import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("INSERT OR IGNORE INTO faculties (id, name, description) VALUES (1, 'Công nghệ thông tin', 'Khoa CNTT')")

cursor.execute("INSERT OR IGNORE INTO subjects (id, name, faculty_id, description) VALUES (1, 'Lập trình Web', 1, 'Học Flask')")

lectures_data = [
    (1, 'Giới thiệu Flask Framework', 1, 'Nội dung bài học 1...', 1800, 150),
    (2, 'Xây dựng RESTful API', 1, 'Nội dung bài học 2...', 2000, 230),
    (3, 'Kết nối SQLite với Flask', 1, 'Nội dung bài học 3...', 2500, 310)
]
cursor.executemany("INSERT OR IGNORE INTO lectures (id, title, subject_id, content, duration, views) VALUES (?, ?, ?, ?, ?, ?)", lectures_data)

bookmarks_data = [
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3)
]
cursor.executemany("INSERT OR IGNORE INTO bookmarks (id, user_id, lecture_id) VALUES (?, ?, ?)", bookmarks_data)

majors_data = [
    (1, 'Công nghệ phần mềm', 1),
    (2, 'Hệ thống thông tin', 1)
]
cursor.executemany("INSERT OR IGNORE INTO majors (id, name, faculty_id) VALUES (?, ?, ?)", majors_data)

history_data = [
    (1, 1, 1, 900, 50.0, 0),
    (2, 1, 2, 1800, 100.0, 1)
]
cursor.executemany("""
    INSERT OR IGNORE INTO history (id, user_id, lecture_id, watched_seconds, progress, is_completed) 
    VALUES (?, ?, ?, ?, ?, ?)
""", history_data)

conn.commit()
conn.close()
print("Đã bơm dữ liệu mẫu thành công cho toàn bộ các bảng!")