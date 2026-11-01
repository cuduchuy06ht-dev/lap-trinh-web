from flask import Blueprint, jsonify
from flask import g
from ..database import get_db
from .common import error, login_required, serialize_lecture
from .lectures import BASE_SELECT

bp = Blueprint("bookmarks", __name__)

@bp.get("")
@login_required()
def list_bookmarks():
    rows = get_db().execute(BASE_SELECT + " JOIN bookmarks b ON b.lecture_id=l.id WHERE b.user_id=? ORDER BY b.created_at DESC", (g.user["id"],)).fetchall()
    items = []
    for row in rows:
        item = serialize_lecture(row); item["isBookmarked"] = True; items.append(item)
    return jsonify(items)

@bp.post("/<int:lecture_id>")
@login_required()
def add_bookmark(lecture_id):
    db = get_db()
    if not db.execute("SELECT 1 FROM lectures WHERE id=?", (lecture_id,)).fetchone(): return error("Không tìm thấy bài giảng.", 404)
    db.execute("INSERT OR IGNORE INTO bookmarks(user_id,lecture_id) VALUES(?,?)", (g.user["id"], lecture_id)); db.commit()
    return jsonify({"lectureId": lecture_id, "isBookmarked": True}), 201

@bp.delete("/<int:lecture_id>")
@login_required()
def remove_bookmark(lecture_id):
    db = get_db(); db.execute("DELETE FROM bookmarks WHERE user_id=? AND lecture_id=?", (g.user["id"], lecture_id)); db.commit()
    return "", 204
