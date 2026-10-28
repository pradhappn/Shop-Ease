// Browser entry point: loads global styling and mounts the React application with providers.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'  
import  'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// StrictMode helps surface unsafe React patterns during development.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
    <App />
    </AuthProvider>
  </StrictMode>,
)
