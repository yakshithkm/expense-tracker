/**
 * Shared format helpers for displaying monetary and date values consistently.
 */
export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace('.00', '');
};

export const formatDate = (dateValue) => {
  if (!dateValue) return '--';

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return '--';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};
