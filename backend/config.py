import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    
    # Render provides postgres:// URLs, but SQLAlchemy needs postgresql://
    db_url = os.environ.get("DATABASE_URL", "sqlite:///" + os.path.join(basedir, "app.db"))
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Required for cookies to work across different domains (Vercel -> Render)
    SESSION_COOKIE_SAMESITE = "None" if os.environ.get("DATABASE_URL") else "Lax"
    SESSION_COOKIE_SECURE = True if os.environ.get("DATABASE_URL") else False