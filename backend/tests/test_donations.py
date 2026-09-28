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
        don = Donation(tenant_id=t.id, donor_id=d.id, amount=150.0); db.session.add(don); db.session.commit()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_generate_receipt(client):
    client.post("/api/auth/login", json={"email": "test@test.com", "password": "pass"})
    res = client.get("/api/donations/1/receipt")
    assert res.status_code == 200
    assert res.mimetype == "application/pdf"
    assert b"%PDF-1" in res.data  # PDF magic number

