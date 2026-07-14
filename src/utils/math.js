/**
 * Calculates compound growth projections for real estate investment.
 * @param {number} principal 
 * @param {number} apy 
 * @param {number} years 
 * @param {number} appreciation 
 * @returns {Array} Array of year-by-year projections
 */
export const calculateCompoundProjections = (principal, apy, years = 5, appreciation = 3.0) => {
  const data = [];
  let currentYieldVal = principal;
  let currentAppVal = principal;
  
  for (let i = 1; i <= years; i++) {
    // Rental dividends compound yield
    currentYieldVal = currentYieldVal * (1 + (apy / 100));
    // Property value appreciation compound
    currentAppVal = currentAppVal * (1 + (appreciation / 100));
    
    data.push({
      year: `Year ${i}`,
      yieldEquity: Math.round(currentYieldVal),
      appreciatedEquity: Math.round(currentAppVal),
      totalEquity: Math.round(currentYieldVal + (currentAppVal - principal))
    });
  }
  
  return data;
};

/**
 * Calculates pending rewards based on O(1) staking mathematics.
 * @param {number} shares 
 * @param {number} accRewardPerShare 
 * @param {number} debt 
 * @param {number} scaleFactor 
 * @returns {number} Pending rewards
 */
export const calculatePendingReward = (shares, accRewardPerShare, debt, scaleFactor = 1e12) => {
  if (!shares || shares <= 0) return 0;
  const accumulated = (shares * accRewardPerShare) / scaleFactor;
  return Math.max(0, accumulated - debt);
};
