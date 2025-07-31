import React from "react";
import { X, ShoppingCart, Heart, Star, Truck, Shield } from "lucide-react";
import { Product } from "../types";
import useCartStore from "../store/cart.store";
import useWishlistStore from "../store/wishlist.store";
import { useAuth } from "../contexts/AuthContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { user } = useAuth();

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1, user?.id);
    onClose();
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id, user?.id);
    } else {
      addToWishlist(product, user?.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-african-brown mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-african-gold fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="text-3xl font-bold text-african-terracotta mb-4">
                  KSh {product.price.toLocaleString()}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.availability === "in-stock"
                        ? "bg-green-100 text-green-800"
                        : product.availability === "limited"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.availability === "in-stock" && "✓ In Stock"}
                    {product.availability === "limited" && "⚠ Limited Stock"}
                    {product.availability === "out-of-stock" &&
                      "✗ Out of Stock"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-african-brown mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Cultural Story */}
              <div className="bg-african-cream p-4 rounded-xl">
                <h3 className="font-semibold text-african-brown mb-2 flex items-center">
                  <span className="mr-2">🏺</span> Cultural Heritage
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.culturalStory}
                </p>
              </div>

              {/* Features */}
              <div className="flex space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Authentic Guarantee</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.availability === "out-of-stock"}
                  className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.availability === "out-of-stock"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-african-terracotta text-white hover:bg-african-terracotta-dark transform hover:scale-105"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`px-6 py-3 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isLiked
                      ? "border-african-red bg-african-red text-white hover:bg-african-red-dark"
                      : "border-african-red text-african-red hover:bg-african-red hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
