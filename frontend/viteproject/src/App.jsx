import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import LeaderboardPage from './pages/LeaderboardPage'; 
import StatsPage from './pages/StatsPage'; 
import PrivateRoute from './components/PrivateRoute'; 
import Navbar from './components/Navbar'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Navbar /> 
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/complaints" element={<PrivateRoute><ComplaintsPage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} /> 
          <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} /> 
        </Routes>
      </main>
    </div>
  );
}

export default App;

