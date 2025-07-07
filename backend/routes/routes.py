from flask import Blueprint, jsonify, request
from backend.data.questions import firstSetQuestions
from backend.schemas.question_schemas import QuestionSchema

api_blueprint = Blueprint('api', __name__)
schema = QuestionSchema(many=True)

# Error handler for ValueError
@api_blueprint.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({"error": str(error)}), 400

@api_blueprint.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@api_blueprint.route("/first_set", methods=["GET"])
def firstset():
    return jsonify(schema.dump(firstSetQuestions))