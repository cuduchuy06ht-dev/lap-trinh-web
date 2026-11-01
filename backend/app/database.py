import sqlite3
from pathlib import Path
from flask import current_app, g
from werkzeug.security import generate_password_hash


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


def close_db(_error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_app(app):
    @app.cli.command("init-db")
    def init_db_command():
        initialise_database()

    with app.app_context():
        initialise_database()


def initialise_database():
    db = get_db()
    schema_path = Path(current_app.root_path) / "schema.sql"
    db.executescript(schema_path.read_text(encoding="utf-8"))
    if db.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
        seed_database(db)
    db.commit()


def seed_database(db):
    users = [
        ("admin", "admin@neu.edu.vn", "Nguyễn Văn Admin", "admin"),
        ("lecturer", "lecturer@neu.edu.vn", "Trần Văn Giảng", "lecturer"),
        ("student", "student@neu.edu.vn", "Lê Văn Sinh", "student"),
    ]
    db.executemany(
        "INSERT INTO users(username,email,password_hash,full_name,role) VALUES(?,?,?,?,?)",
        [(u, e, generate_password_hash("123456"), n, r) for u, e, n, r in users],
    )
    faculties = [
        ("Công nghệ thông tin", "Đào tạo công nghệ thông tin và khoa học máy tính"),
        ("Kinh tế học", "Đào tạo các kiến thức về kinh tế"),
        ("Quản trị kinh doanh", "Đào tạo quản trị và điều hành doanh nghiệp"),
        ("Tài chính - Ngân hàng", "Đào tạo tài chính và hoạt động ngân hàng"),
        ("Kế toán", "Đào tạo kế toán và kiểm toán"),
        ("Marketing", "Đào tạo marketing và truyền thông"),
        ("Thương mại điện tử", "Đào tạo kinh doanh trên nền tảng số"),
        ("Luật", "Đào tạo kiến thức pháp luật"),
        ("Du lịch và Khách sạn", "Đào tạo quản trị du lịch và khách sạn"),
        ("Ngôn ngữ Anh", "Đào tạo ngôn ngữ và giao tiếp tiếng Anh"),
    ]
    db.executemany("INSERT INTO faculties(name,description) VALUES(?,?)", faculties)
    majors = [(1,"Công nghệ thông tin","Ngành công nghệ thông tin"),(1,"Khoa học máy tính","Ngành khoa học máy tính"),(2,"Kinh tế quốc tế","Ngành kinh tế quốc tế"),(2,"Kinh tế đầu tư","Ngành kinh tế đầu tư"),(3,"Quản trị doanh nghiệp","Ngành quản trị doanh nghiệp"),(4,"Tài chính doanh nghiệp","Ngành tài chính doanh nghiệp"),(5,"Kế toán doanh nghiệp","Ngành kế toán doanh nghiệp"),(6,"Marketing số","Ngành marketing số"),(7,"Thương mại điện tử","Ngành thương mại điện tử"),(8,"Luật kinh doanh","Ngành luật kinh doanh")]
    subjects = [(1,"Lập trình Python","Kiến thức lập trình Python cơ bản và nâng cao"),(1,"Cơ sở dữ liệu","Thiết kế và quản trị cơ sở dữ liệu"),(1,"Phát triển ứng dụng Web","Xây dựng ứng dụng web"),(1,"Trí tuệ nhân tạo","Các kiến thức cơ bản về AI"),(2,"Kinh tế vi mô","Các nguyên lý kinh tế vi mô"),(2,"Kinh tế vĩ mô","Các nguyên lý kinh tế vĩ mô"),(3,"Quản trị học","Các nguyên lý quản trị"),(4,"Tài chính doanh nghiệp","Quản lý tài chính trong doanh nghiệp"),(5,"Nguyên lý kế toán","Các nguyên lý kế toán cơ bản"),(6,"Marketing căn bản","Kiến thức nền tảng về marketing")]
    db.executemany("INSERT INTO majors(faculty_id,name,description) VALUES(?,?,?)", majors)
    db.executemany("INSERT INTO subjects(faculty_id,name,description) VALUES(?,?,?)", subjects)
    db.executemany("INSERT INTO major_subjects(major_id,subject_id) VALUES(?,?)", [(1,1),(1,2),(1,3),(2,1),(2,4),(3,5),(3,6),(5,7),(6,8),(7,9)])
    lectures = [
        ("Python cơ bản cho người mới bắt đầu","Giới thiệu cú pháp và các kiến thức cơ bản của Python","/uploads/thumbnails/python-basic.jpg","/uploads/videos/python-basic.mp4",1800,1,2,120,"published"),
        ("Làm việc với List và Dictionary trong Python","Hướng dẫn sử dụng các cấu trúc dữ liệu trong Python","/uploads/thumbnails/python-list.jpg","/uploads/videos/python-list.mp4",2400,1,2,95,"published"),
        ("Giới thiệu về SQL và SQLite","Tìm hiểu câu lệnh SQL và hệ quản trị SQLite","/uploads/thumbnails/sql-basic.jpg","/uploads/videos/sql-basic.mp4",2100,2,2,180,"published"),
        ("Thiết kế cơ sở dữ liệu và mô hình ERD","Hướng dẫn xây dựng mô hình thực thể liên kết","/uploads/thumbnails/erd.jpg","/uploads/videos/erd.mp4",2700,2,2,150,"published"),
        ("Xây dựng website với HTML và CSS","Giới thiệu HTML, CSS và cách xây dựng giao diện website","/uploads/thumbnails/html-css.jpg","/uploads/videos/html-css.mp4",3000,3,2,210,"published"),
        ("JavaScript cơ bản","Tìm hiểu biến, hàm, vòng lặp và DOM trong JavaScript","/uploads/thumbnails/javascript.jpg","/uploads/videos/javascript.mp4",3600,3,2,175,"published"),
        ("Tổng quan về trí tuệ nhân tạo","Giới thiệu các khái niệm và ứng dụng của AI","/uploads/thumbnails/ai-basic.jpg","/uploads/videos/ai-basic.mp4",2400,4,2,300,"published"),
        ("Machine Learning cơ bản","Giới thiệu các thuật toán học máy cơ bản","/uploads/thumbnails/machine-learning.jpg","/uploads/videos/machine-learning.mp4",3200,4,2,260,"published"),
        ("Nguyên lý kinh tế vi mô","Giới thiệu cung, cầu và cân bằng thị trường","/uploads/thumbnails/microeconomics.jpg","/uploads/videos/microeconomics.mp4",2000,5,2,110,"published"),
        ("Marketing căn bản","Giới thiệu các khái niệm và chiến lược marketing","/uploads/thumbnails/marketing.jpg","/uploads/videos/marketing.mp4",2500,10,2,90,"draft"),
    ]
    db.executemany("INSERT INTO lectures(title,description,thumbnail_url,video_url,duration,subject_id,uploaded_by,views,status) VALUES(?,?,?,?,?,?,?,?,?)", lectures)
    db.executemany("INSERT INTO bookmarks(user_id,lecture_id) VALUES(?,?)", [(1,1),(1,2),(1,3),(2,4),(2,5),(2,6),(3,1),(3,7),(3,8),(3,9)])
    db.executemany("INSERT INTO watch_history(user_id,lecture_id,watched_seconds,progress,is_completed) VALUES(?,?,?,?,?)", [(1,1,1800,100,1),(1,2,1200,50,0),(1,3,2100,100,1),(2,4,1350,50,0),(2,5,3000,100,1),(2,6,1800,50,0),(3,1,900,50,0),(3,7,2400,100,1),(3,8,1600,50,0),(3,9,2000,100,1)])
