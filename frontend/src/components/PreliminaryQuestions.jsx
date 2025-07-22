import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- API Service Functions ---
// By moving API calls here, the component becomes cleaner and focused on rendering.

/**
 * Fetches the initial set of questions from the backend.
 * @returns {Promise<object>} The raw data from the API.
 */
async function fetchQuestionSet() {
  const response = await fetch('http://localhost:8000/questions/question_set');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Submits user answers for evaluation.
 * @param {object} answers - The answers object from the component's state.
 * @returns {Promise<object>} The assessment result from the API.
 */
async function submitAndEvaluateAnswers(answers) {
  const payload = {
    is_first_set: true,
    answers: Object.keys(answers).map(questionId => ({
      question_id: parseInt(questionId, 10),
      selected_option_key: answers[questionId],
    })),
  };

  console.log('Payload being sent to backend:', JSON.stringify(payload, null, 2));

  const response = await fetch('http://localhost:8000/questions/submit_evaluate', {
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
      throw new Error(`Server error submitting answers: ${response.status}. Raw response: ${textError.substring(0, 200)}...`);
    }
    throw new Error(`Failed to submit answers: ${errorData.message || response.statusText}`);
  }
  return response.json();
}


// --- Icon Components (unchanged but grouped) ---
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain text-blue-500"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z"/><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h-3A2.5 2.5 0 0 1 9 4.5v0A2.5 2.5 0 0 1 11.5 2h3Z"/><path d="M12 17.5a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-2.5 2.5Z"/><path d="M6.5 22A2.5 2.5 0 0 1 4 19.5v-3a2.5 2.5 0 0 1 5 0v3A2.5 2.5 0 0 1 6.5 22Z"/><path d="M17.5 22a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-2.5 2.5Z"/><path d="M6.5 12A2.5 2.5 0 0 1 4 9.5v-3a2.5 2.5 0 0 1 5 0v3A2.5 2.5 0 0 1 6.5 12Z"/><path d="M17.5 12a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-2.5 2.5Z"/></svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database text-blue-500"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
);
const iconMap = { /* ... your icon map ... */ };

// --- Helper Function ---
/**
 * Transforms the raw question data from the API into a format usable by the UI.
 * @param {object} apiData - The raw data object from the API, containing a 'questions' array.
 * @returns {Array} The transformed array of question objects.
 */
function transformQuestionsData(apiData) {
  if (!apiData.questions || !Array.isArray(apiData.questions)) {
    throw new Error('Invalid API response format: "questions" array not found.');
  }
  return apiData.questions.map(q => ({
    ...q,
    options: Object.keys(q.options).map(key => ({
      id: key,
      title: q.options[key],
      description: '', // Assuming no description from this endpoint
      icon: q.options[key].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '')
    })),
  }));
}

// --- Main Component ---
function PreliminaryQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const data = await fetchQuestionSet();
        const transformedData = transformQuestionsData(data);
        setQuestions(transformedData);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please check the API and response format.');
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question: submit answers
      try {
        const result = await submitAndEvaluateAnswers(answers);
        console.log('Answers submitted successfully:', result);
        
        // **CHANGE**: Store result in sessionStorage for robustness on refresh
        sessionStorage.setItem('preliminaryAssessmentResult', JSON.stringify(result));

        setAssessmentResult(result);
      } catch (err) {
        console.error('Error during final submission:', err);
        setError(err.message || 'An unexpected error occurred during submission.');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNavigateToRecommendations = () => {
    navigate('/risk-questions', { state: { assessmentResult } });
  };

  // --- Render Logic ---
  if (loading) return <div className="text-center p-10 font-inter">Loading questions...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-inter">{error}</div>;

  // **CHANGE**: Render based on assessmentResult instead of a separate boolean flag
  if (assessmentResult) {
    return (
        <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl text-center">
                 <div className="flex flex-col items-center justify-center">
                    <div className={`mb-4 ${assessmentResult.risk === "HIGH" ? "text-red-500" : "text-green-500"}`}>
                        {/* Icon can be dynamic based on risk */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-500 mb-2">Preliminary Assessment</p>
                    <h2 className={`text-4xl font-bold mb-4 ${assessmentResult.risk === "HIGH" ? "text-red-600" : "text-green-600"}`}>
                    {assessmentResult.risk === "HIGH" ? "High Risk" : "Low Risk"}
                    </h2>
                    <p className="text-gray-700 mb-6 max-w-md">
                    {assessmentResult.risk === "HIGH"
                        ? "Based on your answers, your software likely involves high-risk activities. A more detailed analysis is required."
                        : "Based on your answers, your software appears to involve low-risk activities. Proceed to the next step for recommendations."
                    }
                    </p>
                    <button
                        onClick={handleNavigateToRecommendations}
                        className={`px-6 py-3 text-lg font-semibold text-white rounded-lg transition-colors flex items-center ${assessmentResult.risk === "HIGH" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                    Analyze Further
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
  }

  if (!questions || questions.length === 0) return <div className="text-center p-10 font-inter">No questions found.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isNextDisabled = !answers[currentQuestion?.id];

  return (
    <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-4xl">
        <div className="mb-8">
            <p className="text-sm font-medium text-gray-500 mb-2">
                Question {currentQuestionIndex + 1}/{questions.length}
            </p>
            <div className="bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            {currentQuestion.question}
        </h1>
        <div className="space-y-3">
            {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                    <div
                        key={option.id}
                        onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                        className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                        <div className="mr-4 flex-shrink-0">{iconMap[option.icon] || iconMap.default}</div>
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">{option.title}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-4 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                    </div>
                );
            })}
        </div>
        <div className="flex justify-between items-center mt-8">
            <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
                Back
            </button>
            <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
        </div>
      </div>
    </div>
  );
}

export default PreliminaryQuestions;