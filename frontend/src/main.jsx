import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
     <GoogleOAuthProvider clientId="1084774619936-qvamv900iv0076lfmhqpncfchgkoss7t.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </HelmetProvider>
  </StrictMode>,
)
