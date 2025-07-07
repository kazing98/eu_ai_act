import { useState } from 'react'
import './App.css'
import './index.css'
import { Shield, FileText, ChevronRight, AlertTriangle, CheckCircle, BarChart, Users, Database, Globe, Scale, BrainCircuit, Baby } from 'lucide-react';




// --- Helper Components ---

const Card = ({ children, className = '' }) => (

  <div className={`bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}>

    {children}

  </div>

);



const Button = ({ onClick, children, className = '', disabled = false }) => (

  <button

    onClick={onClick}

    disabled={disabled}

    className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}

  >

    {children}

  </button>

);



const RadioCard = ({ id, name, value, label, description, icon, checked, onChange }) => (

    <label htmlFor={id} className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${checked ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white hover:border-gray-300'}`}>

      <div className="mr-5 text-blue-600">{icon}</div>

      <div className="flex-grow">

        <p className="font-semibold text-gray-800">{label}</p>

        <p className="text-sm text-gray-500">{description}</p>

      </div>

      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />

        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>

          {checked && <CheckCircle className="w-4 h-4 text-white" />}

      </div>

    </label>

);



const ProgressBar = ({ current, total }) => {

    const percentage = (current / total) * 100;

    return (

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">

            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>

        </div>

    );

};



// --- Main Pages/Steps ---



const HomePage = ({ onStart }) => (

  <div className="text-center p-8 flex flex-col items-center justify-center min-h-[600px]">

    <div className="relative mb-6">

        <Shield className="w-24 h-24 text-blue-600" />

        <BrainCircuit className="w-12 h-12 text-blue-400 absolute -bottom-2 -right-4" />

    </div>

    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">EU AI Risk Checker</h1>

    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">

      Is your AI or software considered "high-risk" under EU AI Act? Answer a few questions to get a preliminary risk assessment and guidance on your compliance journey.

    </p>

    <Button onClick={onStart}>

      Start Assessment <ChevronRight className="w-5 h-5" />

    </Button>

    <p className="text-xs text-gray-400 mt-8 max-w-md">

        Disclaimer: This tool provides an informational assessment and does not constitute legal advice. Always consult with a qualified legal professional for GDPR compliance matters.

    </p>

  </div>

);



const preliminaryQuestions = [

  {

    id: 'q1',

    text: 'What is the primary purpose of your software?',

    options: [

      { value: 'low', label: 'Internal Business Process', description: 'e.g., internal inventory management, project tools.', icon: <FileText size={24}/> },

      { value: 'medium', label: 'Marketing or Advertising', description: 'e.g., ad targeting, customer analytics, CRM.', icon: <BarChart size={24}/> },

      { value: 'high', label: 'Core Service Delivery to Individuals', description: 'e.g., healthcare apps, financial services, e-commerce.', icon: <Users size={24}/> },

    ]

  },

  {

    id: 'q2',

    text: 'What type of personal data do you process?',

    options: [

        { value: 'low', label: 'Only Non-Personal or Fully Anonymized Data', description: 'No data that can identify an individual.', icon: <Database size={24}/> },

        { value: 'medium', label: 'Standard Personal Data', description: 'e.g., name, email, IP address, location data.', icon: <Database size={24}/> },

        { value: 'high', label: 'Special Categories of Personal Data', description: 'e.g., health, biometrics, race, religion, genetics.', icon: <AlertTriangle size={24}/> },

    ]

  },

  {

    id: 'q3',

    text: 'Does your software involve automated decision-making (including profiling) with legal or similarly significant effects on individuals?',

      options: [

        { value: 'low', label: 'No Automated Decision-Making', description: 'All significant decisions are made by humans.', icon: <Users size={24}/> },

        { value: 'medium', label: 'Automated Profiling for Benign Purposes', description: 'e.g., product recommendations, content personalization.', icon: <BrainCircuit size={24}/> },

        { value: 'high', label: 'Automated Decisions with Significant Effects', description: 'e.g., credit scoring, job application filtering, insurance eligibility.', icon: <AlertTriangle size={24}/> },

    ]

  },

  {

    id: 'q4',

    text: 'What is the scale of your data processing?',

    options: [

      { value: 'low', label: 'Small Scale', description: 'Processing data for a small, defined group (e.g., a small company\'s employees).', icon: <Scale size={24}/> },

      { value: 'medium', label: 'Moderate Scale', description: 'Processing data for a sizeable user base (e.g., a regional app).', icon: <Scale size={24}/> },

      { value: 'high', label: 'Large Scale', description: 'Processing data for a large number of individuals across a wide area.', icon: <Globe size={24}/> },

    ]

  },

    {

    id: 'q5',

    text: 'Does your software process data of vulnerable individuals?',

    options: [

      { value: 'low', label: 'No', description: 'Our service is for the general adult population.', icon: <Users size={24}/> },

      { value: 'high', label: 'Yes', description: 'e.g., children, patients, elderly, employees.', icon: <Baby size={24}/> },

    ]

  }

];



