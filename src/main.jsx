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

// Initialize toast alerts notification layout to slide in on API errors

// Display disconnected overlay panel if Horizon network cannot be reached

// Configure spinner loader indicators during transaction compilation state

// Render ROI calculator sliders dynamically adapting dividend APY yield

// Configure relative sizing units in layouts for screen size accessibility

// Compress property showcase photos to WebP format for fast payload loads

// Include title, keywords, and meta tags descriptions for search engine SEO

// Setup compound interest timeline charts representing growth estimates

// Build stakers list simulation tracking deposits, debts, and earnings
