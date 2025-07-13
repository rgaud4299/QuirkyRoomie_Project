import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';

export default function FileComplaint() {
  const [form, setForm] = useState({ title: '', description: '', type: '', severity: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/complaints`, form, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      toast.success('Complaint filed!');
      setForm({ title: '', description: '', type: '', severity: '' });
    } catch {
      toast.error('Failed to file complaint');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">File New Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded-lg" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded-lg"></textarea>
        <input type="text" name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g. Noise)" className="w-full p-2 border rounded-lg" />
        <select name="severity" value={form.severity} onChange={handleChange} className="w-full p-2 border rounded-lg">
          <option value="">Select Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Nuclear">Nuclear</option>
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Submit</button>
      </form>
    </div>
  );
}
