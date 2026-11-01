from flask import Blueprint, jsonify, request
from app.database import get_db_connection
import sqlite3

bookmarks_bp = Blueprint('bookmarks', __name__, url_prefix='/api/bookmarks')

@bookmarks_bp.route('', methods=['GET'])
def get_bookmarks():
    user_id = request.args.get('user_id', 1, type=int) 
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT b.id as bookmark_id, l.*, b.created_at as bookmarked_at
        FROM bookmarks b
        JOIN lectures l ON b.lecture_id = l.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    """
    cursor.execute(query, (user_id,))
    bookmarks = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in bookmarks]), 200

@bookmarks_bp.route('', methods=['POST'])
def add_bookmark():
    data = request.get_json()
    user_id = data.get('user_id', 1)
    lecture_id = data.get('lecture_id')
    
    if not lecture_id:
        return jsonify({'error': 'Thiếu mã bài giảng (lecture_id)'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO bookmarks (user_id, lecture_id) VALUES (?, ?)", 
            (user_id, lecture_id)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'message': 'Bài giảng này đã được lưu trước đó'}), 200
        
    conn.close()
    return jsonify({'message': 'Đã thêm bài giảng vào danh sách lưu thành công'}), 201

@bookmarks_bp.route('/<int:lecture_id>', methods=['DELETE'])
def remove_bookmark(lecture_id):
    user_id = request.args.get('user_id', 1, type=int)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM bookmarks WHERE user_id = ? AND lecture_id = ?", 
        (user_id, lecture_id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Đã bỏ lưu bài giảng thành công'}), 200