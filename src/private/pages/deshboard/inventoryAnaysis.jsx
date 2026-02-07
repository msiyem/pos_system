import { useState, useEffect, useCallback } from 'react';
import {
  PackageX,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Archive,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Box,
  RefreshCwOff,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
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
import InfoTable from '../../component/InfoTable';
import EntriesDropdown from '../../component/EntriesDropdown';
import api from '../../../api/api';
import Loading from '../../component/Loading';

export default function InventoryAnalysis() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState('alerts');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  // State for API data
  const [alerts, setAlerts] = useState(null);
  const [movement, setMovement] = useState(null);
  const [reorderRecommendations, setReorderRecommendations] = useState(null);
  const [valuation, setValuation] = useState(null);

  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    try {
      const [alertsRes, movementRes, reorderRes, valuationRes] =
        await Promise.all([
          api.get('/dashboard/inventory/alerts'),
          api.get(`/dashboard/inventory/movement?days=${days}`),
          api.get(`/dashboard/inventory/reorder-recommendations?days=${days}`),
          api.get('/dashboard/inventory/valuation'),
        ]);

      setAlerts(alertsRes.data.data);
      setMovement(movementRes.data.data);
      setReorderRecommendations(reorderRes.data.data);
      setValuation(valuationRes.data.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(priority)}`}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  // Chart Data Preparation
  const getAlertChartData = () => {
    if (!alerts?.summary) return [];
    return [
      {
        name: 'Out of Stock',
        value: alerts.summary.out_of_stock_count,
        fill: '#ef4444',
      },
      {
        name: 'Low Stock',
        value: alerts.summary.low_stock_count,
        fill: '#f97316',
      },
      {
        name: 'Overstock',
        value: alerts.summary.overstock_count,
        fill: '#eab308',
      },
    ];
  };

  const getMovementChartData = () => {
    if (!movement?.summary) return [];
    return [
      {
        name: 'Fast Moving',
        value: movement.summary.fast_moving_count,
        fill: '#10b981',
      },
      {
        name: 'Moderate',
        value: movement.summary.moderate_moving_count,
        fill: '#3b82f6',
      },
      {
        name: 'Slow Moving',
        value: movement.summary.slow_moving_count,
        fill: '#f97316',
      },
      {
        name: 'No Movement',
        value: movement.summary.no_movement_count,
        fill: '#ef4444',
      },
    ];
  };

  const getReorderChartData = () => {
    if (!reorderRecommendations?.summary) return [];
    return [
      {
        name: 'Urgent',
        value: reorderRecommendations.summary.urgent_priority,
        fill: '#ef4444',
      },
      {
        name: 'High',
        value: reorderRecommendations.summary.high_priority,
        fill: '#f97316',
      },
      {
        name: 'Medium',
        value: reorderRecommendations.summary.medium_priority,
        fill: '#eab308',
      },
    ];
  };

  const getCategoryValuationData = () => {
    if (!valuation?.category_breakdown) return [];
    return valuation.category_breakdown.map((cat) => ({
      name: cat.category_name,
      value: parseFloat(cat.potential_profit),
      profit: parseFloat(cat.potential_profit),
    }));
  };

  const getCategoryRevenueData = () => {
    if (!valuation?.category_breakdown) return [];
    return valuation.category_breakdown.map((cat) => ({
      name: cat.category_name,
      purchase: parseFloat(cat.purchase_value) / 1000,
      selling: parseFloat(cat.selling_value) / 1000,
    }));
  };

  // Alert columns
  const alertColumns = [
    { label: 'Product', key: 'product_name' },
    { label: 'SKU', key: 'sku' },
    { label: 'Brand', key: 'brand_name' },
    { label: 'Category', key: 'category_name' },
    {
      label: 'Current Stock',
      key: 'current_stock',
      render: (row) => (
        <span
          className={row.current_stock === 0 ? 'text-red-600 font-bold' : ''}
        >
          {row.current_stock}
        </span>
      ),
    },
    {
      label: 'Price',
      key: 'price',
      render: (row) => formatCurrency(row.price),
    },
    {
      label: 'Priority',
      key: 'priority',
      render: (row) => getPriorityBadge(row.priority),
    },
  ];

  // Movement columns
  const movementColumns = [
    { label: 'Product', key: 'product_name' },
    { label: 'SKU', key: 'sku' },
    { label: 'Category', key: 'category_name' },
    {
      label: 'Current Stock',
      key: 'current_stock',
    },
    {
      label: 'Units Sold',
      key: 'units_sold',
      render: (row) => (
        <span className="font-semibold text-blue-600">{row.units_sold}</span>
      ),
    },
    {
      label: 'Revenue',
      key: 'total_revenue',
      render: (row) => formatCurrency(row.total_revenue),
    },
    {
      label: 'Avg Daily Sales',
      key: 'avg_daily_sales',
      render: (row) => {
        const value = row.avg_daily_sales;
        if (value == null || value === '') return '0.00';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0.00' : num.toFixed(2);
      },
    },
    {
      label: 'Days of Stock',
      key: 'days_of_stock',
      render: (row) => row.days_of_stock || 'N/A',
    },
  ];

  // Reorder columns
  const reorderColumns = [
    { label: 'Product', key: 'product_name' },
    { label: 'SKU', key: 'sku' },
    {
      label: 'Current Stock',
      key: 'current_stock',
    },
    {
      label: 'Days to Stockout',
      key: 'sales_metrics',
      render: (row) => row.sales_metrics.days_until_stockout,
    },
    {
      label: 'Recommended Qty',
      key: 'reorder_recommendation',
      render: (row) => (
        <span className="font-semibold text-green-600">
          {row.reorder_recommendation.recommended_qty}
        </span>
      ),
    },
    {
      label: 'Estimated Cost',
      key: 'reorder_recommendation',
      render: (row) =>
        formatCurrency(row.reorder_recommendation.estimated_cost),
    },
    {
      label: 'Potential Profit',
      key: 'reorder_recommendation',
      render: (row) =>
        formatCurrency(row.reorder_recommendation.potential_profit),
    },
    {
      label: 'Priority',
      key: 'priority',
      render: (row) => getPriorityBadge(row.priority),
    },
  ];

  if (loading) {
    return (
      <Loading size={44} />
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 m-3 no-scrollbar overflow-auto">
      {/* Header */}

      <div className="flex ">
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-semibold">Inventory Analysis</span>
          <span className="text-gray-600">
            Monitor stock levels, movement, and valuation
          </span>
        </div>
        <EntriesDropdown
          value={`${days} Days`}
          options={[7, 30, 60, 90].map((d) => `${d} Days`)}
          onChange={(val) => setDays(parseInt(val.split(' ')[0]))}
          open={periodDropdownOpen}
          setOpen={setPeriodDropdownOpen}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300">
        <div className="flex gap-6">
          {[
            { id: 'alerts', label: 'Stock Alerts', icon: AlertTriangle },
            { id: 'movement', label: 'Stock Movement', icon: TrendingUp },
            {
              id: 'reorder',
              label: 'Reorder Recommendations',
              icon: ShoppingCart,
            },
            { id: 'valuation', label: 'Category Valuation', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-2 font-medium transition-all ${
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
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-auto ">
        {activeTab === 'alerts' && (
          <div className="p-5 space-y-10">
            {/* Summary Cards - Alerts */}
            <div>
              <h3 className="text-[16px] font-semibold mb-3">
                Inventory Alerts
              </h3>
              <div className="grid sm:grid-cols-4 gap-5">
                <SummaryCard
                  icon={AlertCircle}
                  title="Total Alerts"
                  value={alerts?.summary.total_alerts || 0}
                  color="text-blue-500"
                />
                <SummaryCard
                  icon={PackageX}
                  title="Out of Stock"
                  value={alerts?.summary.out_of_stock_count || 0}
                  color="text-red-500"
                />
                <SummaryCard
                  icon={AlertTriangle}
                  title="Low Stock"
                  value={alerts?.summary.low_stock_count || 0}
                  color="text-orange-500"
                />
                <SummaryCard
                  icon={Archive}
                  title="Overstock"
                  value={alerts?.summary.overstock_count || 0}
                  color="text-yellow-500"
                />
              </div>
            </div>

            {/* Alert Distribution Charts */}
            <div className="grid sm:grid-cols-2 gap-5 my-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Alert Distribution
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getAlertChartData()}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getAlertChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} items`} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) =>
                        `${entry.payload.name}: ${entry.payload.value}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Alert Count by Type
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getAlertChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                      {getAlertChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
              <PackageX className="text-red-500" size={20} />
              Out of Stock ({alerts?.alerts.out_of_stock.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={alertColumns}
                data={alerts?.alerts.out_of_stock || []}
              />
            </div>

            <h3 className="text-[16px] font-semibold mb-4 mt-8 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={20} />
              Low Stock ({alerts?.alerts.low_stock.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={alertColumns}
                data={alerts?.alerts.low_stock || []}
              />
            </div>

            <h3 className="text-[16px] font-semibold mb-4 mt-8 flex items-center gap-2">
              <Archive className="text-yellow-500" size={20} />
              Overstock ({alerts?.alerts.overstock.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={alertColumns}
                data={alerts?.alerts.overstock || []}
              />
            </div>
          </div>
        )}

        {activeTab === 'movement' && (
          <div className="p-5">
            {/* Stock Movement Summary */}
            <div>
              <h3 className="text-[16px] font-semibold mb-3">
                Stock Movement ({days} Days)
              </h3>
              <div className="grid sm:grid-cols-4 gap-5">
                <SummaryCard
                  icon={TrendingUp}
                  title="Fast Moving"
                  value={movement?.summary.fast_moving_count || 0}
                  color="text-green-500"
                />
                <SummaryCard
                  icon={BarChart3}
                  title="Moderate Moving"
                  value={movement?.summary.moderate_moving_count || 0}
                  color="text-blue-500"
                />
                <SummaryCard
                  icon={TrendingDown}
                  title="Slow Moving"
                  value={movement?.summary.slow_moving_count || 0}
                  color="text-orange-500"
                />
                <SummaryCard
                  icon={Minus}
                  title="No Movement"
                  value={movement?.summary.no_movement_count || 0}
                  color="text-red-500"
                />
              </div>
            </div>

            {/* Movement Distribution Charts */}
            <div className="grid sm:grid-cols-2 gap-5 my-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Stock Movement Distribution
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getMovementChartData()}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getMovementChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} products`} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) =>
                        `${entry.payload.name}: ${entry.payload.value}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Product Count by Movement
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getMovementChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                      {getMovementChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
              <ArrowUpRight className="text-green-500" size={20} />
              Fast Moving Products ({movement?.movement.fast_moving.length || 0}
              )
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={movementColumns}
                data={movement?.movement.fast_moving || []}
              />
            </div>

            <h3 className="text-[16px] font-semibold mb-4 mt-8 flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={20} />
              Moderate Moving Products (
              {movement?.movement.moderate_moving.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={movementColumns}
                data={movement?.movement.moderate_moving || []}
              />
            </div>

            <h3 className="text-[16px] font-semibold mb-4 mt-8 flex items-center gap-2">
              <ArrowDownRight className="text-orange-500" size={20} />
              Slow Moving Products ({movement?.movement.slow_moving.length || 0}
              )
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={movementColumns}
                data={movement?.movement.slow_moving || []}
              />
            </div>

            <h3 className="text-[16px] font-semibold mb-4 mt-8 flex items-center gap-2">
              <Minus className="text-red-500" size={20} />
              No Movement ({movement?.movement.no_movement.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <DataTable
                columns={movementColumns}
                data={movement?.movement.no_movement || []}
              />
            </div>
          </div>
        )}

        {activeTab === 'reorder' && (
          <div className="p-5">
            {/* Reorder Summary */}
            <div>
              <h3 className="text-[16px] font-semibold mb-3">
                Reorder Recommendations
              </h3>
              <div className="grid sm:grid-cols-3 gap-5">
                <SummaryCard
                  icon={ShoppingCart}
                  title="Products to Reorder"
                  value={
                    reorderRecommendations?.summary.total_products_to_reorder ||
                    0
                  }
                  color="text-blue-500"
                />
                <SummaryCard
                  icon={DollarSign}
                  title="Estimated Investment"
                  value={formatCurrency(
                    reorderRecommendations?.summary
                      .total_estimated_investment || 0
                  )}
                  color="text-red-500"
                />
                <SummaryCard
                  icon={TrendingUp}
                  title="Potential Profit"
                  value={formatCurrency(
                    reorderRecommendations?.summary.total_potential_profit || 0
                  )}
                  color="text-green-500"
                />
              </div>
            </div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Urgent Priority:</span>
                  <span className="ml-2 font-semibold text-red-600">
                    {reorderRecommendations?.summary.urgent_priority || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">High Priority:</span>
                  <span className="ml-2 font-semibold text-orange-600">
                    {reorderRecommendations?.summary.high_priority || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Medium Priority:</span>
                  <span className="ml-2 font-semibold text-yellow-600">
                    {reorderRecommendations?.summary.medium_priority || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Reorder Priority Charts */}
            <div className="grid sm:grid-cols-2 gap-5 my-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Reorder by Priority
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getReorderChartData()}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getReorderChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} products`} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) =>
                        `${entry.payload.name}: ${entry.payload.value}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Reorder Count by Priority
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getReorderChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                      {getReorderChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-x-auto">
              <DataTable
                columns={reorderColumns}
                data={reorderRecommendations?.recommendations || []}
              />
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <div className="p-5">
            {/* Summary Cards - Valuation */}
            <div>
              <h3 className="text-[16px] font-semibold mb-3">
                Inventory Valuation
              </h3>
              <div className="grid sm:grid-cols-4 gap-5">
                <SummaryCard
                  icon={Package}
                  title="Total Products"
                  value={valuation?.total_valuation.total_products || 0}
                  color="text-purple-500"
                />
                <SummaryCard
                  icon={Box}
                  title="Total Units"
                  value={valuation?.total_valuation.total_units || 0}
                  color="text-indigo-500"
                />
                <SummaryCard
                  icon={DollarSign}
                  title="Purchase Value"
                  value={formatCurrency(
                    valuation?.total_valuation.total_purchase_value || 0
                  )}
                  color="text-green-500"
                />
                <SummaryCard
                  icon={TrendingUp}
                  title="Potential Profit"
                  value={formatCurrency(
                    valuation?.total_valuation.potential_profit || 0
                  )}
                  color="text-emerald-500"
                />
              </div>
            </div>
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold mb-3 text-gray-800">
                Total Inventory Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="text-xl font-bold text-purple-600">
                    {valuation?.total_valuation.total_products}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Total Units</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {valuation?.total_valuation.total_units}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Purchase Value</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(
                      valuation?.total_valuation.total_purchase_value
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Selling Value</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(
                      valuation?.total_valuation.total_selling_value
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Potential Profit
                  </span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatCurrency(
                      valuation?.total_valuation.potential_profit
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Profit Margin</span>
                  <span className="text-xl font-bold text-teal-600">
                    {valuation?.total_valuation.profit_margin}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Valuation Charts */}
            <div className="grid sm:grid-cols-2 gap-5 my-6">
              {/* Profit by Category Pie Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Profit Distribution by Category
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getCategoryValuationData()}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="profit"
                    >
                      {getCategoryValuationData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              '#10b981',
                              '#3b82f6',
                              '#f97316',
                              '#eab308',
                              '#ef4444',
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `৳${value}`} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => entry.payload.name}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Purchase vs Selling by Category Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-[14px] font-semibold mb-4 text-gray-800">
                  Purchase vs Selling Value by Category (in K)
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getCategoryRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      style={{ fontSize: '12px' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip
                      formatter={(value) => `৳${(value * 1000).toFixed(0)}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="purchase"
                      fill="#ef4444"
                      name="Purchase (K)"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="selling"
                      fill="#10b981"
                      name="Selling (K)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="text-[16px] font-semibold mb-4">
              Category Breakdown
            </h3>
            <div className="space-y-4">
              {valuation?.category_breakdown.map((category, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {category.category_name}
                    </h4>
                    <span className="text-sm text-gray-600">
                      {category.product_count} Products • {category.total_units}{' '}
                      Units
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Purchase Value
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(category.purchase_value)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Selling Value
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(category.selling_value)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Potential Profit
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(category.potential_profit)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (parseFloat(category.potential_profit) /
                              parseFloat(category.selling_value)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
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
