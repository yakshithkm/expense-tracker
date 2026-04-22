/**
 * Dashboard Component
 * Main dashboard showing balance summary and key stats
 */
import React, { useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { analytics, fetchAnalytics, loading } = useTransactions();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <div className="loading">Loading...</div>;

  const summary = analytics?.summary || {
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card balance">
          <h3>Balance</h3>
          <p className="stat-value">₹{summary.balance.toFixed(2)}</p>
        </div>
        <div className="stat-card income">
          <h3>Total Income</h3>
          <p className="stat-value">₹{summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="stat-card expense">
          <h3>Total Expense</h3>
          <p className="stat-value">₹{summary.totalExpense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
