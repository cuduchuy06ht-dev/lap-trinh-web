from pathlib import Path
import os


class Config:
    BASE_DIR = Path(__file__).resolve().parents[1]
    INSTANCE_DIR = BASE_DIR / "instance"
    UPLOAD_DIR = BASE_DIR / "uploads"
    DATABASE = str(INSTANCE_DIR / "database.db")
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-this-development-secret")
    CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "http://localhost:5173")
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024

    @classmethod
    def ensure_directories(cls):
        cls.INSTANCE_DIR.mkdir(exist_ok=True)
        (cls.UPLOAD_DIR / "thumbnails").mkdir(parents=True, exist_ok=True)
        (cls.UPLOAD_DIR / "videos").mkdir(parents=True, exist_ok=True)
