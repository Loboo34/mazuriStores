import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types";
import ApiClient from "../utils/api";

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product, userId?: string) => Promise<void>;
  removeFromWishlist: (productId: string, userId?: string) => Promise<void>;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  fetchWishlistItems: (userId?: string) => Promise<void>;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: async (product: Product, userId?: string) => {
        if (userId) {
          // Authenticated user: sync with backend
          try {
            await ApiClient.addToWishlist(product.id);
            set((state) => ({
              items: [
                ...state.items.filter((item) => item.id !== product.id),
                product,
              ],
            }));
          } catch (error) {
            console.error("Failed to add to wishlist via API:", error);
            // Fallback to local storage
            set((state) => ({
              items: [
                ...state.items.filter((item) => item.id !== product.id),
                product,
              ],
            }));
          }
        } else {
          // Guest user: update local storage only
          set((state) => ({
            items: [
              ...state.items.filter((item) => item.id !== product.id),
              product,
            ],
          }));
        }
      },

      removeFromWishlist: async (productId: string, userId?: string) => {
        if (userId) {
          // Authenticated user: sync with backend
          try {
            await ApiClient.removeFromWishlist(productId);
            set((state) => ({
              items: state.items.filter((item) => item.id !== productId),
            }));
          } catch (error) {
            console.error("Failed to remove from wishlist via API:", error);
            // Fallback to local storage
            set((state) => ({
              items: state.items.filter((item) => item.id !== productId),
            }));
          }
        } else {
          // Guest user: update local storage only
          set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
          }));
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      fetchWishlistItems: async (userId?: string) => {
        if (userId) {
          try {
            const wishlistData = await ApiClient.getWishlist();
            set({ items: wishlistData.data || [] });
          } catch (error) {
            console.error("Failed to fetch wishlist items:", error);
          }
        }
        // For guest users, items are already loaded from localStorage
      },
    }),
    { name: "wishlist-storage" }
  )
);

export default useWishlistStore;
