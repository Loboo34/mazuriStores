import React, { useState } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import useCartStore from "../store/cart.store";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCartStore();
  const { user, logout } = useAuth();

  // Calculate itemCount from the store
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Debug logging
  //console.log("Header - itemCount:", itemCount);
  //console.log("Header - items:", items);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-african-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-display font-bold text-african-terracotta">
              Mazuri Stores
            </h1>
            <p className="text-xs text-african-brown -mt-1">
              Authentic African Decor
            </p>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for African decor, artifacts..."
                className="w-full pl-10 pr-4 py-2 border-2 border-african-terracotta rounded-full focus:outline-none focus:ring-2 focus:ring-african-gold transition-all duration-300"
              />
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-african-terracotta hover:text-african-red transition-colors duration-300">
              <Heart className="w-6 h-6" />
            </button>

            <button
              onClick={onCartClick}
              className="relative text-african-terracotta hover:text-african-red transition-colors duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg z-10">
                  {itemCount}
                </span>
              )}
            </button>

            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-african-brown">
                    Hello, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-african-terracotta text-white px-4 py-2 rounded-full hover:bg-african-terracotta-dark transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="text-african-terracotta hover:text-african-red transition-colors duration-300"
                >
                  <User className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-african-terracotta hover:text-african-red transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border-2 border-african-terracotta rounded-full focus:outline-none focus:ring-2 focus:ring-african-gold"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <button className="flex items-center space-x-3 text-african-terracotta hover:text-african-red transition-colors duration-300">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </button>

            <button
              onClick={() => {
                onCartClick();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 text-african-terracotta hover:text-african-red transition-colors duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart ({itemCount})</span>
            </button>

            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-african-brown">Hello, {user.name}</p>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-african-terracotta text-white px-4 py-2 rounded-lg hover:bg-african-terracotta-dark transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-african-terracotta hover:text-african-red transition-colors duration-300"
              >
                <User className="w-5 h-5" />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
