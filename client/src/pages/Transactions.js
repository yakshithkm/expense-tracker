/**
 * Main Transactions Page
 * Shows all transactions and allows adding/editing
 */
import React, { useEffect, useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import '../styles/TransactionsPage.css';

const Transactions = () => {
  const {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (formData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction._id, formData);
      setEditingTransaction(null);
    } else {
      await addTransaction(formData);
    }
    fetchTransactions();
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  return (
    <div className="transactions-page">
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
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
