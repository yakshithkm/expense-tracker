/**
 * Navbar Component
 * Navigation header with user menu and logout
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">💰 Expense Tracker</h1>
        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}
          >
            Transactions
          </Link>
          <Link
            to="/analytics"
            className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
          >
            Analytics
          </Link>
        </div>
        <div className="navbar-right">
          {user && (
            <>
              <span className="user-name">Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
