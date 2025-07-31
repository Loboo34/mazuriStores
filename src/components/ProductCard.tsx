import React, { useState } from "react";
import { ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { Product } from "../types";

import useCartStore from "../store/cart.store";
import useWishlistStore from "../store/wishlist.store";
import { useAuth } from "../contexts/AuthContext";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { user } = useAuth();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, user?.id);
    console.log(`Added ${product.name} to cart`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.id, user?.id);
    } else {
      addToWishlist(product, user?.id);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product?.image || "/placeholder-image.png"}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay with actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center space-x-3 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleQuickView}
            className="bg-white text-african-terracotta p-2 rounded-full hover:bg-african-gold hover:text-white transition-all duration-300 transform hover:scale-110"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddToCart}
            className="bg-african-terracotta text-white p-2 rounded-full hover:bg-african-terracotta-dark transition-all duration-300 transform hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleLike}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isLiked
                ? "bg-african-red text-white"
                : "bg-white text-african-red hover:bg-african-red hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          {product.availability === "limited" && (
            <span className="bg-african-orange text-white px-2 py-1 rounded-full text-xs font-semibold">
              Limited Stock
            </span>
          )}
          {product.availability === "out-of-stock" && (
            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-african-brown text-lg mb-2 line-clamp-2 group-hover:text-african-terracotta transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-african-gold fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-african-terracotta">
            KSh {product.price.toLocaleString()}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.availability === "out-of-stock"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              product.availability === "out-of-stock"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-african-gold text-african-brown hover:bg-african-gold-dark transform hover:scale-105"
            }`}
          >
            {product.availability === "out-of-stock"
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
