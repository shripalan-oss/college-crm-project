import os
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from email_validator import validate_email, EmailNotValidError
from app import db, mail
from app.models import User, Tenant
from flask_mail import Message

auth_bp = Blueprint("auth", __name__)

def generate_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='email-confirm')

def verify_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=expiration)
        return email
    except Exception:
        return False

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

    # Real Email Validation
    try:
        valid = validate_email(email)
        email = valid.normalized
    except EmailNotValidError as e:
        return jsonify({"error": f"Invalid email: {str(e)}"}), 400

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
        role="org-admin",
        is_verified=False
    )
    db.session.add(user)
    db.session.commit()

    # Generate verification token
    token = generate_token(user.email)
    
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    verify_url = f"{frontend_url}/verify-email?token={token}"
    
    try:
        msg = Message(
            subject="Verify your Collab CRM Account",
            recipients=[user.email],
            body=f"Click the link to verify your email: {verify_url}"
        )
        mail.send(msg)
        print(f"Verification email successfully sent to {user.email}")
    except Exception as e:
        print(f"Failed to send email to {user.email}: {e}")
        # Retain simulation for backup/debugging
        print(f"\n--- EMAIL SIMULATION ---")
        print(f"To: {user.email}")
        print(f"Subject: Verify your Collab CRM Account")
        print(f"Click the link to verify your email: {verify_url}")
        print(f"------------------------\n")

    return jsonify({"message": "Account created! Please check your email to verify your account."}), 201

@auth_bp.route("/api/auth/verify-email", methods=["POST"])
def verify_email():
    token = request.get_json().get("token")
    email = verify_token(token)
    if not email:
        return jsonify({"error": "The confirmation link is invalid or has expired."}), 400
    
    user = User.query.filter_by(email=email).first_or_404()
    if user.is_verified:
        return jsonify({"message": "Account already verified."}), 200
    
    user.is_verified = True
    db.session.commit()
    return jsonify({"message": "You have verified your account. Thanks!"}), 200

@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        if not user.is_verified:
            return jsonify({"error": "Please verify your email before logging in."}), 403
        
        login_user(user)
        return jsonify({"message": "Login successful", "user": user.to_dict()}), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    email = request.get_json().get("email")
    user = User.query.filter_by(email=email).first()
    
    if user:
        token = generate_token(user.email)
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/reset-password?token={token}"
        
        try:
            msg = Message(
                subject="Reset your Collab CRM Password",
                recipients=[user.email],
                body=f"Click the link to reset your password: {reset_url}"
            )
            mail.send(msg)
            print(f"Password reset email successfully sent to {user.email}")
        except Exception as e:
            print(f"Failed to send email to {user.email}: {e}")
            print(f"\n--- EMAIL SIMULATION ---")
            print(f"To: {user.email}")
            print(f"Subject: Reset your Collab CRM Password")
            print(f"Click the link to reset your password: {reset_url}")
            print(f"------------------------\n")

    # Always return a generic message to prevent email enumeration
    return jsonify({"message": "If an account with that email exists, a password reset link has been sent."}), 200

@auth_bp.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("password")
    
    email = verify_token(token)
    if not email:
        return jsonify({"error": "The reset link is invalid or has expired."}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
        
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    
    return jsonify({"message": "Your password has been updated! You can now log in."}), 200

@auth_bp.route("/api/auth/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200