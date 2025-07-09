def evaluate_answer(question_id: str, user_answer: str):
    if not question_id or not user_answer:
        return {"error": "Missing 'id' or 'answer'"}, 400


    return {
        "id": question_id,
        "your_answer": user_answer,
    }, 200