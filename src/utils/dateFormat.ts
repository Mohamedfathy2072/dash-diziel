/**
 * Format date to locale string with date and time
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleString();
};

/**
 * Format date to locale date string (date only)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

/**
 * Format date to locale time string (time only)
 */
export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleTimeString();
};

/**
 * Format date to detailed locale string
 */
export const formatDateDetailed = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

