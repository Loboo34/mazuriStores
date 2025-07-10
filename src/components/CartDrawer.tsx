import React from "react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import useCartStore from "../store/cart.store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { items, updateCartItem, removeFromCart } = useCartStore();

  // Calculate derived values
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    onCheckout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 shadow-2xl overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-african-brown flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6" />
              <span>Shopping Cart ({itemCount})</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold text-african-brown mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some beautiful African decor to get started!
              </p>
              <button
                onClick={onClose}
                className="bg-african-terracotta text-white px-6 py-3 rounded-full hover:bg-african-terracotta-dark transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4 bg-african-cream p-4 rounded-xl"
                >
                  <img
                    src={item.product.image || "/placeholder-image.png"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-african-brown text-sm line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-african-terracotta font-bold">
                      KSh {item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1 bg-african-terracotta text-white rounded-full hover:bg-african-terracotta-dark transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-african-brown">Total:</span>
              <span className="text-2xl font-bold text-african-terracotta">
                KSh {total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-african-gold text-african-brown font-semibold py-3 rounded-full hover:bg-african-gold-dark transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={onClose}
              className="w-full mt-3 text-african-terracotta font-medium py-2 hover:text-african-terracotta-dark transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
