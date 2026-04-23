/**
 * Dashboard Component
 * Main dashboard showing balance summary and key stats
 */
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import '../styles/Dashboard.css';
import { formatCurrency } from '../utils/formatters';
import Analytics from './Analytics';
import { sumByType } from '../utils/dateUtils';

const Dashboard = () => {
  const location = useLocation();
  const {
    analytics,
    transactions,
    fetchTransactions,
    clearError,
    isInitialLoading,
    loading,
    error,
  } = useTransactions();

  useEffect(() => {
    if (location.pathname !== '/dashboard') {
      return;
    }

    clearError();
    fetchTransactions();
  }, [location.pathname, fetchTransactions, clearError]);

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

  if (location.pathname === '/dashboard' && !isInitialLoading && error) {
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

      <section className="dashboard-analytics-wrap" aria-label="Dashboard analytics overview">
        <div className="dashboard-section-divider" aria-hidden="true" />
        <h3 className="dashboard-analytics-title">Analytics Overview</h3>
        <Analytics />
      </section>
    </div>
  );
};

export default Dashboard;
