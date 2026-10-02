from flask import Blueprint
from app.utils import log_audit, role_required, parse_id
from flask import request, jsonify
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
    
    # Verify Donor belongs to Tenant
    donor = Donor.query.filter_by(id=data.get("donor_id"), tenant_id=current_user.tenant_id).first()
    if not donor:
        return jsonify({"error": "Donor not found or unauthorized"}), 404
        
    # Verify Campaign belongs to Tenant (if provided)
    campaign_id = data.get("campaign_id")
    if campaign_id:
        campaign = Campaign.query.filter_by(id=campaign_id, tenant_id=current_user.tenant_id).first()
        if not campaign:
            return jsonify({"error": "Campaign not found or unauthorized"}), 404

    donation = Donation(
        tenant_id=current_user.tenant_id,
        donor_id=donor.id,
        campaign_id=campaign_id or None,
        amount=float(data.get("amount"))
    )
    db.session.add(donation)
    db.session.commit()
    log_audit('Create Donation', 'Donation', entity_id=donation.id, details=f'Created donation amount {donation.amount}')
    return jsonify(donation.to_dict()), 201

@donations_bp.route("/api/donations/<int:id>", methods=["DELETE"])
@login_required
@role_required("org-admin")
def delete_donation(id):
    donation = Donation.query.filter_by(id=id, tenant_id=current_user.tenant_id).first_or_404()
    db.session.delete(donation)
    db.session.commit()
    log_audit("Delete Donation", "Donation", entity_id=id, details="Deleted donation")
    return jsonify({"message": "Donation deleted"}), 200

@donations_bp.route("/api/donations/<int:id>/status", methods=["PUT"])
@login_required
@role_required("org-admin")
def update_donation_status(id):
    donation = Donation.query.filter_by(id=id, tenant_id=current_user.tenant_id).first_or_404()
    
    # State machine: Pending -> Verified -> Receipted
    if donation.status == "Pending":
        donation.status = "Verified"
    elif donation.status == "Verified":
        donation.status = "Receipted"
        
    db.session.commit()
    log_audit("Update Donation Status", "Donation", entity_id=id, details=f"Status changed to {donation.status}")
    return jsonify(donation.to_dict()), 200
