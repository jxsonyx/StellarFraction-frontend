/**
 * Formats a number as USD currency.
 * @param {number} value 
 * @returns {string}
 */
export const formatUSD = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formats a number with commas.
 * @param {number} value 
 * @returns {string}
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
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
