# Used to evaluate risk category
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

question_groups = {
    1: {
        "diagnostic_support": [1, 4, 5, 6, 8, 9, 10],
        "treatment_recommendation": [2, 4, 5, 6, 8, 9, 10],
        "triage_or_icu": [3, 4, 5, 6, 8, 9, 10],
        "vital_sign_monitoring": [7, 4, 5, 6, 8, 9, 10]
    },
    2: {
        "grading": [1, 5, 6, 7, 9, 10],
        "admission": [2, 5, 6, 7, 9, 10],
        "evaluation": [3, 5, 6, 7, 9, 10],
        "emotion_detection": [4, 5, 6, 7, 9, 10],
        "adaptive_learning": [8, 5, 6, 7, 9, 10]
    }
}

def sub_domain_questions(sub_domain, user_domain, highRiskQuestion):
    question_set = []
    if user_domain == 1 and user_domain in question_groups:
        for domain in sub_domain["selected_option_key"]:
            if domain in question_groups[1]:
                question_set.append(question_groups[1][domain])

        # Flattening the list of list to list
        question_set = [item for row in question_set for item in row]
        # Removing duplicates from list
        question_set = list(dict.fromkeys(question_set))

        return high_risk_healthcare_question(question_set, highRiskQuestion)

    elif user_domain == 2 and user_domain in question_groups:
        for domain in sub_domain["selected_option_key"]:
            if domain in question_groups[2]:
                question_set.append(question_groups[2][domain])

        # Flattening the list of list to list
        question_set = [item for row in question_set for item in row]
        # Removing duplicates from list
        question_set = list(dict.fromkeys(question_set))

        return high_risk_healthcare_question(question_set, highRiskQuestion)

    return None


def high_risk_healthcare_question(question_key, highRiskQuestionHealthcare):
    return [question for question in highRiskQuestionHealthcare if question["id"] in question_key]

def high_risk_education_question(question_key, highRiskQuestionEducation):
    return [question for question in highRiskQuestionEducation if question["id"] in question_key]

# Scoring is given based on this
compliance_scoring = {
    "healthcare": {
        1: {"1": 2, "2": 0},
        2: {"1": 2, "2": 0},
        3: {"1": 0, "2": 2, "3": 1},
        4: {"1": 2, "2": 2, "3": 1, "4": 0},
        5: {"1": 2, "2": 1, "3": 0},
        6: {"1": 2, "2": 1, "3": 0},
        7: {"1": 2, "2": 1, "3": 0},
        8: {"1": 2, "2": 1, "3": 0},
        9: {"1": 2, "2": 1, "3": 0},
        10: {"1": 2, "2": 1, "3": 0},
    },
    "education": {
        1: {"1": 0, "2": 2, "3": 1},
        2: {"1": 0, "2": 2, "3": 1},
        3: {"1": 0, "2": 2, "3": 1},
        4: {"1": 0, "2": 2, "3": 1},
        5: {"1": 2, "2": 1, "3": 0},
        6: {"1": 2, "2": 1, "3": 0},
        7: {"1": 2, "2": 1, "3": 0},
        8: {"1": 2, "2": 0},
        9: {"1": 2, "2": 1, "3": 0},
        10: {"1": 2, "2": 1, "3": 0},
    },
    "lowriskdomain": {
        1: {"1": 2, "2": 1, "3": 1, "4": 0},
        2: {"1": 2, "2": 1, "3": 1, "4": 0},
        3: {"1": 2, "2": 1, "3": 1, "4": 0},
        4: {"1": 2, "2": 1, "3": 1, "4": 0},
        5: {"1": 2, "2": 1, "3": 1, "4": 0},
        6: {"1": 2, "2": 1, "3": 1, "4": 0},
        7: {"1": 2, "2": 1, "3": 1, "4": 0},
        8: {"1": 2, "2": 1, "3": 1, "4": 0}
    }
}

# Final Scoring Evaluation
def evaluate_compliance(risk: str, user_domain: str, answers: dict):
    """
    domain: 'healthcare' or 'education'
    answers: { question_id: selected_option (string) }
    Returns: (score, compliance_percent, band)
    """
    if risk.lower() == "low":
        domain = "lowriskdomain"
    elif user_domain == "1":
        domain = "healthcare"
    elif user_domain == "2":
        domain = "education"
    else:
        raise ValueError("Unknown Domain")
    if domain not in compliance_scoring:
        raise ValueError("Unsupported Domain")

    score = 0
    max_score = 0
    scoring_table = compliance_scoring[domain]

    # Converting list of dictionary to only dictionary
    flat_answers = {str(item["question_id"]): item["selected_option_key"] for item in answers}

    for qid, answer in flat_answers.items():
        qid = int(qid)
        if qid in scoring_table:
            score_map = scoring_table[qid]
            point = score_map.get(answer, 0)
            score += point
            max_score += 2

    compliance_percent = round((score / max_score) * 100, 1) if max_score > 0 else 0

    if compliance_percent >= 85:
        band = "Fully Compliant"
    elif compliance_percent >= 70:
        band = "Mostly Compliant"
    elif compliance_percent >= 50:
        band = "Partially Compliant"
    else:
        band = "Non-Compliant"

    if user_domain == "1":
        return {
            "domain": "Healthcare",
            "risk_level": risk,
            "score": score,
            "out_of": max_score,
            "compliance_percent": compliance_percent,
            "compliance_level": band,
        }
    else:
        return {
            "domain": "Education",
            "risk_level": risk,
            "score": score,
            "out_of": max_score,
            "compliance_percent": compliance_percent,
            "compliance_level": band,
        }