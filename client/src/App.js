/**
 * Main App Component
 * Sets up routing and global state providers
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './components/Analytics';
import Landing from './pages/Landing';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading, authReady } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Landing />} />
            <Route path="/register" element={<Landing />} />
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/transactions" element={<Navigate to="/login" replace />} />
            <Route path="/analytics" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      {!isAuthenticated && location.pathname === '/login' && <Login />}
      {!isAuthenticated && location.pathname === '/register' && <Register />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TransactionProvider>
          <AppContent />
        </TransactionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
