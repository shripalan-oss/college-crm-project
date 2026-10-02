import pytest
from app import create_app, db
from app.models import Tenant, User, Donor, Campaign, Donation, Outcome, AuditLog
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    app = create_app()
    app.config.update({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"})
    with app.app_context():
        db.create_all()
        t = Tenant(org_name="Test Org")
        db.session.add(t)
        db.session.commit()
        
        # Org Admin
        u_admin = User(tenant_id=t.id, name="Admin", email="admin@test.com", password_hash=generate_password_hash("pass"), is_verified=True, role="org-admin")
        db.session.add(u_admin)
        
        # Staff
        u_staff = User(tenant_id=t.id, name="Staff", email="staff@test.com", password_hash=generate_password_hash("pass"), is_verified=True, role="staff")
        db.session.add(u_staff)
        
        db.session.commit()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_audit_logging_and_role(client):
    # Log in as admin
    client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pass"})
    
    # Create donor to trigger audit
    res = client.post("/api/donors", json={"name": "Audit Test Donor"})
    assert res.status_code == 201
    
    # Check audit log as admin
    res_audit = client.get("/api/audit-log")
    assert res_audit.status_code == 200
    assert len(res_audit.json) >= 1
    assert res_audit.json[0]["action"] == "Create Donor"

def test_staff_cannot_delete(client):
    client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pass"})
    res = client.post("/api/donors", json={"name": "To Delete"})
    donor_id = res.json["id"]
    
    client.post("/api/auth/login", json={"email": "staff@test.com", "password": "pass"})
    res_del = client.delete(f"/api/donors/{donor_id}")
    assert res_del.status_code == 403
    
def test_admin_can_delete(client):
    client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pass"})
    res = client.post("/api/donors", json={"name": "To Delete 2"})
    donor_id = res.json["id"]
    
    res_del = client.delete(f"/api/donors/{donor_id}")
    assert res_del.status_code == 200

def test_donation_status_transition(client):
    client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pass"})
    # create donor
    d = client.post("/api/donors", json={"name": "D"}).json["id"]
    # create donation
    don = client.post("/api/donations", json={"donor_id": d, "amount": 100}).json
    assert don["status"] == "Pending"
    
    # transition
    don_updated = client.put(f"/api/donations/{don['id']}/status").json
    assert don_updated["status"] == "Verified"
    
    don_updated2 = client.put(f"/api/donations/{don['id']}/status").json
    assert don_updated2["status"] == "Receipted"
