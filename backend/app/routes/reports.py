from flask import Blueprint, jsonify, send_file, request
from flask_login import login_required, current_user
from app.models import Donation, Campaign, Outcome, Tenant
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from sqlalchemy import extract
from datetime import datetime
from app.utils import log_audit

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/api/reports/monthly", methods=["GET"])
@login_required
def generate_monthly_report():
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    if not month or not year:
        now = datetime.utcnow()
        month = now.month
        year = now.year
        
    tenant_id = current_user.tenant_id
    tenant = Tenant.query.get(tenant_id)
    
    donations = Donation.query.filter_by(tenant_id=tenant_id).filter(
        extract("month", Donation.date) == month,
        extract("year", Donation.date) == year
    ).all()
    
    total_raised = sum(d.amount for d in donations)
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, 750, f"{tenant.org_name} - Monthly Report")
    
    p.setFont("Helvetica", 14)
    p.drawString(50, 710, f"Period: {month}/{year}")
    p.drawString(50, 680, f"Total Raised: {total_raised}")
    p.drawString(50, 650, f"Total Donations: {len(donations)}")
    
    p.setFont("Helvetica", 12)
    y = 600
    p.drawString(50, y, "Recent Donations (Max 10):")
    y -= 20
    for d in donations[:10]:
        name = d.donor.name if d.donor else "Unknown"
        p.drawString(70, y, f"- {d.date.strftime('%Y-%m-%d')}: {name} - {d.amount}")
        y -= 20
        if y < 100:
            p.showPage()
            y = 750
            
    p.showPage()
    p.save()
    buffer.seek(0)
    
    log_audit("Generate Report", "Report", details=f"Generated monthly report for {month}/{year}")
    
    return send_file(buffer, as_attachment=True, download_name=f"report_{year}_{month}.pdf", mimetype="application/pdf")
