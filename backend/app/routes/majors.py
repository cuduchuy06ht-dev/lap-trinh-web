from flask import Blueprint, jsonify, request
from app.database import get_db_connection

majors_bp = Blueprint('majors', __name__, url_prefix='/api/majors')

@majors_bp.route('', methods=['GET'])
def get_majors():
    faculty_id = request.args.get('faculty_id', type=int)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM majors"
    params = []
    
    if faculty_id:
        query += " WHERE faculty_id = ?"
        params.append(faculty_id)
        
    cursor.execute(query, params)
    majors = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in majors]), 200