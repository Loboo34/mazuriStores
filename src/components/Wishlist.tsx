import React from "react";
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react";
import useWishlistStore from "../store/wishlist.store";
import useCartStore from "../store/cart.store";
import { useAuth } from "../contexts/AuthContext";

interface WishlistProps {
  onQuickView?: (product: any) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onQuickView }) => {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { user } = useAuth();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1, user?.id);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId, user?.id);
  };

  const handleClearWishlist = () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      clearWishlist();
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-african-brown mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Start adding items to your wishlist by clicking the heart icon on
            products you love!
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-african-terracotta text-white px-6 py-3 rounded-full hover:bg-african-terracotta-dark transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-african-brown mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} in your
            wishlist
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />

              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  {onQuickView && (
                    <button
                      onClick={() => onQuickView(product)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-300"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                  )}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 bg-african-terracotta text-white rounded-full hover:bg-african-terracotta-dark transition-colors duration-300"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Wishlist indicator */}
              <div className="absolute top-3 right-3">
                <div className="p-2 bg-red-500 text-white rounded-full">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-african-terracotta">
                  KSh {product.price?.toLocaleString()}
                </span>
                {product.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-african-terracotta text-white py-2 px-4 rounded-lg hover:bg-african-terracotta-dark transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
