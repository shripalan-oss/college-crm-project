from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import AuditLog
from app.utils import role_required

audit_bp = Blueprint("audit", __name__)

@audit_bp.route("/api/audit-log", methods=["GET"])
@login_required
@role_required("org-admin")
def get_audit_log():
    logs = AuditLog.query.filter_by(tenant_id=current_user.tenant_id).order_by(AuditLog.timestamp.desc()).all()
    return jsonify([log.to_dict() for log in logs]), 200
