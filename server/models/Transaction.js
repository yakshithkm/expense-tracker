/**
 * Transaction Model
 * Schema for storing income and expense transactions
 */
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      positive: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction must have a type'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Index on userId for faster queries
 */
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
