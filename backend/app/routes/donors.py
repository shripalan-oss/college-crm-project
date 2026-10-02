from flask import Blueprint
from app.utils import log_audit, role_required, parse_id
from flask import request, jsonify
from flask_login import login_required, current_user
from sqlalchemy import func
from datetime import datetime
from app import db
from app.models import Donor, Donation

donors_bp = Blueprint("donors", __name__)

@donors_bp.route("/api/donors", methods=["GET"])
@login_required
def list_donors():
    donors = Donor.query.filter_by(tenant_id=current_user.tenant_id).all()
    return jsonify([d.to_dict() for d in donors]), 200

@donors_bp.route("/api/donors", methods=["POST"])
@login_required
def add_donor():
    data = request.get_json()
    donor = Donor(
        tenant_id=current_user.tenant_id,
        name=data.get("name"),
        contact=data.get("contact", ""),
        tags=data.get("tags", "")
    )
    db.session.add(donor)
    db.session.commit()
    log_audit('Create Donor', 'Donor', entity_id=donor.id, details=f'Created donor {donor.name}')
    return jsonify(donor.to_dict()), 201

@donors_bp.route("/api/donors/insights", methods=["GET"])
@login_required
def donor_insights():
    results = db.session.query(
        Donor.id,
        Donor.name,
        func.max(Donation.date).label("last_donation"),
        func.count(Donation.id).label("frequency"),
        func.sum(Donation.amount).label("total_given")
    ).join(Donation, Donation.donor_id == Donor.id
    ).filter(Donor.tenant_id == current_user.tenant_id
    ).group_by(Donor.id, Donor.name).all()

    today = datetime.utcnow()
    insights = []
    for r in results:
        days_since = (today - r.last_donation).days if r.last_donation else None
        insights.append({
            "id": r.id,
            "name": r.name,
            "last_donation": r.last_donation.strftime("%Y-%m-%d") if r.last_donation else None,
            "days_since": days_since,
            "frequency": r.frequency,
            "total_given": float(r.total_given) if r.total_given else 0.0,
            "status": "Lapsing" if days_since and days_since > 90 else "Active"
        })

    return jsonify(insights), 200

@donors_bp.route("/api/donors/<int:id>", methods=["DELETE"])
@login_required
@role_required("org-admin")
def delete_donor(id):
    donor = Donor.query.filter_by(id=id, tenant_id=current_user.tenant_id).first_or_404()
    db.session.delete(donor)
    db.session.commit()
    log_audit("Delete Donor", "Donor", entity_id=id, details=f"Deleted donor {donor.name}")
    return jsonify({"message": "Donor deleted"}), 200
