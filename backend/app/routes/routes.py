from flask import Blueprint, jsonify, request
from ..data.questions import firstSetQuestions
from ..schemas.question_schemas import QuestionSchema

api_blueprint = Blueprint('api', __name__)
schema = QuestionSchema(many=True)

# Error handler for ValueError
@api_blueprint.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({"error": str(error)}), 400

@api_blueprint.route("/first_set", methods=["GET"])
def firstset():
    return jsonify(schema.dump(firstSetQuestions)), 200

@api_blueprint.route("/evaluate", methods=["GET", "POST"])
def secondset():
    if request.method == 'POST':
        data = request.get_json()
        results = []
        for item in data:
            question_id = item.get('id')
            user_answer = item.get('answer')
            # result, _ = evaluate_answer(question_id, user_answer)
            # results.append(result)

        return jsonify(results), 200
    return None