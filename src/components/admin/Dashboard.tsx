import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

import useDashboardAnalyticsStore from "../../store/dashAnalytics.store";
import useOrderStore from "../../store/order.store";
import useProductStore from "../../store/product.store";

const Dashboard: React.FC = () => {
  const {
    fetchDashboardStats,
    stats: dashboardStats,
    fetchSalesAnalytics,
    salesAnalytics,
    fetchOrderStatusDistribution,
    orderStatusDistribution,
  } = useDashboardAnalyticsStore();
  const { orders, fetchAllOrders } = useOrderStore();
  const { products, fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchAllOrders();
    fetchAllProducts();
    fetchSalesAnalytics("daily", 30);
    fetchOrderStatusDistribution();
  }, [
    fetchDashboardStats,
    fetchAllOrders,
    fetchAllProducts,
    fetchSalesAnalytics,
    fetchOrderStatusDistribution,
  ]);

  const [chartPeriod, setChartPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  // Add loading and error states for debugging
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Update analytics when chart period changes
  useEffect(() => {
    if (chartPeriod) {
      setIsLoading(true);
      fetchSalesAnalytics(chartPeriod, 30)
        .then(() => setHasError(false))
        .catch(() => setHasError(true))
        .finally(() => setIsLoading(false));
    }
  }, [chartPeriod, fetchSalesAnalytics]);

  // Process real sales data based on selected period
  const getChartData = () => {
    if (!salesAnalytics || salesAnalytics.length === 0) {
      // Fallback to dummy data when backend is unavailable
      console.warn("Using fallback chart data - backend data not available");
      const fallbackData = [
        { date: "2024-01-01", sales: 45, orders: 45, revenue: 89000 },
        { date: "2024-01-02", sales: 52, orders: 52, revenue: 103000 },
        { date: "2024-01-03", sales: 48, orders: 48, revenue: 95000 },
        { date: "2024-01-04", sales: 61, orders: 61, revenue: 121000 },
        { date: "2024-01-05", sales: 55, orders: 55, revenue: 109000 },
        { date: "2024-01-06", sales: 67, orders: 67, revenue: 133000 },
        { date: "2024-01-07", sales: 59, orders: 59, revenue: 117000 },
      ];

      return fallbackData.slice(-7).map((data) => ({
        date: format(new Date(data.date), "MMM dd"),
        revenue: data.revenue,
        orders: data.orders,
        sales: data.orders,
      }));
    }

    return salesAnalytics.map((data) => ({
      date: format(
        new Date(data.date),
        chartPeriod === "monthly" ? "MMM" : "MMM dd"
      ),
      revenue: data.revenue,
      orders: data.orders,
      sales: data.orders, // For backward compatibility
    }));
  };

  const chartData = getChartData();

  // Order status distribution from real backend data
  const orderStatusData = orderStatusDistribution
    ? orderStatusDistribution.map((status) => ({
        name: status._id.charAt(0).toUpperCase() + status._id.slice(1),
        value: status.count,
        color:
          status._id === "pending"
            ? "#FF8C00"
            : status._id === "processing"
            ? "#DAA520"
            : status._id === "shipped"
            ? "#008B8B"
            : status._id === "delivered"
            ? "#228B22"
            : "#B22222", // cancelled or other
      }))
    : [
        // Fallback data when backend is unavailable
        {
          name: "Pending",
          value: orders.filter((o) => o.status === "pending").length || 5,
          color: "#FF8C00",
        },
        {
          name: "Processing",
          value: orders.filter((o) => o.status === "processing").length || 8,
          color: "#DAA520",
        },
        {
          name: "Shipped",
          value: orders.filter((o) => o.status === "shipped").length || 12,
          color: "#008B8B",
        },
        {
          name: "Delivered",
          value: orders.filter((o) => o.status === "delivered").length || 15,
          color: "#228B22",
        },
        {
          name: "Cancelled",
          value: orders.filter((o) => o.status === "cancelled").length || 2,
          color: "#B22222",
        },
      ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
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
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`KSh ${(dashboardStats?.totalRevenue || 0).toLocaleString()}`}
          change={dashboardStats?.revenueGrowth || 0}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats?.totalOrders || orders.length}
          change={dashboardStats?.ordersGrowth || 0}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Monthly Orders"
          value={dashboardStats?.monthlyOrders || 0}
          change={dashboardStats?.ordersGrowth || 0}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-african-terracotta"
        />
        <StatCard
          title="Products"
          value={products.length}
          change={5.2}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-african-gold"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h3>
              {hasError && (
                <p className="text-sm text-orange-600 mt-1">
                  Using fallback data - Backend connection issue
                </p>
              )}
              {isLoading && (
                <p className="text-sm text-blue-600 mt-1">
                  Loading chart data...
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={chartPeriod}
                onChange={(e) =>
                  setChartPeriod(
                    e.target.value as "daily" | "weekly" | "monthly"
                  )
                }
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-african-gold"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#CD853F"
                strokeWidth={3}
                dot={{ fill: "#CD853F", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#CD853F", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Orders
        </h3>
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

export default Dashboard;
