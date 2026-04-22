/**
 * Authentication Routes
 * Routes for user registration and login
 */
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.register
);

/**
 * POST /api/auth/login
 * Login an existing user
 */
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  authController.login
);

/**
 * GET /api/auth/me
 * Get current user profile (protected)
 */
router.get('/me', auth, authController.getMe);

module.exports = router;
