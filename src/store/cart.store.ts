import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiClient from "../utils/api";
import { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    userId?: string
  ) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  fetchCartItems: () => Promise<CartItem[]>;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: async (
        product: Product,
        quantity: number,
        userId?: string
      ) => {
        // Only call backend if user is authenticated
        if (userId) {
          try {
            console.log(
              "Adding to cart for user:",
              userId,
              "product:",
              product.id,
              "quantity:",
              quantity
            );
            const cartData = await ApiClient.addCart(product.id, quantity);
            // Backend returns cart object directly: { _id, user, items: [...], total, ... }
            const cart = cartData as unknown as {
              items: { product: Product; quantity: number }[];
            };
            set({
              items: cart.items.map(
                (item: { product: Product; quantity: number }) => ({
                  product: item.product, // populated Product object
                  quantity: item.quantity,
                })
              ),
            });
          } catch (error) {
            console.error("Failed to add to cart via API:", error);
            // Fallback to local storage if API fails
            set((state) => {
              const existingItem = state.items.find(
                (item) => item.product.id === product.id
              );
              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.product.id === product.id
                      ? { ...item, quantity: item.quantity + quantity }
                      : item
                  ),
                };
              } else {
                return {
                  items: [...state.items, { product, quantity }],
                };
              }
            });
          }
        } else {
          // Guest user: update local storage only
          console.log("Adding to local cart for guest user");
          set((state) => {
            const existingItem = state.items.find(
              (item) => item.product.id === product.id
            );
            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            } else {
              return {
                items: [...state.items, { product, quantity }],
              };
            }
          });
        }
      },

      updateCartItem: async (id: string, quantity: number) => {
        try {
          const cartData = await ApiClient.updateCartItem(id, quantity);
          // Backend returns updated cart object
          const cart = cartData as unknown as {
            items: { product: Product; quantity: number }[];
          };
          set({
            items: cart.items.map(
              (item: { product: Product; quantity: number }) => ({
                product: item.product,
                quantity: item.quantity,
              })
            ),
          });
        } catch (error) {
          console.error("Failed to update cart item:", error);
        }
      },

      removeFromCart: async (id: string) => {
        try {
          const cartData = await ApiClient.removeCartItem(id);
          // Backend returns updated cart object
          const cart = cartData as unknown as {
            items: { product: Product; quantity: number }[];
          };
          set({
            items: cart.items.map(
              (item: { product: Product; quantity: number }) => ({
                product: item.product,
                quantity: item.quantity,
              })
            ),
          });
        } catch (error) {
          console.error("Failed to remove from cart:", error);
        }
      },
      fetchCartItems: async () => {
        try {
          const cartData = await ApiClient.getCartItems();
          const cart = cartData as unknown as {
            items: { product: Product; quantity: number }[];
          };
          set({
            items: cart.items.map(
              (item: { product: Product; quantity: number }) => ({
                product: item.product, // populated Product object
                quantity: item.quantity,
              })
            ),
          });
          return cart.items;
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
          return [];
        }
      },
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;
