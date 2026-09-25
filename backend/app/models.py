from app import db
from flask_login import UserMixin
from datetime import datetime

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_name = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "org_name": self.org_name,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenant.id"), nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="staff")
    is_verified = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_verified": self.is_verified
        }

class Donor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenant.id"), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    contact = db.Column(db.String(150))
    tags = db.Column(db.String(200))

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "name": self.name,
            "contact": self.contact,
            "tags": self.tags
        }

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenant.id"), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    goal_amount = db.Column(db.Float)

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "name": self.name,
            "goal_amount": self.goal_amount
        }

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenant.id"), nullable=False)
    donor_id = db.Column(db.Integer, db.ForeignKey("donor.id"), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaign.id"))
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    donor = db.relationship("Donor", backref="donations")
    campaign = db.relationship("Campaign", backref="donations")

    def to_dict(self):
        return {
            "id": self.id,
            "donor_id": self.donor_id,
            "donor_name": self.donor.name if self.donor else None,
            "campaign_id": self.campaign_id,
            "campaign_name": self.campaign.name if self.campaign else None,
            "amount": self.amount,
            "date": self.date.isoformat() if self.date else None
        }

class Outcome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenant.id"), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaign.id"))
    description = db.Column(db.String(255))
    metric_value = db.Column(db.Float)

    campaign = db.relationship("Campaign", backref="outcomes")

    def to_dict(self):
        return {
            "id": self.id,
            "campaign_id": self.campaign_id,
            "campaign_name": self.campaign.name if self.campaign else None,
            "description": self.description,
            "metric_value": self.metric_value
        }