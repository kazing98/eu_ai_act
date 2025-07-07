from flask import Flask
from flask_cors import CORS
from backend.routes.routes import api_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow frontend requests

    app.register_blueprint(api_blueprint, url_prefix='/questions')

    return app