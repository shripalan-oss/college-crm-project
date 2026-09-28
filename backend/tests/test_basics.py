import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_app_is_testing(app):
    assert app.config["TESTING"]

def test_unauthorized_access(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert b"Unauthorized" in response.data

