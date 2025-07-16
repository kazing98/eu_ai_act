from flask import Blueprint, jsonify, request
from ..data.questions import firstSetQuestions, lowRiskQuestions, highRiskQuestionEducation, highRiskQuestionHealthcare
from ..schemas.question_schemas import QuestionSchema
from ..services.services import evaluate_answer, user_domain

api_blueprint = Blueprint('api', __name__)
schema = QuestionSchema(many=True)

# Error handler for ValueError
@api_blueprint.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({"error": str(error)}), 400

@api_blueprint.route("/question_set", methods=["GET", "POST"])
def questions():
    if request.method == 'GET':
        questions = schema.dump(firstSetQuestions, many=True)

        result = {
            "is_first_set": True,  # <‑‑ your flag
            "questions": questions
        }

        return jsonify(result), 200

    if request.method == 'POST':
        data = request.get_json()
        risk = data.get("risk")
        user_domain = int(data.get("user_domain"))

        # High Risk Question for Healthcare
        if risk.lower() == "high" and user_domain == 1:
            return jsonify(schema.dump(highRiskQuestionHealthcare)), 200
        # High Risk Question for Education
        elif risk.lower() == "high" and user_domain == 2:
            return jsonify(schema.dump(highRiskQuestionEducation)), 200
        elif risk.lower() == "low":
            return jsonify(schema.dump(lowRiskQuestions)), 200
        else:
            return "Invalid Risk Level"
    return None


@api_blueprint.route("/submit_evaluate", methods=["POST"])
def evaluation():
    if request.method == 'POST':
        data = request.get_json()
        question_id = []
        user_answer = []

        # for item in data['answers']:
        #     question_id.append(item.get("question_id"))
        #     user_answer.append(item.get("selected_option_key"))
        #     print(f"question: {question_id}"
        #           f"answer: {user_answer}")

        result = {}
        if data["is_first_set"]:
            result["risk"] = evaluate_answer(data['answers'])  # index 0
            result["user_domain"] = user_domain(data['answers'])  # sharing user response

        else:
            #second questions
            pass

        return jsonify(result), 200

    return None