const PreliminaryQuestions = ({ onComplete }) => {

  const [answers, setAnswers] = useState({});

  const [currentQ, setCurrentQ] = useState(0);



  const handleAnswer = (questionId, value) => {

    setAnswers(prev => ({ ...prev, [questionId]: value }));

  };

  

  const handleNext = () => {

      if(currentQ < preliminaryQuestions.length - 1) {

          setCurrentQ(currentQ + 1);

      } else {

          onComplete(answers);

      }

  }

  

  const handleBack = () => {

      if(currentQ > 0) {

          setCurrentQ(currentQ - 1);

      }

  }



  const isAnswered = answers[preliminaryQuestions[currentQ].id] !== undefined;



  return (

    <div className="p-8">

        <ProgressBar current={currentQ + 1} total={preliminaryQuestions.length} />

      <h2 className="text-2xl font-bold text-gray-800 mb-2">{`Question ${currentQ + 1}/${preliminaryQuestions.length}`}</h2>

      <p className="text-lg text-gray-600 mb-8">{preliminaryQuestions[currentQ].text}</p>

      <div className="space-y-4 mb-8">

        {preliminaryQuestions[currentQ].options.map(opt => (

          <RadioCard

            key={opt.value}

            id={`${preliminaryQuestions[currentQ].id}-${opt.value}`}

            name={preliminaryQuestions[currentQ].id}

            value={opt.value}

            label={opt.label}

            description={opt.description}

            icon={opt.icon}

            checked={answers[preliminaryQuestions[currentQ].id] === opt.value}

            onChange={(e) => handleAnswer(e.target.name, e.target.value)}

          />

        ))}

      </div>

      <div className="flex justify-between items-center">

        <Button onClick={handleBack} className="bg-gray-200 text-gray-700 hover:bg-gray-300" disabled={currentQ === 0}>

          Back

        </Button>

        <Button onClick={handleNext} disabled={!isAnswered}>

          {currentQ === preliminaryQuestions.length - 1 ? 'See Results' : 'Next'} <ChevronRight className="w-5 h-5"/>

        </Button>

      </div>

    </div>

  );

};



