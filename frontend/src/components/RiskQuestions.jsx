import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Import jsPDF library

// --- Icon components (Assumed to be available) ---
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file text-blue-500">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-2 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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

// New PieChart Component to mimic the Canva style
const PieChart = ({ score, outOf }) => {
    const percentage = (score / outOf) * 100;
    const radius = 40; // Smaller radius for a compact circle
    const circumference = 2 * Math.PI * radius;

    // Calculate the length of the arc for the score
    const scoreEndAngle = (percentage / 100) * 360;

    // Function to get path data for a circular arc
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0; // Adjust for SVG's 0-degree at 3 o'clock
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const describeArc = (x, y, r, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, r, endAngle);
        const end = polarToCartesian(x, y, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y, // Line to center
            "Z" // Close path
        ].join(" ");
    };

    const centerX = 50;
    const centerY = 50;
    const startAngle = 0; // Always start from the top (12 o'clock)

    return (
        <div className="flex-shrink-0 w-32 h-32 transition-transform duration-300 hover:scale-105"> {/* Fixed size container for the SVG */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Full circle background (for the remaining portion) */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill="#E0E0E0" // Light grey for the remaining portion
                />
                {/* Scored portion (green) */}
                {percentage > 0 && (
                    <path
                        d={describeArc(centerX, centerY, radius, startAngle, scoreEndAngle)}
                        fill="#4CAF50" // Green for the compliant part
                    />
                )}
            </svg>
        </div>
    );
};


const iconMap = {
    document: DocumentIcon,
    users: UsersIcon,
    brain: BrainIcon,
    database: DatabaseIcon,
    // Medical-specific icons (reusing existing for now, can be customized)
    'diagnostic_decision_support': BrainIcon,
    'treatment_recommendation': DocumentIcon,
    'icu_triage_prioritization': UsersIcon,
    'monitoring_patient_vital_signs': DatabaseIcon,
    'medication_planning': DocumentIcon,
    // Education-specific icons (reusing existing for now, can be customized)
    'grading_performance_scoring': DocumentIcon,
    'admission_scholarship_decision_making': UsersIcon,
    'emotion_detection_in_assessments': BrainIcon,
    'learning_adaptation_tutoring': UsersIcon,
    'pass_fail_evaluation': DocumentIcon,
    default: DocumentIcon,
};

// Define options for the static question based on domain ID
const staticQuestionOptions = {
    "1": [ // Medical Domain
        { id: "diagnostic_decision_support", title: "Diagnostic decision support", backendKey: "diagnostic_support" },
        { id: "treatment_recommendation", title: "Treatment recommendation", backendKey: "treatment_recommendation" },
        { id: "icu_triage_prioritization", title: "ICU triage or prioritization", backendKey: "triage_or_icu" },
        { id: "monitoring_patient_vital_signs", title: "Monitoring patient vital signs", backendKey: "vital_sign_monitoring" },
        { id: "medication_planning", title: "Medication planning", backendKey: "medication_planning" }
    ],
    "2": [ // Education Domain
        { id: "grading_performance_scoring", title: "Grading or performance scoring", backendKey: "grading" },
        { id: "admission_scholarship_decision_making", title: "Admission or scholarship decision-making", backendKey: "admission" },
        { id: "emotion_detection_in_assessments", title: "Emotion detection in assessments", backendKey: "emotion_detection" },
        { id: "learning_adaptation_tutoring", title: "Learning adaptation or tutoring", backendKey: "adaptive_learning" },
        { id: "pass_fail_evaluation", title: "Pass/fail evaluation", backendKey: "evaluation" }
    ]
};

