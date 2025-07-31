import { create } from 'zustand';
import { Order } from '../types';
import { apiService } from '../services/api';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  fetchOrders: (filters?: any) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  createOrder: async (orderData: Partial<Order>) => {
    set({ isLoading: true, error: null });
    try {
      const order = await apiService.createOrder(orderData);
      set(state => ({
        orders: [order, ...state.orders],
        currentOrder: order,
        isLoading: false
      }));
      return order;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create order',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchOrders: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await apiService.getOrders(filters);
      set({ orders, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),
}));