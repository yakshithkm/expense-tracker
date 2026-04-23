import React, { useMemo } from 'react';
import '../styles/Insights.css';
import { formatCurrency } from '../utils/formatters';
import {
  calculatePercentagePerCategory,
  getCurrentMonthTransactions,
  getPreviousMonthTransactions,
  sumByType,
} from '../utils/dateUtils';

const Insights = ({ transactions = [] }) => {
  const insightData = useMemo(() => {
    const currentMonth = getCurrentMonthTransactions(transactions);
    const previousMonth = getPreviousMonthTransactions(transactions);

    const currentMonthExpense = sumByType(currentMonth, 'expense');
    const previousMonthExpense = sumByType(previousMonth, 'expense');

    const categoryBreakdown = calculatePercentagePerCategory(currentMonth);
    const topCategory = categoryBreakdown[0] || null;

    let trendText = 'No previous month data to compare yet.';
    if (previousMonthExpense > 0) {
      const diff = currentMonthExpense - previousMonthExpense;
      const percent = Math.abs((diff / previousMonthExpense) * 100).toFixed(1);

      if (diff > 0) {
        trendText = `Your expenses increased by ${percent}% compared to last month.`;
      } else if (diff < 0) {
        trendText = `Your expenses decreased by ${percent}% compared to last month.`;
      } else {
        trendText = 'Your expenses are the same as last month.';
      }
    }

    return {
      currentMonthExpense,
      topCategory,
      trendText,
    };
  }, [transactions]);

  if (!transactions.length) {
    return (
      <div className="insights-container">
        <h2>Insights</h2>
        <div className="insight-empty">Add transactions to unlock spending insights.</div>
      </div>
    );
  }

  return (
    <div className="insights-container">
      <h2>Insights</h2>
      <div className="insight-grid">
        <article className="insight-card">
          <p className="insight-icon" aria-hidden="true">📅</p>
          <h3>You spent {formatCurrency(insightData.currentMonthExpense)} this month</h3>
          <p>Track this number regularly to keep your monthly budget in control.</p>
        </article>

        <article className="insight-card">
          <p className="insight-icon" aria-hidden="true">🥇</p>
          {insightData.topCategory ? (
            <>
              <h3>
                Highest spend: {insightData.topCategory.category} ({formatCurrency(insightData.topCategory.amount)})
              </h3>
              <p>
                You spent {insightData.topCategory.percentage.toFixed(1)}% of this month's expenses on this category.
              </p>
            </>
          ) : (
            <>
              <h3>No expense categories yet this month</h3>
              <p>Add expense entries to identify your top spending bucket.</p>
            </>
          )}
        </article>

        <article className="insight-card">
          <p className="insight-icon" aria-hidden="true">📈</p>
          <h3>Month-over-month trend</h3>
          <p>{insightData.trendText}</p>
        </article>
      </div>
    </div>
  );
};

export default Insights;
