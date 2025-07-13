import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, ShieldCheck, AlertCircle } from 'lucide-react';

const ComplaintCard = ({ complaint, onResolve, onVote, currentUserId }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800';
      case 'Annoying': return 'bg-yellow-100 text-yellow-800';
      case 'Major': return 'bg-orange-100 text-orange-800';
      case 'Nuclear': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasUpvoted = complaint.upvotedBy.includes(currentUserId);
  const hasDownvoted = complaint.downvotedBy.includes(currentUserId);
  const isFiledByCurrentUser = complaint.filedBy._id === currentUserId;

  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-300 hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-bold text-gray-800">{complaint.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(complaint.severityLevel)}`}>
          {complaint.severityLevel}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{complaint.description}</p>

      {complaint.suggestedPunishment && (
        <div className="mt-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="font-semibold text-red-700">Suggested Punishment:</p>
          <p className="text-red-600 italic">{complaint.suggestedPunishment}</p>
        </div>
      )}

      <div className="text-sm text-gray-500 mb-4 space-y-1">
        <p><span className="font-medium text-gray-700">Type:</span> {complaint.complaintType}</p>
        <p><span className="font-medium text-gray-700">Filed by:</span> {complaint.filedBy?.name || 'Unknown'}</p>
        <p><span className="font-medium text-gray-700">Filed on:</span> {new Date(complaint.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onVote(complaint._id, 'upvote')}
            disabled={isFiledByCurrentUser || hasUpvoted}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold 
              ${hasUpvoted ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
              ${isFiledByCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ThumbsUp size={18} /> {complaint.upvotes}
          </button>

          <button
            onClick={() => onVote(complaint._id, 'downvote')}
            disabled={isFiledByCurrentUser || hasDownvoted}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold 
              ${hasDownvoted ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200'}
              ${isFiledByCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ThumbsDown size={18} /> {complaint.downvotes}
          </button>
        </div>

        {!complaint.resolved ? (
          <button
            onClick={() => onResolve(complaint._id)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all transform hover:scale-105"
          >
            <ShieldCheck size={18} /> Resolve
          </button>
        ) : (
          <span className="text-green-700 font-bold border border-green-300 px-4 py-2 rounded-full bg-green-100 flex items-center gap-1">
            <ShieldCheck size={18} /> Resolved
          </span>
        )}
      </div>
    </div>
  );
};

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    complaintType: '',
    severityLevel: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await API.get('/complaints');
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await API.post('/complaints', newComplaint);
      setNewComplaint({ title: '', description: '', complaintType: '', severityLevel: '' });
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      await API.put(`/complaints/${id}/resolve`);
      fetchComplaints();
    } catch (err) {
      setError('Failed to resolve complaint.');
    }
  };

  const handleVote = async (id, voteType) => {
    try {
      await API.post(`/complaints/${id}/vote`, { voteType });
      fetchComplaints();
    } catch (err) {
      setError(`Failed to ${voteType} complaint.`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-b-blue-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading complaints...</p>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-gray-600 text-xl mt-10">Please log in to view and file complaints.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-200 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">🧼 Your Flat's Complaints</h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 max-w-xl mx-auto">
            <AlertCircle size={20} /> <span>{error}</span>
          </div>
        )}

        {/* Complaint Form */}
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-300 mb-12 mx-auto max-w-3xl">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">📣 File a New Complaint</h3>
          <form onSubmit={handleSubmitComplaint} className="space-y-6">
            <input
              type="text"
              name="title"
              placeholder="Complaint title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              value={newComplaint.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              rows="4"
              placeholder="Explain the issue..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              value={newComplaint.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="complaintType"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg bg-white"
                value={newComplaint.complaintType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Complaint Type</option>
                <option value="Noise">Noise</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Bills">Bills</option>
                <option value="Pets">Pets</option>
                <option value="Other">Other</option>
              </select>
              <select
                name="severityLevel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg bg-white"
                value={newComplaint.severityLevel}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Severity</option>
                <option value="Mild">Mild</option>
                <option value="Annoying">Annoying</option>
                <option value="Major">Major</option>
                <option value="Nuclear">Nuclear</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-lg transition-all transform hover:scale-105"
            >
              {submitting ? 'Submitting...' : '🚨 File Complaint'}
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">📋 Active Complaints</h3>
        {complaints.length === 0 ? (
          <p className="text-xl text-center text-gray-600 bg-white/50 p-6 rounded-xl shadow-inner mt-4">
            No active complaints in your flat. All peaceful! ✌️
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onResolve={handleResolveComplaint}
                onVote={handleVote}
                currentUserId={user._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
