import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types";
import ApiClient from "../utils/api";
type NewProduct = Omit<Product, "id">;

interface ProductState {
  products: Product[];
  createProduct: (product: NewProduct, file?: File) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Product) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
}

const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      createProduct: async (product: NewProduct, file?: File) => {
        try {
          // Ensure API client has the latest token
          ApiClient.refreshToken();

          let productData: NewProduct | FormData;

          // Only use FormData if we have an actual file to upload
          if (file && file instanceof File) {
            console.log("Creating product with file upload");
            // Create FormData for file upload
            productData = new FormData();
            productData.append("name", product.name);
            productData.append("price", product.price.toString());
            productData.append("category", product.category);
            productData.append("description", product.description);
            productData.append("culturalStory", product.culturalStory);
            productData.append("availability", product.availability);
            productData.append("stock", (product.stock || 0).toString());
            productData.append("rating", (product.rating || 4.5).toString());
            productData.append("reviews", (product.reviews || 0).toString());
            productData.append("tags", JSON.stringify(product.tags));
            productData.append("image", file);
          } else {
            console.log("Creating product with image URL");
            // Use regular JSON for URL-based images
            productData = product;
          }

          const newProduct = await ApiClient.addProduct(productData);
          set((state) => ({
            products: [...state.products, newProduct.data as Product],
          }));
        } catch (error) {
          console.error("Failed to create product:", error);
          throw error;
        }
      },
      removeProduct: async (id: string) => {
        try {
          await ApiClient.deleteProduct(id);
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        } catch (error) {
          console.error("Failed to remove product:", error);
        }
      },
      updateProduct: async (id: string, updatedProduct: Product) => {
        try {
          await ApiClient.updateProduct(id, updatedProduct);
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id ? updatedProduct : product
            ),
          }));
        } catch (error) {
          console.error("Failed to update product:", error);
        }
      },
      fetchAllProducts: async () => {
        try {
          const response = await ApiClient.getProducts();
          const products = Array.isArray(response?.products)
            ? response.products
            : [];
          set({ products });
        } catch (error) {
          console.error("Failed to fetch products:", error);
          set({ products: [] });
        }
      },
      fetchProductById: async (id: string) => {
        try {
          const response = await ApiClient.getProduct(id);
          return (response.data as Product) || null;
        } catch (error) {
          console.error("Failed to fetch product by ID:", error);
          return null;
        }
      },
    }),
    {
      name: "product-storage",
    }
  )
);

export default useProductStore;
