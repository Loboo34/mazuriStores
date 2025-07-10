import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";

const Settings: React.FC = () => {
  const { adminUser, updateAdminProfile, changePassword } = useAdmin();

  // Debug admin state
  useEffect(() => {
    console.log("Settings component loaded, adminUser:", adminUser);
    console.log("isAuthenticated:", !!adminUser);
    if (adminUser) {
      console.log("Admin details:", {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasToken: !!adminUser.token,
      });

      // Sync form data with admin user
      setFormData((prev) => ({
        ...prev,
        name: adminUser.name || "",
      }));
    }
  }, [adminUser]);
  const [formData, setFormData] = useState({
    name: adminUser?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const success = await updateAdminProfile(formData.name);
      if (success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log("Password update started, adminUser:", adminUser);
    console.log("Form data:", {
      hasCurrentPassword: !!formData.currentPassword,
      hasNewPassword: !!formData.newPassword,
      hasConfirmPassword: !!formData.confirmPassword,
    });

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      setLoading(false);
      return;
    }

    // Check if admin user is available
    if (!adminUser) {
      console.error("No admin user available for password change");
      setMessage({
        type: "error",
        text: "Authentication error. Please log in again.",
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Calling changePassword function...");
      const success = await changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      console.log("changePassword result:", success);

      if (success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setMessage({
          type: "error",
          text: "Failed to update password. Please check your current password.",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "profile"
                  ? "border-african-terracotta text-african-terracotta"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "security"
                  ? "border-african-terracotta text-african-terracotta"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Security
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Information
                </h3>

                {/* Current Info Display */}
                <div className="bg-african-cream rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-african-terracotta" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{adminUser?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-african-terracotta" />
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="font-medium capitalize">
                          {adminUser?.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-african-terracotta" />
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-medium">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || formData.name === adminUser?.name}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      loading || formData.name === adminUser?.name
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-african-terracotta text-white hover:bg-african-terracotta-dark transform hover:scale-105"
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Updating..." : "Update Profile"}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h3>
                <p className="text-gray-600 mb-6">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-african-terracotta text-white hover:bg-african-terracotta-dark transform hover:scale-105"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? "Updating..." : "Update Password"}</span>
                  </button>
                </form>
              </div>

              {/* Security Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Security Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use a unique password that you don't use elsewhere</li>
                  <li>
                    • Make it at least 8 characters long with mixed case
                    letters, numbers, and symbols
                  </li>
                  <li>• Don't share your password with anyone</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
