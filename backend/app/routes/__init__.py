from flask import Flask

def create_app():
    app = Flask(__name__)
    
    from app.routes.auth import auth_bp
    from app.routes.faculties import faculties_bp
    from app.routes.subjects import subjects_bp
    from app.routes.majors import majors_bp
    from app.routes.lectures import lectures_bp
    from app.routes.bookmarks import bookmarks_bp
    from app.routes.history import history_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(faculties_bp)
    app.register_blueprint(subjects_bp)
    app.register_blueprint(majors_bp)
    app.register_blueprint(lectures_bp)
    app.register_blueprint(bookmarks_bp)
    app.register_blueprint(history_bp)

    return app