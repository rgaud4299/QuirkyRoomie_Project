import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-bold tracking-wider rounded-md px-2 py-1 hover:bg-white hover:text-blue-600 transition-all duration-300">
          QuirkyRoomie
        </Link>
        <div className="flex space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-20">
                Dashboard
              </Link>
              <Link to="/complaints" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-20">
                Complaints
              </Link>
              <Link to="/leaderboard" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-20">
                Leaderboard
              </Link>
              <Link to="/stats" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-20">
                Stats
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-20">
                Login
              </Link>
              <Link to="/register" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-20">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

