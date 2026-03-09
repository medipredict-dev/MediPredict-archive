import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CompleteProfile from './components/CompleteProfile';
import Dashboard from './pages/Dashboard';
import MainPage from './pages/MainPage';
import CoachDashboard from './pages/CoachDashboard';
import MedicalDashboard from './pages/MedicalDashboard';
import PredictionsPage from './pages/PredictionsPage';
import AboutTeam from './pages/AboutTeam';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ReportsPage from './pages/ReportsPage';
import RecoveryProgressReport from './components/reports/RecoveryProgressReport';
import TeamAvailabilityReport from './components/reports/TeamAvailabilityReport';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
          <Route path="/medical-dashboard" element={<MedicalDashboard />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/about-team" element={<AboutTeam />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* Protected Report Routes */}
          <Route path="/report/recovery-progress" element={<RecoveryProgressReport />} />
          <Route path="/report/team-availability" element={<TeamAvailabilityReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
