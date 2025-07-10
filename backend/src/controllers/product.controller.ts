import { Request, Response } from "express";
import Product from "../models/product.model";
import {
  asyncHandler,
  createError,
} from "../middlewares/errorHandler.middleware";
import { uploadToCloudinary } from "../utils/imageUpload.util";

// Get all products
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const availability = req.query.availability as string;
    const featured = req.query.featured as string;
    const sort = (req.query.sort as string) || "-createdAt";

    // Build query
    const query: any = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    if (availability) {
      query.availability = availability;
    }

    if (featured === "true") {
      query.featured = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
);

// Get product by ID
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      throw createError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  }
);

// Create new product (Admin only)
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productData = req.body;

    // Parse FormData fields that come as strings
    if (productData.price) {
      productData.price = parseFloat(productData.price);
    }
    if (productData.stock) {
      productData.stock = parseInt(productData.stock);
    }
    if (productData.rating) {
      productData.rating = parseFloat(productData.rating);
    }
    if (productData.reviews) {
      productData.reviews = parseInt(productData.reviews);
    }
    if (productData.tags && typeof productData.tags === "string") {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch {
        // If parsing fails, split by comma as fallback
        productData.tags = productData.tags
          .split(",")
          .map((tag: string) => tag.trim());
      }
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.price) {
      throw createError("Name, description, and price are required", 400);
    }

    // Validate required fields specific to your model
    if (!productData.culturalStory) {
      throw createError("Cultural story is required", 400);
    }

    if (!productData.category) {
      throw createError("Category is required", 400);
    }

    // Validate category enum
    const validCategories = [
      "home-decor",
      "artifacts",
      "kitchen",
      "wall-art",
      "woven-items",
      "hair-accessories",
      "beaded-mirror",
    ];

    if (!validCategories.includes(productData.category)) {
      throw createError("Invalid category provided", 400);
    }

    // Handle image uploads
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, "products");
      productData.image = imageUrl;
    }

    // Validate that we have an image (either uploaded or URL provided)
    if (!productData.image) {
      throw createError("Product image is required", 400);
    }

    // Validate stock is a number
    if (productData.stock !== undefined && isNaN(Number(productData.stock))) {
      throw createError("Stock must be a valid number", 400);
    }

    // Set default stock if not provided
    if (!productData.stock) {
      productData.stock = 0;
    }

    // Create the product (this is where the error might occur)
    const product = await Product.create(productData);

    // Only send response if product creation succeeds
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  }
);

// Update product (Admin only)
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);

    if (!product) {
      throw createError("Product not found", 404);
    }

    // Handle image uploads
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, "products");
      updateData.image = imageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      // If update failed, throw error before sending a response
      throw createError("Failed to update product", 400);
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  }
);

// Delete product (Admin only)
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw createError("Product not found", 404);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);

// Toggle product featured status (Admin only)
export const toggleFeatured = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw createError("Product not found", 404);
    }

    product.featured = !product.featured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${
        product.featured ? "featured" : "unfeatured"
      } successfully`,
      data: { product },
    });
  }
);

// Get featured products
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 8;

    const products = await Product.find({
      featured: true,
      isActive: true,
      availability: { $ne: "out-of-stock" },
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: { products },
    });
  }
);

// Get products by category
export const getProductsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const sort = (req.query.sort as string) || "-createdAt";

    const skip = (page - 1) * limit;

    const products = await Product.find({
      category,
      isActive: true,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ category, isActive: true });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
);

// Search products
export const searchProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    if (!q) {
      throw createError("Search query is required", 400);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { tags: { $in: [new RegExp(q as string, "i")] } },
            { culturalStory: { $regex: q, $options: "i" } },
          ],
        },
      ],
    })
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { tags: { $in: [new RegExp(q as string, "i")] } },
            { culturalStory: { $regex: q, $options: "i" } },
          ],
        },
      ],
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
);

// Get product statistics (Admin only)
export const getProductStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
          inactiveProducts: {
            $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
          },
          featuredProducts: {
            $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] },
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ["$availability", "out-of-stock"] }, 1, 0] },
          },
          averagePrice: { $avg: "$price" },
          totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
    ]);

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          averagePrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats[0],
        categoryDistribution: categoryStats,
      },
    });
  }
);

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getProductStats,
};
