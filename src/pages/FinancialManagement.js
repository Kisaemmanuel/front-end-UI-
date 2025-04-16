import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinancialManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('income');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Income state
  const [incomeForm, setIncomeForm] = useState({
    date: '',
    source: 'daycare',
    sessionType: 'full-day',
    amount: '',
    description: ''
  });

  // Expense state
  const [expenseForm, setExpenseForm] = useState({
    date: '',
    category: 'salaries',
    amount: '',
    description: ''
  });

  // Budget state
  const [budgetForm, setBudgetForm] = useState({
    category: 'salaries',
    amount: '',
    period: 'monthly'
  });

  // Sample data (replace with actual data from backend)
  const [financialData, setFinancialData] = useState({
    income: [
      { date: '2024-03-01', source: 'daycare', sessionType: 'full-day', amount: 50000, description: 'Parent payment' },
      { date: '2024-03-01', source: 'daycare', sessionType: 'half-day', amount: 20000, description: 'Parent payment' }
    ],
    expenses: [
      { date: '2024-03-01', category: 'salaries', amount: 30000, description: 'Babysitter payment' },
      { date: '2024-03-01', category: 'materials', amount: 15000, description: 'Toys purchase' }
    ],
    budgets: [
      { category: 'salaries', amount: 100000, period: 'monthly' },
      { category: 'materials', amount: 50000, period: 'monthly' }
    ]
  });

  // Add new state for alerts
  const [alerts, setAlerts] = useState([]);

  // Add new state for modal
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const newIncome = {
      ...incomeForm,
      amount: parseFloat(incomeForm.amount)
    };
    setFinancialData(prev => ({
      ...prev,
      income: [...prev.income, newIncome]
    }));
    setIncomeForm({
      date: '',
      source: 'daycare',
      sessionType: 'full-day',
      amount: '',
      description: ''
    });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      ...expenseForm,
      amount: parseFloat(expenseForm.amount)
    };
    setFinancialData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
    setExpenseForm({
      date: '',
      category: 'salaries',
      amount: '',
      description: ''
    });
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const newBudget = {
      ...budgetForm,
      amount: parseFloat(budgetForm.amount)
    };
    setFinancialData(prev => ({
      ...prev,
      budgets: [...prev.budgets, newBudget]
    }));
    setBudgetForm({
      category: 'salaries',
      amount: '',
      period: 'monthly'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Calculate financial metrics
  const calculateMetrics = () => {
    const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = financialData.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    
    const categoryExpenses = financialData.expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      categoryExpenses
    };
  };

  const metrics = calculateMetrics();

  // Chart data
  const incomeChartData = {
    labels: financialData.income.map(item => item.date),
    datasets: [{
      label: 'Income',
      data: financialData.income.map(item => item.amount),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const expenseChartData = {
    labels: Object.keys(metrics.categoryExpenses),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(metrics.categoryExpenses),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Add function to check budget thresholds
  const checkBudgetThresholds = () => {
    const newAlerts = [];
    financialData.budgets.forEach(budget => {
      const actualSpending = financialData.expenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const percentageUsed = (actualSpending / budget.amount) * 100;
      
      if (percentageUsed >= 90) {
        newAlerts.push({
          category: budget.category,
          message: `Warning: ${budget.category} expenses have reached ${percentageUsed.toFixed(1)}% of budget`,
          severity: percentageUsed >= 100 ? 'high' : 'medium',
          date: new Date().toISOString().split('T')[0]
        });
      }
    });
    setAlerts(newAlerts);
  };

  // Add useEffect to check thresholds when data changes
  useEffect(() => {
    checkBudgetThresholds();
  }, [financialData]);

  // Add function to generate daily summaries
  const generateDailySummaries = () => {
    const summaries = {};
    
    // Group transactions by date
    [...financialData.income, ...financialData.expenses].forEach(transaction => {
      if (!summaries[transaction.date]) {
        summaries[transaction.date] = {
          date: transaction.date,
          income: 0,
          expenses: 0,
          transactions: []
        };
      }
      
      if ('source' in transaction) { // Income transaction
        summaries[transaction.date].income += transaction.amount;
      } else { // Expense transaction
        summaries[transaction.date].expenses += transaction.amount;
      }
      
      summaries[transaction.date].transactions.push(transaction);
    });
    
    return Object.values(summaries).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const dailySummaries = generateDailySummaries();

  // Add function to handle view details click
  const handleViewDetails = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Add function to get transactions for selected date
  const getTransactionsForDate = (date) => {
    const income = financialData.income.filter(t => t.date === date);
    const expenses = financialData.expenses.filter(t => t.date === date);
    return { income, expenses };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Financial Management</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/manager')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('income')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'income'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Income Tracking
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'expenses'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expense Tracking
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'budget'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Budgeting
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'reports'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Financial Reports
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Income Tracking */}
            {activeTab === 'income' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Income Tracking</h2>
                <form onSubmit={handleIncomeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={incomeForm.date}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Source</label>
                      <select
                        name="source"
                        value={incomeForm.source}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, source: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="daycare">Daycare Services</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session Type</label>
                      <select
                        name="sessionType"
                        value={incomeForm.sessionType}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, sessionType: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="full-day">Full Day (5,000 UGX)</option>
                        <option value="half-day">Half Day (2,000 UGX)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={incomeForm.amount}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={incomeForm.description}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Add Income Record
                  </button>
                </form>

                {/* Income Records */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Income Records</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financialData.income.map((record, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.source}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.sessionType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.amount.toLocaleString()} UGX</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Expense Tracking */}
            {activeTab === 'expenses' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Expense Tracking</h2>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="salaries">Babysitter Salaries</option>
                        <option value="materials">Toys and Materials</option>
                        <option value="maintenance">Maintenance and Repairs</option>
                        <option value="utilities">Utility Bills</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Add Expense Record
                  </button>
                </form>

                {/* Expense Records */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Expense Records</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financialData.expenses.map((record, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.amount.toLocaleString()} UGX</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Budgeting */}
            {activeTab === 'budget' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Budget Management</h2>
                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={budgetForm.category}
                        onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="salaries">Babysitter Salaries</option>
                        <option value="materials">Toys and Materials</option>
                        <option value="maintenance">Maintenance and Repairs</option>
                        <option value="utilities">Utility Bills</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={budgetForm.amount}
                        onChange={(e) => setBudgetForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Period</label>
                      <select
                        name="period"
                        value={budgetForm.period}
                        onChange={(e) => setBudgetForm(prev => ({ ...prev, period: e.target.value }))}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Set Budget
                  </button>
                </form>

                {/* Budget Records */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Current Budgets</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financialData.budgets.map((budget, index) => {
                          const spent = financialData.expenses
                            .filter(expense => expense.category === budget.category)
                            .reduce((sum, expense) => sum + expense.amount, 0);
                          const remaining = budget.amount - spent;
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{budget.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{budget.amount.toLocaleString()} UGX</td>
                              <td className="px-6 py-4 whitespace-nowrap">{budget.period}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{spent.toLocaleString()} UGX</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  remaining >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {remaining.toLocaleString()} UGX
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Reports */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Financial Reports</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
                    <p className="text-3xl font-bold text-green-600">{metrics.totalIncome.toLocaleString()} UGX</p>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-600">{metrics.totalExpenses.toLocaleString()} UGX</p>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Net Income</h3>
                    <p className={`text-3xl font-bold ${
                      metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metrics.netIncome.toLocaleString()} UGX
                    </p>
                  </div>
                </div>

                {/* Daily Transaction Summaries */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Transaction Summaries</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Income</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Expenses</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dailySummaries.map((summary, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{summary.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600">
                              {summary.income.toLocaleString()} UGX
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-red-600">
                              {summary.expenses.toLocaleString()} UGX
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                (summary.income - summary.expenses) >= 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {(summary.income - summary.expenses).toLocaleString()} UGX
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleViewDetails(summary.date)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Budget Threshold Alerts */}
                {alerts.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Threshold Alerts</h3>
                    <div className="space-y-4">
                      {alerts.map((alert, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg ${
                            alert.severity === 'high' 
                              ? 'bg-red-50 border border-red-200' 
                              : 'bg-yellow-50 border border-yellow-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 ${
                              alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className={`text-sm font-medium ${
                                alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
                              }`}>
                                {alert.category}
                              </h4>
                              <p className={`text-sm ${
                                alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
                              }`}>
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {alert.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget vs Actual Report */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Budget vs Actual Spending</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budgeted Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Spending</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Budget Used</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financialData.budgets.map((budget, index) => {
                          const actualSpending = financialData.expenses
                            .filter(expense => expense.category === budget.category)
                            .reduce((sum, expense) => sum + expense.amount, 0);
                          const variance = budget.amount - actualSpending;
                          const percentageUsed = (actualSpending / budget.amount) * 100;
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{budget.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{budget.amount.toLocaleString()} UGX</td>
                              <td className="px-6 py-4 whitespace-nowrap">{actualSpending.toLocaleString()} UGX</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  variance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {variance.toLocaleString()} UGX
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        percentageUsed <= 80 ? 'bg-green-600' : 
                                        percentageUsed <= 100 ? 'bg-yellow-500' : 'bg-red-600'
                                      }`}
                                      style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm text-gray-600">
                                    {percentageUsed.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Income Trend</h3>
                    <Line data={incomeChartData} />
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Distribution</h3>
                    <Pie data={expenseChartData} />
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Export Reports</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {/* Add export to PDF functionality */}}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Export to PDF
                    </button>
                    <button
                      onClick={() => {/* Add export to CSV functionality */}}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Export to CSV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Details Modal */}
        {showModal && selectedDate && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Transaction Details for {selectedDate}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Income Section */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-green-700 mb-2">Income</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getTransactionsForDate(selectedDate).income.map((transaction, index) => (
                          <tr key={`income-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.source}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.sessionType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600">
                              {transaction.amount.toLocaleString()} UGX
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h4 className="text-md font-medium text-red-700 mb-2">Expenses</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getTransactionsForDate(selectedDate).expenses.map((transaction, index) => (
                          <tr key={`expense-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-red-600">
                              {transaction.amount.toLocaleString()} UGX
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Total Income</p>
                      <p className="text-2xl font-semibold text-green-600">
                        {getTransactionsForDate(selectedDate).income.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} UGX
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-red-800">Total Expenses</p>
                      <p className="text-2xl font-semibold text-red-600">
                        {getTransactionsForDate(selectedDate).expenses.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} UGX
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      getTransactionsForDate(selectedDate).income.reduce((sum, t) => sum + t.amount, 0) -
                      getTransactionsForDate(selectedDate).expenses.reduce((sum, t) => sum + t.amount, 0) >= 0
                        ? 'bg-green-50'
                        : 'bg-red-50'
                    }`}>
                      <p className="text-sm font-medium">Net Amount</p>
                      <p className={`text-2xl font-semibold ${
                        getTransactionsForDate(selectedDate).income.reduce((sum, t) => sum + t.amount, 0) -
                        getTransactionsForDate(selectedDate).expenses.reduce((sum, t) => sum + t.amount, 0) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {(getTransactionsForDate(selectedDate).income.reduce((sum, t) => sum + t.amount, 0) -
                          getTransactionsForDate(selectedDate).expenses.reduce((sum, t) => sum + t.amount, 0)).toLocaleString()} UGX
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialManagement; 