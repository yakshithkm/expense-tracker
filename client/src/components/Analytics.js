/**
 * Analytics Component
 * Display charts for category-wise and monthly analytics
 */
import React, { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import '../styles/Analytics.css';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

const Analytics = () => {
  const { analytics, fetchAnalytics, loading } = useTransactions();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <div className="loading">Loading analytics...</div>;

  if (!analytics) return <div className="loading">No data available</div>;

  // Prepare category-wise data
  const categoryData = Object.entries(analytics.categoryWise || {}).map(
    ([category, values]) => ({
      name: category,
      income: values.income || 0,
      expense: values.expense || 0,
    })
  );

  // Prepare monthly data
  const monthlyData = Object.entries(analytics.monthlyData || {})
    .sort()
    .map(([month, values]) => ({
      month,
      income: values.income || 0,
      expense: values.expense || 0,
    }))
    .slice(-12); // Last 12 months

  // Prepare category expense distribution for pie chart
  const categoryExpenses = Object.entries(analytics.categoryWise || {})
    .filter(([, values]) => values.expense > 0)
    .map(([category, values]) => ({
      name: category,
      value: values.expense,
    }));

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>

      {categoryExpenses.length > 0 && (
        <div className="chart-container">
          <h3>Expense Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {monthlyData.length > 0 && (
        <div className="chart-container">
          <h3>Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#4ECDC4" name="Income" />
              <Bar dataKey="expense" fill="#FF6B6B" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {categoryData.length > 0 && (
        <div className="chart-container">
          <h3>Category Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#4ECDC4" name="Income" />
              <Bar dataKey="expense" fill="#FF6B6B" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
