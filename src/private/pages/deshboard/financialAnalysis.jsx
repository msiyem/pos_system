import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  RefreshCw,
  Target,
  Award,
  Activity,
  PieChart as PieIcon,
  CreditCard,
  TrendingUpIcon,
  Calculator,
  AlertCircle,
  PiggyBank,
  Zap,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import api from '../../../api/api';
import Loading from '../../component/Loading';

export default function FinancialAnalysis() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().setDate(new Date().getDate() - 28))
      .toISOString()
      .split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });

  const [analysisData, setAnalysisData] = useState(null);

  const fetchFinancialAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/financial-analysis', {
        params: {
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
        },
      });

      setAnalysisData(response.data.data);
      console.log('Financial Analysis Data:', response.data.data);
    } catch (error) {
      console.error('Error fetching financial analysis:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchFinancialAnalysis();
  }, [fetchFinancialAnalysis]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Chart Data Preparation
  const getPaymentMethodsData = () => {
    if (!analysisData?.payment_methods) return [];
    const methods = analysisData.payment_methods;
    return Object.keys(methods).map((key) => ({
      name: key.replace('_', ' ').toUpperCase(),
      value: parseFloat(methods[key].amount),
      fill: getColorByMethod(key),
    }));
  };

  const getExpenseBreakdownData = () => {
    if (!analysisData?.operating_expenses) return [];
    const expenses = analysisData.operating_expenses;
    return [
      {
        name: 'Salary',
        value: parseFloat(expenses.salary_expenses),
        fill: '#3b82f6',
      },
      {
        name: 'Rent',
        value: parseFloat(expenses.rent_expenses),
        fill: '#8b5cf6',
      },
      {
        name: 'Utilities',
        value: parseFloat(expenses.utility_expenses),
        fill: '#10b981',
      },
      {
        name: 'Other',
        value: parseFloat(expenses.other_expenses),
        fill: '#f59e0b',
      },
    ];
  };

  const getProfitTrendData = () => {
    if (!analysisData) return [];
    const data = analysisData;
    return [
      {
        name: 'Gross Profit',
        value: parseFloat(data.gross_profit_analysis?.gross_profit || 0),
      },
      {
        name: 'Operating Exp',
        value: parseFloat(
          data.profitability_metrics?.total_operating_expenses || 0
        ),
      },
      {
        name: 'Net Profit',
        value: parseFloat(data.profitability_metrics?.net_profit || 0),
      },
    ];
  };

  const getColorByMethod = (method) => {
    const colors = {
      cash: '#10b981',
      card: '#3b82f6',
      cheque: '#f59e0b',
      mobile_banking: '#8b5cf6',
      bank_transfer: '#ec4899',
    };
    return colors[method] || '#6b7280';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col gap-5 m-3 no-scrollbar overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[18px] font-semibold">Financial Analysis</span>
        <span className="text-gray-600">
          Comprehensive financial performance and profitability insights
        </span>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-5 items-end bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">From Date</label>
          <input
            type="date"
            value={dateRange.fromDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, fromDate: e.target.value })
            }
            className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">To Date</label>
          <input
            type="date"
            value={dateRange.toDate}
            min={dateRange.fromDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, toDate: e.target.value })
            }
            className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={fetchFinancialAnalysis}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
        >
          Apply
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300">
        <div className="flex gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'profitability', label: 'Profitability', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses', icon: Calculator },
            { id: 'payment', label: 'Payment Methods', icon: CreditCard },
            { id: 'receivables', label: 'Receivables', icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-2 font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6">
            {/* Top Section - Revenue Overview (Full Width) */}
            <div className="mb-8">
              <h3 className="text-[16px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />
                Revenue Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Total Revenue
                    </p>
                    <TrendingUp className="text-green-600" size={18} />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mt-3">
                    {formatCurrency(
                      analysisData?.revenue_analysis?.total_revenue || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Period total earnings
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Total Transactions
                    </p>
                    <Activity className="text-blue-600" size={18} />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mt-3">
                    {analysisData?.revenue_analysis?.total_transactions || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Number of transactions
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Avg Transaction
                    </p>
                    <Award className="text-purple-600" size={18} />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mt-3">
                    {formatCurrency(
                      analysisData?.revenue_analysis?.avg_transaction_value || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Per transaction value
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Unique Customers
                    </p>
                    <PiggyBank className="text-orange-600" size={18} />
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mt-3">
                    {analysisData?.revenue_analysis?.unique_customers || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Active customers</p>
                </div>
              </div>
            </div>

            {/* Main Section - Profit Overview Left, Metrics Right */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Left Section - Profit Comparison Chart */}
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUpIcon size={20} className="text-blue-600" />
                    Profit Analysis
                  </h3>

                  <div className="flex-1 flex items-center justify-center min-h-[280px]">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={getProfitTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#3b82f6"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 space-y-3 pt-6 border-t border-gray-300">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors">
                      <span className="text-sm font-medium text-gray-700">
                        Gross Profit Margin
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {
                          analysisData?.gross_profit_analysis
                            ?.gross_profit_margin
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors">
                      <span className="text-sm font-medium text-gray-700">
                        Net Profit Margin
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {
                          analysisData?.profitability_metrics
                            ?.net_profit_margin_percent
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors">
                      <span className="text-sm font-medium text-gray-700">
                        Operating Expense Ratio
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {
                          analysisData?.profitability_metrics
                            ?.operating_expense_ratio
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Key Financial Metrics */}
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6 h-full shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calculator size={20} className="text-orange-600" />
                    Financial Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <p className="text-sm text-gray-600 font-medium">
                        Gross Profit
                      </p>
                      <p className="text-3xl font-bold text-green-600 mt-2">
                        {formatCurrency(
                          analysisData?.gross_profit_analysis?.gross_profit || 0
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Sales - Cost of Goods
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <p className="text-sm text-gray-600 font-medium">
                        Total Expenses
                      </p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        {formatCurrency(
                          analysisData?.profitability_metrics
                            ?.total_operating_expenses || 0
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Operating expenses
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <p className="text-sm text-gray-600 font-medium">
                        Net Profit
                      </p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">
                        {formatCurrency(
                          analysisData?.profitability_metrics?.net_profit || 0
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Bottom line</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <p className="text-sm text-gray-600 font-medium">
                        Cash Collected
                      </p>
                      <p className="text-3xl font-bold text-indigo-600 mt-2">
                        {formatCurrency(
                          analysisData?.receivables_analysis?.cash_collected ||
                            0
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Collection efficiency:{' '}
                        {
                          analysisData?.receivables_analysis
                            ?.collection_efficiency
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profitability Tab */}
        {activeTab === 'profitability' && (
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* COGS vs Profit */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">
                  COGS vs Profit
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'COGS',
                          value: parseFloat(
                            analysisData?.gross_profit_analysis?.total_cogs || 0
                          ),
                          fill: '#ef4444',
                        },
                        {
                          name: 'Gross Profit',
                          value: parseFloat(
                            analysisData?.gross_profit_analysis?.gross_profit ||
                              0
                          ),
                          fill: '#10b981',
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={85}
                      innerRadius={45}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {[
                        {
                          name: 'COGS',
                          value: parseFloat(
                            analysisData?.gross_profit_analysis?.total_cogs || 0
                          ),
                          fill: '#ef4444',
                        },
                        {
                          name: 'Gross Profit',
                          value: parseFloat(
                            analysisData?.gross_profit_analysis?.gross_profit ||
                              0
                          ),
                          fill: '#10b981',
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3 pt-6 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Total Units Sold
                    </span>
                    <span className="font-bold text-gray-900">
                      {analysisData?.gross_profit_analysis?.total_units_sold}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Avg Selling Price/Unit
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        analysisData?.gross_profit_analysis
                          ?.avg_selling_price_per_unit || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Avg COGS/Unit
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        analysisData?.gross_profit_analysis
                          ?.avg_cogs_per_unit || 0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profitability Metrics */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Gross Sales
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatCurrency(
                      analysisData?.gross_profit_analysis?.gross_sales || 0
                    )}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Net Profit
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {formatCurrency(
                      analysisData?.profitability_metrics?.net_profit || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Total profit after all expenses
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Products Sold
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {analysisData?.gross_profit_analysis?.num_products_sold}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Avg Revenue Per Customer
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {formatCurrency(
                      analysisData?.revenue_analysis
                        ?.avg_revenue_per_customer || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Expense Breakdown Pie Chart */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">
                  Expense Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getExpenseBreakdownData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={85}
                      innerRadius={45}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {getExpenseBreakdownData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3 pt-6 border-t border-gray-300">
                  {getExpenseBreakdownData().map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Details */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Total Expenses
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {formatCurrency(
                      analysisData?.operating_expenses?.total_expenses || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {analysisData?.operating_expenses?.expense_categories}{' '}
                    expense categories
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Salary Expenses
                  </p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {formatCurrency(
                      analysisData?.operating_expenses?.salary_expenses || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {
                      analysisData?.operating_expenses?.expense_breakdown
                        ?.salary_percent
                    }
                    %
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Rent Expenses
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {formatCurrency(
                      analysisData?.operating_expenses?.rent_expenses || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {
                      analysisData?.operating_expenses?.expense_breakdown
                        ?.rent_percent
                    }
                    %
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Utility Expenses
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatCurrency(
                      analysisData?.operating_expenses?.utility_expenses || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {
                      analysisData?.operating_expenses?.expense_breakdown
                        ?.utilities_percent
                    }
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payment' && (
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Payment Methods Pie Chart */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">
                  Payment Method Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getPaymentMethodsData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={85}
                      innerRadius={45}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {getPaymentMethodsData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Method Details */}
              <div className="space-y-4">
                {Object.keys(analysisData?.payment_methods || {}).map(
                  (method, idx) => {
                    const data = analysisData.payment_methods[method];
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg p-5 bg-gradient-to-br ${getPaymentMethodStyle(method)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600 font-medium">
                            {method.replace('_', ' ').toUpperCase()}
                          </p>
                          <span className="text-xs font-bold text-gray-700">
                            {(
                              (parseFloat(data.amount) /
                                parseFloat(
                                  analysisData?.revenue_analysis
                                    ?.total_revenue || 1
                                )) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {formatCurrency(data.amount)}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          {data.transactions} transactions • Avg:{' '}
                          {formatCurrency(data.avg_transaction)}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* Receivables Tab */}
        {activeTab === 'receivables' && (
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Receivables Overview */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Cash Collected
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatCurrency(
                      analysisData?.receivables_analysis?.cash_collected || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Collection rate:{' '}
                    {analysisData?.revenue_analysis?.cash_collection_rate}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Outstanding Receivables
                  </p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {formatCurrency(
                      analysisData?.receivables_analysis
                        ?.outstanding_receivables || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Amount due from customers
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Customers with Outstanding
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {
                      analysisData?.receivables_analysis
                        ?.customers_with_outstanding
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Overdue 30+ days:{' '}
                    {analysisData?.receivables_analysis?.overdue_count_30days}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 font-medium">
                    Collection Efficiency
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {parseFloat(
                      analysisData?.receivables_analysis
                        ?.collection_efficiency || 0
                    ).toFixed(2)}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Days since oldest:{' '}
                    {analysisData?.receivables_analysis?.days_since_oldest_due}{' '}
                    days
                  </p>
                </div>
              </div>

              {/* Receivables Chart and Details */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">
                  Collection vs Outstanding
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'Collected',
                          value: parseFloat(
                            analysisData?.receivables_analysis
                              ?.cash_collected || 0
                          ),
                          fill: '#10b981',
                        },
                        {
                          name: 'Outstanding',
                          value: parseFloat(
                            analysisData?.receivables_analysis
                              ?.outstanding_receivables || 0
                          ),
                          fill: '#ef4444',
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={85}
                      innerRadius={45}
                      dataKey="value"
                    >
                      {[
                        {
                          name: 'Collected',
                          fill: '#10b981',
                        },
                        {
                          name: 'Outstanding',
                          fill: '#ef4444',
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 space-y-3 pt-6 border-t border-gray-300">
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      Avg Outstanding/Transaction
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        analysisData?.receivables_analysis
                          ?.avg_outstanding_per_transaction || 0
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      Total Due
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        analysisData?.revenue_analysis?.total_due_amount || 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for payment method styling
function getPaymentMethodStyle(method) {
  const styles = {
    cash: 'from-green-50 to-green-100 border-green-200',
    card: 'from-blue-50 to-blue-100 border-blue-200',
    cheque: 'from-yellow-50 to-yellow-100 border-yellow-200',
    mobile_banking: 'from-purple-50 to-purple-100 border-purple-200',
    bank_transfer: 'from-pink-50 to-pink-100 border-pink-200',
    bkash: 'from-purple-50 to-purple-100 border-purple-200',
    nagad: 'from-red-50 to-red-100 border-red-200',
    due: 'from-orange-50 to-orange-100 border-orange-200',
  };
  return styles[method] || 'from-gray-50 to-gray-100 border-gray-200';
}
