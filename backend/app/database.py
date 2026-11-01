import sqlite3
<<<<<<< HEAD
from app.config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")

=======
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'database.db')

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
>>>>>>> a22dbac18e4b68102ea53fce3ad7d5f0ad543f25
    return conn