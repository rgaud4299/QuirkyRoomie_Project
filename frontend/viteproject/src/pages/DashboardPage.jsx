import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, CheckCircle, Flame, Sparkles, ShieldCheck } from 'lucide-react';

const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAllComplaints();
  }, [user]);

  const fetchAllComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get('/complaints/all-flat');
      setComplaints(res.data);
    } catch (err) {
      setError('Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, voteType) => {
    try {
      await API.post(`/complaints/${id}/vote`, { voteType });
      fetchAllComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await API.put(`/complaints/${id}/resolve`);
      const updatedKarma = res.data?.userKarma;
      if (updatedKarma) {
        setUser((prev) => ({ ...prev, karmaPoints: updatedKarma }));
      }
      fetchAllComplaints();
    } catch (err) {
      console.error('Resolve failed:', err);
    }
  };

  if (!user) return <div className="text-center mt-10 text-xl">Please log in to view dashboard.</div>;

  const problemOfWeek = [...complaints]
    .filter(c => !c.resolved)
    .sort((a, b) => b.upvotes - a.upvotes)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {user.name} 👋</h1>
        <p className="text-lg mt-2 text-gray-700">
          Flat Code: <span className="text-indigo-700 font-semibold">{user.flatCode}</span> | Karma Points:{' '}
          <span className="text-green-600 font-bold flex inline-flex items-center gap-1">
            <Sparkles size={18} className="text-yellow-500" /> {user.karmaPoints}
          </span>
        </p>
      </div>

      {problemOfWeek && (
        <div className="max-w-5xl mx-auto mb-10 bg-yellow-100 border border-yellow-300 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-yellow-800 flex items-center gap-2">
            <ShieldCheck className="text-yellow-700" /> Problem of the Week
          </h2>
          <h3 className="text-xl font-semibold text-gray-800">{problemOfWeek.title}</h3>
          <p className="text-gray-700">{problemOfWeek.description}</p>
          <p className="text-sm text-gray-600 mt-1">Upvotes: {problemOfWeek.upvotes} | Filed by: {problemOfWeek.filedBy?.name}</p>
        </div>
      )}

      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((comp) => {
            const isMine = comp.filedBy?._id === user._id;
            const hasUpvoted = comp.upvotedBy.includes(user._id);
            const hasDownvoted = comp.downvotedBy.includes(user._id);

            return (
              <div
                key={comp._id}
                className={`p-6 rounded-xl shadow-xl border ${
                  comp.resolved ? 'bg-green-100 border-green-300' : 'bg-white/60 border-gray-200 backdrop-blur'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-red-500" size={20} />
                  <h2 className="text-xl font-bold text-gray-800">{comp.title}</h2>
                </div>
                <p className="text-gray-700 mb-2">{comp.description}</p>
                <p className="text-sm text-gray-500">Filed by: <span className="font-medium text-gray-700">{comp.filedBy?.name || 'Unknown'}</span></p>
                <p className="text-sm text-gray-500 mb-2">Severity: <span className="font-semibold">{comp.severityLevel}</span></p>

                {comp.suggestedPunishment && (
                  <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded">
                    <p className="text-sm font-semibold text-orange-900">Punishment:</p>
                    <p className="text-sm text-orange-800 italic">{comp.suggestedPunishment}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      disabled={isMine || hasUpvoted}
                      onClick={() => handleVote(comp._id, 'upvote')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition ${
                        hasUpvoted ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      } ${isMine && 'opacity-50 cursor-not-allowed'}`}
                    >
                      <ThumbsUp size={16} /> {comp.upvotes}
                    </button>
                    <button
                      disabled={isMine || hasDownvoted}
                      onClick={() => handleVote(comp._id, 'downvote')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition ${
                        hasDownvoted ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } ${isMine && 'opacity-50 cursor-not-allowed'}`}
                    >
                      <ThumbsDown size={16} /> {comp.downvotes}
                    </button>
                  </div>

                  {comp.resolved ? (
                    <span className="flex items-center gap-1 text-green-700 font-semibold text-sm">
                      <CheckCircle size={16} /> Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolve(comp._id)}
                      className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full font-medium"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
