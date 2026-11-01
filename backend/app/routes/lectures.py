from flask import Blueprint, jsonify, request
from app.database import get_db_connection

lectures_bp = Blueprint('lectures', __name__, url_prefix='/api/lectures')

@lectures_bp.route('', methods=['GET'])
def get_lectures():
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row if 'sqlite3' in globals() else None
    cursor = conn.cursor()
    
    search = request.args.get('search', '')
    subject_id = request.args.get('subject_id', type=int)
    sort_by = request.args.get('sort', 'created_at')
    
    query = "SELECT * FROM lectures WHERE title LIKE ?"
    params = [f"%{search}%"]
    
    if subject_id:
        query += " AND subject_id = ?"
        params.append(subject_id)
        
    allowed_sorts = ['created_at', 'views', 'title', 'duration']
    if sort_by in allowed_sorts:
        query += f" ORDER BY {sort_by} DESC"
        
    cursor.execute(query, params)
    lectures = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in lectures]), 200

@lectures_bp.route('/<int:id>', methods=['GET'])
def get_lecture_detail(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lectures WHERE id = ?", (id,))
    lecture = cursor.fetchone()
    conn.close()
    
    if not lecture:
        return jsonify({'error': 'Không tìm thấy bài giảng'}), 404
        
    return jsonify(dict(lecture)), 200