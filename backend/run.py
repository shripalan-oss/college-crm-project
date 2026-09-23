from app import create_app, db, login_manager
from app.models import User

app = create_app()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == "__main__":
    app.run(debug=True)