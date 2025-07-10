import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AdminUser, Order, Product, DashboardStats, SalesData } from "../types";
import { mockOrders, mockSalesData } from "../data/mockData";
import { products } from "../data/products";
import ApiClient from "../utils/api";

interface AdminContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAdminProfile: (name: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  dashboardStats: DashboardStats;
  salesData: SalesData[];
  orders: Order[];
  products: Product[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderCustomerInfo: (
    orderId: string,
    customerInfo: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      address: string;
    }
  ) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [adminProducts, setAdminProducts] = useState<Product[]>(products);
  const [salesData] = useState<SalesData[]>(mockSalesData);

  // Load admin user from localStorage on mount
  useEffect(() => {
    const loadAdminFromStorage = () => {
      console.log("AdminContext: Loading admin from localStorage...");
      const storedAdmin = localStorage.getItem("mazuri_admin");
      console.log("Stored admin data:", storedAdmin);

      if (storedAdmin) {
        try {
          const admin = JSON.parse(storedAdmin);
          console.log("Parsed admin:", admin);

          // Verify token is still valid (in real app, verify with backend)
          if (admin.token && admin.token.length > 0) {
            console.log("Loading admin from localStorage, setting token...");
            setAdminUser(admin);
            // Set token in API client for authenticated requests
            ApiClient.setToken(admin.token);
            console.log("Admin user set successfully:", admin);
          } else {
            console.log("No valid token found in stored admin");
            localStorage.removeItem("mazuri_admin");
          }
        } catch (error) {
          console.error("Error parsing stored admin:", error);
          localStorage.removeItem("mazuri_admin");
        }
      } else {
        console.log("No stored admin found");
      }

      setIsLoading(false);
    };

    loadAdminFromStorage();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting admin login for:", email);
      const response = await ApiClient.login(email, password);

      console.log("Login response:", response);

      if (response.success && response.data) {
        const { user, token } = response.data;

        console.log("User role:", user.role);

        // Check if user has admin role
        if (user.role !== "admin") {
          console.log("User is not admin, login failed");
          return false;
        }

        const admin: AdminUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: "admin",
          token: token,
        };

        console.log("Admin login successful, setting admin user:", admin);
        setAdminUser(admin);
        localStorage.setItem("mazuri_admin", JSON.stringify(admin));
        // Set token in API client for authenticated requests
        ApiClient.setToken(token);
        return true;
      }

      console.log("Login failed - no success or data");
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      return false;
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("mazuri_admin");
    // Remove token from API client
    ApiClient.removeToken();
  };

  const updateAdminProfile = async (name: string): Promise<boolean> => {
    if (!adminUser) return false;

    try {
      // Make API call to update the profile
      const response = await ApiClient.updateProfile(name);

      if (response.success) {
        const updatedAdmin = {
          ...adminUser,
          name,
          updatedAt: new Date().toISOString(),
        };

        setAdminUser(updatedAdmin);
        localStorage.setItem("mazuri_admin", JSON.stringify(updatedAdmin));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating admin profile:", error);
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    console.log("changePassword called, adminUser:", adminUser);

    if (!adminUser) {
      console.error("No admin user found in changePassword");
      console.log(
        "localStorage admin data:",
        localStorage.getItem("mazuri_admin")
      );
      return false;
    }

    try {
      console.log("Attempting to change password for admin:", adminUser.email);
      console.log("Current token:", adminUser.token ? "Present" : "Missing");

      const response = await ApiClient.changePassword(
        currentPassword,
        newPassword
      );

      console.log("API response:", response);

      if (response.success) {
        console.log("Password changed successfully");
        return true;
      }
      console.error("Password change failed:", response);
      return false;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const updateOrderCustomerInfo = (
    orderId: string,
    customerInfo: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      address: string;
    }
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              ...customerInfo,
              phone: customerInfo.customerPhone,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAdminProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setAdminProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setAdminProducts((prev) => prev.filter((product) => product.id !== id));
  };

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = {
    totalOrders: orders.length,
    totalRevenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, order) => sum + order.total, 0),
    totalProducts: adminProducts.length,
    totalUsers: 150, // Mock data for now
    todayOrders: orders.filter(
      (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length,
    todayRevenue: orders
      .filter(
        (o) =>
          new Date(o.createdAt).toDateString() === new Date().toDateString() &&
          o.status === "delivered"
      )
      .reduce((sum, order) => sum + order.total, 0),
    monthlyOrders: orders.filter(
      (o) =>
        new Date(o.createdAt).getMonth() === new Date().getMonth() &&
        new Date(o.createdAt).getFullYear() === new Date().getFullYear()
    ).length,
    monthlyRevenue: orders
      .filter(
        (o) =>
          new Date(o.createdAt).getMonth() === new Date().getMonth() &&
          new Date(o.createdAt).getFullYear() === new Date().getFullYear() &&
          o.status === "delivered"
      )
      .reduce((sum, order) => sum + order.total, 0),
    ordersGrowth: 12.5, // Mock growth percentage
    revenueGrowth: 8.3, // Mock growth percentage
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
        updateAdminProfile,
        changePassword,
        dashboardStats,
        salesData,
        orders,
        products: adminProducts,
        updateOrderStatus,
        updateOrderCustomerInfo,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
