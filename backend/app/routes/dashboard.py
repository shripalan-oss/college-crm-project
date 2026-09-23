from flask import Blueprint, jsonify
from flask_login import login_required, current_user

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
@login_required
def index():
    return jsonify({
        "message": "Welcome to the dashboard",
        "user": current_user.to_dict()
    }), 200