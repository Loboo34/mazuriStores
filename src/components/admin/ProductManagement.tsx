import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  Save,
  Upload,
  Package,
} from "lucide-react";
import useProductStore from "../../store/product.store";
import { Product } from "../../types";

import { categories } from "../../data/products";
type NewProduct = Omit<Product, "id">;

interface ProductFormData {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  culturalStory: string;
  availability: Product["availability"];
  stock: number;
  tags: string;
  imageFile?: File; // Add file property
}

const ProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSave: () => void;
}> = ({ isOpen, onClose, title, productForm, setProductForm, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    // Store the file and create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setProductForm((prev) => ({
      ...prev,
      imageFile: file,
      image: previewUrl, // Show preview
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KSh)
              </label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL or Upload File
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={productForm.image}
                onChange={(e) => {
                  setProductForm((prev) => ({
                    ...prev,
                    image: e.target.value,
                    imageFile: undefined, // Clear file when URL is entered
                  }));
                  // Reset file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
                placeholder="Enter image URL or click upload button to select file"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-4 py-2 bg-african-terracotta text-white rounded-lg hover:bg-african-terracotta-dark transition-colors duration-200 flex items-center"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            {productForm.image && (
              <div className="mt-2">
                <img
                  src={productForm.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              >
                <option value="">Select category</option>
                {categories
                  .filter((cat) => cat.slug !== "all")
                  .map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={productForm.availability}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    availability: e.target.value as Product["availability"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              >
                <option value="in-stock">In Stock</option>
                <option value="limited">Limited Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  stock: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cultural Story
            </label>
            <textarea
              value={productForm.culturalStory}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  culturalStory: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              placeholder="Tell the cultural story behind this product"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={productForm.tags}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              placeholder="handmade, traditional, authentic"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-african-terracotta text-white rounded-lg hover:bg-african-terracotta-dark transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductManagement: React.FC = () => {
  const {
    products,
    createProduct,
    updateProduct,
    fetchAllProducts,
    // fetchProductById,
    removeProduct,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    price: 0,
    image: "",
    category: "",
    description: "",
    culturalStory: "",
    availability: "in-stock" as Product["availability"],
    stock: 0,
    tags: "",
    imageFile: undefined,
  });

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setProductForm({
      name: "",
      price: 0,
      image: "",
      category: "",
      description: "",
      culturalStory: "",
      availability: "in-stock",
      stock: 0,
      tags: "",
      imageFile: undefined,
    });
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      price: product.price || 0,
      image: product.image || "",
      category: product.category || "",
      description: product.description || "",
      culturalStory: product.culturalStory || "",
      availability: product.availability || "in-stock",
      stock: product.stock || 0,
      tags: (product.tags || []).join(", "),
      imageFile: undefined, // Clear any previous file selection
    });
    setShowEditModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData: NewProduct = {
        ...productForm,
        rating: 4.5,
        reviews: 0,
        tags: productForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (editingProduct) {
        updateProduct(editingProduct.id, {
          ...productData,
          id: editingProduct.id,
        });
        setShowEditModal(false);
        setEditingProduct(null);
      } else {
        // Pass the file if available, otherwise use URL
        await createProduct(productData, productForm.imageFile);
        setShowAddModal(false);
      }

      // Reset form
      setProductForm({
        name: "",
        price: 0,
        image: "",
        category: "",
        description: "",
        culturalStory: "",
        availability: "in-stock",
        stock: 0,
        tags: "",
        imageFile: undefined,
      });
    } catch (error) {
      console.error("Error saving product:", error);

      // Check if it's an authentication error
      if (
        error instanceof Error &&
        error.message.includes("Access token is required")
      ) {
        alert("Authentication required. Please log in again as an admin.");
      } else {
        alert("Failed to save product. Please try again.");
      }
    }
  };

  const handleDeleteProduct = (id: string) => {
    removeProduct(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={handleAddProduct}
          className="mt-4 sm:mt-0 bg-african-terracotta text-white px-4 py-2 rounded-lg hover:bg-african-terracotta-dark transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Stock
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name || "Product image"}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name || "Unnamed Product"}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {product.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-african-cream text-african-brown rounded-full text-xs font-medium">
                      {categories.find((cat) => cat.slug === product.category)
                        ?.name || product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold">
                    KSh {(product.price || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">{product.stock || 0}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.availability === "in-stock"
                          ? "bg-green-100 text-green-800"
                          : product.availability === "limited"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.availability === "in-stock"
                        ? "In Stock"
                        : product.availability === "limited"
                        ? "Limited"
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-african-terracotta rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        productForm={productForm}
        setProductForm={setProductForm}
        onSave={handleSaveProduct}
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        productForm={productForm}
        setProductForm={setProductForm}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
