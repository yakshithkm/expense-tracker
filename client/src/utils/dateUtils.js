/**
 * Date and analytics helpers for transaction insights.
 */

const monthKey = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1).toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit',
  });
};

export const getCurrentMonthTransactions = (transactions = []) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((tx) => {
    const date = new Date(tx.date);
    return (
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });
};

export const getPreviousMonthTransactions = (transactions = []) => {
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return transactions.filter((tx) => {
    const date = new Date(tx.date);
    return (
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === prev.getMonth() &&
      date.getFullYear() === prev.getFullYear()
    );
  });
};

/**
 * Groups transactions by month and returns sorted summary points.
 */
export const groupTransactionsByMonth = (
  transactions = [],
  { type = 'expense', limit = 6 } = {}
) => {
  const monthTotals = transactions.reduce((acc, tx) => {
    if (type && tx.type !== type) return acc;

    const key = monthKey(tx.date);
    if (!key) return acc;

    acc[key] = (acc[key] || 0) + Number(tx.amount || 0);
    return acc;
  }, {});

  return Object.entries(monthTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-limit)
    .map(([key, total]) => ({
      key,
      month: monthLabel(key),
      total,
    }));
};

/**
 * Calculates category share percentages from expense transactions.
 */
export const calculatePercentagePerCategory = (transactions = []) => {
  const expenses = transactions.filter((tx) => tx.type === 'expense');
  const categoryTotals = expenses.reduce((acc, tx) => {
    const category = tx.category || 'Other';
    acc[category] = (acc[category] || 0) + Number(tx.amount || 0);
    return acc;
  }, {});

  const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return [];
  }

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const sumByType = (transactions = [], type) =>
  transactions
    .filter((tx) => tx.type === type)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
