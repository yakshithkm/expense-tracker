/**
 * TransactionList Component
 * Display list of all transactions with edit/delete options
 */
import React, { useState } from 'react';
import '../styles/TransactionList.css';

const TransactionList = ({ transactions, loading, onEdit, onDelete }) => {
  const [filter, setFilter] = useState('all');

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="transaction-list-container">
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
          onClick={() => setFilter('income')}
        >
          Income
        </button>
        <button
          className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
          onClick={() => setFilter('expense')}
        >
          Expense
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="no-transactions">No transactions found</p>
      ) : (
        <div className="transactions-list">
          {filteredTransactions.map((transaction) => (
            <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
              <div className="transaction-info">
                <p className="category">{transaction.category}</p>
                {transaction.description && (
                  <p className="description">{transaction.description}</p>
                )}
                <p className="date">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="transaction-amount">
                <p className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
              <div className="transaction-actions">
                <button
                  onClick={() => onEdit(transaction)}
                  className="edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm('Are you sure you want to delete this transaction?')
                    ) {
                      onDelete(transaction._id);
                    }
                  }}
                  className="delete-btn"
                  title="Delete"
                >
                  🗑️
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
