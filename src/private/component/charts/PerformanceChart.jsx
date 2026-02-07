import {
  LineChart,
  Line,
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
  AreaChart,
  Area,
} from 'recharts';


export function DailyPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    revenue: item.revenue,
    paid: item.paid,
    due: item.due,
    orders: item.orders,
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Daily Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => `৳${value}`}
            labelStyle={{ color: '#000' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="green"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="paid"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Paid"
          />
          <Area
            type="monotone"
            dataKey="due"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
            name="Due"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaymentMethodChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const COLORS = {
    cash: '#10b981',
    card: '#3b82f6',
    due: '#f59e0b',
  };

  const chartData = data.map((item) => ({
    name:
      item.payment_method.charAt(0).toUpperCase() +
      item.payment_method.slice(1),
    value: item.revenue,
    orders: item.orders,
    method: item.payment_method,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Payment Methods Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
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
              formatter={(value) => `৳${value}`}
            />
            <Bar
              dataKey="value"
              fill="#8884d8"
              radius={[8, 8, 0, 0]}
              name="Revenue"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.method]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Revenue Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry) => `${entry.name}: ৳${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.method]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `৳${value}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


export function OrdersTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    orders: item.orders,
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Orders</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar
            dataKey="orders"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            name="Orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
