from flask import Blueprint, jsonify, request, g
from ..database import get_db
from .common import error, login_required, serialize_lecture
from .lectures import BASE_SELECT

bp = Blueprint("history", __name__)

@bp.get("")
@login_required()
def list_history():
    query = BASE_SELECT.replace("\nFROM", ", h.watched_seconds, h.progress, h.is_completed, h.last_watched\nFROM", 1)
    rows = get_db().execute(query + " JOIN watch_history h ON h.lecture_id=l.id WHERE h.user_id=? ORDER BY h.last_watched DESC", (g.user["id"],)).fetchall()
    return jsonify([{**serialize_lecture(r), "watchedSeconds": r["watched_seconds"], "progress": r["progress"], "isCompleted": bool(r["is_completed"]), "lastWatched": r["last_watched"]} for r in rows])

@bp.post("/track")
@login_required()
def track():
    data = request.get_json(silent=True) or {}; lecture_id = data.get("lectureId"); seconds = data.get("progressSeconds", data.get("watchedSeconds", 0))
    try: lecture_id, seconds = int(lecture_id), max(int(seconds), 0)
    except (TypeError, ValueError): return error("Dữ liệu tiến độ không hợp lệ.")
    db = get_db(); lecture = db.execute("SELECT duration FROM lectures WHERE id=?", (lecture_id,)).fetchone()
    if not lecture: return error("Không tìm thấy bài giảng.", 404)
    progress = min(100, round(seconds / max(lecture["duration"], 1) * 100, 2)); completed = bool(data.get("isCompleted")) or progress >= 95
    db.execute("INSERT INTO watch_history(user_id,lecture_id,watched_seconds,progress,is_completed,last_watched) VALUES(?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(user_id,lecture_id) DO UPDATE SET watched_seconds=excluded.watched_seconds,progress=excluded.progress,is_completed=excluded.is_completed,last_watched=CURRENT_TIMESTAMP", (g.user["id"], lecture_id, seconds, progress, int(completed))); db.commit()
    return jsonify({"lectureId": lecture_id, "watchedSeconds": seconds, "progress": progress, "isCompleted": completed})

@bp.delete("/<int:lecture_id>")
@login_required()
def remove_history(lecture_id):
    db = get_db(); db.execute("DELETE FROM watch_history WHERE user_id=? AND lecture_id=?", (g.user["id"], lecture_id)); db.commit(); return "", 204
