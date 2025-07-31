export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  culturalStory: string;
  availability: "in-stock" | "out-of-stock" | "limited";
  rating: number;
  reviews: number;
  tags: string[];
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: "customer" | "admin";
  isAdmin: boolean; // Keep for backward compatibility
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "mpesa" | "card";
  deliveryOption: "pickup" | "delivery";
  address: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
}

export interface makeOrder {
  items: {
    product: string;
    quantity: number;
  }[];
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  paymentMethod: "mpesa" | "cash";
  deliveryOption: "pickup" | "delivery";
  deliveryAddress?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  todayOrders: number;
  todayRevenue: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super-admin";
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
