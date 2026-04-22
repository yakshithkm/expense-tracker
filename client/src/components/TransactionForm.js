/**
 * TransactionForm Component
 * Form to add or edit a transaction
 */
import React, { useState, useEffect } from 'react';
import '../styles/TransactionForm.css';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Other'],
};

const TransactionForm = ({ onSubmit, loading, editingTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        description: editingTransaction.description || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      setFormData({
        ...formData,
        [name]: value,
        category: CATEGORIES[value][0], // Reset category when type changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      amount: '',
      type: 'expense',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const categories = CATEGORIES[formData.type];

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>

      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description"
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Saving...' : editingTransaction ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default TransactionForm;
