import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';

export default function ComplaintCard({ complaint, userId }) {
  const { _id, title, type, severity, createdBy, upvotes, downvotes } = complaint;

  const handleVote = async (type) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/complaints/${_id}/${type}`, {}, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      toast.success(`${type}d! Reload to see change.`);
    } catch {
      toast.error('Vote failed');
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between mb-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-sm text-gray-500">{type} • {severity}</span>
      </div>
      <p className="text-sm mb-2">By: {createdBy?.name || 'Anonymous'}</p>
      <div className="flex items-center space-x-4">
        <button onClick={() => handleVote('upvote')} className="text-green-600">👍 {upvotes.length}</button>
        <button onClick={() => handleVote('downvote')} className="text-red-600">👎 {downvotes.length}</button>
      </div>
    </div>
  );
}
