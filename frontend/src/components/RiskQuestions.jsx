import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- Icon components (Assumed to be available) ---
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file text-blue-500">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain text-blue-500"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z"/><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h-3A2.5 2.5 0 0 1 9 4.5v0A2.5 2.5 0 0 1 11.5 2h3Z"/><path d="M12 17.5a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-2.5 2.5Z"/><path d="M6.5 22A2.5 2.5 0 0 1 4 19.5v-3a2.5 2.5 0 0 1 5 0v3A2.5 2.5 0 0 1 6.5 22Z"/><path d="M17.5 22a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-2.5 2.5Z"/><path d="M6.5 12A2.5 2.5 0 0 1 4 9.5v-3a2.5 2.5 0 0 1 5 0v3A2.5 2.5 0 0 1 6.5 12Z"/><path d="M17.5 12a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 1 5 0v3A2.5 2.5 0 0 1 17.5 12Z"/></svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database text-blue-500"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-white"><path d="M20 6 9 17l-5-5"/></svg>
);

const iconMap = {
    document: DocumentIcon,
    users: UsersIcon,
    brain: BrainIcon,
    database: DatabaseIcon,
    'diagnostic_support': BrainIcon,
    'treatment_planning': DocumentIcon,
    'icu_triage_prioritization': UsersIcon,
    'vital_sign_monitoring': DatabaseIcon,
    'patient_communication': UsersIcon,
    default: DocumentIcon,
};

const initialStaticQuestion = {
    id: 2001,
    question: "Which of the following functions does your AI system perform?",
    isMultiSelect: true,
    options: [
        { id: "diagnostic_support", title: "Diagnostic Support" },
        { id: "treatment_planning", title: "Treatment Planning" },
        { id: "icu_triage_prioritization", title: "ICU Triage / Prioritization" },
        { id: "vital_sign_monitoring", title: "Vital Sign Monitoring" },
        { id: "patient_communication", title: "Patient Communication" }
    ]
};

async function submitAnswersAndGetNextSteps(payload) {
    const response = await fetch('http://localhost:8000/questions/question_set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            const textError = await response.text();
            throw new Error(`Server error: ${response.status}. Raw response: ${textError.substring(0, 200)}...`);
        }
        throw new Error(errorData.message || response.statusText);
    }
    return response.json();
}


