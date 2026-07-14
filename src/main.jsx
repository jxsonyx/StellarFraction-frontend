import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// StellarFraction frontend entry - bootstraps React application rendering

// Import root stylesheets index.css containing dark theme glassmorphism

// Render App root component inside document root element container
