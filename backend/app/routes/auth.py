from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models import User, Tenant

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth/me", methods=["GET"])
@login_required
def get_me():
    return jsonify({"user": current_user.to_dict()}), 200

@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    org_name = data.get("org_name")
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([org_name, name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "An account with this email already exists"}), 409

    tenant = Tenant(org_name=org_name)
    db.session.add(tenant)
    db.session.flush()

    user = User(
        tenant_id=tenant.id,
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        role="org-admin"
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created successfully"}), 201

@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"message": "Login successful", "user": user.to_dict()}), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route("/api/auth/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200