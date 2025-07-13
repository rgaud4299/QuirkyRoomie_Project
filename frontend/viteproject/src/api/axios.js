import axios from 'axios';

// Create an Axios instance with a base URL
// IMPORTANT: Replace with your actual backend URL when deployed or running locally
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', // Default to localhost:5000/api
});

// Request interceptor to add the JWT token to headers if available
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from local storage
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

