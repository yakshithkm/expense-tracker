/**
 * TransactionContext - Global Transaction State Management
 * Manages transactions, loading, and error states
 */
import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { authReady, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const callWithRetry = useCallback(async (requestFn) => {
    try {
      return await requestFn();
    } catch (firstError) {
      if (firstError?.response?.status === 401) {
        throw firstError;
      }

      await sleep(500);
      return await requestFn();
    }
  }, []);

  const canCallApi = useCallback(() => {
    if (!authReady || !isAuthenticated) {
      return false;
    }

    const token = localStorage.getItem('token');
    return Boolean(token);
  }, [authReady, isAuthenticated]);

  // Fetch transactions
  const fetchTransactions = useCallback(async (filters = {}) => {
    if (!canCallApi()) {
      return [];
    }

    setIsFetching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const query = params.toString();
      const url = query ? `/api/transactions?${query}` : '/api/transactions';
      const res = await callWithRetry(() => api.get(url));

      setTransactions(res.data.transactions);
      setError(null);
      return res.data.transactions;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch transactions';
      setError(message);
      return [];
    } finally {
      setIsFetching(false);
    }
  }, [callWithRetry, canCallApi]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    if (!canCallApi()) {
      return null;
    }

    setIsFetching(true);
    setError(null);

    try {
      const res = await callWithRetry(() => api.get('/api/transactions/analytics/summary'));
      setAnalytics(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch analytics';
      setError(message);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [callWithRetry, canCallApi]);

  // Add transaction
  const addTransaction = async (transactionData) => {
    if (!canCallApi()) {
      return { success: false, error: 'Authentication not ready' };
    }

    setIsFetching(true);
    setError(null);

    try {
      const res = await callWithRetry(() => api.post('/api/transactions', transactionData));
      setTransactions((prev) => [res.data.transaction, ...prev]);
      setError(null);
      return { success: true, transaction: res.data.transaction };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add transaction';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsFetching(false);
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    if (!canCallApi()) {
      return { success: false, error: 'Authentication not ready' };
    }

    setIsFetching(true);
    setError(null);

    try {
      const res = await callWithRetry(() => api.put(`/api/transactions/${id}`, transactionData));
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? res.data.transaction : tx))
      );
      setError(null);
      return { success: true, transaction: res.data.transaction };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update transaction';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsFetching(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!canCallApi()) {
      return { success: false, error: 'Authentication not ready' };
    }

    setIsFetching(true);
    setError(null);

    try {
      await callWithRetry(() => api.delete(`/api/transactions/${id}`));
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete transaction';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!isAuthenticated) {
      setTransactions([]);
      setAnalytics(null);
      setError(null);
      setHasLoadedInitialData(false);
      setIsInitialLoading(false);
      setIsFetching(false);
      return;
    }

    if (hasLoadedInitialData) {
      return;
    }

    const initializeData = async () => {
      setIsInitialLoading(true);
      await Promise.all([fetchTransactions(), fetchAnalytics()]);
      setHasLoadedInitialData(true);
      setIsInitialLoading(false);
    };

    initializeData();
  }, [
    authReady,
    isAuthenticated,
    hasLoadedInitialData,
    fetchTransactions,
    fetchAnalytics,
  ]);

  const loading = isInitialLoading || isFetching;
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isInitialLoading,
        isFetching,
        loading,
        error,
        analytics,
        hasLoadedInitialData,
        clearError,
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
