/**
 * Main Transactions Page
 * Shows all transactions and allows adding/editing
 */
import React, { useEffect, useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import '../styles/TransactionsPage.css';

const CATEGORY_OPTIONS = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income',
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Other',
];

const Transactions = () => {
  const { authReady, isAuthenticated } = useAuth();
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!authReady || !isAuthenticated) {
      return;
    }

    fetchTransactions({
      type: filters.type === 'all' ? '' : filters.type,
      category: filters.category === 'all' ? '' : filters.category,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  }, [fetchTransactions, filters, authReady, isAuthenticated]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const handleAddTransaction = async (formData) => {
    if (!authReady || !isAuthenticated) {
      return { success: false, error: 'Authentication not ready' };
    }

    let result;

    if (editingTransaction) {
      result = await updateTransaction(editingTransaction._id, formData);
      if (result.success) {
        setEditingTransaction(null);
      }
    } else {
      result = await addTransaction(formData);
    }

    if (result.success) {
      await fetchTransactions({
        type: filters.type === 'all' ? '' : filters.type,
        category: filters.category === 'all' ? '' : filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return result;
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTransaction = async (id) => {
    if (!authReady || !isAuthenticated) {
      return;
    }

    const result = await deleteTransaction(id);
    if (result.success) {
      await fetchTransactions({
        type: filters.type === 'all' ? '' : filters.type,
        category: filters.category === 'all' ? '' : filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }
  };

  return (
    <div className="transactions-page">
      <section className="transaction-filters" aria-label="Transaction Filters">
        <h2>Filters</h2>
        <div className="filters-grid">
          <div className="filter-field">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="startDate">From</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="endDate">To</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <button type="button" className="clear-filters-btn" onClick={clearFilters}>
          Clear filters
        </button>
      </section>

      <div className="transactions-grid">
        <div className="form-section">
          <TransactionForm
            onSubmit={handleAddTransaction}
            loading={loading}
            editingTransaction={editingTransaction}
          />
          {editingTransaction && (
            <button
              onClick={() => setEditingTransaction(null)}
              className="cancel-edit-btn"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="list-section">
          <TransactionList
            transactions={transactions}
            loading={loading}
            error={error}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
