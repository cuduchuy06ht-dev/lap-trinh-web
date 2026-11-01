from flask import Blueprint, jsonify, request
from app.database import get_db_connection

lectures_bp = Blueprint('lectures', __name__, url_prefix='/api/lectures')

@lectures_bp.route('', methods=['GET'])
@lectures_bp.route('/api/lectures', methods=['GET'])
def get_lectures():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lectures")
    
    column_names = [description[0] for description in cursor.description]
    rows = cursor.fetchall()
    
    result = []
    for row in rows:
        result.append(dict(zip(column_names, row)))
        
    conn.close()
    return jsonify(result), 200

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
@lectures_bp.route('/api/lectures/top-viewed', methods=['GET'])

@lectures_bp.route('/top-viewed', methods=['GET'])
def get_top_viewed_lectures():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM lectures ORDER BY views DESC LIMIT 5")
    lectures = cursor.fetchall()
    
    conn.close()
    return jsonify([dict(lecture) for lecture in lectures]), 200


@lectures_bp.route('/latest', methods=['GET'])
def get_latest_lectures():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM lectures ORDER BY id DESC LIMIT 5")
    lectures = cursor.fetchall()
    
    conn.close()
    return jsonify([dict(lecture) for lecture in lectures]), 200