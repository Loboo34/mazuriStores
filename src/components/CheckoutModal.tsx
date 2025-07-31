import React, { useState } from "react";
import { X, Smartphone, MapPin, User, Phone, Banknote } from "lucide-react";
import useCartStore from "../store/cart.store";
import { useAuth } from "../contexts/AuthContext";
import useOrderStore from "../store/order.store";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { makeOrder } = useOrderStore();
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "mpesa" as "mpesa" | "cash",
    deliveryOption: "delivery" as "delivery" | "pickup",
    deliveryAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const { user } = useAuth();

  // Calculate total from cart store
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  const handleNext = () => {
    // Validation for step 2 (delivery info)
    if (step === 2) {
      const currentName = orderData.name || user?.name || "";
      const currentPhone = orderData.phone || user?.phone || "";

      if (
        orderData.deliveryOption === "delivery" &&
        !orderData.address.trim()
      ) {
        alert("Please enter a delivery address");
        return;
      }
      if (!currentName.trim()) {
        alert("Please enter your name");
        return;
      }
      if (!currentPhone.trim()) {
        alert("Please enter your phone number");
        return;
      }
    }

    if (step < 3) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const order = {
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
        customerInfo: {
          name: orderData.name || user?.name || "",
          phone: orderData.phone || user?.phone || "",
          address: orderData.address,
        },
        paymentMethod: orderData.paymentMethod,
        deliveryOption: orderData.deliveryOption,
        deliveryAddress: orderData.deliveryAddress || orderData.address,
      };

      await makeOrder(order);
      console.log("order", order);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-african-brown mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You'll receive a confirmation SMS shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-african-terracotta text-white py-3 rounded-full hover:bg-african-terracotta-dark transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-african-brown">
              Checkout - Step {step} of 3
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center mt-4 space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    s <= step
                      ? "bg-african-terracotta text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      s < step ? "bg-african-terracotta" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-african-brown mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3 p-3 bg-african-cream rounded-lg"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-african-terracotta">
                      KSh{" "}
                      {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-african-terracotta">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-african-brown mb-4">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={orderData.name || user?.name || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={orderData.phone || user?.phone || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-african-brown mb-2">
                    Delivery Option
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        orderData.deliveryOption === "delivery"
                          ? "border-african-terracotta bg-african-cream"
                          : "border-gray-200 hover:border-african-terracotta"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={orderData.deliveryOption === "delivery"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-african-terracotta" />
                        <span className="font-medium">Delivery</span>
                      </div>
                    </label>

                    <label
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        orderData.deliveryOption === "pickup"
                          ? "border-african-terracotta bg-african-cream"
                          : "border-gray-200 hover:border-african-terracotta"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={orderData.deliveryOption === "pickup"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <span className="text-2xl block mb-1">🏪</span>
                        <span className="font-medium">Pickup</span>
                      </div>
                    </label>
                  </div>
                </div>

                {orderData.deliveryOption === "delivery" && (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="address"
                      placeholder="Enter your full delivery address (including street, area, city, and any landmarks)"
                      value={orderData.address}
                      onChange={handleChange}
                      rows={3}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold resize-none"
                    />
                    {orderData.deliveryOption === "delivery" &&
                      !orderData.address && (
                        <p className="text-xs text-gray-500 mt-1">
                          Please provide a detailed address for accurate
                          delivery
                        </p>
                      )}
                  </div>
                )}

                {orderData.deliveryOption === "pickup" && (
                  <div className="bg-african-cream p-4 rounded-lg">
                    <h4 className="font-semibold text-african-brown mb-2">
                      Pickup Location:
                    </h4>
                    <p className="text-sm text-gray-700">
                      Mazuri Stores
                      <br />
                      Ukunda-Ramisi Rd, Ukunda, Kenya
                      <br />
                      Mon-Sat: 8:00 AM - 7:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-african-brown mb-4">
                Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    orderData.paymentMethod === "mpesa"
                      ? "border-african-terracotta bg-african-cream"
                      : "border-gray-200 hover:border-african-terracotta"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={orderData.paymentMethod === "mpesa"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <span className="font-medium">M-Pesa</span>
                  </div>
                </label>

                <label
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    orderData.paymentMethod === "cash"
                      ? "border-african-terracotta bg-african-cream"
                      : "border-gray-200 hover:border-african-terracotta"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={orderData.paymentMethod === "cash"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Banknote className="w-8 h-8 mx-auto mb-2 text-green-700" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </label>
              </div>

              <div className="bg-african-cream p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-african-brown mb-2">
                  Order Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-african-terracotta text-african-terracotta rounded-full hover:bg-african-terracotta hover:text-white transition-all duration-300"
            >
              Back
            </button>
          )}

          <button
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={loading}
            className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-african-terracotta text-white hover:bg-african-terracotta-dark transform hover:scale-105"
            }`}
          >
            {loading ? "Processing..." : step === 3 ? "Place Order" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
