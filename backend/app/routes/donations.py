from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Donation, Donor, Campaign

donations_bp = Blueprint("donations", __name__)

@donations_bp.route("/api/donations", methods=["GET"])
@login_required
def list_donations():
    donations = Donation.query.filter_by(tenant_id=current_user.tenant_id).all()
    return jsonify([d.to_dict() for d in donations]), 200

@donations_bp.route("/api/donations", methods=["POST"])
@login_required
def add_donation():
    data = request.get_json()
    donation = Donation(
        tenant_id=current_user.tenant_id,
        donor_id=data.get("donor_id"),
        campaign_id=data.get("campaign_id") or None,
        amount=float(data.get("amount"))
    )
    db.session.add(donation)
    db.session.commit()
    return jsonify(donation.to_dict()), 201