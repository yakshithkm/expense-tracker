/**
 * Analytics Component
 * Display charts for category-wise and monthly analytics
 */
import React, { useEffect, useMemo } from 'react';
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
import Insights from './Insights';
import {
  calculatePercentagePerCategory,
  groupTransactionsByMonth,
  sumByType,
} from '../utils/dateUtils';

const COLORS = ['#ef5350', '#4db6ac', '#42a5f5', '#ffa726', '#ab47bc', '#66bb6a', '#26c6da'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      {label && <p className="tooltip-label">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const CategoryTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{point.category}</p>
      <p>Amount: {formatCurrency(point.amount)}</p>
      <p>Share: {point.percentage.toFixed(1)}%</p>
    </div>
  );
};

const Analytics = () => {
  const { transactions, fetchTransactions, loading, error } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const expenseCategoryData = useMemo(
    () =>
      calculatePercentagePerCategory(transactions).map((item) => ({
        category: item.category,
        amount: item.amount,
        percentage: item.percentage,
      })),
    [transactions]
  );

  const monthlyExpenseData = useMemo(
    () => groupTransactionsByMonth(transactions, { type: 'expense', limit: 8 }),
    [transactions]
  );

  const incomeExpenseData = useMemo(() => {
    const totalIncome = sumByType(transactions, 'income');
    const totalExpense = sumByType(transactions, 'expense');

    return [
      { label: 'Income', total: totalIncome },
      { label: 'Expense', total: totalExpense },
    ];
  }, [transactions]);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (!transactions.length) {
    return <div className="loading">Add transactions to unlock analytics.</div>;
  }

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>

      {expenseCategoryData.length > 0 && (
        <div className="chart-container">
          <h3>Expense Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} (${percentage.toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {monthlyExpenseData.length > 0 && (
        <div className="chart-container">
          <h3>Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyExpenseData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="total" fill="#ef5350" name="Expenses" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {incomeExpenseData.length > 0 && (
        <div className="chart-container">
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={incomeExpenseData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="total" name="Amount" radius={[6, 6, 0, 0]}>
                {incomeExpenseData.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.label === 'Income' ? '#48c774' : '#ef5350'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Insights transactions={transactions} />
    </div>
  );
};

export default Analytics;
