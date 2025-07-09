import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import testImage from '../assets/test1.png';

function HomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/preliminary");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-8xl text-center p-8 flex flex-col items-center justify-center min-h-[600px]">
      <div className="relative mb-6">
        <img src={testImage} alt="Test" style={{ width: '100px' }} />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">EU AI Risk Checker</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Is your AI or software considered "high-risk" under EU AI Act? Answer a few questions to get a preliminary risk assessment and guidance on your compliance journey.
      </p>
      <button onClick={handleClick} className="bg-blue-800 rounded-full w-60 h-14 mt-0 mx-3">
        <span className="flex items-center justify-center top-2 text-white">
          Start Assessment <ChevronRight className="w-5 h-5 mt-0 ml-2" />
        </span>
      </button>
      <p className="text-xs text-gray-400 mt-8 max-w-md">
        Disclaimer: This tool provides an informational assessment and does not constitute legal advice.
      </p>
    </div>
  );
}

export default HomePage;
