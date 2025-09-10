/**
 * Date and time utilities for baseball stat tracker
 */

/**
 * Format timestamp for display
 * @param {string|Date} timestamp - ISO timestamp or Date object
 * @returns {string} Formatted date and time
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Format date only (no time)
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};

/**
 * Get relative time description (e.g., "2 days ago")
 * @param {string|Date} timestamp - ISO timestamp or Date object
 * @returns {string} Relative time description
 */
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Check if date is valid
 * @param {any} date - Date to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
