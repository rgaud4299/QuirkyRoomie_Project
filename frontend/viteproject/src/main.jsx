import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css'; // Tailwind CSS directives
import { AuthProvider } from './context/AuthContext.jsx'; // Import the AuthProvider
import { BrowserRouter } from 'react-router-dom'; // For client-side routing

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    {/* BrowserRouter provides routing capabilities to the app */}
    <BrowserRouter>
      {/* AuthProvider makes authentication state available throughout the app */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

