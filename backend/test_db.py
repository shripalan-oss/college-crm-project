import os
import re
from sqlalchemy import text, inspect
from app import create_app, db
from app.models import Donor, User

app = create_app()

with app.app_context():
    raw_url = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    
    # 1. Mask password
    masked_url = re.sub(r"(://[^:]+:).*?(@)", r"\1****\2", str(raw_url))
    print(f"1. DATABASE_URL: {masked_url}")
    
    # 2. Test connection
    try:
        result = db.session.execute(text("SELECT 1")).scalar()
        print(f"2. Connection Test: SUCCESS (Result: {result})")
    except Exception as e:
        import traceback
        print(f"2. Connection Test: FAILED\n{traceback.format_exc()}")
    
    # 3. List tables
    try:
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"3. Tables: {', '.join(tables)}")
    except Exception as e:
        import traceback
        print(f"3. Tables FAILED\n{traceback.format_exc()}")
        
    # 4. ORM Test
    try:
        count = Donor.query.count()
        print(f"4. ORM Test: SUCCESS (Donor count: {count})")
    except Exception as e:
        import traceback
        print(f"4. ORM Test FAILED\n{traceback.format_exc()}")
