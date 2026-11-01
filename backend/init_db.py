import sqlite3
import os

def init_db():
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
        role TEXT DEFAULT 'student',
        avatar TEXT DEFAULT 'default.png'
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS faculties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        faculty_id INTEGER,
        description TEXT,
        FOREIGN KEY (faculty_id) REFERENCES faculties (id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS majors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        faculty_id INTEGER,
        FOREIGN KEY (faculty_id) REFERENCES faculties (id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS lectures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject_id INTEGER,
        content TEXT,
        duration INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects (id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lecture_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (lecture_id) REFERENCES lectures (id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lecture_id INTEGER NOT NULL,
        watched_seconds INTEGER DEFAULT 0,
        progress REAL DEFAULT 0.0,
        is_completed INTEGER DEFAULT 0,
        last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (lecture_id) REFERENCES lectures (id)
    )
    ''')

    cursor.execute('''
    INSERT OR IGNORE INTO users (id, username, password, email, full_name, role)
    VALUES (1, 'student1', 'hash_123', 'student1@example.com', 'Nguyễn Văn A', 'student')
    ''')

    conn.commit()
    conn.close()
    print("Đã khởi tạo thành công các bảng trong database.db!")

if __name__ == '__main__':
    init_db()