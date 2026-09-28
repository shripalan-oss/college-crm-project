from flask import Blueprint, request, jsonify, send_file
from flask_login import login_required, current_user
from app import db
from app.models import Donation, Donor, Campaign, Tenant
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

donations_bp = Blueprint("donations", __name__)

@donations_bp.route("/api/donations/<int:id>/receipt", methods=["GET"])
@login_required
def generate_receipt(id):
    donation = Donation.query.filter_by(id=id, tenant_id=current_user.tenant_id).first_or_404()
    tenant = Tenant.query.get(current_user.tenant_id)
    donor = Donor.query.get(donation.donor_id)
    campaign = Campaign.query.get(donation.campaign_id) if donation.campaign_id else None
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, 750, f"{tenant.org_name} - Donation Receipt")
    
    p.setFont("Helvetica", 12)
    p.drawString(50, 700, f"Receipt Number: RCPT-{donation.id:06d}")
    p.drawString(50, 680, f"Date: {donation.date.strftime('%Y-%m-%d %H:%M:%S')}")
    p.drawString(50, 660, f"Donor Name: {donor.name}")
    p.drawString(50, 640, f"Amount: {donation.amount}")
    if campaign:
        p.drawString(50, 620, f"Campaign: {campaign.name}")
    
    p.drawString(50, 580, "Thank you for your generous contribution!")
    
    p.showPage()
    p.save()
    buffer.seek(0)
    
    return send_file(buffer, as_attachment=True, download_name=f"receipt_{donation.id}.pdf", mimetype='application/pdf')

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