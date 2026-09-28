import pytest
from app import create_app, db
from app.models import Tenant, User, Donor, Campaign, Donation, Outcome
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })
    
    with app.app_context():
        db.create_all()
        
        # Setup two tenants and users
        t1 = Tenant(org_name="Tenant A"); db.session.add(t1)
        t2 = Tenant(org_name="Tenant B"); db.session.add(t2)
        db.session.commit()
        
        u1 = User(tenant_id=t1.id, name="User A", email="a@test.com", password_hash=generate_password_hash("pass"), is_verified=True); db.session.add(u1)
        u2 = User(tenant_id=t2.id, name="User B", email="b@test.com", password_hash=generate_password_hash("pass"), is_verified=True); db.session.add(u2)
        db.session.commit()
        
        # Tenant A resources
        d1 = Donor(tenant_id=t1.id, name="Donor A"); db.session.add(d1)
        c1 = Campaign(tenant_id=t1.id, name="Campaign A"); db.session.add(c1)
        db.session.commit()
        
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_tenant_isolation_post_donation(client):
    # Login as User B
    client.post("/api/auth/login", json={"email": "b@test.com", "password": "pass"})
    
    # Try to add a donation to Donor A (who belongs to Tenant A)
    res = client.post("/api/donations", json={
        "donor_id": 1,  # Donor A
        "amount": 100
    })
    assert res.status_code == 404
    assert b"unauthorized" in res.data.lower()

def test_tenant_isolation_post_outcome(client):
    # Login as User B
    client.post("/api/auth/login", json={"email": "b@test.com", "password": "pass"})
    
    # Try to add an outcome to Campaign A (who belongs to Tenant A)
    res = client.post("/api/outcomes", json={
        "campaign_id": 1,  # Campaign A
        "description": "Test",
        "metric_value": 10
    })
    assert res.status_code == 404
    assert b"unauthorized" in res.data.lower()

