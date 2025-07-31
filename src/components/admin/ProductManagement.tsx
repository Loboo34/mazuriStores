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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState<{ image?: string }>({});

  useEffect(() => {
    if (productForm.imageFile) {
      setImageFile(productForm.imageFile);
      setImagePreview(productForm.image);
    } else if (productForm.image) {
      setImagePreview(productForm.image);
      setImageFile(undefined);
    } else {
      setImagePreview("");
      setImageFile(undefined);
    }
  }, [productForm.image, productForm.imageFile]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        image: "Please select a valid image file (JPG, PNG, GIF, WebP)",
      });
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ image: "File size must be less than 5MB" });
      return;
    }
    setErrors({});
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
    setProductForm((prev) => ({
      ...prev,
      imageFile: file,
      image: previewUrl,
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(undefined);
    setProductForm((prev) => ({
      ...prev,
      image: "",
      imageFile: undefined,
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

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Product Image *
            </label>
            {!imagePreview ? (
              <div className="relative">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    errors.image
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-african-gold"
                  }`}
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 text-center">
                    Click to upload image
                    <br />
                    <span className="text-xs text-gray-500">
                      Supports: JPG, PNG, GIF, WebP (Max 5MB)
                    </span>
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">{imageFile?.name}</p>
                    <p className="text-xs text-gray-500">
                      {imageFile
                        ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {errors.image && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h1m4 0h-1v4h1zm-9 0H7v4h1zm4-8h1m-1 0V7m0 1v1zm0 4h1m-1 0v1m0 4h1m-1 0v1m-4-8H7v4h1zm9 0h1v4h-1z"
                  />
                </svg>
                {errors.image}
              </p>
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
