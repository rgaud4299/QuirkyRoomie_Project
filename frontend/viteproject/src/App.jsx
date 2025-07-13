import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import LeaderboardPage from './pages/LeaderboardPage'; // New page
import StatsPage from './pages/StatsPage'; // New page
import PrivateRoute from './components/PrivateRoute'; // For protected routes
import Navbar from './components/Navbar'; // Navigation bar

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Navbar /> {/* Navbar will be visible on all pages */}
      <main className="container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (only accessible when authenticated) */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/complaints" element={<PrivateRoute><ComplaintsPage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} /> {/* New Protected Route */}
          <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} /> {/* New Protected Route */}
          {/* Add more protected routes here as you build out features */}
        </Routes>
      </main>
    </div>
  );
}

export default App;

