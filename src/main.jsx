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

// Import React StrictMode wrapper to identify double render lifecycle issues

// Configure Freighter browser wallet hooks to detect active account key

// Setup Albedo browser adapter fallback options for keyless users

// Setup Hana wallet connection API handlers for Stellar network authentication

// Load wallet credentials and save connection addresses in state manager

// Setup localStorage caching to recover active user address on reload
