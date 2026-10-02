from functools import wraps
from flask import jsonify
from flask_login import current_user
from app import db
from app.models import AuditLog

def parse_id(value, field_name):
    if value is None or value == "":
        return None, None
    try:
        return int(value), None
    except (ValueError, TypeError):
        return None, f"{field_name} must be a number"

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_user.role != role:
                return jsonify({"error": "Unauthorized role"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def log_audit(action, entity_type, entity_id=None, details=None):
    if not current_user.is_authenticated:
        return
    log = AuditLog(
        tenant_id=current_user.tenant_id,
        user_id=current_user.id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details
    )
    db.session.add(log)
    db.session.commit()

