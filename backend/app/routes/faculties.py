from flask import Blueprint, jsonify
from app.database import get_db_connection

faculties_bp = Blueprint('faculties', __name__, url_prefix='/api/faculties')

@faculties_bp.route('', methods=['GET'])
def get_faculties():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT f.id, f.name, f.description, 
               COUNT(l.id) as lecture_count
        FROM faculties f
        LEFT JOIN subjects s ON f.id = s.faculty_id
        LEFT JOIN lectures l ON s.id = l.subject_id
        GROUP BY f.id
    """
    cursor.execute(query)
    faculties = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in faculties]), 200