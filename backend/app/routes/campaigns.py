from flask import Blueprint, request, jsonify
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
    return jsonify(campaign.to_dict()), 201