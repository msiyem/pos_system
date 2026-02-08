import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Activity,
  Target,
  Award,
  Zap,
  ShoppingCart,
  Calendar,
  Clock,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../../api/api';
import Loading from '../../component/Loading';
import SummaryCard from '../../component/SummaryCard';
import DataTable from '../../component/DataTable';
import PageLoader from '../../../ui/PageLoader';

export default function CustomersAnalysis() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });

  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  const fetchCustomerAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        '/dashboard/customer-analysis/comprehensive',
        {
          params: {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
          },
        }
      );

      setAnalysisData(response.data?.data || null);
      console.log('Customer Analysis Data:', response.data?.data);
    } catch (err) {
      setError('Failed to fetch customer analysis data. Please try again.');
      console.error('Error fetching customer analysis:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchCustomerAnalysis();
  }, [fetchCustomerAnalysis]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const getSegmentColor = (segment) => {
    const colors = {
      VIP: 'text-purple-600 bg-purple-50 border-purple-200',
      Regular: 'text-blue-600 bg-blue-50 border-blue-200',
      'One-Time': 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[segment] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getOverdueBucketColor = (bucket) => {
    const colors = {
      '0-30 days': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      '31-60 days': 'text-orange-600 bg-orange-50 border-orange-200',
      '61-90 days': 'text-red-600 bg-red-50 border-red-200',
      '90+ days': 'text-red-700 bg-red-100 border-red-300',
    };
    return colors[bucket] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const segmentationChartData = useMemo(() => {
    if (!analysisData?.segmentation) return [];

    const segmentTotals = analysisData.segmentation.reduce((acc, item) => {
      if (!acc[item.segment]) {
        acc[item.segment] = {
          segment: item.segment,
          count: 0,
          revenue: 0,
        };
      }
      acc[item.segment].count += parseInt(item.customer_count);
      acc[item.segment].revenue += parseFloat(item.segment_revenue);
      return acc;
    }, {});

    return Object.values(segmentTotals).map((item) => ({
      name: item.segment,
      value: item.count,
      revenue: item.revenue,
      fill:
        {
          VIP: '#9333ea',
          Regular: '#3b82f6',
          'One-Time': '#6b7280',
        }[item.segment] || '#6b7280',
    }));
  }, [analysisData]);

  const topCustomersChartData = useMemo(() => {
    if (!analysisData?.top_customers) return [];
    return analysisData.top_customers.slice(0, 5).map((customer) => ({
      name: customer.customer_name.substring(0, 12),
      revenue: parseFloat(customer.total_revenue),
      paid: parseFloat(customer.total_paid),
      due: parseFloat(customer.total_due),
    }));
  }, [analysisData]);

  const overdueBucketData = useMemo(() => {
    if (!analysisData?.long_due_customers) return [];

    const buckets = analysisData.long_due_customers.reduce((acc, customer) => {
      const bucket = customer.overdue_bucket;
      if (!acc[bucket]) {
        acc[bucket] = { bucket, count: 0, amount: 0 };
      }
      acc[bucket].count += 1;
      acc[bucket].amount += parseFloat(customer.total_due);
      return acc;
    }, {});

    return Object.values(buckets).map((item) => ({
      name: item.bucket,
      count: item.count,
      amount: item.amount,
    }));
  }, [analysisData]);

  const topCustomersColumns = [
    {
      key: 'customer_name',
      label: 'Customer',
      render: (row) => (
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{row.customer_name}</span>
          <span className="text-xs text-gray-500">{row.phone}</span>
        </div>
      ),
    },
    {
      key: 'total_purchases',
      label: 'Purchases',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <ShoppingCart size={14} className="text-gray-500" />
          <span className="font-semibold">{row.total_purchases}</span>
        </div>
      ),
    },
    {
      key: 'total_revenue',
      label: 'Total Revenue',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.total_revenue)}
        </span>
      ),
    },
    {
      key: 'total_paid',
      label: 'Paid',
      render: (row) => (
        <span className="font-semibold text-blue-600">
          {formatCurrency(row.total_paid)}
        </span>
      ),
    },
    {
      key: 'total_due',
      label: 'Due',
      render: (row) => (
        <span
          className={`font-semibold ${parseFloat(row.total_due) > 0 ? 'text-red-600' : 'text-green-600'}`}
        >
          {formatCurrency(row.total_due)}
        </span>
      ),
    },
    {
      key: 'avg_order_value',
      label: 'Avg Order',
      render: (row) => (
        <span className="font-semibold text-purple-600">
          {formatCurrency(row.avg_order_value)}
        </span>
      ),
    },
  ];

  
  const longDueColumns = [
    {
      key: 'customer_name',
      label: 'Customer',
      render: (row) => (
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{row.customer_name}</span>
          <span className="text-xs text-gray-500">{row.phone}</span>
        </div>
      ),
    },
    {
      key: 'total_due',
      label: 'Due Amount',
      render: (row) => (
        <span className="font-semibold text-red-600">
          {formatCurrency(row.total_due)}
        </span>
      ),
    },
    {
      key: 'days_overdue',
      label: 'Days Overdue',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <Clock size={14} className="text-orange-500" />
          <span className="font-semibold">{row.days_overdue}</span>
        </div>
      ),
    },
    {
      key: 'overdue_bucket',
      label: 'Status',
      render: (row) => (
        <div
          className={`px-3 py-1 rounded-full border text-xs font-semibold ${getOverdueBucketColor(row.overdue_bucket)}`}
        >
          {row.overdue_bucket}
        </div>
      ),
    },
    {
      key: 'oldest_due_date',
      label: 'Oldest Due',
      render: (row) => (
        <span className="text-xs text-gray-600">
          {formatDate(row.oldest_due_date)}
        </span>
      ),
    },
  ];


  const recentActivityColumns = [
    {
      key: 'customer_name',
      label: 'Customer',
      render: (row) => (
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{row.customer_name}</span>
          <span className="text-xs text-gray-500">{row.invoice_no}</span>
        </div>
      ),
    },
    {
      key: 'total_amount',
      label: 'Total',
      render: (row) => (
        <span className="font-semibold">
          {formatCurrency(row.total_amount)}
        </span>
      ),
    },
    {
      key: 'paid_amount',
      label: 'Paid',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.paid_amount)}
        </span>
      ),
    },
    {
      key: 'due_amount',
      label: 'Due',
      render: (row) =>
        parseFloat(row.due_amount) > 0 ? (
          <span className="font-semibold text-red-600">
            {formatCurrency(row.due_amount)}
          </span>
        ) : (
          <span className="text-green-600 font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 size={16} /> Paid
          </span>
        ),
    },
    {
      key: 'payment_method',
      label: 'Method',
      render: (row) => (
        <span className="text-xs font-medium capitalize bg-gray-100 px-2 py-1 rounded">
          {row.payment_method?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'transaction_date',
      label: 'Date',
      render: (row) => (
        <span className="text-xs text-gray-600">
          {formatDate(row.transaction_date)}
        </span>
      ),
    },
    {
      key: 'served_by',
      label: 'Served By',
      render: (row) => (
        <span className="text-xs text-gray-600">{row.served_by}</span>
      ),
    },
  ];

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCustomerAnalysis}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="w-full flex items-center justify-center p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 m-3 no-scrollbar overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-bold text-gray-900">
          Customer Analysis
        </h1>
        <p className="text-sm text-gray-600">
          Comprehensive customer performance, segmentation, and activity
          insights
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-5 items-end bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex-wrap">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">From Date</label>
          <input
            type="date"
            value={dateRange.fromDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, fromDate: e.target.value })
            }
            className="border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">To Date</label>
          <input
            type="date"
            value={dateRange.toDate}
            min={dateRange.fromDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, toDate: e.target.value })
            }
            className="border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={fetchCustomerAnalysis}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2 shadow-sm"
        >
          <RefreshCw size={16} />
          Apply Filter
        </button>
      </div>

      {/* Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Users}
          title="Total Customers"
          value={analysisData?.overview?.total_customers || 0}
          color="text-blue-600"
        />
        <SummaryCard
          icon={UserCheck}
          title="Active Customers"
          value={analysisData?.overview?.active_customers || 0}
          color="text-green-600"
        />
        <SummaryCard
          icon={Target}
          title="New Customers"
          value={analysisData?.overview?.new_customers || 0}
          color="text-purple-600"
        />
        <SummaryCard
          icon={AlertCircle}
          title="Customers with Dues"
          value={analysisData?.overview?.customers_with_dues || 0}
          color="text-red-600"
        />
        <SummaryCard
          icon={DollarSign}
          title="Total Revenue"
          value={formatCurrency(analysisData?.overview?.total_revenue)}
          color="text-emerald-600"
        />
        <SummaryCard
          icon={CreditCard}
          title="Outstanding Amount"
          value={formatCurrency(analysisData?.overview?.total_outstanding)}
          color="text-orange-600"
        />
        <SummaryCard
          icon={ShoppingCart}
          title="Total Transactions"
          value={analysisData?.overview?.total_transactions || 0}
          color="text-indigo-600"
        />
        <SummaryCard
          icon={Calendar}
          title="Analysis Period"
          value={`${analysisData?.period?.days || 0} days`}
          color="text-teal-600"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-300">
        <div className="flex gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'topCustomers', label: 'Top Customers', icon: Award },
            { id: 'segmentation', label: 'Segmentation', icon: Users },
            { id: 'dues', label: 'Long Due', icon: AlertCircle },
            { id: 'activity', label: 'Recent Activity', icon: Activity },
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Customer Segmentation Chart */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Zap className="text-yellow-600" size={20} />
                  Customer Segmentation
                </h3>
                {segmentationChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={segmentationChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name} (${entry.value})`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {segmentationChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} customers (${formatCurrency(props.payload.revenue)})`,
                          'Count',
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No segmentation data available
                  </div>
                )}
              </div>

              {/* Top Customers Revenue Chart */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={20} />
                  Top 5 Customers Revenue
                </h3>
                {topCustomersChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topCustomersChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        name="Revenue"
                      />
                      <Bar
                        dataKey="paid"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                        name="Paid"
                      />
                      <Bar
                        dataKey="due"
                        fill="#ef4444"
                        radius={[8, 8, 0, 0]}
                        name="Due"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No customer data available
                  </div>
                )}
              </div>
            </div>

            {/* Overdue Bucket Distribution */}
            {overdueBucketData.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Clock className="text-orange-600" size={20} />
                  Overdue Distribution by Age
                </h3>
                <ResponsiveContainer width="100%" height={250} >
                  <BarChart data={overdueBucketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name) =>
                        name === 'Count' ? value : formatCurrency(value)
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#f59e0b"
                      radius={[8, 8, 0, 0]}
                      name="Count"
                    />
                    <Bar
                      dataKey="amount"
                      fill="#ef4444"
                      radius={[8, 8, 0, 0]}
                      name="Amount"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Top Customers Tab */}
        {activeTab === 'topCustomers' && (
          <div className="p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Award className="text-green-600" size={20} />
                Top Customers by Revenue
              </h3>
              <div className="text-sm text-gray-600">
                Showing {analysisData?.top_customers?.length || 0} customers
              </div>
            </div>
            <DataTable
              columns={topCustomersColumns}
              data={analysisData?.top_customers || []}
            />
          </div>
        )}

        {/* Segmentation Tab */}
        {activeTab === 'segmentation' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Users className="text-purple-600" size={20} />
              Customer Segmentation Analysis
            </h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {segmentationChartData.map((segment) => (
                <div
                  key={segment.name}
                  className={`p-5 rounded-lg border-2 ${getSegmentColor(segment.name)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{segment.name}</h4>
                    <Users size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{segment.value}</p>
                    <p className="text-sm opacity-90">Customers</p>
                    <p className="text-lg font-semibold mt-2">
                      {formatCurrency(segment.revenue)}
                    </p>
                    <p className="text-xs opacity-90">Total Revenue</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Segmentation Guide:
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>
                  <strong>VIP:</strong> High-value customers with multiple
                  purchases
                </li>
                <li>
                  <strong>Regular:</strong> Repeat customers with consistent
                  purchases
                </li>
                <li>
                  <strong>One-Time:</strong> Customers with single purchase
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Long Due Customers Tab */}
        {activeTab === 'dues' && (
          <div className="p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle className="text-red-600" size={20} />
                Long Due Customers
              </h3>
              <div className="text-sm text-red-600 font-semibold">
                Total Due:{' '}
                {formatCurrency(
                  analysisData?.long_due_customers?.reduce(
                    (sum, c) => sum + parseFloat(c.total_due),
                    0
                  ) || 0
                )}
              </div>
            </div>
            <DataTable
              columns={longDueColumns}
              data={analysisData?.long_due_customers || []}
            />
          </div>
        )}

        {/* Recent Activity Tab */}
        {activeTab === 'activity' && (
          <div className="p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="text-indigo-600" size={20} />
                Recent Customer Transactions
              </h3>
              <div className="text-sm text-gray-600">
                Last {analysisData?.recent_activity?.length || 0} transactions
              </div>
            </div>
            <DataTable
              columns={recentActivityColumns}
              data={analysisData?.recent_activity || []}
            />
          </div>
        )}
      </div>
    </div>
  );
}
