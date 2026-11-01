from flask import Blueprint, jsonify
from ..database import get_db
from .common import login_required, serialize_lecture
from .lectures import BASE_SELECT

bp = Blueprint("dashboard", __name__)

@bp.get("/stats")
@login_required(["admin"])
def stats():
    db = get_db()
    metrics = db.execute("SELECT (SELECT COUNT(*) FROM lectures WHERE status='published') totalLectures, (SELECT COALESCE(SUM(views),0) FROM lectures) totalViews, (SELECT ROUND(COALESCE(SUM(watched_seconds),0)/3600.0,1) FROM watch_history) totalWatchHours, (SELECT COUNT(DISTINCT user_id) FROM watch_history WHERE last_watched >= datetime('now','-24 hours')) activeStudents").fetchone()
    categories = db.execute("SELECT f.name, COUNT(l.id) count FROM faculties f LEFT JOIN subjects s ON s.faculty_id=f.id LEFT JOIN lectures l ON l.subject_id=s.id AND l.status='published' GROUP BY f.id HAVING count > 0 ORDER BY count DESC").fetchall()
    total = sum(r["count"] for r in categories) or 1
    return jsonify({"metrics": dict(metrics), "viewTrend": [], "categoryStats": [{"name": r["name"], "percentage": round(r["count"] * 100 / total)} for r in categories]})

@bp.get("/lectures")
@login_required(["admin"])
def dashboard_lectures():
    rows = get_db().execute(BASE_SELECT + " ORDER BY l.created_at DESC").fetchall()
    return jsonify([serialize_lecture(r) for r in rows])
