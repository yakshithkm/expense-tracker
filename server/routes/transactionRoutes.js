/**
 * Transaction Routes
 * Routes for CRUD operations on transactions
 */
const express = require('express');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(auth);

/**
 * GET /api/transactions
 * Fetch all transactions for the user
 */
router.get('/', transactionController.getTransactions);

/**
 * POST /api/transactions
 * Create a new transaction
 */
router.post('/', transactionController.createTransaction);

/**
 * GET /api/transactions/analytics/summary
 * Get analytics data (summary, category-wise, monthly)
 * Note: Must come before /:id route to avoid conflicts
 */
router.get('/analytics/summary', transactionController.getAnalytics);

/**
 * PUT /api/transactions/:id
 * Update an existing transaction
 */
router.put('/:id', transactionController.updateTransaction);

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
