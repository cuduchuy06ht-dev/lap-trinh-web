from pathlib import Path
from uuid import uuid4
from flask import Blueprint, current_app, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from ..database import get_db
from .common import error, login_required, serialize_lecture

bp = Blueprint("lectures", __name__)

BASE_SELECT = """SELECT l.*, s.name subject_name, s.faculty_id, f.name faculty_name, u.full_name lecturer_name, u.avatar lecturer_avatar
FROM lectures l JOIN subjects s ON s.id=l.subject_id JOIN faculties f ON f.id=s.faculty_id LEFT JOIN users u ON u.id=l.uploaded_by"""

def optional_user_id():
    from .common import current_user_from_token
    user = current_user_from_token()
    return user["id"] if user else None

def with_bookmark_state(rows, user_id=None):
    items = [serialize_lecture(row) for row in rows]
    if not user_id:
        return items
    bookmarked = {row["lecture_id"] for row in get_db().execute("SELECT lecture_id FROM bookmarks WHERE user_id=?", (user_id,))}
    for item in items:
        item["isBookmarked"] = item["id"] in bookmarked
    return items

def lecture_query(include_user=True):
    db, user_id = get_db(), optional_user_id()
    filters, args = [], []
    if request.args.get("faculty_id", type=int): filters.append("s.faculty_id=?"); args.append(request.args.get("faculty_id", type=int))
    if request.args.get("subject_id", type=int): filters.append("l.subject_id=?"); args.append(request.args.get("subject_id", type=int))
    if request.args.get("major_id", type=int): filters.append("EXISTS (SELECT 1 FROM major_subjects ms WHERE ms.subject_id=l.subject_id AND ms.major_id=?)"); args.append(request.args.get("major_id", type=int))
    if request.args.get("q", "").strip(): filters.append("(l.title LIKE ? OR l.description LIKE ? OR u.full_name LIKE ?)"); args.extend([f"%{request.args['q'].strip()}%"] * 3)
    status = request.args.get("status", "published")
    if status != "all": filters.append("l.status=?"); args.append(status)
    query = BASE_SELECT
    if filters: query += " WHERE " + " AND ".join(filters)
    sort = request.args.get("sort", "newest")
    ordering = {"oldest":"l.created_at ASC", "title":"l.title COLLATE NOCASE ASC", "views":"l.views DESC", "newest":"l.created_at DESC"}.get(sort, "l.created_at DESC")
    total = db.execute("SELECT COUNT(*) FROM (" + query + ")", args).fetchone()[0]
    page, page_size = max(request.args.get("page", 1, type=int), 1), min(max(request.args.get("page_size", 24, type=int), 1), 100)
    rows = db.execute(query + f" ORDER BY {ordering} LIMIT ? OFFSET ?", args + [page_size, (page - 1) * page_size]).fetchall()
    return jsonify({"items": with_bookmark_state(rows, user_id), "pagination": {"page": page, "pageSize": page_size, "total": total, "totalPages": (total + page_size - 1) // page_size}})

@bp.get("")
def list_lectures(): return lecture_query()

@bp.get("/featured")
def featured():
    db = get_db(); rows = db.execute(BASE_SELECT + " WHERE l.status='published' ORDER BY l.views DESC, l.created_at DESC LIMIT 6").fetchall()
    return jsonify(with_bookmark_state(rows, optional_user_id()))

@bp.get("/latest")
def latest():
    db = get_db(); rows = db.execute(BASE_SELECT + " WHERE l.status='published' ORDER BY l.created_at DESC LIMIT 8").fetchall()
    return jsonify(with_bookmark_state(rows, optional_user_id()))

@bp.get("/<int:lecture_id>")
def get_lecture(lecture_id):
    db = get_db(); row = db.execute(BASE_SELECT + " WHERE l.id=?", (lecture_id,)).fetchone()
    if not row: return error("Không tìm thấy bài giảng.", 404)
    db.execute("UPDATE lectures SET views=views+1 WHERE id=?", (lecture_id,)); db.commit()
    return jsonify(with_bookmark_state([db.execute(BASE_SELECT + " WHERE l.id=?", (lecture_id,)).fetchone()], optional_user_id())[0])

def uploaded_url(file, folder):
    if not file or not file.filename: return None
    filename = f"{uuid4().hex}_{secure_filename(file.filename)}"
    destination = Path(current_app.config["UPLOAD_DIR"]) / folder / filename
    file.save(destination)
    return f"/uploads/{folder}/{filename}"

def payload(): return request.form if request.form else (request.get_json(silent=True) or {})

@bp.post("")
@login_required(["lecturer", "admin"])
def create_lecture():
    from flask import g
    data = payload(); title = str(data.get("title", "")).strip()
    if not title or not data.get("subjectId", data.get("subject_id")): return error("Tiêu đề và môn học là bắt buộc.")
    try:
        subject_id = int(data.get("subjectId", data.get("subject_id"))); duration = max(int(data.get("duration", 0)), 0)
    except ValueError: return error("Môn học hoặc thời lượng không hợp lệ.")
    video_url = uploaded_url(request.files.get("video"), "videos") or data.get("videoUrl") or data.get("video_url")
    if not video_url: return error("Video là bắt buộc.")
    thumbnail = uploaded_url(request.files.get("thumbnail"), "thumbnails") or data.get("thumbnailUrl") or data.get("thumbnail_url")
    db = get_db(); cursor = db.execute("INSERT INTO lectures(title,description,thumbnail_url,video_url,duration,subject_id,uploaded_by,status) VALUES(?,?,?,?,?,?,?,?)", (title, data.get("description"), thumbnail, video_url, duration, subject_id, g.user["id"], data.get("status", "published")))
    db.commit(); row = db.execute(BASE_SELECT + " WHERE l.id=?", (cursor.lastrowid,)).fetchone()
    return jsonify(serialize_lecture(row)), 201

@bp.patch("/<int:lecture_id>")
@login_required(["lecturer", "admin"])
def update_lecture(lecture_id):
    from flask import g
    db = get_db(); lecture = db.execute("SELECT * FROM lectures WHERE id=?", (lecture_id,)).fetchone()
    if not lecture: return error("Không tìm thấy bài giảng.", 404)
    if g.user["role"] != "admin" and lecture["uploaded_by"] != g.user["id"]: return error("Bạn không thể sửa bài giảng này.", 403)
    data = payload(); allowed = {"title":"title","description":"description","videoUrl":"video_url","thumbnailUrl":"thumbnail_url","status":"status","subjectId":"subject_id","duration":"duration"}
    fields, values = [], []
    for key, column in allowed.items():
        if key in data: fields.append(f"{column}=?"); values.append(data[key])
    if not fields: return error("Không có dữ liệu cập nhật.")
    values.append(lecture_id); db.execute("UPDATE lectures SET " + ", ".join(fields) + " WHERE id=?", values); db.commit()
    return jsonify(serialize_lecture(db.execute(BASE_SELECT + " WHERE l.id=?", (lecture_id,)).fetchone()))

@bp.delete("/<int:lecture_id>")
@login_required(["lecturer", "admin"])
def delete_lecture(lecture_id):
    from flask import g
    db = get_db(); lecture = db.execute("SELECT uploaded_by FROM lectures WHERE id=?", (lecture_id,)).fetchone()
    if not lecture: return error("Không tìm thấy bài giảng.", 404)
    if g.user["role"] != "admin" and lecture["uploaded_by"] != g.user["id"]: return error("Bạn không thể xóa bài giảng này.", 403)
    db.execute("DELETE FROM lectures WHERE id=?", (lecture_id,)); db.commit(); return "", 204

@bp.get("/uploads/<path:filename>")
def legacy_uploads(filename):
    return send_from_directory(current_app.config["UPLOAD_DIR"], filename)
