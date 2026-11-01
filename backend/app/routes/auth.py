from flask import Blueprint, jsonify, request
from app.database import get_db_connection

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Thiếu dữ liệu đầu vào'}), 400
        
    username_or_email = data.get('username') or data.get('email')
    password = data.get('password')
    
    if not username_or_email or not password:
        return jsonify({'error': 'Vui lòng cung cấp tên đăng nhập/email và mật khẩu'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM users 
        WHERE username = ? OR email = ?
    """, (username_or_email, username_or_email))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'Tài khoản không tồn tại'}), 404
        
    user_dict = dict(user)
    
    if user_dict['password_hash'] != password:
        return jsonify({'error': 'Mật khẩu không chính xác'}), 401
        
    return jsonify({
        'message': 'Đăng nhập thành công',
        'user': {
            'id': user_dict['id'],
            'username': user_dict['username'],
            'email': user_dict['email'],
            'full_name': user_dict['full_name'],
            'role': user_dict['role'],
            'avatar': user_dict['avatar']
        }
    }), 200