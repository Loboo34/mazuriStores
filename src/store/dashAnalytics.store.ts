import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiClient from "../utils/api";
import { DashboardStats } from "../types";

interface SalesAnalytics {
  _id: Record<string, number>;
  orders: number;
  revenue: number;
  averageOrderValue: number;
  date: string;
}

interface OrderStatusDistribution {
  _id: string;
  count: number;
  totalValue: number;
}

interface DashboardAnalyticsState {
  stats: DashboardStats | null;
  salesAnalytics: SalesAnalytics[] | null;
  orderStatusDistribution: OrderStatusDistribution[] | null;
  fetchDashboardStats: () => Promise<void>;
  fetchSalesAnalytics: (period?: string, days?: number) => Promise<void>;
  fetchOrderStatusDistribution: () => Promise<void>;
}

const useDashboardAnalyticsStore = create<DashboardAnalyticsState>()(
  persist(
    (set) => ({
      stats: null,
      salesAnalytics: null,
      orderStatusDistribution: null,
      fetchDashboardStats: async () => {
        try {
          const response = await ApiClient.getDashboardStats();
          console.log("Fetched dashboard stats:", response.data);
          const data = response.data as { overview: DashboardStats };
          set({ stats: data.overview });
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
          // Set fallback stats when API fails
          set({
            stats: {
              totalOrders: 0,
              totalRevenue: 0,
              totalProducts: 0,
              totalUsers: 0,
              todayOrders: 0,
              todayRevenue: 0,
              monthlyOrders: 0,
              monthlyRevenue: 0,
              ordersGrowth: 0,
              revenueGrowth: 0,
            },
          });
        }
      },
      fetchSalesAnalytics: async (period = "daily", days = 30) => {
        try {
          const response = await ApiClient.getSalesAnalytics(period, days);
          console.log("Fetched sales analytics:", response.data);
          const data = response.data as { salesData: SalesAnalytics[] };
          set({ salesAnalytics: data.salesData });
        } catch (error) {
          console.error("Error fetching sales analytics:", error);
          // Leave salesAnalytics as null so component can use fallback data
          console.warn(
            "Sales analytics API failed, component will use fallback data"
          );
        }
      },
      fetchOrderStatusDistribution: async () => {
        try {
          const response = await ApiClient.getOrderStatusDistribution();
          console.log("Fetched order status distribution:", response.data);
          const data = response.data as {
            statusDistribution: OrderStatusDistribution[];
          };
          set({ orderStatusDistribution: data.statusDistribution });
        } catch (error) {
          console.error("Error fetching order status distribution:", error);
          // Leave orderStatusDistribution as null so component can use fallback data
          console.warn(
            "Order status distribution API failed, component will use fallback data"
          );
        }
      },
    }),
    {
      name: "dashboard-analytics-storage",
    }
  )
);

export default useDashboardAnalyticsStore;
