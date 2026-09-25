from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    import os
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    
    # Configure CORS to allow the React frontend
    CORS(app, supports_credentials=True, origins=[frontend_url, "http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.2.45:5173"])

    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    
    # Send a 401 JSON response instead of redirecting to login page
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Unauthorized"}), 401

    from app.routes.auth import auth_bp
    from app.routes.donors import donors_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.campaigns import campaigns_bp
    from app.routes.donations import donations_bp
    from app.routes.outcomes import outcomes_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(donors_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(campaigns_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(outcomes_bp)

    return app