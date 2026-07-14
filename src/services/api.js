const BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all real estate property assets.
 */
export const fetchProperties = async () => {
  const res = await fetch(`${BASE_URL}/properties`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
};

/**
 * Fetch single property details.
 */
export const fetchPropertyById = async (id) => {
  const res = await fetch(`${BASE_URL}/properties/${id}`);
  if (!res.ok) throw new Error('Failed to fetch property details');
  return res.json();
};

/**
 * Fetch all registered stakers from the backend.
 */
export const fetchStakers = async () => {
  const res = await fetch(`${BASE_URL}/stakers`);
  if (!res.ok) throw new Error('Failed to fetch stakers');
  return res.json();
};

/**
 * Register a new staker wallet address.
 */
export const registerStakerAddress = async (name, address, shares = 0) => {
  const res = await fetch(`${BASE_URL}/stakers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, address, shares })
  });
  if (!res.ok) throw new Error('Failed to register staker');
  return res.json();
};

/**
 * Fetch USDC dividend payout transaction history.
 */
export const fetchDividendHistory = async () => {
  const res = await fetch(`${BASE_URL}/history`);
  if (!res.ok) throw new Error('Failed to fetch dividend logs');
  return res.json();
};

/**
 * Trigger dividend distribution from the landlord panel.
 */
export const triggerDistribution = async (propertyId, amountUSDC) => {
  const res = await fetch(`${BASE_URL}/distribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ propertyId, amountUSDC })
  });
  if (!res.ok) throw new Error('Failed to distribute dividends');
  return res.json();
};
