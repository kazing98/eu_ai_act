from flask import Blueprint, jsonify, request
from ..data.questions import firstSetQuestions, lowRiskQuestions
from ..schemas.question_schemas import QuestionSchema
from ..services.services import evaluate_answer

api_blueprint = Blueprint('api', __name__)
schema = QuestionSchema(many=True)

# Error handler for ValueError
@api_blueprint.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({"error": str(error)}), 400

@api_blueprint.route("/question_set", methods=["GET", "POST"])
def questions():
    if request.method == 'GET':
        return jsonify(schema.dump(firstSetQuestions)), 200

    if request.method == 'POST':
        data = request.get_json()
        risk = data[0].get("risk")

        if risk.lower() == "high":
            return "High Risk Questions"
        elif risk.lower() == "low":
            return jsonify(schema.dump(lowRiskQuestions)), 200
        else:
            return "Invalid Risk Level"
    return None


@api_blueprint.route("/submit_evaluate", methods=["GET", "POST"])
def evaluation():
    if request.method == 'POST':
        data = request.get_json()
        question_id = []
        user_answer = []
        for item in data:
            question_id.append(item.get("question_id"))
            user_answer.append(item.get("selected_option_key"))
            print(f"question: {question_id}"
                  f"answer: {user_answer}")

        result = evaluate_answer(question_id, user_answer)

        return jsonify(result), 200

    return None