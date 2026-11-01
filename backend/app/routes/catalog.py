from flask import Blueprint, jsonify, request
from ..database import get_db
from .common import error, login_required, row_dict

bp = Blueprint("catalog", __name__)


def parse_id(value, field):
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field} không hợp lệ.")


def list_resource(table, include_count=False):
    db = get_db()
    faculty_id = request.args.get("faculty_id", type=int)
    if table == "faculties":
        rows = db.execute("SELECT f.*, COUNT(l.id) AS lecture_count FROM faculties f LEFT JOIN subjects s ON s.faculty_id=f.id LEFT JOIN lectures l ON l.subject_id=s.id AND l.status='published' GROUP BY f.id ORDER BY f.name").fetchall()
    else:
        query = f"SELECT {table}.* FROM {table}"
        args = []
        if faculty_id:
            query += " WHERE faculty_id=?"; args.append(faculty_id)
        rows = db.execute(query + " ORDER BY name", args).fetchall()
    return jsonify([row_dict(r) for r in rows])


def create_resource(table):
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    if not name: return error("Tên là bắt buộc.")
    db = get_db()
    try:
        if table == "faculties":
            cursor = db.execute("INSERT INTO faculties(name,description) VALUES(?,?)", (name, data.get("description")))
        else:
            cursor = db.execute(f"INSERT INTO {table}(faculty_id,name,description) VALUES(?,?,?)", (parse_id(data.get("facultyId"), "facultyId"), name, data.get("description")))
        db.commit()
        return jsonify(row_dict(db.execute(f"SELECT * FROM {table} WHERE id=?", (cursor.lastrowid,)).fetchone())), 201
    except ValueError as exc: return error(str(exc))
    except Exception: return error("Bản ghi đã tồn tại hoặc khoa không hợp lệ.", 409)


def update_resource(table, resource_id):
    data = request.get_json(silent=True) or {}
    db = get_db()
    fields, values = [], []
    for api_key, column in [("name","name"),("description","description"),("facultyId","faculty_id")]:
        if api_key in data:
            fields.append(f"{column}=?"); values.append(parse_id(data[api_key], api_key) if api_key == "facultyId" else data[api_key])
    if not fields: return error("Không có dữ liệu cập nhật.")
    values.append(resource_id); db.execute(f"UPDATE {table} SET {', '.join(fields)} WHERE id=?", values); db.commit()
    row = db.execute(f"SELECT * FROM {table} WHERE id=?", (resource_id,)).fetchone()
    return (jsonify(row_dict(row)), 200) if row else error("Không tìm thấy bản ghi.", 404)


def delete_resource(table, resource_id):
    db = get_db(); cursor = db.execute(f"DELETE FROM {table} WHERE id=?", (resource_id,)); db.commit()
    return ("", 204) if cursor.rowcount else error("Không tìm thấy bản ghi.", 404)


@bp.get("/faculties")
def faculties_list(): return list_resource("faculties")
@bp.post("/faculties")
@login_required(["admin"])
def faculties_create(): return create_resource("faculties")
@bp.patch("/faculties/<int:resource_id>")
@login_required(["admin"])
def faculties_update(resource_id): return update_resource("faculties", resource_id)
@bp.delete("/faculties/<int:resource_id>")
@login_required(["admin"])
def faculties_delete(resource_id): return delete_resource("faculties", resource_id)

@bp.get("/majors")
def majors_list(): return list_resource("majors")
@bp.post("/majors")
@login_required(["admin"])
def majors_create(): return create_resource("majors")
@bp.patch("/majors/<int:resource_id>")
@login_required(["admin"])
def majors_update(resource_id): return update_resource("majors", resource_id)
@bp.delete("/majors/<int:resource_id>")
@login_required(["admin"])
def majors_delete(resource_id): return delete_resource("majors", resource_id)

@bp.get("/subjects")
def subjects_list(): return list_resource("subjects")
@bp.post("/subjects")
@login_required(["admin"])
def subjects_create(): return create_resource("subjects")
@bp.patch("/subjects/<int:resource_id>")
@login_required(["admin"])
def subjects_update(resource_id): return update_resource("subjects", resource_id)
@bp.delete("/subjects/<int:resource_id>")
@login_required(["admin"])
def subjects_delete(resource_id): return delete_resource("subjects", resource_id)
