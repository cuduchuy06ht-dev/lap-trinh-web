from flask import Flask, jsonify, send_from_directory
from .config import Config
from .database import close_db, init_app as init_database
from .routes.auth import bp as auth_bp
from .routes.catalog import bp as catalog_bp
from .routes.lectures import bp as lectures_bp
from .routes.bookmarks import bp as bookmarks_bp
from .routes.history import bp as history_bp
from .routes.dashboard import bp as dashboard_bp


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)
    Config.ensure_directories()
    init_database(app)
    app.teardown_appcontext(close_db)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = app.config["CORS_ORIGIN"]
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        return response

    @app.route("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.route("/uploads/<path:filename>")
    def uploads(filename):
        return send_from_directory(app.config["UPLOAD_DIR"], filename)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(catalog_bp, url_prefix="/api")
    app.register_blueprint(lectures_bp, url_prefix="/api/lectures")
    app.register_blueprint(bookmarks_bp, url_prefix="/api/bookmarks")
    app.register_blueprint(history_bp, url_prefix="/api/history")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    return app
