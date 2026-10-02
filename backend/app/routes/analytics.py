from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from sqlalchemy import func
from app import db
from app.models import Donation, Donor, Campaign

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/api/analytics/summary", methods=["GET"])
@login_required
def get_analytics_summary():
    tenant_id = current_user.tenant_id
    
    total_raised = db.session.query(func.sum(Donation.amount)).filter_by(tenant_id=tenant_id).scalar() or 0
    donor_count = db.session.query(func.count(Donor.id)).filter_by(tenant_id=tenant_id).scalar() or 0
    campaign_count = db.session.query(func.count(Campaign.id)).filter_by(tenant_id=tenant_id).scalar() or 0
    donation_count = db.session.query(func.count(Donation.id)).filter_by(tenant_id=tenant_id).scalar() or 0
    
    campaign_totals = db.session.query(
        Campaign.name, func.sum(Donation.amount)
    ).join(Donation, Donation.campaign_id == Campaign.id).filter(
        Campaign.tenant_id == tenant_id
    ).group_by(Campaign.name).all()
    
    top_donors = db.session.query(
        Donor.name, func.sum(Donation.amount).label("total")
    ).join(Donation, Donation.donor_id == Donor.id).filter(
        Donor.tenant_id == tenant_id
    ).group_by(Donor.name).order_by(func.sum(Donation.amount).desc()).limit(5).all()
    
    donations_by_date = db.session.query(
        func.date(Donation.date).label("date"), func.sum(Donation.amount)
    ).filter_by(tenant_id=tenant_id).group_by(func.date(Donation.date)).order_by("date").all()
    
    return jsonify({
        "total_raised": total_raised,
        "donor_count": donor_count,
        "campaign_count": campaign_count,
        "donation_count": donation_count,
        "campaign_totals": [{"name": c[0], "amount": c[1]} for c in campaign_totals],
        "top_donors": [{"name": d[0], "amount": d[1]} for d in top_donors],
        "donations_by_date": [{"date": str(d[0]), "amount": d[1]} for d in donations_by_date]
    }), 200
