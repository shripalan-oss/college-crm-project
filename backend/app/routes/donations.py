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

from app.utils import parse_id

@donations_bp.route("/api/donations", methods=["POST"])
@login_required
def add_donation():
    data = request.get_json()
    
    donor_id_val, err = parse_id(data.get("donor_id"), "donor_id")
    if err: return jsonify({"error": err}), 400
    
    campaign_id_val, err2 = parse_id(data.get("campaign_id"), "campaign_id")
    if err2: return jsonify({"error": err2}), 400
    
    # Verify Donor belongs to Tenant
    donor = Donor.query.filter_by(id=donor_id_val, tenant_id=current_user.tenant_id).first()
    if not donor:
        return jsonify({"error": "Donor not found or unauthorized"}), 404
        
    # Verify Campaign belongs to Tenant (if provided)
    if campaign_id_val:
        campaign = Campaign.query.filter_by(id=campaign_id_val, tenant_id=current_user.tenant_id).first()
        if not campaign:
            return jsonify({"error": "Campaign not found or unauthorized"}), 404

    donation = Donation(
        tenant_id=current_user.tenant_id,
        donor_id=donor.id,
        campaign_id=campaign_id_val,
        amount=float(data.get("amount"))
    )
    db.session.add(donation)
    db.session.commit()
    return jsonify(donation.to_dict()), 201