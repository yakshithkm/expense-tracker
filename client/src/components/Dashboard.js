/**
 * Dashboard Component
 * Main dashboard showing balance summary and key stats
 */
import React, { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import '../styles/Dashboard.css';
import { formatCurrency } from '../utils/formatters';
import Analytics from './Analytics';
import { sumByType } from '../utils/dateUtils';

const Dashboard = () => {
  const {
    analytics,
    transactions,
    isInitialLoading,
    loading,
    error,
  } = useTransactions();

  const fallbackSummary = useMemo(() => {
    const totalIncome = sumByType(transactions, 'income');
    const totalExpense = sumByType(transactions, 'expense');
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  if (loading) return <div className="loading">Loading...</div>;

  if (!isInitialLoading && error) {
    return <div className="error-message">{error}</div>;
  }

  const summary = analytics?.summary || fallbackSummary;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card balance">
          <h3>Balance</h3>
          <p className="stat-value">{formatCurrency(summary.balance)}</p>
        </div>
        <div className="stat-card income">
          <h3>Total Income</h3>
          <p className="stat-value">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div className="stat-card expense">
          <h3>Total Expense</h3>
          <p className="stat-value">{formatCurrency(summary.totalExpense)}</p>
        </div>
      </div>

      <Analytics />
    </div>
  );
};

export default Dashboard;
