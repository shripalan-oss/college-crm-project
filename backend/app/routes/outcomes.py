from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Outcome, Campaign

outcomes_bp = Blueprint("outcomes", __name__)

@outcomes_bp.route("/api/outcomes", methods=["GET"])
@login_required
def list_outcomes():
    outcomes = Outcome.query.filter_by(tenant_id=current_user.tenant_id).all()
    return jsonify([o.to_dict() for o in outcomes]), 200

@outcomes_bp.route("/api/outcomes", methods=["POST"])
@login_required
def add_outcome():
    data = request.get_json()
    
    campaign_id = data.get("campaign_id")
    campaign = Campaign.query.filter_by(id=campaign_id, tenant_id=current_user.tenant_id).first()
    if not campaign:
        return jsonify({"error": "Campaign not found or unauthorized"}), 404
        
    outcome = Outcome(
        tenant_id=current_user.tenant_id,
        campaign_id=campaign.id,
        description=data.get("description"),
        metric_value=float(data.get("metric_value")) if data.get("metric_value") else None
    )
    db.session.add(outcome)
    db.session.commit()
    return jsonify(outcome.to_dict()), 201