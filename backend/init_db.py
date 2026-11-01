import os
import sqlite3
from app.config import Config

def init_db():
    os.makedirs(os.path.dirname(Config.DATABASE), exist_ok=True)

    schema_path = os.path.join(
        os.path.dirname(__file__),
        "app",
        "schema.sql"
    )

    with open(schema_path, "r", encoding="utf-8") as file:
        schema = file.read()

    conn = sqlite3.connect(Config.DATABASE)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(schema)
    conn.close()

    print("Khoi tao database thanh cong!")

if __name__ == "__main__":
    init_db()