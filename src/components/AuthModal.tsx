import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "customer" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "customer",
}) => {
  const [currentMode, setCurrentMode] = useState<"customer" | "register">(
    initialMode
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [localError, setLocalError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, register, loading, error } = useAuth();


  // Update mode when initialMode changes
  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode]);

  // Clear errors when switching between modes
  useEffect(() => {
    setLocalError("");
  }, [currentMode]);

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", password: "", phone: "" });
      setLocalError("");
      setCurrentMode("customer");
      setIsLoggingIn(false);
    }
  }, [isOpen]);



  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError("Email and password are required");
      return;
    }

    if (currentMode === "register" && (!formData.name || !formData.phone)) {
      setLocalError("All fields are required for registration");
      return;
    }

    try {
      let success = false;

      if (currentMode === "customer") {
        setIsLoggingIn(true);
        success = await login(formData.email, formData.password);
        
        if (!success) {
          setIsLoggingIn(false);
        }
        // If successful, the useEffect will handle redirection
      } else {
        success = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );

        if (success) {
          onClose();
          setFormData({ name: "", email: "", password: "", phone: "" });
        }
      }
    } catch (err: any) {
      setLocalError(err.message || "An unexpected error occurred");
      setIsLoggingIn(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModeSwitch = (mode: "customer" | "register") => {
    setCurrentMode(mode);
    setLocalError("");
    setFormData({ name: "", email: "", password: "", phone: "" });
    setIsLoggingIn(false);
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-display font-bold text-african-brown text-center">
            {currentMode === "customer" ? "Welcome Back" : "Join Mazuri Stores"}
          </h2>
          <p className="text-gray-600 text-center mt-2">
            {currentMode === "customer"
              ? "Sign in to your account"
              : "Create your account"}
          </p>

          {/* Mode Selection Tabs */}
          <div className="flex mt-4 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleModeSwitch("customer")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 ${
                currentMode === "customer"
                  ? "bg-african-terracotta text-white"
                  : "text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleModeSwitch("register")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 ${
                currentMode === "register"
                  ? "bg-african-terracotta text-white"
                  : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {displayError}
            </div>
          )}

          {/* Show login processing message */}
          {isLoggingIn && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 p-3 rounded-lg text-sm flex items-center">
              <div className="w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Signing you in...</span>
            </div>
          )}

          {/* Name field for registration only */}
          {currentMode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={currentMode === "register"}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
              />
            </div>
          )}

          {/* Email field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
            />
          </div>

          {/* Phone field for registration only */}
          {currentMode === "register" && (
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (e.g., 0712345678)"
                value={formData.phone}
                onChange={handleChange}
                required={currentMode === "register"}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1 ml-10">
                Enter your phone number (will be converted to international
                format)
              </p>
            </div>
          )}

          {/* Password field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isLoggingIn}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading || isLoggingIn
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-african-terracotta text-white hover:bg-african-terracotta-dark transform hover:scale-105"
            }`}
          >
            {loading || isLoggingIn
              ? "Please wait..."
              : currentMode === "customer"
              ? "Sign In"
              : "Create Account"}
          </button>

          {/* Demo Credentials */}
          {/* <div className="text-center">
            <div className="bg-african-cream p-4 rounded-lg">
              <p className="text-sm text-african-brown font-medium mb-2">
                Demo Credentials:
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Customer: john@example.com / password123
              </p>
              <p className="text-xs text-gray-600">
                Admin: admin@mazuristores.com / admin123
              </p>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
