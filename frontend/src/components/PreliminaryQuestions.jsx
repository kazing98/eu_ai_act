import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

// Icon components - using Lucide React for better icon variety and consistency
// Assuming lucide-react is available in the environment.
// For a standalone HTML file, these would be SVG definitions directly.
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file text-blue-500">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
  </svg>
);
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 text-blue-500">
    <path d="M18 20V10"/>
    <path d="M12 20V4"/>
    <path d="M6 20v-6"/>
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-blue-500">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87a4 4 0 0 0-7-1.03"/>
    <path d="M15 7a4 4 0 0 0 0-8"/>
  </svg>
);
const BrainIcon = () => ( // New icon for AI
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain text-blue-500">
    <path d="M9.5 22c-1.5.7-3.3 1-5 1-4 0-7-2-7-6 0-3.8 2.5-6.5 5-8 1.5-1 3-2 3-4 0-2-2-3-3-3.5"/>
    <path d="M14.5 22c1.5.7 3.3 1 5 1 4 0 7-2 7-6 0-3.8-2.5-6.5-5-8-1.5-1-3-2-3-4 0-2 2-3 3-3.5"/>
    <path d="M8 2h8"/>
    <path d="M12 11c1 1 2 1 3 0 1-1 1-2 0-3-1-1-2-1-3 0-1 1-1 2 0 3z"/>
  </svg>
);
const DatabaseIcon = () => ( // New icon for Data
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database text-blue-500">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
    <path d="M3 12A9 3 0 0 0 21 12"/>
  </svg>
);


const iconMap = {
  healthcare: <DocumentIcon />, // Example mapping for 'Healthcare'
  education: <DocumentIcon />,  // Example mapping for 'Education'
  "general public": <UsersIcon />,
  "internal company employees": <UsersIcon />,
  minors: <UsersIcon />,
  "professionals in regulated fields (e.g., doctors, lawyers)law enforcement or public authorities": <UsersIcon />,
  "yes, core functionality is ai-based": <BrainIcon />,
  "yes, ai is used, but not essential": <BrainIcon />,
  "no, but we are planning to add ai": <BrainIcon />,
  "no ai involved at all": <BrainIcon />,
  "natural language processing (e.g., chatbots, sentiment analysis)": <BrainIcon />,
  "computer vision (e.g., facial recognition, object detection)": <BrainIcon />,
  "predictive analytics (e.g., forecasts, scoring models)": <BrainIcon />,
  "recommendation systems (e.g., personalized suggestions)robotics or automation": <BrainIcon />,
  "personal data (e.g., names, emails)": <DatabaseIcon />,
  "sensitive data (e.g., health records, biometrics)": <DatabaseIcon />,
  "behavioral data (e.g., usage patterns)": <DatabaseIcon />,
  "public or non-personal data": <DatabaseIcon />,
  "yes, we provide clear explanations": <DocumentIcon />,
  "yes, but only to internal users": <DocumentIcon />,
  "no, decisions are not currently explained": <DocumentIcon />,
  "not sure": <DocumentIcon />,
  default: <DocumentIcon /> // Fallback icon
};


function PreliminaryQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assessmentResult, setAssessmentResult, error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false); // State for completion message

// fetch method 

