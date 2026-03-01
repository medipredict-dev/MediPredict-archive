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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
