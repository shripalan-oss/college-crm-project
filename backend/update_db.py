import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'instance', 'app.db')
if not os.path.exists(db_path):
    print("DB not found at instance/app.db. Creating one or checking root.")
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')

try:
    conn = sqlite3.connect(db_path)
    # Check if column exists
    cursor = conn.execute("PRAGMA table_info(user);")
    columns = [row[1] for row in cursor.fetchall()]
    if 'is_verified' not in columns:
        conn.execute("ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT 0;")
        conn.commit()
        print("Successfully added is_verified column.")
    else:
        print("is_verified column already exists.")
    conn.close()
except Exception as e:
    print("Error:", e)
