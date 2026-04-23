/**
 * TransactionList Component
 * Display list of all transactions with edit/delete options
 */
import React from 'react';
import '../styles/TransactionList.css';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionList = ({ transactions, loading, error, onEdit, onDelete }) => {
  const showEmptyAll = !loading && !error && transactions.length === 0;

  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="transaction-list-container">
        <div className="list-loading-state" role="status" aria-live="polite">
          <span className="list-spinner" />
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list-container">
        <div className="list-error-state" role="alert">
          <p>Unable to load transactions.</p>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      {showEmptyAll ? (
        <div className="list-empty-state">
          <div className="empty-icon" aria-hidden="true">◌</div>
          <p>No transactions yet. Add your first expense.</p>
        </div>
      ) : (
        <div className="transactions-list" role="table" aria-label="Transactions">
          <div className="transaction-row transaction-row-head" role="row">
            <p>Category</p>
            <p>Type</p>
            <p>Date</p>
            <p className="amount-col">Amount</p>
            <p className="actions-col">Actions</p>
          </div>

          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`transaction-row transaction-item ${transaction.type}`}
              role="row"
            >
              <div className="transaction-info">
                <p className="category">{transaction.category}</p>
                {transaction.description && (
                  <p className="description">{transaction.description}</p>
                )}
              </div>
              <p className={`transaction-type-pill ${transaction.type}`}>
                {transaction.type}
              </p>
              <p className="date">{formatDate(transaction.date)}</p>
              <div className="transaction-amount">
                <p className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              <div className="transaction-actions">
                <button
                  onClick={() => onEdit(transaction)}
                  className="edit-btn"
                  title="Edit transaction"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(transaction._id)}
                  className="delete-btn"
                  title="Delete transaction"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
