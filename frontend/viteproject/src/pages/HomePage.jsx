import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg shadow-xl">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
        Welcome to <span className="text-blue-600">QuirkyRoomie</span>
      </h1>
      <p className="text-2xl text-gray-700 mb-10 text-center max-w-2xl">
        Your ultimate solution for harmonious flatmate living. Resolve conflicts, track issues, and celebrate the best flatmate!
      </p>
      <div className="flex space-x-6">
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Login
        </Link>
      </div>
      <div className="mt-16 text-center text-gray-600">
        <p className="text-lg mb-2">Manage household issues like:</p>
        <ul className="list-disc list-inside text-xl space-y-2">
          <li>Noise complaints 🔊</li>
          <li>Cleanliness disputes 🧹</li>
          <li>Bill divisions 💸</li>
          <li>Pet problems 🐾</li>
          <li>And more! ✨</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;

