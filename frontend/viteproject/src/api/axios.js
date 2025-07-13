import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', 
});

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

