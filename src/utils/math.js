const DEFAULT_SCALE_FACTOR = 1e12;
const DEFAULT_APPRECIATION_RATE = 0.045;

export const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

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
  let currentYieldVal = toNumber(principal);
  let currentAppVal = toNumber(principal);
  const annualYieldRate = toNumber(apy) / 100;
  const annualAppRate = toNumber(appreciation) / 100;

  for (let i = 1; i <= years; i += 1) {
    currentYieldVal *= 1 + annualYieldRate;
    currentAppVal *= 1 + annualAppRate;

    data.push({
      year: `Year ${i}`,
      yieldEquity: Math.round(currentYieldVal),
      appreciatedEquity: Math.round(currentAppVal),
      totalEquity: Math.round(currentYieldVal + (currentAppVal - toNumber(principal)))
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
export const calculatePendingReward = (shares, accRewardPerShare, debt, scaleFactor = DEFAULT_SCALE_FACTOR) => {
  const normalizedShares = toNumber(shares);
  if (!normalizedShares || normalizedShares <= 0) return 0;
  const accumulated = (normalizedShares * toNumber(accRewardPerShare)) / toNumber(scaleFactor, DEFAULT_SCALE_FACTOR);
  return Math.max(0, accumulated - toNumber(debt));
};

export const calculateInvestmentProjection = ({
  principal,
  apy,
  years,
  appreciationRate = DEFAULT_APPRECIATION_RATE,
  reinvest = true,
}) => {
  const normalizedPrincipal = toNumber(principal);
  const normalizedApy = toNumber(apy) / 100;
  const normalizedAppreciationRate = toNumber(appreciationRate);
  const normalizedYears = Math.max(1, Math.floor(toNumber(years, 1)));
  let totalYield = 0;
  let currentPrincipal = normalizedPrincipal;
  const entries = [];

  for (let year = 1; year <= normalizedYears; year += 1) {
    const yearlyYield = currentPrincipal * normalizedApy;
    totalYield += yearlyYield;

    if (reinvest) {
      currentPrincipal += yearlyYield;
    }

    const appreciationProfit = normalizedPrincipal * Math.pow(1 + normalizedAppreciationRate, year) - normalizedPrincipal;

    entries.push({
      year,
      totalYield,
      appreciationProfit,
      totalValue: normalizedPrincipal + totalYield + appreciationProfit,
    });
  }

  const finalAppreciationProfit = normalizedPrincipal * Math.pow(1 + normalizedAppreciationRate, normalizedYears) - normalizedPrincipal;
  const finalTotalValue = normalizedPrincipal + totalYield + finalAppreciationProfit;

  return {
    entries,
    finalAppreciationProfit,
    finalTotalValue,
    totalGain: finalTotalValue - normalizedPrincipal,
  };
};
