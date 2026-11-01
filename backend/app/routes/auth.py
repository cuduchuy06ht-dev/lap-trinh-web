from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
from ..database import get_db
from .common import error, make_token, serialize_user, login_required

bp = Blueprint("auth", __name__)

@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    identity, password = data.get("identity", data.get("username", "")).strip(), data.get("password", "")
    user = get_db().execute("SELECT * FROM users WHERE username=? OR email=?", (identity, identity)).fetchone()
    if not user or not check_password_hash(user["password_hash"], password):
        return error("Tên đăng nhập hoặc mật khẩu không đúng.", 401)
    return jsonify({"token": make_token(user), "user": serialize_user(user)})

@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    required = ["username", "email", "password"]
    if any(not str(data.get(key, "")).strip() for key in required):
        return error("Username, email và mật khẩu là bắt buộc.")
    try:
        db = get_db()
        cursor = db.execute("INSERT INTO users(username,email,password_hash,full_name,role) VALUES(?,?,?,?,?)", (data["username"].strip(), data["email"].strip(), generate_password_hash(data["password"]), data.get("fullName", "").strip() or None, "student"))
        db.commit()
        user = db.execute("SELECT * FROM users WHERE id=?", (cursor.lastrowid,)).fetchone()
        return jsonify({"token": make_token(user), "user": serialize_user(user)}), 201
    except Exception:
        return error("Tên đăng nhập hoặc email đã tồn tại.", 409)

@bp.get("/me")
@login_required()
def me():
    from flask import g
    return jsonify({"user": serialize_user(g.user)})
