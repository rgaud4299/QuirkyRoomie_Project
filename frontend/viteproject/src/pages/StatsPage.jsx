import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  BarChart2, PieChart, Users, Flame, AlertTriangle
} from 'lucide-react';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        setLoading(true);
        try {
          const response = await API.get('/leaderboard/stats');
          setStats(response.data);
        } catch (err) {
          setError('Failed to fetch statistics.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading statistics...</p>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-gray-600 text-xl mt-10">Please log in to view statistics.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-12">
      <h2 className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-12 drop-shadow-md">
        📊 Flat Insights & Stats
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-xl mx-auto">
          <strong className="font-bold">Error:</strong> <span>{error}</span>
        </div>
      )}

      {stats && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-md border border-blue-200 p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-blue-700">
              <BarChart2 size={28} />
              <h3 className="text-2xl font-bold">Total Complaints Filed</h3>
            </div>
            <p className="text-center text-6xl font-extrabold text-blue-600">{stats.totalComplaints}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-purple-200 p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-purple-700">
              <PieChart size={28} />
              <h3 className="text-2xl font-bold">Top Complaint Categories</h3>
            </div>
            {stats.topCategories.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">No active complaints to categorize yet!</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {stats.topCategories.map((category) => (
                  <li key={category._id} className="flex justify-between items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-lg font-medium shadow-sm">
                    <span>{category._id}</span>
                    <span>{category.count} complaints</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-red-200 p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-red-700">
              <Users size={28} />
              <h3 className="text-2xl font-bold">Most Complained Flatmates</h3>
            </div>
            {stats.usersWithMostComplaintsAgainstThem.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">No complaints with downvotes yet!</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {stats.usersWithMostComplaintsAgainstThem.map((userStats, index) => (
                  <li key={index} className="flex justify-between items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg text-lg font-medium shadow-sm">
                    <span>{userStats.name}</span>
                    <span>{userStats.totalDownvotes} downvotes</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-green-200 p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-green-700">
              <Flame size={28} />
              <h3 className="text-2xl font-bold">Flatmate Problem of the Week</h3>
            </div>
            {stats.flatmateProblemOfTheWeek ? (
              <div className="text-left space-y-2 text-gray-800">
                <p className="text-xl font-semibold">{stats.flatmateProblemOfTheWeek.title}</p>
                <p className="text-md">
                  Filed by: <span className="font-medium">{stats.flatmateProblemOfTheWeek.filedBy?.name || 'Unknown'}</span>
                </p>
                <p className="text-md">
                  Upvotes: <span className="font-semibold text-green-700">{stats.flatmateProblemOfTheWeek.upvotes}</span>
                </p>
                {stats.flatmateProblemOfTheWeek.suggestedPunishment && (
                  <div className="mt-4 p-4 bg-orange-100 border border-orange-300 rounded-lg shadow-inner">
                    <p className="font-semibold text-orange-800 flex items-center gap-1"><AlertTriangle size={16} /> Suggested Punishment:</p>
                    <p className="text-orange-700 italic">{stats.flatmateProblemOfTheWeek.suggestedPunishment}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-lg text-gray-700">No major flatmate issues trending this week. 🎉</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
