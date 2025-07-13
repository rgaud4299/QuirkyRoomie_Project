import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaCrown } from 'react-icons/fa';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (user) {
        setLoading(true);
        try {
          const response = await API.get('/leaderboard');
          setLeaderboard(response.data);
        } catch (err) {
          setError('Failed to fetch leaderboard.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading leaderboard...</p>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-gray-600 text-xl mt-10">Please log in to view the leaderboard.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-200 px-6 py-12">
      <h2 className="text-5xl font-bold text-center text-gray-800 mb-10">🏆 Karma Leaderboard</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-xl mx-auto">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <p className="text-xl text-center text-gray-600">No flatmates on the leaderboard yet. Start resolving complaints!</p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-200 animate-fade-in">
          <ul className="space-y-4">
            {leaderboard.map((flatmate, index) => {
              const isTopThree = index < 3;
              const isCurrentUser = flatmate._id === user._id;

              const bgColor =
                index === 0 ? 'from-yellow-200 to-yellow-100' :
                index === 1 ? 'from-gray-200 to-gray-100' :
                index === 2 ? 'from-orange-200 to-orange-100' :
                'from-white to-gray-50';

              return (
                <li
                  key={flatmate._id}
                  className={`flex justify-between items-center p-5 rounded-2xl transition-all duration-300
                    bg-gradient-to-br ${bgColor}
                    ${isCurrentUser ? 'ring-2 ring-blue-400 shadow-lg' : 'shadow-md'}
                    hover:scale-[1.02]`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-700 flex items-center">
                      #{index + 1}
                      {index === 0 && <FaCrown className="ml-2 text-yellow-500" />}
                    </span>
                    <span className={`text-xl font-semibold ${isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                      {flatmate.name}
                    </span>
                  </div>
                  <span className={`text-xl font-bold ${index === 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                    {flatmate.karmaPoints} Karma
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
