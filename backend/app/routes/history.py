from flask import Blueprint, jsonify, request
from app.database import get_db_connection

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id', 1, type=int)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT h.*, l.title, l.thumbnail_url, l.duration 
        FROM watch_history h
        JOIN lectures l ON h.lecture_id = l.id
        WHERE h.user_id = ?
        ORDER BY h.last_watched DESC
    """
    cursor.execute(query, (user_id,))
    history = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in history]), 200

@history_bp.route('/<int:lecture_id>', methods=['PUT'])
def update_history(lecture_id):
    data = request.get_json()
    user_id = data.get('user_id', 1)
    watched_seconds = data.get('watched_seconds', 0)
    progress = data.get('progress', 0.0)
    is_completed = data.get('is_completed', 0)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO watch_history (user_id, lecture_id, watched_seconds, progress, is_completed, last_watched)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, lecture_id) 
        DO UPDATE SET 
            watched_seconds = excluded.watched_seconds,
            progress = excluded.progress,
            is_completed = excluded.is_completed,
            last_watched = CURRENT_TIMESTAMP
    """, (user_id, lecture_id, watched_seconds, progress, is_completed))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Cập nhật tiến độ xem thành công'}), 200

@history_bp.route('/<int:lecture_id>', methods=['DELETE'])
def delete_history_item(lecture_id):
    user_id = request.args.get('user_id', 1, type=int)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM watch_history WHERE user_id = ? AND lecture_id = ?", 
        (user_id, lecture_id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Đã xóa một lịch sử xem thành công'}), 200

@history_bp.route('', methods=['DELETE'])
def clear_all_history():
    user_id = request.args.get('user_id', 1, type=int)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM watch_history WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Đã xóa toàn bộ lịch sử xem thành công'}), 200