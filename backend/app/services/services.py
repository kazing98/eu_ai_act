def evaluate_answer(answers: list) -> str:
    """
    Evaluate AI system risk category based on user answers and defined risk rules.

    Parameters:
    - answers: Dict mapping question_id (as string) to selected_option_key (also string)
    - risk_rules: Dict containing rule definitions

    Returns: "HIGH" or "LOW"
    """
    risk_rules = {
        "high_risk_flags": {
            "1": ["1", "2"],  # Healthcare or Education
            "2": ["1"],  # Public institution
            "3": ["1"],  # Fully autonomous
            "4": ["2"],  # Sensitive data
            "5": ["1"],  # Accessible online
            "6": ["1"],  # Affects rights or services
            "7": ["1"],  # Minors involved
            "8": ["2"],  # No explanation
            "9": ["2"]  # No human in final decision
        },
        "low_risk_defaults": {
            "2": ["2", "3", "4"],
            "3": ["2", "3"],
            "4": ["4"],
            "5": ["2"],
            "6": ["2"],
            "7": ["2"],
            "8": ["1"],
            "9": ["1"]
        },
        "high_risk_threshold": 4
    }

    high_risk_flags = risk_rules["high_risk_flags"]
    threshold = risk_rules["high_risk_threshold"]

    # Converting list of dictionary to only dictionary
    flat_answers = {str(item["question_id"]): item["selected_option_key"] for item in answers}

    score = 0
    for q_id, high_vals in high_risk_flags.items():
        user_ans = flat_answers.get(q_id)
        if user_ans in high_vals:
            score += 1

    return "HIGH" if score >= threshold else "LOW"

def user_domain(answers: list):
    flat_answers = {str(item["question_id"]): item["selected_option_key"] for item in answers}

    return flat_answers["1"]