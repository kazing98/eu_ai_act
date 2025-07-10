def evaluate_answer(question_id: list, user_answer: list):
    if not question_id or not user_answer:
        return {"error": "Missing 'id' or 'answer'"}, 400

    low_risk_1 = {1: ["1", "2"],
                2: ["1", "2"],
                3: "4",
                4: "6",
                5: "4",
                6: "4"}

    low_risk_2 = {1: ["1", "2"],
                2: "2",
                3: ["2", "3"],
                4: ["1", "4"],
                5: ["1", "3", "4"],
                6: ["1", "2"]}

    low_risk = [low_risk_1, low_risk_2]

    for pattern in low_risk:
        match = True
        for i in range(len(question_id)):
            q_id = question_id[i]
            ans = user_answer[i]
            valid_answers = pattern.get(q_id)
            if valid_answers is None or ans not in valid_answers:
                match = False
                break
        if match:
            return {"risk": "LOW"}

    return {"risk": "HIGH"}