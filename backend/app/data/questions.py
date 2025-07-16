firstSetQuestions = [
    {
        "id": 1,
        "question": "What is the primary application domain of your AI system? (Hint: Needed to guide risk checks)",
        "options": {
            "1": "Healthcare",
            "2": "Education"
        }
    },
    {
        "id": 2,
        "question": "What type of institution uses this system? (Hint: Public use often has higher oversight)",
        "options": {
            "1": "Public",
            "2": "Private",
            "3": "NGO",
            "4": "Other",
        }
    },
    {
        "id": 3,
        "question": "Is the AI system fully autonomous or decision-supportive? (Hint: Impacts required human oversight)",
        "options": {
            "1": "Fully autonomous",
            "2": "Decision-support",
            "3": "Manual override required",
        }
    },
    {
        "id": 4,
        "question": "What data types are used? (Hint: Determines sensitivity under EU AI Act)",
        "options": {
            "1": "Personal data",
            "2": "Sensitive data",
            "3": "Behavioral data",
            "4": "Public or non-personal data",
            "5": "Other"
        }
    },
    {
        "id": 5,
        "question": "Is your AI system accessible online? (Hint: Public accessibility impacts compliance scope)",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 6,
        "question": "Can the system output affect someone's rights or access to services? (Hint: Key question for high-risk classification)",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Not sure"
        }
    },
    {
        "id": 7,
        "question": "Are there any children or minors affected by the system? (Hint: Special protection applies)",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Not sure"
        }
    },
    {
        "id": 8,
        "question": "Does the AI system provide an explanation for its output? (Hint: Required for transparency)",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Partially"
        }
    },
    {
        "id": 9,
        "question": "Is there a human responsible for the final decision? (Hint: Required for many high-risk cases)",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Varies by case"
        }
    }
]

lowRiskQuestions = [
    {
        "id": 1,
        "question": "Does your software interact directly with users in a conversational or helpdesk format (e.g., chatbots)?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 2,
        "question": "Does the system generate or manipulate text, images, audio, or video intended for public display (e.g., AI-generated marketing content)?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 3,
        "question": "Does your system employ emotion analysis or biometric profiling on end-users (e.g., detecting mood, stress)?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 4,
        "question": "Is your AI used to generate deepfake-style content or disguised impersonation (e.g., synthetic voice or avatars)?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 5,
        "question": "Does the software serve as a recommendation engine that users interact with directly (e.g., product, movie, or job suggestions)?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 6,
        "question": "Does your system include an AI-powered translation or summarisation feature that users utilise directly?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 7,
        "question": "Does the software generate AI-based chat or advisory responses beyond static FAQ?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    },
    {
        "id": 8,
        "question": "Is your AI used to enhance user-generated content (e.g., grammar checks, predictive text)?",
        "options": {
            "1": "Yes",
            "2": "Mostly",
            "3": "Few Times",
            "4": "No"
        }
    }
]

highRiskQuestionHealthcare = [
    {
        "id": 1,
        "question": "Is the AI system used for diagnosing medical conditions?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 2,
        "question": "Does the system assist in suggesting treatment plans or medication?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 3,
        "question": "Is the AI used in triage, ICU, or patient prioritization?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 4,
        "question": "What kind of patient data does it process?",
        "options": {
            "1": "EHR",
            "2": "Imaging",
            "3": "Biometric",
            "4": "Other"
        }
    },
    {
        "id": 5,
        "question": "Can healthcare staff override AI decisions?",
        "options": {
            "1": "Always",
            "2": "Sometimes",
            "3": "Never",
        }
    },
    {
        "id": 6,
        "question": "Is the system part of a certified medical device?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Not sure",
        }
    },
    {
        "id": 7,
        "question": "Does it monitor patient vital signs continuously?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 8,
        "question": "Has it been tested for safety risks or adverse effects?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Not yet",
        }
    },
    {
        "id": 9,
        "question": "Are patients informed about AI involvement in their care?",
        "options": {
            "1": "Always",
            "2": "Sometimes",
            "3": "No",
        }
    },
    {
        "id": 10,
        "question": "Does the AI learn from real-world patient data?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Planned",
        }
    }
]

highRiskQuestionEducation = [
    {
        "id": 1,
        "question": "Does the AI system score or grade student performance?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 2,
        "question": "Can it influence admission or scholarship decisions?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 3,
        "question": "Can it autonomously decide pass/fail status?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Requires",
            "4": "Validation"
        }
    },
    {
        "id": 4,
        "question": "Does it use emotion detection (e.g., eye-tracking, facial data)?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 5,
        "question": "Are students notified of AI use in assessments?",
        "options": {
            "1": "Always",
            "2": "Sometimes",
            "3": "Never",
        }
    },
    {
        "id": 6,
        "question": "Are training datasets reviewed for bias?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Not sure",
        }
    },
    {
        "id": 7,
        "question": "Can students or teachers access explanations of the decisions?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Limited"
        }
    },
    {
        "id": 8,
        "question": "Does it adapt in real-time to student responses?",
        "options": {
            "1": "Yes",
            "2": "No",
        }
    },
    {
        "id": 9,
        "question": "Who accesses AI-generated results?",
        "options": {
            "1": "Teachers",
            "2": "Admin",
            "3": "Parents",
            "4": "Students"
        }
    },
    {
        "id": 10,
        "question": "Has the system been tested across different demographics?",
        "options": {
            "1": "Yes",
            "2": "No",
            "3": "Planned",
        }
    }
]