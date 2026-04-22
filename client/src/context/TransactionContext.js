/**
 * TransactionContext - Global Transaction State Management
 * Manages transactions, loading, and error states
 */
import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Fetch transactions
  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await axios.get(`/api/transactions?${params.toString()}`);
      setTransactions(res.data.transactions);
      return res.data.transactions;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch transactions';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get('/api/transactions/analytics/summary');
      setAnalytics(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      return null;
    }
  }, []);

  // Add transaction
  const addTransaction = async (transactionData) => {
    setError(null);
    try {
      const res = await axios.post('/api/transactions', transactionData);
      setTransactions([res.data.transaction, ...transactions]);
      return { success: true, transaction: res.data.transaction };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add transaction';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    setError(null);
    try {
      const res = await axios.put(`/api/transactions/${id}`, transactionData);
      setTransactions(
        transactions.map((tx) => (tx._id === id ? res.data.transaction : tx))
      );
      return { success: true, transaction: res.data.transaction };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update transaction';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    setError(null);
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete transaction';
      setError(message);
      return { success: false, error: message };
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        analytics,
        fetchTransactions,
        fetchAnalytics,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use transaction context
export const useTransactions = () => {
  const context = React.useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
