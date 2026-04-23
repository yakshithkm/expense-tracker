/**
 * TransactionContext - Global Transaction State Management
 * Manages transactions, loading, and error states
 */
import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Temporary debug log requested for integration tracing.
    console.log('[TransactionContext] transactions state updated:', transactions);
  }, [transactions]);

  useEffect(() => {
    // Temporary debug log requested for integration tracing.
    console.log('[TransactionContext] analytics state updated:', analytics);
  }, [analytics]);

  const seedSampleTransactions = useCallback(async () => {
    const sample = [
      { amount: 500, type: 'expense', category: 'Food', date: new Date() },
      { amount: 2000, type: 'income', category: 'Salary', date: new Date() },
      { amount: 300, type: 'expense', category: 'Transport', date: new Date() },
    ];

    await Promise.all(sample.map((item) => api.post('/api/transactions', item)));
  }, []);

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

      const query = params.toString();
      const url = query ? `/api/transactions?${query}` : '/api/transactions';
      const res = await api.get(url);

      // Temporary debug log requested for API tracing.
      console.log('[TransactionContext] GET /api/transactions response:', res.data);

      setTransactions(res.data.transactions);

      // Optional debug seed if database is empty and no filters are applied.
      const noFilters = !filters.type && !filters.category && !filters.startDate && !filters.endDate;
      const alreadySeeded = sessionStorage.getItem('seeded-sample-transactions');
      if (noFilters && res.data.transactions.length === 0 && !alreadySeeded) {
        await seedSampleTransactions();
        sessionStorage.setItem('seeded-sample-transactions', '1');
        const refetchRes = await api.get('/api/transactions');
        console.log('[TransactionContext] seeded sample transactions:', refetchRes.data);
        setTransactions(refetchRes.data.transactions);
        return refetchRes.data.transactions;
      }

      return res.data.transactions;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch transactions';
      setError(message);
      console.error('[TransactionContext] fetchTransactions error:', err.response?.data || err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [seedSampleTransactions]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setError(null);
    try {
      const res = await api.get('/api/transactions/analytics/summary');
      // Temporary debug log requested for API tracing.
      console.log('[TransactionContext] GET /api/transactions/analytics/summary response:', res.data);
      setAnalytics(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch analytics';
      setError(message);
      console.error('[TransactionContext] fetchAnalytics error:', err.response?.data || err.message);
      return null;
    }
  }, []);

  // Add transaction
  const addTransaction = async (transactionData) => {
    setError(null);
    try {
      const res = await api.post('/api/transactions', transactionData);
      setTransactions((prev) => [res.data.transaction, ...prev]);
      console.log('[TransactionContext] added transaction:', res.data.transaction);
      return { success: true, transaction: res.data.transaction };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add transaction';
      setError(message);
      console.error('[TransactionContext] addTransaction error:', err.response?.data || err.message);
      return { success: false, error: message };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    setError(null);
    try {
      const res = await api.put(`/api/transactions/${id}`, transactionData);
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? res.data.transaction : tx))
      );
      console.log('[TransactionContext] updated transaction:', res.data.transaction);
      return { success: true, transaction: res.data.transaction };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update transaction';
      setError(message);
      console.error('[TransactionContext] updateTransaction error:', err.response?.data || err.message);
      return { success: false, error: message };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    setError(null);
    try {
      await api.delete(`/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      console.log('[TransactionContext] deleted transaction id:', id);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete transaction';
      setError(message);
      console.error('[TransactionContext] deleteTransaction error:', err.response?.data || err.message);
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
