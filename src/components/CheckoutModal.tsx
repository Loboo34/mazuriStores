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

      if (orderData.deliveryOption === "delivery" && !orderData.address) {
        alert("Please select a delivery area");
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

      // Validate phone number format for Kenyan numbers
      const phoneRegex = /^254[0-9]{9}$/;
      if (!phoneRegex.test(currentPhone.replace(/[\s\-\(\)]/g, ""))) {
        alert(
          "Please enter a valid Kenyan phone number (format: 254XXXXXXXXX)"
        );
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
      const finalPhone = orderData.phone || user?.phone || "";

      const order = {
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
        customerInfo: {
          name: orderData.name || user?.name || "",
          phone: finalPhone.replace(/[\s\-()]/g, ""), // Clean phone number
          address:
            orderData.deliveryOption === "delivery"
              ? `${orderData.address}${
                  orderData.deliveryAddress
                    ? ` - ${orderData.deliveryAddress}`
                    : ""
                }`
              : orderData.address,
        },
        paymentMethod: orderData.paymentMethod,
        deliveryOption: orderData.deliveryOption,
        deliveryAddress:
          orderData.deliveryOption === "delivery"
            ? `${orderData.address}${
                orderData.deliveryAddress
                  ? ` - ${orderData.deliveryAddress}`
                  : ""
              }`
            : orderData.deliveryAddress || orderData.address,
      };

      await makeOrder(order);
      console.log("order", order);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Format phone number for Kenyan format
    if (name === "phone") {
      let formattedValue = value.replace(/[^\d]/g, ""); // Remove non-digits

      // Auto-format to Kenyan format
      if (formattedValue.startsWith("0")) {
        formattedValue = "254" + formattedValue.substring(1);
      } else if (
        formattedValue.startsWith("7") ||
        formattedValue.startsWith("1")
      ) {
        formattedValue = "254" + formattedValue;
      }

      setOrderData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
            Thank you for your order! {!user && "As a guest, "}You'll receive a
            confirmation SMS at {orderData.phone || user?.phone} shortly.
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-african-brown">
                  Order Summary
                </h3>
                {!user && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">
                      Have an account?{" "}
                      <button
                        type="button"
                        className="text-african-terracotta hover:underline font-medium"
                        onClick={() => {
                          // This would typically open a login modal
                          // For now, just show an alert
                          alert(
                            "Login functionality would be implemented here"
                          );
                        }}
                      >
                        Sign in
                      </button>
                    </p>
                    <span className="text-xs bg-african-cream text-african-brown px-2 py-1 rounded-full">
                      Checking out as guest
                    </span>
                  </div>
                )}
              </div>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-african-brown">
                  Delivery Information
                </h3>
                {!user && (
                  <span className="text-xs bg-african-cream text-african-brown px-2 py-1 rounded-full">
                    Guest Checkout
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder={user ? "Full Name" : "Enter your full name"}
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
                    placeholder={
                      user ? "Phone Number" : "Phone Number (e.g., 0712345678)"
                    }
                    value={orderData.phone || user?.phone || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                  />
                  {!user && (
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your Kenyan phone number for order updates
                    </p>
                  )}
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
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="address"
                        value={orderData.address}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold appearance-none bg-white"
                      >
                        <option value="">
                          Select delivery area in Mombasa
                        </option>
                        <optgroup label="Mombasa Island">
                          <option value="Mombasa CBD">Mombasa CBD</option>
                          <option value="Old Town">Old Town</option>
                          <option value="Majengo">Majengo</option>
                          <option value="Mvita">Mvita</option>
                          <option value="Tudor">Tudor</option>
                          <option value="Kizingo">Kizingo</option>
                          <option value="Kilindini">Kilindini</option>
                        </optgroup>
                        <optgroup label="Mombasa Mainland">
                          <option value="Nyali">Nyali</option>
                          <option value="Bamburi">Bamburi</option>
                          <option value="Kisauni">Kisauni</option>
                          <option value="Shanzu">Shanzu</option>
                          <option value="Mtwapa">Mtwapa</option>
                          <option value="Kongowea">Kongowea</option>
                          <option value="Jomvu">Jomvu</option>
                          <option value="Port Reitz">Port Reitz</option>
                          <option value="Changamwe">Changamwe</option>
                          <option value="Chaani">Chaani</option>
                        </optgroup>
                        <optgroup label="South Coast">
                          <option value="Likoni">Likoni</option>
                          <option value="Shelly Beach">Shelly Beach</option>
                          <option value="Tiwi">Tiwi</option>
                          <option value="Diani">Diani</option>
                          <option value="Ukunda">Ukunda</option>
                          <option value="Msambweni">Msambweni</option>
                        </optgroup>
                        <optgroup label="North Coast">
                          <option value="Kilifi">Kilifi</option>
                          <option value="Malindi">Malindi</option>
                          <option value="Watamu">Watamu</option>
                          <option value="Kikambala">Kikambala</option>
                        </optgroup>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {orderData.address && (
                      <div className="relative">
                        <input
                          type="text"
                          name="deliveryAddress"
                          placeholder="Specific address/landmark (e.g., Building name, street, house number)"
                          value={orderData.deliveryAddress}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Optional: Add specific details like building name,
                          street, or house number
                        </p>
                      </div>
                    )}

                    {orderData.deliveryOption === "delivery" &&
                      !orderData.address && (
                        <p className="text-xs text-gray-500">
                          Please select your delivery area for accurate delivery
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
