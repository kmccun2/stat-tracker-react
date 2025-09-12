/**
 * Date and time utilities for baseball stat tracker
 */

/**
 * Format timestamp for display
 * @param timestamp - ISO timestamp or Date object
 * @returns Formatted date and time
 */
export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Format date only (no time)
 * @param date - ISO date string or Date object
 * @returns Formatted date
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};

/**
 * Get relative time description (e.g., "2 days ago")
 * @param timestamp - ISO timestamp or Date object
 * @returns Relative time description
 */
export const getRelativeTime = (timestamp: string | Date): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
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
 * @param date - Date to validate
 * @returns True if valid date
 */
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};