function RiskQuestions() {
    const location = useLocation();
    const navigate = useNavigate();

    const [assessmentResult, setAssessmentResult] = useState(null);
    const [riskQuestions, setRiskQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [finalReport, setFinalReport] = useState(null);

    const [showStaticQuestion, setShowStaticQuestion] = useState(true);
    const [staticQuestionAnswers, setStaticQuestionAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // New state for current question index

    useEffect(() => {
        let initialResult = location.state?.assessmentResult;
        if (!initialResult) {
            const storedResult = sessionStorage.getItem('preliminaryAssessmentResult');
            if (storedResult) {
                initialResult = JSON.parse(storedResult);
            }
        }

        if (!initialResult?.risk || !initialResult?.user_domain) {
            setError('Assessment data is missing. Please start over from Preliminary Questions.');
            setLoading(false);
            setShowStaticQuestion(false);
            return;
        }
        setAssessmentResult(initialResult);

        if (initialResult && !riskQuestions.length && !finalReport) {
            setShowStaticQuestion(true);
        }

    }, [location.state]);

    const handleStaticOptionSelect = (optionId) => {
        setStaticQuestionAnswers(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId);
            } else {
                return [...prev, optionId];
            }
        });
    };

    const handleStartAnalysis = async () => {
        if (staticQuestionAnswers.length === 0) {
            setError("Please select at least one function for your AI system.");
            return;
        }
        if (!assessmentResult?.risk || !assessmentResult?.user_domain) {
            setError("Preliminary assessment data is missing. Cannot start analysis.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const payload = {
                is_first_set: false,
                user_domain: assessmentResult.user_domain,
                risk: assessmentResult.risk.toLowerCase(),
                answers: {
                    question_id: initialStaticQuestion.id,
                    selected_option_key: staticQuestionAnswers,
                },
            };

            console.log("Sending Payload to /question_set:", JSON.stringify(payload, null, 2));

            const data = await submitAnswersAndGetNextSteps(payload);

            if (Array.isArray(data)) {
                setRiskQuestions(data);
                setShowStaticQuestion(false);
                setAnswers({});
                setCurrentQuestionIndex(0); // Reset to first question
            } else {
                setFinalReport(data);
                setShowStaticQuestion(false);
            }

        } catch (err) {
            console.error('Error submitting static question or fetching dynamic questions:', err);
            setError(err.message || 'Failed to start analysis or load dynamic questions.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleNextQuestion = () => {
        const currentQuestion = riskQuestions[currentQuestionIndex];
        if (!answers.hasOwnProperty(currentQuestion.id)) {
            setError("Please select an option before proceeding.");
            return;
        }
        setError(null);
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setError(null);
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    };

    const handleSubmitRiskAnalysis = async () => {
        const currentQuestion = riskQuestions[currentQuestionIndex];
        if (!answers.hasOwnProperty(currentQuestion.id)) {
            setError("Please select an option before submitting.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const payload = {
                risk: assessmentResult.risk.toLowerCase(),
                user_domain: assessmentResult.user_domain,
                answers: Object.keys(answers).map(questionId => ({
                    question_id: parseInt(questionId, 10),
                    selected_option_key: answers[questionId],
                })),
            };

            const report = await submitAnswersAndGetNextSteps(payload);
            setFinalReport(report);

        } catch (err) {
            setError(err.message || 'An unexpected error occurred during final analysis submission.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartNewAssessment = () => {
        sessionStorage.removeItem('preliminaryAssessmentResult');
        navigate('/preliminary', { replace: true });
    };

    // --- Render Logic ---

    if (showStaticQuestion && assessmentResult) {
        const q = initialStaticQuestion;
        return (
            <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4">
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-4xl">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                        {q.question}
                    </h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-3">
                        {q.options.map((option) => {
                            const isSelected = staticQuestionAnswers.includes(option.id);
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleStaticOptionSelect(option.id)}
                                    className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <div className="mr-4 flex-shrink-0">{React.createElement(iconMap[option.id] || iconMap.default)}</div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{option.title}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ml-4 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                                        {isSelected && <CheckIcon />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={() => navigate('/preliminary')}
                            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleStartAnalysis}
                            disabled={staticQuestionAnswers.length === 0 || loading}
                            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Starting...' : 'Start Analysis'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div className="text-center p-10 font-inter text-gray-700">Loading questions...</div>;
    if (error) return <div className="text-center p-10 font-inter text-red-500">{error} <button onClick={handleStartNewAssessment} className="text-blue-600 underline ml-2">Start Over</button></div>;

    if (finalReport) {
        return (
            <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4">
                <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Recommendations</h2>
                    <p className="text-gray-700 mb-6">Here are your personalized recommendations:</p>
                    <div className="bg-blue-50 p-4 rounded-lg text-left mb-6 border border-blue-200">
                        <h3 className="font-semibold text-blue-800 text-lg mb-2">Key Actions Recommended:</h3>
                        <ul className="list-disc list-inside text-blue-700 space-y-2">
                            {finalReport.recommendations?.length > 0 ? (
                                finalReport.recommendations.map((rec, index) => <li key={index}>{rec}</li>)
                            ) : (
                                <li>No specific recommendations were generated.</li>
                            )}
                        </ul>
                    </div>
                    <button onClick={handleStartNewAssessment} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Start New Assessment
                    </button>
                </div>
            </div>
        );
    }

    if (!riskQuestions.length) return <div className="text-center p-10 font-inter">No specific risk questions found. <button onClick={handleStartNewAssessment} className="text-blue-600 underline ml-2">Start Over</button></div>;

    const currentQuestion = riskQuestions[currentQuestionIndex];
    const totalQuestions = riskQuestions.length;
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-4xl">
                {/* Progress Bar and Counter */}
                <div className="mb-8">
                    <p className="text-sm text-gray-500 text-center mb-2">
                        Question {currentQuestionIndex + 1}/{totalQuestions}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    {`${assessmentResult?.risk}-Risk Analysis`}
                </h1>
                <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                    {assessmentResult?.risk === "HIGH"
                        ? "Your project is potentially high-risk. These questions will help generate targeted recommendations."
                        : "Let's refine your low-risk assessment with a few more details to provide tailored advice."
                    }
                </p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* Current Question Display */}
                <div className="space-y-8">
                    <div key={currentQuestion.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {currentQuestion.question || 'Question text not found'}
                        </h2>
                        <div className="flex flex-col gap-y-3">
                            {currentQuestion.options && Object.entries(currentQuestion.options).map(([optionId, optionTitle]) => (
                                <label key={optionId} className="inline-flex items-center cursor-pointer p-3 rounded-md hover:bg-gray-100 border border-gray-200 transition-all duration-200">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={optionId}
                                        checked={answers[currentQuestion.id] === optionId}
                                        onChange={() => handleOptionSelect(currentQuestion.id, optionId)}
                                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-gray-700 text-base">{optionTitle}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-10">
                    {currentQuestionIndex > 0 ? (
                        <button
                            onClick={handlePreviousQuestion}
                            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/preliminary')}
                            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Back
                        </button>
                    )}

                    {currentQuestionIndex < totalQuestions - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            disabled={!answers.hasOwnProperty(currentQuestion.id)}
                            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmitRiskAnalysis}
                            disabled={!answers.hasOwnProperty(currentQuestion.id) || loading}
                            className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Submitting...' : 'Get Scored'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RiskQuestions;