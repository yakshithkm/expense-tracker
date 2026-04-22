/**
 * Main App Component
 * Sets up routing and global state providers
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './components/Analytics';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
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
