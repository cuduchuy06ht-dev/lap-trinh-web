from flask import Blueprint, jsonify, request
from app.database import get_db_connection

subjects_bp = Blueprint('subjects', __name__, url_prefix='/api/subjects')

@subjects_bp.route('', methods=['GET'])
def get_subjects():
    faculty_id = request.args.get('faculty_id', type=int)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM subjects"
    params = []
    
    if faculty_id:
        query += " WHERE faculty_id = ?"
        params.append(faculty_id)
        
    cursor.execute(query, params)
    subjects = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in subjects]), 200