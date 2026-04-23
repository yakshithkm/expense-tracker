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

const DEFAULT_TYPE = 'expense';
const DEFAULT_DATE = () => new Date().toISOString().split('T')[0];

const getInitialState = () => ({
  amount: '',
  type: DEFAULT_TYPE,
  category: CATEGORIES[DEFAULT_TYPE][0],
  description: '',
  date: DEFAULT_DATE(),
});

const validateForm = (values) => {
  const errors = {};
  const parsedAmount = Number(values.amount);

  if (values.amount === '' || Number.isNaN(parsedAmount)) {
    errors.amount = 'Amount is required';
  } else if (parsedAmount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (parsedAmount > 100000000) {
    errors.amount = 'Amount is too large';
  }

  if (!['income', 'expense'].includes(values.type)) {
    errors.type = 'Select a valid transaction type';
  }

  if (!values.category || !values.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!values.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(values.date);
    if (Number.isNaN(selectedDate.getTime())) {
      errors.date = 'Select a valid date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.date = 'Date cannot be in the future';
      }
    }
  }

  return errors;
};

const TransactionForm = ({ onSubmit, loading, editingTransaction }) => {
  const [formData, setFormData] = useState(getInitialState());
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        description: editingTransaction.description || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
      });
      setFormErrors({});
      setSubmitError('');
    } else {
      setFormData(getInitialState());
      setFormErrors({});
      setSubmitError('');
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubmitError('');

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

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      category: formData.category.trim(),
      description: formData.description.trim(),
    };

    const result = await onSubmit(payload);

    if (result?.success === false) {
      setSubmitError(result.error || 'Failed to save transaction');
      return;
    }

    // Reset form
    if (!editingTransaction) {
      setFormData(getInitialState());
    }
    setFormErrors({});
    setSubmitError('');
  };

  const categories = CATEGORIES[formData.type];

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>

      {submitError && <p className="form-error-message">{submitError}</p>}

      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={formErrors.type ? 'input-error' : ''}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {formErrors.type && <p className="field-error">{formErrors.type}</p>}
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
          min="0"
          className={formErrors.amount ? 'input-error' : ''}
          required
        />
        {formErrors.amount && <p className="field-error">{formErrors.amount}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={formErrors.category ? 'input-error' : ''}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {formErrors.category && <p className="field-error">{formErrors.category}</p>}
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
          max={DEFAULT_DATE()}
          className={formErrors.date ? 'input-error' : ''}
          required
        />
        {formErrors.date && <p className="field-error">{formErrors.date}</p>}
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Saving...' : editingTransaction ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default TransactionForm;
