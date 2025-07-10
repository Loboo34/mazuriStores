import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import Settings from "./Settings";
import LoadingSpinner from "../LoadingSpinner";

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to home if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/?admin=true" replace />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "customers":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Customer Management
            </h2>
            <p className="text-gray-600">
              Customer management features coming soon...
            </p>
          </div>
        );
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export default AdminPanel;
