from flask import Blueprint
from app.utils import log_audit, role_required, parse_id
from flask import request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Campaign

campaigns_bp = Blueprint("campaigns", __name__)

@campaigns_bp.route("/api/campaigns", methods=["GET"])
@login_required
def list_campaigns():
    campaigns = Campaign.query.filter_by(tenant_id=current_user.tenant_id).all()
    return jsonify([c.to_dict() for c in campaigns]), 200

@campaigns_bp.route("/api/campaigns", methods=["POST"])
@login_required
def add_campaign():
    data = request.get_json()
    campaign = Campaign(
        tenant_id=current_user.tenant_id,
        name=data.get("name"),
        goal_amount=float(data.get("goal_amount")) if data.get("goal_amount") else None
    )
    db.session.add(campaign)
    db.session.commit()
    log_audit('Create Campaign', 'Campaign', entity_id=campaign.id, details=f'Created campaign {campaign.name}')
    return jsonify(campaign.to_dict()), 201

@campaigns_bp.route("/api/campaigns/<int:id>", methods=["DELETE"])
@login_required
@role_required("org-admin")
def delete_campaign(id):
    campaign = Campaign.query.filter_by(id=id, tenant_id=current_user.tenant_id).first_or_404()
    db.session.delete(campaign)
    db.session.commit()
    log_audit("Delete Campaign", "Campaign", entity_id=id, details=f"Deleted campaign {campaign.name}")
    return jsonify({"message": "Campaign deleted"}), 200
