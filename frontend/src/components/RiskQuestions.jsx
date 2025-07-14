import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate

// Icon components (ideally, these would be in a shared utility file)
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file text-blue-500">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 0 0 0 2 2h4"/>
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
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain text-blue-500">
        <path d="M9.5 22c-1.5.7-3.3 1-5 1-4 0-7-2-7-6 0-3.8 2.5-6.5 5-8 1.5-1 3-2 3-4 0-2-2-3-3-3.5"/>
        <path d="M14.5 22c1.5.7 3.3 1 5 1 4 0-7-2-7-6 0-3.8-2.5-6.5-5-8-1.5-1-3-2-3-4 0-2 2-3 3-3.5"/>
        <path d="M8 2h8"/>
        <path d="M12 11c1 1 2 1 3 0 1-1 1-2 0-3-1-1-2-1-3 0-1 1-1 2 0 3z"/>
    </svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database text-blue-500">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
        <path d="M3 12A9 3 0 0 0 21 12"/>
    </svg>
);

const iconMap = {
  healthcare: <DocumentIcon />,
  education: <DocumentIcon />,
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
  default: <DocumentIcon />
};


function RiskQuestions() { // This component is now named RiskQuestions
  const location = useLocation(); // Hook to access the current URL's state
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Extract assessmentResult from the location state
  // It's crucial that PreliminaryQuestions sends this via navigate('/risk-questions', { state: { assessmentResult: ... } })
  const assessmentResult = location.state?.assessmentResult;

  const [riskQuestions, setRiskQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); // Stores answers for THIS set of questions
  const [showFinalRecommendations, setShowFinalRecommendations] = useState(false);

  useEffect(() => {
    const fetchRiskSpecificQuestions = async () => {
      // 1. Check if assessmentResult is available
      if (!assessmentResult || !assessmentResult.risk) {
        console.error('Risk level not found in navigation state. Redirecting to preliminary questions.');
        setError('Assessment result missing. Please start from the preliminary questions.');
        setLoading(false);
        // Redirect back if no assessment data is found, preventing direct access
        navigate('/preliminary', { replace: true });
        return;
      }

      const riskLevel = assessmentResult.risk.toLowerCase(); // 'high' or 'low'

      try {
        // 2. Make the POST API call to fetch questions
        const response = await fetch('http://localhost:8000/questions/question_set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ risk: riskLevel }), // Send the determined risk level
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        // Transform the data to match the expected format (if necessary, like adding empty descriptions)
        const transformedData = data.map(q => {
          const optionsArray = Object.keys(q.options).map(key => ({
            id: key,
            title: q.options[key],
            description: '', // Your backend doesn't provide descriptions for options
            icon: q.options[key].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '')
          }));
          return {
            ...q,
            options: optionsArray,
          };
        });
        setRiskQuestions(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching risk-specific questions:', err);
        setError('Failed to load risk-specific questions. Please ensure the backend is running and the API endpoint is correct.');
        setLoading(false);
      }
    };

    fetchRiskSpecificQuestions();
  }, [assessmentResult, navigate]); // Depend on assessmentResult and navigate to re-fetch if they change

  // Handler for selecting an option for a question
  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  // Handler for the "Get Recommendations" button
  const handleSubmitRiskAnalysis = () => {
    // Basic validation: Check if all questions have an answer
    const allAnswered = riskQuestions.every(q => answers.hasOwnProperty(q.id));
    if (!allAnswered) {
      setError("Please answer all questions before getting recommendations.");
      return;
    }

    console.log('Final Risk-specific Answers:', answers);
    // Here, you would typically send these `answers` to a *final* backend endpoint
    // to get the actual recommendations.
    // For now, we'll just switch to the recommendations display.
    setShowFinalRecommendations(true);
    setError(null); // Clear any previous errors
  };

  // Function to navigate back to the Preliminary Questions page
  const handleBackToPreliminary = () => {
    navigate('/preliminary'); // Go back to the /preliminary route
  };

  // Function to start a completely new assessment (e.g., go back to HomePage or preliminary)
  const handleStartNewAssessment = () => {
    // This will replace the current history entry, so the back button won't go back here
    navigate('/preliminary', { replace: true });
  };

  // --- Render Logic ---
  if (loading) return <div className="text-center p-10 font-inter text-gray-700">Loading specific risk questions...</div>;
  if (error) return <div className="text-center p-10 font-inter text-red-500">{error}</div>;
  if (!riskQuestions || riskQuestions.length === 0) return <div className="text-center p-10 font-inter text-gray-700">No specific risk questions found for this assessment.</div>;

  // Determine the title and intro text based on the risk level
  const currentRiskLevelText = assessmentResult?.risk ? `${assessmentResult.risk}-Risk Analysis` : "Risk Analysis";
  const introText = assessmentResult?.risk === "HIGH"
    ? "Based on your preliminary assessment, your software has been identified as potentially high-risk. Please answer the following questions to receive targeted recommendations."
    : "Based on your preliminary assessment, your software has been identified as low-risk. Please answer the following questions to receive targeted recommendations.";

  return (
    <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-4xl">
        {showFinalRecommendations ? (
          // Display the final recommendations section
          <div className="text-center p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Recommendations</h2>
            <p className="text-gray-700 mb-6">Here are your personalized recommendations based on your detailed risk assessment:</p>
            <div className="bg-blue-100 p-4 rounded-lg text-left mb-6">
                <h3 className="font-semibold text-blue-800 text-lg mb-2">Key Actions Recommended:</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                    {/* These are example recommendations. In a real app, they'd be dynamic based on answers */}
                    <li>**Conduct a thorough DPIA:** Ensure all high-risk processing activities have a documented Data Protection Impact Assessment.</li>
                    <li>**Strengthen Consent Mechanisms:** Verify explicit consent for special category data and ensure easy withdrawal.</li>
                    <li>**Implement Enhanced Security:** Review and upgrade encryption standards for data at rest and in transit.</li>
                    <li>**Refine Data Retention Policies:** Regularly audit and minimize data retention periods, deleting data no longer necessary.</li>
                    <li>**Validate International Transfer Safeguards:** Confirm that all cross-border data transfers comply with GDPR (e.g., SCCs, adequacy decisions).</li>
                    {/* Add more specific recommendations based on user answers in the future */}
                </ul>
            </div>
            <button
              onClick={handleStartNewAssessment}
              className="px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Assessment
            </button>
          </div>
        ) : (
          // Display the risk-specific questions
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {currentRiskLevelText}
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl">
              {introText}
            </p>

            <div className="space-y-6"> {/* Increased spacing between questions */}
              {riskQuestions.map((q) => (
                <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    {q.question || 'Question text not found'}
                  </h2>
                  <div className="flex flex-col space-y-3"> {/* Vertical alignment for options */}
                    {(q.options || []).map((option) => (
                      <label key={option.id} className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${q.id}`} // Group radio buttons by question ID
                          value={option.id}
                          checked={answers[q.id] === option.id}
                          onChange={() => handleOptionSelect(q.id, option.id)}
                          className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 text-base">{option.title || 'Option title missing'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleBackToPreliminary}
                className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Preliminary Assessment
              </button>
              <button
                onClick={handleSubmitRiskAnalysis}
                // Button is disabled if not all questions have been answered
                disabled={riskQuestions.some(q => !answers.hasOwnProperty(q.id))}
                className="px-6 py-3 text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Get Recommendations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RiskQuestions;