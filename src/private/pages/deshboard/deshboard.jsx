import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  BarChart3,
  Activity,
  Boxes,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api from '../../../api/api';
import Loading from '../../component/Loading';
import SummaryCard from '../../component/SummaryCard';
import DataTable from '../../component/DataTable';
import EntriesDropdown from '../../component/EntriesDropdown';
import PageLoader from '../../../ui/PageLoader';

export default function Deshboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [daysDropdownOpen, setDaysDropdownOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState(30);
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/main', {
        params: {
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
        },
      });

      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDaysChange = (days) => {
    setSelectedDays(days);
    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - days);

    setDateRange({
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getAlertSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 border-red-300 text-red-800',
      high: 'bg-orange-100 border-orange-300 text-orange-800',
      medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      low: 'bg-blue-100 border-blue-300 text-blue-800',
    };
    return colors[severity] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'overdue_customer':
        return AlertTriangle;
      case 'low_stock':
        return Package;
      case 'out_of_stock':
        return AlertCircle;
      default:
        return AlertTriangle;
    }
  };

  const quickLinks = [
    {
      title: 'Product Analysis',
      description: 'View detailed product performance metrics',
      icon: BarChart3,
      link: '/deshboard/product-analysis',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Customer Analysis',
      description: 'Track customer performance and payment behavior',
      icon: Users,
      link: '/deshboard/customer-analysis',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
    {
      title: 'Inventory Analysis',
      description: 'Monitor stock levels and movements',
      icon: Boxes,
      link: '/deshboard/inventory-analysis',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      title: 'Financial Analysis',
      description: 'Track revenue and financial health',
      icon: Activity,
      link: '/deshboard/financial-analysis',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ];

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
      key: 'total_revenue',
      label: 'Revenue',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.total_revenue)}
        </span>
      ),
    },
    {
      key: 'outstanding_due',
      label: 'Outstanding',
      render: (row) => (
        <span
          className={`font-semibold ${parseFloat(row.outstanding_due) > 0 ? 'text-red-600' : 'text-green-600'}`}
        >
          {formatCurrency(row.outstanding_due)}
        </span>
      ),
    },
  ];

  const topProductsColumns = [
    {
      key: 'product_name',
      label: 'Product',
      render: (row) => (
        <span className="font-medium text-sm">{row.product_name}</span>
      ),
    },
    {
      key: 'units_sold',
      label: 'Units Sold',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <ShoppingCart size={14} className="text-gray-500" />
          <span className="font-semibold">{row.units_sold}</span>
        </div>
      ),
    },
    {
      key: 'total_revenue',
      label: 'Revenue',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.total_revenue)}
        </span>
      ),
    },
    {
      key: 'stock_status',
      label: 'Stock',
      render: (row) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            row.stock_status === 'In Stock'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.stock_status}
        </span>
      ),
    },
  ];

  const recentTransactionsColumns = [
    {
      key: 'transaction_id',
      label: 'Invoice',
      render: (row) => (
        <span className="font-medium text-sm">{row.transaction_id}</span>
      ),
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (row) => (
        <span className="text-sm text-gray-700">{row.customer_name}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Total',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'paid_amount',
      label: 'Paid',
      render: (row) => (
        <span className="font-semibold text-blue-600">
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
            <CheckCircle2 size={14} /> Paid
          </span>
        ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => {
        // Try multiple possible date field names
        const dateValue =
          row.date ||
          row.transaction_date ||
          row.created_at ||
          row.order_date ||
          row.date_time;
        return (
          <span className="text-xs text-gray-600">{formatDate(dateValue)}</span>
        );
      },
    },
  ];

  // Check if we're on a child route under /deshboard
  const isChildRoute = location.pathname.startsWith('/deshboard/');

  // If we're on a child route, only show the Outlet
  if (isChildRoute) {
    return <Outlet />;
  }

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData?.data || dashboardData;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header with Date Range */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your business overview.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-4 items-end mt-4 bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, fromDate: e.target.value })
              }
              className="border rounded px-2 py-1 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={dateRange.toDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, toDate: e.target.value })
              }
              className="border rounded px-2 py-1 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Days Dropdown */}
          <div className="ml-auto">
            <EntriesDropdown
              value={selectedDays}
              options={[1, 3, 7, 15, 30, 60]}
              onChange={handleDaysChange}
              open={daysDropdownOpen}
              setOpen={setDaysDropdownOpen}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={DollarSign}
          title="Total Revenue"
          value={formatCurrency(data?.key_metrics?.total_revenue)}
          color="text-green-600"
        />
        <SummaryCard
          icon={CreditCard}
          title="Outstanding"
          value={formatCurrency(data?.key_metrics?.total_outstanding)}
          color="text-red-600"
        />
        <SummaryCard
          icon={Users}
          title="Total Customers"
          value={data?.key_metrics?.total_customers || 0}
          color="text-blue-600"
        />
        <SummaryCard
          icon={ShoppingCart}
          title="Total Transactions"
          value={data?.key_metrics?.total_transactions || 0}
          color="text-purple-600"
        />
      </div>

      {/* Today's Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Today's Cash</p>
            <DollarSign size={18} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(data?.key_metrics?.today_cash)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Cash payments received</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Today's Credit</p>
            <CreditCard size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(data?.key_metrics?.today_credit)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Credit sales</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Today's Profit</p>
            <TrendingUp size={18} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(data?.key_metrics?.today_profit)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Net profit</p>
        </div>
      </div>

      {/* Critical Alerts Section */}
      {data?.critical_alerts && data.critical_alerts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Critical Alerts ({data.critical_alerts.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.critical_alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.alert_type);
              return (
                <div
                  key={alert.alert_id}
                  className={`rounded-lg border-2 p-4 ${getAlertSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon size={20} className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {alert.alert_type === 'overdue_customer' && (
                        <>
                          <p className="font-semibold text-sm">
                            {alert.customer_name}
                          </p>
                          <p className="text-xs mt-1">
                            {alert.days_overdue} days overdue
                          </p>
                          <p className="font-semibold text-sm mt-2">
                            {formatCurrency(alert.amount_due)}
                          </p>
                        </>
                      )}
                      {alert.alert_type === 'low_stock' && (
                        <>
                          <p className="font-semibold text-sm">
                            {alert.product_name}
                          </p>
                          <p className="text-xs mt-1">
                            Stock: {alert.current_stock} / Reorder:{' '}
                            {alert.reorder_level}
                          </p>
                        </>
                      )}
                      {alert.alert_type === 'out_of_stock' && (
                        <>
                          <p className="font-semibold text-sm">
                            {alert.product_name}
                          </p>
                          <p className="text-xs mt-1">Out of Stock</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Layout: Top Customers & Top Products */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Customers
          </h2>
          {data?.top_customers && data.top_customers.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTable
                columns={topCustomersColumns}
                data={data.top_customers}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No customer data available
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h2>
          {data?.top_products && data.top_products.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTable
                columns={topProductsColumns}
                data={data.top_products}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No product data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Transactions
        </h2>
        {data?.recent_transactions && data.recent_transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <DataTable
              columns={recentTransactionsColumns}
              data={data.recent_transactions}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions available
          </div>
        )}
      </div>

      {/* Analysis Center */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Analysis Center
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.link}
              to={link.link}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className={`${link.color} p-6 text-white`}>
                <link.icon className="h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
                <p className="text-sm text-white/90">{link.description}</p>
              </div>
              <div className="p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  View Details
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Outlet for child routes */}
      <Outlet />
    </div>
  );
}
