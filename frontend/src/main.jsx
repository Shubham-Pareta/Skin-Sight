// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Remove this line - NOT NEEDED with Firebase
// import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Remove the GoogleOAuthProvider wrapper */}
    <App />
  </React.StrictMode>
);