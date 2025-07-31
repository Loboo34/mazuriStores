import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Target,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  Filter,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
  Legend,
  Bar,
} from "recharts";
import { format, subDays } from "date-fns";

import useDashboardAnalyticsStore from "../../store/dashAnalytics.store";
import useOrderStore from "../../store/order.store";
import useProductStore from "../../store/product.store";

// Custom color palette for better visualization
const COLORS = {
  primary: "#CD853F", // African Gold
  secondary: "#8B4513", // African Terracotta
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
  pink: "#EC4899",
  teal: "#14B8A6",
  orange: "#F97316",
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.teal,
  COLORS.orange,
  COLORS.error,
];

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const TIME_RANGES: TimeRange[] = [
  { label: "Last 7 Days", value: "7d", days: 7 },
  { label: "Last 30 Days", value: "30d", days: 30 },
  { label: "Last 90 Days", value: "90d", days: 90 },
  { label: "This Week", value: "week", days: 7 },
  { label: "This Month", value: "month", days: 30 },
];

const EnhancedDashboard: React.FC = () => {
  const {
    fetchDashboardStats,
    stats: dashboardStats,
    fetchSalesAnalytics,
    salesAnalytics,
    fetchOrderStatusDistribution,
    orderStatusDistribution,
  } = useDashboardAnalyticsStore();
  const { orders, fetchAllOrders } = useOrderStore();
  const { fetchAllProducts } = useProductStore();

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(
    TIME_RANGES[1]
  );
  const [chartView, setChartView] = useState<"revenue" | "orders" | "both">(
    "both"
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchAllOrders(),
          fetchAllProducts(),
          fetchSalesAnalytics("daily", selectedTimeRange.days),
          fetchOrderStatusDistribution(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [
    selectedTimeRange,
    fetchDashboardStats,
    fetchAllOrders,
    fetchAllProducts,
    fetchSalesAnalytics,
    fetchOrderStatusDistribution,
  ]);

  // Enhanced chart data processing
  const getEnhancedChartData = () => {
    if (!salesAnalytics || salesAnalytics.length === 0) {
      // Enhanced fallback data with more realistic patterns
      return Array.from({ length: selectedTimeRange.days }, (_, i) => {
        const date = subDays(new Date(), selectedTimeRange.days - i - 1);
        const baseRevenue = 50000 + Math.random() * 30000;
        const baseOrders = 20 + Math.random() * 40;

        // Add weekly patterns (weekends are usually lower)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const weekendFactor = isWeekend ? 0.7 : 1.2;

        return {
          date: format(date, "MMM dd"),
          fullDate: date,
          revenue: Math.round(baseRevenue * weekendFactor),
          orders: Math.round(baseOrders * weekendFactor),
          averageOrderValue: Math.round(baseRevenue / baseOrders),
          conversionRate: 2.5 + Math.random() * 2,
        };
      });
    }

    return salesAnalytics.map((data) => ({
      date: format(new Date(data.date), "MMM dd"),
      fullDate: new Date(data.date),
      revenue: data.revenue,
      orders: data.orders,
      averageOrderValue:
        data.averageOrderValue || Math.round(data.revenue / data.orders),
      conversionRate: 2.5 + Math.random() * 2, // Mock conversion rate
    }));
  };

  // Enhanced stat cards with more metrics
  const enhancedStats = {
    totalRevenue: dashboardStats?.totalRevenue || 0,
    totalOrders: dashboardStats?.totalOrders || orders.length,
    averageOrderValue: dashboardStats?.totalRevenue
      ? Math.round(dashboardStats.totalRevenue / dashboardStats.totalOrders)
      : 0,
    conversionRate: 3.2, // Mock conversion rate
    topSellingCategory: "Home Decor", // Mock data
    customerSatisfaction: 4.7, // Mock rating
  };

  // Enhanced order status data
  const getEnhancedOrderStatusData = () => {
    if (orderStatusDistribution && orderStatusDistribution.length > 0) {
      return orderStatusDistribution.map((status, index) => ({
        name: status._id.charAt(0).toUpperCase() + status._id.slice(1),
        value: status.count,
        percentage: Math.round((status.count / orders.length) * 100),
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
    }

    // Fallback data
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: Math.round((value / orders.length) * 100),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  };

  // Weekly performance comparison
  const getWeeklyComparison = () => {
    const chartData = getEnhancedChartData();
    const thisWeekData = chartData.slice(-7);
    const lastWeekData = chartData.slice(-14, -7);

    const thisWeekRevenue = thisWeekData.reduce(
      (sum, day) => sum + day.revenue,
      0
    );
    const lastWeekRevenue = lastWeekData.reduce(
      (sum, day) => sum + day.revenue,
      0
    );
    const revenueGrowth =
      lastWeekRevenue > 0
        ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
        : 0;

    const thisWeekOrders = thisWeekData.reduce(
      (sum, day) => sum + day.orders,
      0
    );
    const lastWeekOrders = lastWeekData.reduce(
      (sum, day) => sum + day.orders,
      0
    );
    const ordersGrowth =
      lastWeekOrders > 0
        ? ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100
        : 0;

    return { revenueGrowth, ordersGrowth };
  };

  const chartData = getEnhancedChartData();
  const orderStatusData = getEnhancedOrderStatusData();
  const weeklyComparison = getWeeklyComparison();

  // Custom tooltip for charts
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("Revenue")
                ? `KSh ${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Stat Card Component
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, change, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>

      {change !== undefined && (
        <div className="flex items-center">
          {change >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last week</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sales Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive overview of your business performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          <select
            value={selectedTimeRange.value}
            onChange={(e) => {
              const range = TIME_RANGES.find((r) => r.value === e.target.value);
              if (range) setSelectedTimeRange(range);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <button className="flex items-center px-4 py-2 bg-african-terracotta text-white rounded-lg hover:bg-african-terracotta-dark transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`KSh ${enhancedStats.totalRevenue.toLocaleString()}`}
          change={weeklyComparison.revenueGrowth}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
          subtitle="This month"
        />
        <StatCard
          title="Total Orders"
          value={enhancedStats.totalOrders}
          change={weeklyComparison.ordersGrowth}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          subtitle={`${selectedTimeRange.label.toLowerCase()}`}
        />
        <StatCard
          title="Average Order Value"
          value={`KSh ${enhancedStats.averageOrderValue.toLocaleString()}`}
          change={5.2}
          icon={<Target className="w-6 h-6 text-white" />}
          color="bg-african-terracotta"
          subtitle="Per transaction"
        />
        <StatCard
          title="Conversion Rate"
          value={`${enhancedStats.conversionRate}%`}
          change={1.8}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          subtitle="Visitor to customer"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Performance
              </h3>
              <p className="text-sm text-gray-600">
                Revenue and orders over time
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={chartView}
                onChange={(e) =>
                  setChartView(e.target.value as typeof chartView)
                }
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-african-gold"
              >
                <option value="both">Revenue & Orders</option>
                <option value="revenue">Revenue Only</option>
                <option value="orders">Orders Only</option>
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#666"
                fontSize={12}
                tick={{ fill: "#666" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#666"
                fontSize={12}
                tick={{ fill: "#666" }}
              />
              {chartView !== "orders" && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: "#666" }}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {(chartView === "both" || chartView === "revenue") && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary}
                  fill={`${COLORS.primary}20`}
                  strokeWidth={3}
                  name="Revenue (KSh)"
                />
              )}

              {(chartView === "both" || chartView === "orders") && (
                <Bar
                  yAxisId={chartView === "orders" ? "left" : "right"}
                  dataKey="orders"
                  fill={COLORS.secondary}
                  name="Orders"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Order Status
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-african-terracotta hover:text-african-terracotta-dark text-sm font-medium">
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-mono text-sm">#{order.id}</td>
                  <td className="py-3 px-4">
                    {order.customerInfo?.name || "Unknown Customer"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    KSh {(order.total || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.createdAt
                      ? format(new Date(order.createdAt), "MMM dd, yyyy")
                      : "Unknown Date"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