useEffect(() => {
  fetch('http://localhost:8000/questions/question_set')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const transformedData = data.map(q => {
        // If options is an object, convert it to an array
        const optionsArray = Object.keys(q.options).map(key => ({
          id: key, // Use the numeric key ("1", "2", "3") as the option's ID
          title: q.options[key], // The value is the option text
          description: '', // Your API doesn't provide descriptions, so keep it empty
          icon: q.options[key].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '')
        }));
        return {
          ...q,
          options: optionsArray,
        };
      });
      setQuestions(transformedData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions.');
      setLoading(false);
    });
}, []);
  const sendAnswersToBackend = async (finalAnswers) => {
    // The backend expects a list of objects, where each object has:
    // {
    //   "question_id": <original_question_id_from_api>,
    //   "selected_option_key": <selected_option_key_from_api_response_e.g._"1","2">
    // }
    const answersToSend = Object.keys(finalAnswers).map(questionId => {
      // finalAnswers[questionId] will directly give you "1", "2", "3", etc.
      const selectedOptionKey = finalAnswers[questionId];

      return {
        question_id: parseInt(questionId, 10), // Assuming your question IDs are integers
        selected_option_key: selectedOptionKey, // This will be "1", "2", "3", etc.
      };
    });

    try {
      const response = await fetch('http://localhost:8000/questions/submit_evaluate', { // <-- Confirm this URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', // If your API requires authentication
        },
        body: JSON.stringify(answersToSend), // Send the formatted answers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Answers submitted successfully:', responseData);
      setAssessmentResult(responseData);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Failed to submit answers. Please try again.');
    }
  };
  const handleOptionSelect = (questionId, optionId) => {
    if (questionId === undefined) {
        console.error("The question ID is undefined. Make sure your question object has an 'id' property.");
        return;
    }
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('Final Answers:', answers);
      sendAnswersToBackend(answers);
      setShowCompletionMessage(true); // Show completion message instead of alert
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // --- Render Logic ---
  if (loading) return <div className="text-center p-10 font-inter">Loading questions...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-inter">{error}</div>;
  if (!questions || questions.length === 0) return <div className="text-center p-10 font-inter">No questions found.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // The Next button is enabled only if an answer for the current question's ID exists.
  const isNextDisabled = !answers[currentQuestion?.id];

  return (
    <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-4xl">

{showCompletionMessage ? (
  <div className="text-center p-10">
    {assessmentResult && assessmentResult.risk ? ( // Check if assessmentResult and risk exist
      <div className="flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          {/* Assuming you have an icon for a warning, like a Lucide `AlertTriangle` */}
          {/* For simplicity, I'm using an SVG similar to your screenshot. */}
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-500 mb-2">Preliminary Assessment</p>
        <h2 className="text-4xl font-bold text-red-600 mb-4">
          {assessmentResult.risk === "HIGH" ? "High Risk" : "Low Risk"}
        </h2>
        <p className="text-gray-700 mb-6 max-w-md">
          {assessmentResult.risk === "HIGH"
            ? "Based on your answers, your software likely involves high-risk data processing activities under GDPR. A more detailed analysis is strongly recommended."
            : "Based on your answers, your software appears to involve low-risk data processing activities under GDPR. You may proceed with confidence." // Or whatever low risk message you want
          }
        </p>
        <button
          onClick={() => {
            navigate('/risk-questions', { state: { assessmentResult: assessmentResult } });
          
            console.log("Analyze & Get Recommendations clicked!");
  
          }}
          className="px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          Analyze & Get Recommendations
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
    ) : (
      // Fallback if assessmentResult is not available or doesn't have risk (e.g., initial state or error)
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Questionnaire Completed!</h2>
        <p className="text-gray-700 mb-6">Thank you for your responses.</p>
        <button
          onClick={() => {
            setShowCompletionMessage(false);
            setCurrentQuestionIndex(0);
            setAnswers({});
            setAssessmentResult(null); // Reset result on start over
          }}
          className="px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    )}
  </div>
) : (
          <>
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </p>
              <div className="bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question || 'Question text not found'}
            </h1>

            <div className="space-y-3">
              {(currentQuestion.options || []).map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                // Normalize option.title for icon mapping
                const iconKey = option.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');

                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                    className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="mr-3 sm:mr-4 flex-shrink-0">{iconMap[iconKey] || iconMap.default}</div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{option.title || 'Option title missing'}</p>
                      {option.description && <p className="text-xs sm:text-sm text-gray-500">{option.description}</p>}
                    </div>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ml-3 sm:ml-4 ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PreliminaryQuestions;
