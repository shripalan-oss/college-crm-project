import pytest
from app import create_app, db
from app.models import Tenant, User, Donor, Campaign, Donation
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    app = create_app()
    app.config.update({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"})
    with app.app_context():
        db.create_all()
        t = Tenant(org_name="Test Org"); db.session.add(t); db.session.commit()
        u = User(tenant_id=t.id, name="Test User", email="test@test.com", password_hash=generate_password_hash("pass"), is_verified=True); db.session.add(u); db.session.commit()
        d = Donor(tenant_id=t.id, name="Test Donor"); db.session.add(d); db.session.commit()
        c = Campaign(tenant_id=t.id, name="Test Camp", goal_amount=1000); db.session.add(c); db.session.commit()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_add_donation_with_string_id(client):
    client.post("/api/auth/login", json={"email": "test@test.com", "password": "pass"})
    
    # Valid string ID
    res = client.post("/api/donations", json={"donor_id": "1", "campaign_id": "1", "amount": 50})
    assert res.status_code == 201
    
    # Valid int ID
    res2 = client.post("/api/donations", json={"donor_id": 1, "campaign_id": 1, "amount": 50})
    assert res2.status_code == 201

    # Invalid string ID
    res3 = client.post("/api/donations", json={"donor_id": "abc", "amount": 50})
    assert res3.status_code == 400
    assert b"must be a number" in res3.data

def test_add_outcome_with_invalid_id(client):
    client.post("/api/auth/login", json={"email": "test@test.com", "password": "pass"})
    res = client.post("/api/outcomes", json={"campaign_id": "xyz", "description": "test", "metric_value": 10})
    assert res.status_code == 400
    assert b"must be a number" in res.data

