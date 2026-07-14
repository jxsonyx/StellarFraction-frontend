const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildUrl = (path) => `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

const requestJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), options);

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json();
};

/**
 * Fetch all real estate property assets.
 */
export const fetchProperties = async () => requestJson('/properties');

/**
 * Fetch single property details.
 */
export const fetchPropertyById = async (id) => requestJson(`/properties/${id}`);

/**
 * Fetch all registered stakers from the backend.
 */
export const fetchStakers = async () => requestJson('/stakers');

/**
 * Register a new staker wallet address.
 */
export const registerStakerAddress = async (name, address, shares = 0) => requestJson('/stakers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, address, shares })
});

/**
 * Fetch USDC dividend payout transaction history.
 */
export const fetchDividendHistory = async () => requestJson('/history');

/**
 * Trigger dividend distribution from the landlord panel.
 */
export const triggerDistribution = async (propertyId, amountUSDC) => requestJson('/distribute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ propertyId, amountUSDC })
});
