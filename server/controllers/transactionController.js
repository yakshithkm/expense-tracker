/**
 * Transaction Controller
 * Handles CRUD operations for transactions
 */
const Transaction = require('../models/Transaction');

/**
 * Get all transactions for a user
 * GET /api/transactions
 */
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Build filter
    let filter = { userId: req.userId };

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Fetch transactions sorted by date (newest first)
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};

/**
 * Create a new transaction
 * POST /api/transactions
 */
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    // Validate required fields
    if (!amount || !type || !category) {
      return res.status(400).json({
        message: 'Please provide amount, type, and category',
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        message: 'Type must be either "income" or "expense"',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be greater than 0',
      });
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      amount,
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error creating transaction' });
  }
};

/**
 * Update a transaction
 * PUT /api/transactions/:id
 */
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, description, date } = req.body;

    // Find transaction
    let transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }

    // Validate type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        message: 'Type must be either "income" or "expense"',
      });
    }

    // Validate amount if provided
    if (amount && amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be greater than 0',
      });
    }

    // Update fields
    if (amount) transaction.amount = amount;
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = new Date(date);

    await transaction.save();

    res.json({
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error updating transaction' });
  }
};

/**
 * Delete a transaction
 * DELETE /api/transactions/:id
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await Transaction.findByIdAndDelete(id);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error deleting transaction' });
  }
};

/**
 * Get analytics data (summary, category-wise, monthly)
 * GET /api/transactions/analytics/summary
 */
exports.getAnalytics = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryWise = {};
    const monthlyData = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }

      // Category wise
      if (!categoryWise[tx.category]) {
        categoryWise[tx.category] = { income: 0, expense: 0 };
      }
      categoryWise[tx.category][tx.type] += tx.amount;

      // Monthly data
      const month = new Date(tx.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      monthlyData[month][tx.type] += tx.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      summary: {
        balance,
        totalIncome,
        totalExpense,
      },
      categoryWise,
      monthlyData,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};
