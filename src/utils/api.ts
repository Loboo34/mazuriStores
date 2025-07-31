import { Product, User, Order, makeOrder } from "../types";
const API_BASE_URL = "http://localhost:5000/api/v1";
type NewProduct = Omit<Product, "id">;
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    this.token = localStorage.getItem("authToken");

    // If no regular auth token, check for admin token
    if (!this.token) {
      const adminData = localStorage.getItem("mazuri_admin");
      if (adminData) {
        try {
          const admin = JSON.parse(adminData);
          if (admin.token) {
            this.token = admin.token;
            console.log("Loaded admin token from localStorage");
          }
        } catch (error) {
          console.error("Error parsing admin data:", error);
        }
      }
    }
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Don't set Content-Type for FormData, let browser set it with boundary
    const isFormData = options.body instanceof FormData;

    // Debug: Log token status
    console.log(
      "API Request:",
      endpoint,
      "Token:",
      this.token ? "Present" : "Missing"
    );

    if (this.token) {
      console.log("Token preview:", this.token.substring(0, 50) + "...");
    }

    const config: RequestInit = {
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug: Log the actual headers being sent
    console.log("Request headers:", config.headers);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  setToken(token: string) {
    console.log(
      "Setting token in API client:",
      token ? "Token provided" : "No token"
    );
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  refreshToken() {
    // Refresh token from localStorage (useful for already instantiated clients)
    console.log("Refreshing token...");
    console.log(
      "authToken in localStorage:",
      localStorage.getItem("authToken")
    );
    console.log(
      "mazuri_admin in localStorage:",
      localStorage.getItem("mazuri_admin")
    );

    this.token = localStorage.getItem("authToken");

    // If no regular auth token, check for admin token
    if (!this.token) {
      const adminData = localStorage.getItem("mazuri_admin");
      if (adminData) {
        try {
          const admin = JSON.parse(adminData);
          if (admin.token) {
            this.token = admin.token;
            console.log("Refreshed admin token from localStorage");
          }
        } catch (error) {
          console.error("Error parsing admin data:", error);
        }
      }
    }

    console.log(
      "Current token after refresh:",
      this.token ? "Present" : "Missing"
    );
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      user: any;
      token: string;
      refreshToken: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, phone: string) {
    return this.request<{
      user: any;
      token: string;
      refreshToken: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
  }

  async getProfile() {
    return this.request<{ user: any }>("/auth/profile");
  }

  async updateProfile(name: string) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // Products endpoints
  async getProducts(params?: URLSearchParams) {
    const query = params ? `?${params.toString()}` : "";
    const response = await this.request<{
      products: Product[];
      pagination: any;
    }>(`/products/${query}`);
    return response.data; // <-- Only returns the data property!
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async addProduct(productData: NewProduct | FormData) {
    // Check if it's FormData (contains files) or regular JSON
    const isFormData = productData instanceof FormData;

    // Debug: Log what data is being sent
    if (isFormData) {
      console.log("Sending FormData with entries:");
      for (const [key, value] of (productData as FormData).entries()) {
        console.log(`${key}:`, value);
      }
    } else {
      console.log("Sending JSON data:", productData);
    }

    // Don't override headers for FormData, let the request method handle it
    return this.request("/products", {
      method: "POST",
      body: isFormData ? productData : JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Product) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Orders endpoints
  //user
  async createOrder(orderData: makeOrder) {
    return this.request("/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders() {
    return this.request("/orders/my-orders");
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: "PATCH",
    });
  }

  //admin
  async getAllOrders(params?: URLSearchParams) {
    const query = params ? `?${params.toString()}` : "";
    const response = await this.request<{
      orders: Order[];
      pagination: any;
    }>(`/orders/${query}`);
    console.log("order:", response);
    return response.data;
  }
  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
  async updateOrderCustomerInfo(id: string, customerInfo: User) {
    return this.request(`/orders/${id}/customer-info`, {
      method: "PATCH",
      body: JSON.stringify(customerInfo),
    });
  }

  async getOrderStats() {
    return this.request("/orders/admin/stats");
  }
  async getDailySales() {
    return this.request("/orders/admin/sales");
  }

  async addCart(productId: string, quantity: number) {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async getCartItems() {
    return this.request("/cart");
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request(`/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(id: string) {
    return this.request(`/cart/${id}`, {
      method: "DELETE",
    });
  }

  //dashboard stats
  async getDashboardStats() {
    return this.request("/admin/dashboard/stats");
  }
  async getRevenueByCategory(days: number = 30) {
    return this.request(`/admin/dashboard/revenue-by-category?days=${days}`);
  }
  async getSalesAnalytics(period: string = "daily", days: number = 30) {
    return this.request(
      `/admin/dashboard/sales-analytics?period=${period}&days=${days}`
    );
  }
  async getOrderStatusDistribution() {
    return this.request("/admin/dashboard/order-status");
  }
  async getTopSellingProducts() {
    return this.request("/admin/dashboard/top-products");
  }

  // Wishlist endpoints
  async getWishlist() {
    return this.request("/wishlist");
  }

  async addToWishlist(productId: string) {
    return this.request("/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request(`/wishlist/${productId}`, {
      method: "DELETE",
    });
  }

  async clearWishlist() {
    return this.request("/wishlist", {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
