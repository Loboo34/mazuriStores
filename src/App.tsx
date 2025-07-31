import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";

import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoryFilter from "./components/CategoryFilter";
import ProductGrid from "./components/ProductGrid";
import QuickViewModal from "./components/QuickViewModal";
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import CheckoutModal from "./components/CheckoutModal";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AdminPanel from "./components/admin/AdminPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import WishlistPage from "./pages/WishlistPage";

import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
//import { products } from "./data/products";

import { Product } from "./types";
import useProductStore from "./store/product.store";

// Main Store Component
const Store: React.FC = () => {
  const { products, fetchAllProducts } = useProductStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  //fetch products on mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Check for auth parameter
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsAuthOpen(true);
      setSearchParams({}); // Clear the parameter
    }
  }, [searchParams, setSearchParams]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleAuthClick = () => {
    setIsAuthOpen(true);
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={handleCartClick}
        onAuthClick={handleAuthClick}
        onWishlistClick={handleWishlistClick}
      />

      <main>
        <Hero />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-african-brown">
                {selectedCategory === "all"
                  ? "All Products"
                  : selectedCategory
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>

            <ProductGrid
              products={filteredProducts}
              onQuickView={handleQuickView}
            />
          </div>
        </motion.div>

        {/* Promotional Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-african-gold to-african-orange py-16 my-12"
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              🎯 Special Offer: 20% Off on All Artifacts!
            </h2>
            <p className="text-xl text-white mb-8 opacity-90">
              Discover authentic African artifacts and bring home a piece of
              history
            </p>
            <button
              onClick={() => setSelectedCategory("artifacts")}
              className="bg-white text-african-brown font-semibold px-8 py-3 rounded-full hover:bg-african-cream transition-all duration-300 transform hover:scale-105"
            >
              Shop Artifacts Now
            </button>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-african-cream py-16"
        >
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-3xl font-display font-bold text-african-brown mb-4">
              Stay Connected with African Culture
            </h2>
            <p className="text-gray-700 mb-8">
              Subscribe to get the latest updates on new arrivals, cultural
              stories, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-african-terracotta rounded-full focus:outline-none focus:ring-2 focus:ring-african-gold"
              />
              <button className="bg-african-terracotta text-white font-semibold px-8 py-3 rounded-full hover:bg-african-terracotta-dark transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Modals */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

// Protected Route Component for Admin
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/?login=true" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// AppContent component with role-based routing
const AppContent: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect after login (not on initial load)
    if (isAuthenticated && user) {
      if (user.role === "admin" && location.pathname !== "/admin") {
        navigate("/admin", { replace: true });
      }
      // Optionally, redirect customers to "/" if they're on /admin
      if (user.role === "customer" && location.pathname === "/admin") {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminProvider>
                <AdminPanel />
              </AdminProvider>
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
