/**
 * Navbar Component
 * Navigation header with user menu and logout
 */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const logoSrc = `${process.env.PUBLIC_URL}/favicon.svg`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand" aria-label="Expense Tracker Dashboard Home">
          <img src={logoSrc} alt="" className="navbar-logo" aria-hidden="true" />
          <span className="brand-text">Expense Tracker</span>
        </Link>
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