const RiskResultPage = ({ risk, onContinue }) => {

    const isHighRisk = risk === 'High';

    return (

        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[600px]">

            {isHighRisk ? (

                <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" />

            ) : (

                <CheckCircle className="w-24 h-24 text-green-500 mb-6" />

            )}

            <p className="text-lg font-semibold text-gray-600 mb-2">Preliminary Assessment</p>

            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isHighRisk ? 'text-red-600' : 'text-green-600'}`}>

                {isHighRisk ? 'High Risk' : 'Low Risk'}

            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">

                {isHighRisk 

                    ? "Based on your answers, your software likely involves high-risk data processing activities under GDPR. A more detailed analysis is strongly recommended."

                    : "Based on your answers, your software does not appear to involve high-risk data processing activities. However, you must still adhere to all standard GDPR principles."

                }

            </p>

            {isHighRisk ? (

                <Button onClick={onContinue} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">

                    Analyze & Get Recommendations <ChevronRight className="w-5 h-5"/>

                </Button>

            ) : (

                <div className="text-left max-w-xl bg-green-50 border border-green-200 p-6 rounded-lg mt-4">

                    <h3 className="font-bold text-green-800 mb-2">General Recommendations:</h3>

                    <ul className="list-disc list-inside text-green-700 space-y-1">

                        <li>Ensure you have a clear privacy policy.</li>

                        <li>Only collect data that is necessary for your service.</li>

                        <li>Implement strong security measures to protect user data.</li>

                        <li>Regularly review your data processing activities.</li>

                    </ul>

                </div>

            )}

        </div>

    );

};



const highRiskQuestions = [

    { id: 'hrq1', text: 'Have you conducted and documented a Data Protection Impact Assessment (DPIA)?', category: 'governance'},

    { id: 'hrq2', text: 'Is your legal basis for processing special category data explicitly defined and compliant (e.g., explicit consent)?', category: 'legal'},

    { id: 'hrq3', text: 'Are you using state-of-the-art security measures, including encryption and pseudonymization, to protect the data?', category: 'security'},

    { id: 'hrq4', text: 'Do you have a clear data retention policy that minimizes data storage periods?', category: 'data_management'},

    { id: 'hrq5', text: 'If transferring data outside the EU, have you implemented appropriate safeguards (e.g., Standard Contractual Clauses)?', category: 'transfers'},

    { id: 'hrq6', text: 'Do users have clear, accessible controls to exercise their rights (access, rectification, erasure)?', category: 'user_rights'},

];



const HighRiskAnalysisPage = ({ onComplete }) => {

    const [answers, setAnswers] = useState({});

    

    const handleAnswer = (questionId, value) => {

        setAnswers(prev => ({ ...prev, [questionId]: value }));

    };



    const allAnswered = Object.keys(answers).length === highRiskQuestions.length;



    return (

        <div className="p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-2">High-Risk Analysis</h2>

            <p className="text-lg text-gray-600 mb-8">

                Your software has been identified as potentially high-risk. Please answer the following questions to receive targeted recommendations.

            </p>

            <div className="space-y-6">

                {highRiskQuestions.map(q => (

                    <div key={q.id} className="p-5 border bg-white rounded-lg">

                        <p className="font-semibold text-gray-700 mb-3">{q.text}</p>

                        <div className="flex gap-4">

                           <label className="flex items-center gap-2 cursor-pointer">

                               <input type="radio" name={q.id} value="yes" checked={answers[q.id] === 'yes'} onChange={() => handleAnswer(q.id, 'yes')} className="form-radio text-blue-600"/> Yes

                           </label>

                           <label className="flex items-center gap-2 cursor-pointer">

                               <input type="radio" name={q.id} value="no" checked={answers[q.id] === 'no'} onChange={() => handleAnswer(q.id, 'no')} className="form-radio text-red-600"/> No

                           </label>

                           <label className="flex items-center gap-2 cursor-pointer">

                               <input type="radio" name={q.id} value="unsure" checked={answers[q.id] === 'unsure'} onChange={() => handleAnswer(q.id, 'unsure')} className="form-radio text-yellow-600"/> Unsure

                           </label>

                        </div>

                    </div>

                ))}

            </div>

            <div className="mt-8 flex justify-end">

                <Button onClick={() => onComplete(answers)} disabled={!allAnswered}>

                    Generate Recommendations

                </Button>

            </div>

        </div>

    );

};



const RecommendationsPage = ({ answers, onReset }) => {

    const recommendations = {

        governance: {

            title: "Governance & Documentation",

            text: "A DPIA is mandatory for high-risk processing. It helps you identify, assess, and mitigate data protection risks. Without one, you are likely non-compliant.",

            action: "Prioritize conducting and documenting a comprehensive Data Protection Impact Assessment (DPIA) immediately. Consult a DPO or legal expert.",

        },

        legal: {

            title: "Legal Basis",

            text: "Processing sensitive data requires an explicit and lawful basis under GDPR Article 9. 'Legitimate interest' is generally not sufficient.",

            action: "Review and document your legal basis for processing special category data. If relying on consent, ensure it is explicit, freely given, specific, and informed.",

        },

        security: {

            title: "Data Security",

            text: "GDPR requires 'appropriate technical and organisational measures'. For high-risk data, this means robust, state-of-the-art security is non-negotiable.",

            action: "Conduct a security audit. Implement strong encryption for data at rest and in transit, and apply pseudonymization where possible to reduce risks.",

        },

        data_management: {

            title: "Data Minimization & Retention",

            text: "Keeping data longer than necessary increases risk and violates the storage limitation principle of GDPR.",

            action: "Establish and enforce a clear data retention policy. Automate the deletion of data that is no longer required for its original purpose.",

        },

        transfers: {

            title: "International Data Transfers",

            text: "Transferring data outside the EU/EEA requires specific legal safeguards to ensure the data remains protected to GDPR standards.",

            action: "Identify all cross-border data transfers. Ensure valid transfer mechanisms like Standard Contractual Clauses (SCCs) or an Adequacy Decision are in place.",

        },

        user_rights: {

            title: "User Rights Management",

            text: "Individuals have a fundamental right to control their data. Your system must be designed to facilitate these rights easily.",

            action: "Develop and implement user-friendly processes for handling data subject access requests (DSARs), including access, correction, and deletion.",

        }

    };



    const triggeredRecs = highRiskQuestions

        .filter(q => answers[q.id] === 'no' || answers[q.id] === 'unsure')

        .map(q => recommendations[q.category]);



    return (

        <div className="p-8">

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Actionable Recommendations</h2>

            <p className="text-lg text-gray-600 mb-8">

                Based on your answers, here are the key areas you need to address to mitigate GDPR risks.

            </p>

            {triggeredRecs.length > 0 ? (

                <div className="space-y-6">

                    {triggeredRecs.map(rec => (

                        <div key={rec.title} className="bg-white border-l-4 border-red-500 p-6 rounded-r-lg shadow-md">

                            <h3 className="text-xl font-bold text-red-700 mb-2">{rec.title}</h3>

                            <p className="text-gray-600 mb-4">{rec.text}</p>

                            <div className="bg-red-50 p-4 rounded-lg">

                                <p className="font-semibold text-red-800">Suggested Action:</p>

                                <p className="text-red-700">{rec.action}</p>

                            </div>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="text-center p-8 bg-green-50 border border-green-200 rounded-xl">

                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>

                    <h3 className="text-2xl font-bold text-green-800">Great Work!</h3>

                    <p className="text-green-700 mt-2">

                        Based on your answers, you seem to have addressed many key high-risk areas. Continue to monitor your processes and consult with a legal expert to ensure full compliance.

                    </p>

                </div>

            )}

             <div className="mt-12 text-center">

                <Button onClick={onReset} className="bg-gray-600 hover:bg-gray-700">

                    Start New Assessment

                </Button>

            </div>

        </div>

    );

};



// --- Main App Component ---

export default function App() {

  const [step, setStep] = useState('home');

  const [preliminaryAnswers, setPreliminaryAnswers] = useState(null);

  const [highRiskAnswers, setHighRiskAnswers] = useState(null);

  const [riskLevel, setRiskLevel] = useState(null);

  

  const calculateRisk = (answers) => {

    const scoreMap = { low: 0, medium: 1, high: 2 };

    let score = 0;

    for (const key in answers) {

      score += scoreMap[answers[key]];

    }



    // High risk if any 'high' answer, or score is high

    if (Object.values(answers).includes('high') || score > 4) {

      return 'High';

    }

    return 'Low';

  };

  

  const handleStart = () => setStep('preliminary');



  const handlePreliminaryComplete = (answers) => {

    setPreliminaryAnswers(answers);

    const risk = calculateRisk(answers);

    setRiskLevel(risk);

    setStep('result');

  };



  const handleContinueHighRisk = () => {

      setStep('highRiskAnalysis');

  }



  const handleHighRiskComplete = (answers) => {

      setHighRiskAnswers(answers);

      setStep('recommendations');

  }



  const handleReset = () => {

    setStep('home');

    setPreliminaryAnswers(null);

    setHighRiskAnswers(null);

    setRiskLevel(null);

  };



  const renderStep = () => {

    switch (step) {

      case 'home':

        return <HomePage onStart={handleStart} />;

      case 'preliminary':

        return <PreliminaryQuestions onComplete={handlePreliminaryComplete} />;

      case 'result':

        return <RiskResultPage risk={riskLevel} onContinue={handleContinueHighRisk} />;

      case 'highRiskAnalysis':

        return <HighRiskAnalysisPage onComplete={handleHighRiskComplete}/>;

      case 'recommendations':

        return <RecommendationsPage answers={highRiskAnswers} onReset={handleReset}/>;

      default:

        return <HomePage onStart={handleStart} />;

    }

  };



  return (

    <div className="min-h-screen bg-gray-50 font-sans antialiased">

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_200px,#d1eaff,transparent)] -z-10"></div>

        <div className="container mx-auto p-4 sm:p-6 md:p-8">

            <div className="max-w-4xl mx-auto mt-4 sm:mt-8 md:mt-12">

             <Card>

                 {renderStep()}

             </Card>

            </div>

        </div>

    </div>

  );

}
