import base64
import hashlib
import hmac
import json
import time
from functools import wraps
from flask import current_app, jsonify, request, g
from ..database import get_db


def row_dict(row):
    return dict(row) if row else None


def error(message, status=400):
    return jsonify({"message": message}), status


def make_token(user):
    payload = {"sub": user["id"], "exp": int(time.time()) + 60 * 60 * 24 * 7}
    body = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(current_app.config["SECRET_KEY"].encode(), body.encode(), hashlib.sha256).hexdigest()
    return f"{body}.{signature}"


def current_user_from_token():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    try:
        body, signature = header.removeprefix("Bearer ").split(".")
        expected = hmac.new(current_app.config["SECRET_KEY"].encode(), body.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        payload = json.loads(base64.urlsafe_b64decode(body + "=" * (-len(body) % 4)))
        if payload["exp"] < time.time():
            return None
        return get_db().execute("SELECT * FROM users WHERE id=?", (payload["sub"],)).fetchone()
    except (ValueError, KeyError, json.JSONDecodeError):
        return None


def login_required(roles=None):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            g.user = current_user_from_token()
            if not g.user:
                return error("Cần đăng nhập để thực hiện thao tác này.", 401)
            if roles and g.user["role"] not in roles:
                return error("Bạn không có quyền thực hiện thao tác này.", 403)
            return view(*args, **kwargs)
        return wrapped
    return decorator


def serialize_user(row):
    return {"id": row["id"], "username": row["username"], "email": row["email"], "name": row["full_name"], "avatar": row["avatar"], "role": row["role"], "createdAt": row["created_at"]}


def serialize_lecture(row):
    data = dict(row)
    return {"id": data["id"], "title": data["title"], "description": data["description"] or "", "thumbnail": data["thumbnail_url"], "thumbnailUrl": data["thumbnail_url"], "videoUrl": data["video_url"], "durationSeconds": data["duration"], "duration": format_duration(data["duration"]), "subjectId": data["subject_id"], "subject": data.get("subject_name"), "facultyId": data.get("faculty_id"), "faculty": data.get("faculty_name"), "lecturer": data.get("lecturer_name") or "Chưa có giảng viên", "avatar": data.get("lecturer_avatar"), "views": data["views"], "status": data["status"], "createdAt": data["created_at"], "isBookmarked": bool(data.get("is_bookmarked", False))}


def format_duration(seconds):
    seconds = int(seconds or 0)
    return f"{seconds // 3600}:{seconds % 3600 // 60:02d}:{seconds % 60:02d}" if seconds >= 3600 else f"{seconds // 60}:{seconds % 60:02d}"
