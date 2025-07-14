import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import PreliminaryQuestions from './components/PreliminaryQuestions';
import RiskQuestions from './components/RiskQuestions';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_200px,#d1eaff,transparent)] -z-10"></div>
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/preliminary" element={<PreliminaryQuestions />} />
            <Route path="/risk-questions" element={<RiskQuestions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
