/**
 * Formats a number as USD currency.
 * @param {number|string} value
 * @returns {string}
 */
export const formatUSD = (value) => formatCurrency(value);

/**
 * Formats a number as USD currency with configurable precision.
 * @param {number|string} value
 * @param {object} [options]
 * @returns {string}
 */
export const formatCurrency = (value, options = {}) => {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

/**
 * Formats a number with commas.
 * @param {number|string} value
 * @returns {string}
 */
export const formatNumber = (value) => {
  const numericValue = Number(value ?? 0);
  return new Intl.NumberFormat('en-US').format(Number.isFinite(numericValue) ? numericValue : 0);
};

/**
 * Formats a decimal percentage for UI display.
 * @param {number|string} value
 * @param {number} [maximumFractionDigits=2]
 * @returns {string}
 */
export const formatPercent = (value, maximumFractionDigits = 2) => {
  const numericValue = Number(value ?? 0);
  return `${(Number.isFinite(numericValue) ? numericValue : 0).toFixed(maximumFractionDigits)}%`;
};

/**
 * Truncates a Stellar address for UI display.
 * @param {string} address
 * @returns {string}
 */
export const truncateAddress = (address) => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