const baseStaticQuestion = {
    id: 2001,
    question: "Which of the following functions does your AI system perform?",
    isMultiSelect: true,
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

// This new, separate function submits the final answers to get the score.
async function submitFinalAnswersForScoring(payload) {
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
    const [pdfLoading, setPdfLoading] = useState(false); // State for PDF generation loading

    const [showStaticQuestion, setShowStaticQuestion] = useState(true);
    const [staticQuestionAnswers, setStaticQuestionAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [currentStaticQuestion, setCurrentStaticQuestion] = useState({
        ...baseStaticQuestion,
        options: []
    });

    // Helper to get all static options for the current domain for easy lookup
    const [allStaticOptions, setAllStaticOptions] = useState([]);

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

        const domainOptions = staticQuestionOptions[initialResult.user_domain] || []; 
        setCurrentStaticQuestion(prev => ({
            ...prev,
            options: domainOptions
        }));
        // Store all options for current domain to easily map IDs to backendKeys
        setAllStaticOptions(domainOptions);

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
            // Map the frontend option IDs to backend keys
            const selectedBackendKeys = staticQuestionAnswers.map(selectedId => {
                const option = allStaticOptions.find(opt => opt.id === selectedId);
                return option ? option.backendKey : null;
            }).filter(key => key !== null); // Filter out any nulls if an ID wasn't found (shouldn't happen if options are well-defined)

            const payload = {
                is_first_set: false,
                user_domain: assessmentResult.user_domain,
                risk: assessmentResult.risk.toLowerCase(),
                answers: {
                    question_id: currentStaticQuestion.id,
                    selected_option_key: selectedBackendKeys, // Send the backend keys
                },
            };

            console.log("Sending Payload to /question_set:", JSON.stringify(payload, null, 2));

            const data = await submitAnswersAndGetNextSteps(payload);

            if (Array.isArray(data)) {
                setRiskQuestions(data);
                setShowStaticQuestion(false);
                setAnswers({});
                setCurrentQuestionIndex(0);
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
                // Ensure is_first_set is false for the final submission
                is_first_set: false, 
                risk: assessmentResult.risk.toLowerCase(),
                user_domain: assessmentResult.user_domain,
                answers: Object.keys(answers).map(questionId => ({
                    question_id: parseInt(questionId, 10),
                    selected_option_key: answers[questionId],
                })),
            };

            console.log("Sending Final Payload to /submit_evaluate:", JSON.stringify(payload, null, 2));

            // Call the dedicated function for submitting final answers for scoring
            const report = await submitFinalAnswersForScoring(payload); 
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

    // New function to handle PDF download directly on frontend using jsPDF
    const handleDownloadReport = async () => {
        if (!finalReport || !finalReport.scoring) {
            // Using a custom message box instead of alert()
            const messageBox = document.createElement('div');
            messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
            messageBox.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-xl text-center">
                    <p class="text-lg font-semibold mb-4">No report data available to download.</p>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick="this.closest('.fixed').remove()">OK</button>
                </div>
            `;
            document.body.appendChild(messageBox);
            return;
        }

        setPdfLoading(true);
        setError(null);

        try {
            const { scoring } = finalReport;

            // Initialize jsPDF
            const doc = new jsPDF();
            
            // Set initial position and line height
            let yPos = 20; // Starting Y position from the top
            const lineHeight = 10;
            const margin = 15; // Left/right margin
            const pageWidth = doc.internal.pageSize.getWidth();

            // Header: EU Artificial Intelligence Act
            doc.setFontSize(18);
            doc.text("EU Artificial Intelligence Act", margin, yPos);
            yPos += lineHeight * 2;

            // Introduction Text with proper line breaks
            doc.setFontSize(10);
            const introLines = [
                "Thank you for visiting our site and using our application to assess your system's compliance with the EU Artificial Intelligence Act.",
                "You’ve successfully completed the assessment and received a detailed compliance report. This report helps you:",
                "     •  Understand how well your system aligns with the EU AI Act",
                "     •  Confirm that your system can be used legally and responsibly",
                "     •  Identify areas to improve based on your current score",
                "     •  Strengthen future compliance with AI regulations",
                "You're all set to use your application confidently, backed by clear guidance and compliance insights.",
                "We appreciate your trust in our tool — feel free to revisit anytime to re-check and enhance your system!"
            ];
            
            introLines.forEach(line => {
                const splitLine = doc.splitTextToSize(line, pageWidth - (2 * margin));
                doc.text(splitLine, margin, yPos);
                yPos += (splitLine.length * (lineHeight * 0.7)); // Adjust line height for smaller font
            });
            yPos += lineHeight; // Extra spacing after introduction

            // Grey Square Box for Summary
            const boxStartX = margin;
            const boxStartY = yPos;
            const boxWidth = pageWidth - (2 * margin);
            const detailLineHeight = 8; // For each detail line in the summary
            const summaryBoxPadding = 10; // Padding inside the box

            const boxContentLines = 5; // For Complaint, Domain, Risk Level, Score, Compliance Percentage
            const boxHeight = (boxContentLines * detailLineHeight) + (summaryBoxPadding * 2) + 5; // Adjust for title removal

            doc.setFillColor(240, 240, 240); // Light grey color
            doc.rect(boxStartX, boxStartY, boxWidth, boxHeight, 'F'); // 'F' for fill

            // Content inside the grey box
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0); // Black text for content
            let currentBoxY = boxStartY + summaryBoxPadding; // Padding from top of box
            
            doc.text("Below is the summary of the Report :", boxStartX + 10, currentBoxY); // Add the new requested text
            currentBoxY += lineHeight; // Adjust for this new line

           // Complaint
doc.setFont(undefined, 'bold');
doc.text('Complaint:', boxStartX + 10, currentBoxY);
doc.setFont(undefined, 'normal');
doc.text(`${scoring.compliance_level}`, boxStartX + 50, currentBoxY);
currentBoxY += detailLineHeight;

// Domain
doc.setFont(undefined, 'bold');
doc.text('Domain:', boxStartX + 10, currentBoxY);
doc.setFont(undefined, 'normal');
doc.text(`${scoring.domain}`, boxStartX + 50, currentBoxY);
currentBoxY += detailLineHeight;

// Risk Level
doc.setFont(undefined, 'bold');
doc.text('Risk Level:', boxStartX + 10, currentBoxY);
doc.setFont(undefined, 'normal');
doc.text(`${scoring.risk_level.toUpperCase()}`, boxStartX + 50, currentBoxY);
currentBoxY += detailLineHeight;

// Score
doc.setFont(undefined, 'bold');
doc.text('Score:', boxStartX + 10, currentBoxY);
doc.setFont(undefined, 'normal');
doc.text(`${scoring.score} out of ${scoring.out_of}`, boxStartX + 50, currentBoxY);
currentBoxY += detailLineHeight;

// Compliance Percentage
doc.setFont(undefined, 'bold');
doc.text('Compliance Percentage:', boxStartX + 10, currentBoxY);
doc.setFont(undefined, 'normal');
doc.text(`${scoring.compliance_percent}%`, boxStartX + 65, currentBoxY);
currentBoxY += detailLineHeight;


            yPos = boxStartY + boxHeight + lineHeight * 2; // Position below the box

            // Complaint under the EU AI Act section with colored dots
            doc.setFontSize(16);
            doc.text("Complaint under the EU AI Act", margin, yPos);
            yPos += lineHeight;

            const complianceLevels = [
                { range: "85–100%", text: "Fully Compliant", color: [76, 175, 80] },   // Green
                { range: "70–84%", text: "Mostly Compliant", color: [255, 193, 7] },   // Amber/Yellow
                { range: "50–69%", text: "Partially Compliant", color: [255, 152, 0] }, // Orange
                { range: "Below 50%", text: "Non-Compliant", color: [244, 67, 54] }    // Red
            ];

            doc.setFontSize(12);
            complianceLevels.forEach(level => {
                // Draw the colored dot first
                doc.setFillColor(level.color[0], level.color[1], level.color[2]);

                // Position the dot at the margin, and adjust y for better vertical alignment
                const dotX = margin + 2; // Small offset from the margin
                // Adjusted vertical alignment:
                // We were at yPos - 3. To bring it down, we need a smaller subtraction.
                // Let's try yPos - 2, or even yPos - 1.5 for a very slight downward shift.
                const dotY = yPos - 2; // Try -2. If still too high, try -1.5. If too low, try -2.5.
                                      // This value needs fine-tuning for perfect alignment.
                doc.circle(dotX, dotY, 2, 'F'); // Draw the dot

                // Then, draw the text next to the dot
                doc.setFont('helvetica', 'normal');
                const textStartX = dotX + 7; // Start text slightly after the dot
                doc.text(`${level.range} - ${level.text}`, textStartX, yPos);

                yPos += lineHeight;
            });
            yPos += lineHeight; // Extra spacing after the list

            // Removed "Key Actions Recommended" section entirely as per request

            // Save the PDF
            doc.save(`AI_Assessment_Report_${scoring.compliance_level || 'General'}.pdf`);

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError(err.message || 'Failed to generate PDF report.');
        } finally {
            setPdfLoading(false);
        }
    };


    // --- Render Logic ---

    if (showStaticQuestion && assessmentResult) {
        const q = currentStaticQuestion;
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
        // Extract scoring data safely
        const { scoring } = finalReport;

        return (
            <div className="bg-gray-50 font-inter flex items-center justify-center min-h-screen p-4">
                <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Results</h2>
                    <p className="text-gray-700 mb-6">Here's a summary of your AI system's compliance:</p>

                    {scoring ? (
                        <>
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6 transform transition-all duration-300 hover:scale-105">
                                <h3 className="text-4xl font-extrabold mb-4 animate-fadeIn" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {scoring.compliance_level}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-md">
                                        <p className="text-sm font-light">Domain</p>
                                        <p className="text-lg font-semibold">{scoring.domain}</p>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-3 rounded-md">
                                        <p className="text-sm font-light">Risk Level</p>
                                        <p className="text-lg font-semibold capitalize">{scoring.risk_level}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-blue-900 mb-4"> Score</div>
                            {/* Pie Chart and Score/Percentage Display */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                            
                                <PieChart score={scoring.score} outOf={scoring.out_of} />
                                <div className="flex flex-col items-center md:items-start">
                                    <p className="text-5xl font-extrabold text-gray-800">
                                        {scoring.score} / {scoring.out_of}
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-700 mt-2">
                                        <span className="text-blue-900">{scoring.compliance_percent}%</span> Compliant
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline ml-2">Could not retrieve scoring data.</span>
                        </div>
                    )}

                  

                    <div className="flex justify-center gap-4 mt-8">
                        {/* New Download Report Button */}
                        <button 
                            onClick={handleDownloadReport} 
                            disabled={pdfLoading}
                            className="px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pdfLoading ? 'Generating PDF...' : 'Download Report'}
                        </button>
                        <button onClick={handleStartNewAssessment} className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
                            Start New Assessment
                        </button>
                    </div>
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