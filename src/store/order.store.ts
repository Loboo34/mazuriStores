import {create} from "zustand";
import {persist} from "zustand/middleware";
import {makeOrder, Order} from "../types";
import ApiClient from "../utils/api";


interface OrderState {
    orders: Order[];
    makeOrder: (order: makeOrder) => Promise<void>;
    removeOrder: (id: string) => Promise<void>;
    updateOrder: (id: string, status: string) => Promise<void>;
    fetchAllOrders: () => Promise<void>;
    fetchOrderById: (id: string) => Promise<Order | null>;
    fetchOrderStatus: () => Promise<Order[]>;
    fetchOrdersByUserId: () => Promise<Order[]>;
}

const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            orders: [],
            makeOrder: async (order: makeOrder) => {
                try {
                    const newOrder = await ApiClient.createOrder(order);
                    set((state) => ({
                        orders: [...state.orders, newOrder.data as Order],
                    }));
                    console.log("Order created:", newOrder.data);
                } catch (error) {
                    console.error("Failed to make order:", error);
                }
            },
            removeOrder: async (id: string) => {
                try {
                    await ApiClient.cancelOrder(id);
                    set((state) => ({
                        orders: state.orders.filter((order) => order.id !== id),
                    }));
                } catch (error) {
                    console.error("Failed to remove order:", error);
                }
            },
            updateOrder: async (id: string, status: string) => {
                try {
                    await ApiClient.updateOrderStatus(id, status);
                    set((state) => ({
                        orders: state.orders.map((order) =>
                            order.id === id ? { ...order, status: status as Order['status'] } : order
                        ),
                    }));
                } catch (error) {
                    console.error("Failed to update order:", error);
                }
            },
            fetchAllOrders: async () => {
                try {
                    const response = await ApiClient.getAllOrders();
                    const orders = Array.isArray(response?.orders)
                        ? response.orders
                        : [];
                    set({orders});
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                }
            },
            fetchOrderById: async (id: string) => {
                try {
                    const response = await ApiClient.getOrder(id);
                    return response.data as Order;
                } catch (error) {
                    console.error("Failed to fetch order by ID:", error);
                    return null;
                }
            },
            fetchOrderStatus: async () => {
                try {
                    const response = await ApiClient.getOrderStats();
                    return response.data as Order[];
                } catch (error) {
                    console.error("Failed to fetch orders by status:", error);
                    return [];
                }
            },
            fetchOrdersByUserId: async () => {
                try {
                    const response = await ApiClient.getMyOrders();
                    return response.data as Order[];
                } catch (error) {
                    console.error("Failed to fetch orders by user ID:", error);
                    return [];
                }
            },
        }),
        {
            name: "order-storage",
            
        }
    )
)

export default useOrderStore;
