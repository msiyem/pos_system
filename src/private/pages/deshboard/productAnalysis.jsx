import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Zap,
  Target,
  Award,
  Activity,
  Eye,
  EyeOff,
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
import SummaryCard from '../../component/SummaryCard';
import DataTable from '../../component/DataTable';
import api from '../../../api/api';
import Loading from '../../component/Loading';

export default function ProductAnalysis() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().setDate(new Date().getDate() - 28))
      .toISOString()
      .split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });

  // State for API data
  const [analysisData, setAnalysisData] = useState(null);

  const fetchProductAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/product-analysis', {
        params: {
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
        },
      });

      setAnalysisData(response.data.data);
    } catch (error) {
      console.error('Error fetching product analysis:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchProductAnalysis();
  }, [fetchProductAnalysis]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Chart Data Preparation
  const getProductStatusData = () => {
    if (!analysisData?.overview_metrics) return [];
    const metrics = analysisData.overview_metrics;
    return [
      { name: 'Products Sold', value: metrics.products_sold, fill: '#10b981' },
      {
        name: 'Products Unsold',
        value: metrics.products_unsold,
        fill: '#ef4444',
      },
    ];
  };

  const getCategoryPerformanceData = () => {
    if (!analysisData?.category_performance) return [];
    return analysisData.category_performance.map((cat) => ({
      name: cat.category_name,
      revenue: parseFloat(cat.total_revenue) / 1000,
      units: cat.total_units_sold,
      profit: parseFloat(cat.total_profit) / 1000,
    }));
  };

  const getTopSellersData = () => {
    if (!analysisData?.top_sellers) return [];
    return analysisData.top_sellers.slice(0, 5).map((product) => ({
      name: product.product_name,
      revenue: parseFloat(product.total_revenue) / 1000,
      units: product.units_sold,
    }));
  };

  // Top Sellers columns
  const topSellersColumns = [
    { label: 'Product Name', key: 'product_name' },
    {label: 'Product Image',key: 'image_url', render: (row)=>(
      <img src={row.image} alt='product image' className='w-12 h-12' />
    )},
    { label: 'SKU', key: 'sku' },
    {
      label: 'Units Sold',
      key: 'units_sold',
      render: (row) => (
        <span className="font-semibold text-green-600">{row.units_sold}</span>
      ),
    },
    {
      label: 'Revenue',
      key: 'total_revenue',
      render: (row) => formatCurrency(row.total_revenue),
    },
    {
      label: 'Profit Margin',
      key: 'profit_margin',
      render: (row) => (
        <span className="font-semibold text-blue-600">{row.profit_margin}</span>
      ),
    },
    {
      label: 'Current Stock',
      key: 'current_stock',
      render: (row) => (
        <span
          className={row.current_stock < 10 ? 'text-orange-600 font-bold' : ''}
        >
          {row.current_stock}
        </span>
      ),
    },
  ];

  // Bottom Sellers columns
  const bottomSellersColumns = [
    { label: 'Product Name', key: 'product_name' },
    {label: 'Product Image',key: 'image_url', render: (row)=>(
      <img src={row.image} alt='product image' className='w-12 h-12' />
    )},
    { label: 'SKU', key: 'sku' },
    {
      label: 'Units Sold',
      key: 'units_sold',
      render: (row) => (
        <span className="font-semibold text-red-600">{row.units_sold}</span>
      ),
    },
    {
      label: 'Total Revenue',
      key: 'total_revenue',
      render: (row) => formatCurrency(row.total_revenue),
    },
    {
      label: 'Note',
      key: 'note',
      render: (row) => (
        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-semibold">
          {row.note || 'Low Sales'}
        </span>
      ),
    },
    {
      label: 'Current Stock',
      key: 'current_stock',
    },
    {label: 'Product Image',key: 'image_url', render: (row)=>(
      <img src={row.image} alt='product image' className='w-12 h-12' />
    )},
  ];

  // High Profit Products columns
  const highProfitColumns = [
    { label: 'Product Name', key: 'product_name' },
    {label: 'Product Image',key: 'image_url', render: (row)=>(
      <img src={row.image} alt='product image' className='w-12 h-12' />
    )},
    { label: 'SKU', key: 'sku' },
    {
      label: 'Units Sold',
      key: 'units_sold',
    },
    {
      label: 'Total Profit',
      key: 'gross_profit',
      render: (row) => formatCurrency(row.gross_profit),
    },
    {
      label: 'Profit Margin',
      key: 'profit_margin',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {row.profit_margin}
        </span>
      ),
    },
  ];

  // Low Margin Products columns
  const lowMarginColumns = [
    { label: 'Product Name', key: 'product_name' },
    {label: 'Product Image',key: 'image_url', render: (row)=>(
      <img src={row.image} alt='product image' className='w-12 h-12' />
    )},
    { label: 'SKU', key: 'sku' },
    {
      label: 'Price',
      key: 'selling_price',
      render: (row) => formatCurrency(row.selling_price),
    },
    {
      label: 'Profit Margin',
      key: 'profit_margin',
      render: (row) => (
        <span className="font-semibold text-red-600">{row.profit_margin}</span>
      ),
    },
    {
      label: 'Units Sold',
      key: 'units_sold',
    },
  ];

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 m-3 no-scrollbar overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[18px] font-semibold">Product Analysis</span>
        <span className="text-gray-600">
          Comprehensive product performance insights
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
          onClick={fetchProductAnalysis}
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
            { id: 'top-sellers', label: 'Top Sellers', icon: TrendingUp },
            {
              id: 'bottom-sellers',
              label: 'Bottom Sellers',
              icon: TrendingDown,
            },
            {
              id: 'profit-analysis',
              label: 'Profit Analysis',
              icon: DollarSign,
            },
            { id: 'category', label: 'Category Performance', icon: Package },
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
            <div className="mb-8 @container">
              <h3 className="text-[16px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />
                Revenue Overview
              </h3>
              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 min-[1180px]:grid-cols-4 gap-4">
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Total Units Sold
                    </p>
                    <ShoppingCart className="text-indigo-600" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600 mt-3">
                    {analysisData?.overview_metrics.total_units_sold || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Units sold in the period
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Total Revenue
                    </p>
                    <Award className="text-blue-600" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-3">
                    {formatCurrency(
                      analysisData?.overview_metrics.total_revenue || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Total earnings</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Avg Transaction
                    </p>
                    <Activity className="text-green-600" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-3">
                    {formatCurrency(
                      analysisData?.overview_metrics.avg_transaction_value || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Per transaction value
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Avg Product Price
                    </p>
                    <Target className="text-purple-600" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mt-3">
                    {formatCurrency(
                      analysisData?.overview_metrics.avg_product_price || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Average product cost
                  </p>
                </div>
              </div>
            </div>

            {/* Main Section - Pie Chart Left, Key Metrics Right */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Left Section - Product Status Pie Chart */}
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-blue-600" />
                    Product Status Distribution
                  </h3>

                  <div className="flex-1 flex items-center justify-center min-h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getProductStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={85}
                          innerRadius={45}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {getProductStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `${value} products`}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }}
                          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend with Stats */}
                  <div className="mt-6 space-y-3 pt-6 border-t border-gray-300">
                    {getProductStatusData().map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: item.fill }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {item.value}
                          </span>
                          <span className="text-xs text-gray-500">
                            (
                            {(
                              (item.value /
                                ((analysisData?.overview_metrics
                                  .products_sold || 0) +
                                  (analysisData?.overview_metrics
                                    .products_unsold || 0))) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-300 flex items-center justify-between font-semibold">
                      <span className="text-sm text-gray-700">
                        Total Products
                      </span>
                      <span className="text-lg text-gray-900">
                        {(analysisData?.overview_metrics.products_sold || 0) +
                          (analysisData?.overview_metrics.products_unsold || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Key Performance Indicators */}
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6 h-full shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-orange-600" />
                    Key Performance Indicators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Package
                          className="text-purple-600 mt-1 flex-shrink-0"
                          size={22}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">
                            Total Active Products
                          </p>
                          <p className="text-3xl font-bold text-purple-600 mt-2">
                            {analysisData?.overview_metrics
                              .total_active_products || 0}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Currently available for sale
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <TrendingUp
                          className="text-green-600 mt-1 flex-shrink-0"
                          size={22}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">
                            Products Sold
                          </p>
                          <p className="text-3xl font-bold text-green-600 mt-2">
                            {analysisData?.overview_metrics.products_sold || 0}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Sell Through Rate:{' '}
                            {analysisData?.overview_metrics.sell_through_rate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <EyeOff
                          className="text-red-600 mt-1 flex-shrink-0"
                          size={22}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">
                            Products Unsold
                          </p>
                          <p className="text-3xl font-bold text-red-600 mt-2">
                            {analysisData?.overview_metrics.products_unsold ||
                              0}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Require strategic action
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Eye
                          className="text-blue-600 mt-1 flex-shrink-0"
                          size={22}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">
                            Total Inventory
                          </p>
                          <p className="text-3xl font-bold text-blue-600 mt-2">
                            {analysisData?.overview_metrics
                              .total_inventory_units || 0}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            units in stock
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Sellers Tab */}
        {activeTab === 'top-sellers' && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500" size={20} />
                Top Selling Products
              </h3>
              {getCategoryPerformanceData().length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getTopSellersData()}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      style={{ fontSize: '12px' }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip
                      formatter={(value) => `৳${(value * 1000).toFixed(0)}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      name="Revenue (K)"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="units"
                      fill="#3b82f6"
                      name="Units Sold"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <h3 className="text-[14px] font-semibold mb-4">Detailed List</h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={topSellersColumns}
                data={analysisData?.top_sellers || []}
              />
              {console.log(analysisData?.top_sellers)}
            </div>
          </div>
        )}

        {/* Bottom Sellers Tab */}
        {activeTab === 'bottom-sellers' && (
          <div className="p-5">
            <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={20} />
              Low Performing Products
            </h3>
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                These products have minimal or no sales. Consider promotional
                strategies or product assessment.
              </p>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                columns={bottomSellersColumns}
                data={analysisData?.bottom_sellers || []}
              />
            </div>
          </div>
        )}

        {/* Profit Analysis Tab */}
        {activeTab === 'profit-analysis' && (
          <div className="p-5">
            <h3 className="text-[16px] font-semibold mb-4">Profit Analysis</h3>

            {/* Highest Profit Products */}
            <div className="mb-8">
              <h4 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={18} />
                Highest Profit Products
              </h4>
              <div className="overflow-x-auto">
                <DataTable
                  columns={highProfitColumns}
                  data={analysisData?.highest_profit_products || []}
                />
                {console.log(analysisData?.highest_profit_products)}
              </div>
            </div>

            {/* Lowest Margin Products */}
            <div>
              <h4 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="text-red-600" size={18} />
                Lowest Margin Products
              </h4>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  These products have low profit margins. Review pricing or cost
                  structure.
                </p>
              </div>
              <div className="overflow-x-auto">
                <DataTable
                  columns={lowMarginColumns}
                  data={analysisData?.lowest_margin_products || []}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Performance Tab */}
        {activeTab === 'category' && (
          <div className="p-5">
            <h3 className="text-[16px] font-semibold mb-4">
              Category Performance Analysis
            </h3>

            {/* Category Chart */}
            {getCategoryPerformanceData().length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Revenue by Category
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={getCategoryPerformanceData()}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      style={{ fontSize: '12px' }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip
                      formatter={(value) => `৳${(value * 1000).toFixed(0)}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="Revenue (K)"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="profit"
                      fill="#10b981"
                      name="Profit (K)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Category Details */}
            <h4 className="text-[14px] font-semibold mb-4">
              Category Breakdown
            </h4>
            <div className="space-y-4">
              {analysisData?.category_performance?.map((category, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-800">
                      {category.category_name}
                    </h5>
                    <span className="text-sm text-gray-600">
                      {category.total_products} Products
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Total Revenue
                      </span>
                      <span className="font-semibold text-blue-600 mt-1">
                        {formatCurrency(category.total_revenue)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">Units Sold</span>
                      <span className="font-semibold text-green-600 mt-1">
                        {category.total_units_sold}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Total Profit
                      </span>
                      <span className="font-semibold text-emerald-600 mt-1">
                        {formatCurrency(category.total_profit)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Profit Margin
                      </span>
                      <span className="font-semibold text-purple-600 mt-1">
                        {category.profit_margin}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (parseFloat(category.total_revenue) /
                              (analysisData?.overview_metrics?.total_revenue ||
                                1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(
                        (parseFloat(category.total_revenue) /
                          (analysisData?.overview_metrics?.total_revenue ||
                            1)) *
                        100
                      ).toFixed(1)}
                      % of total revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
