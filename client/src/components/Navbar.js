/**
 * Navbar Component
 * Navigation header with user menu and logout
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">💰 Expense Tracker</h1>
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
