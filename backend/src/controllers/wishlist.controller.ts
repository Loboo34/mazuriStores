import { Request, Response } from "express";
import Wishlist from "../models/wishlist.model";
import Product from "../models/product.model";
import {
  asyncHandler,
  createError,
} from "../middlewares/errorHandler.middleware";

// Get user's wishlist
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError("Authentication required", 401);
  }

  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "items.product",
    model: "Product",
    select: "name price image category availability rating reviews",
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  return res.status(200).json({
    success: true,
    data: wishlist.items.map((item) => item.product),
    message: "Wishlist retrieved successfully",
  });
});

// Add item to wishlist
export const addToWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw createError("Authentication required", 401);
    }

    if (!productId) {
      throw createError("Product ID is required", 400);
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw createError("Product not found", 404);
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(200).json({
        success: true,
        message: "Item already in wishlist",
      });
    }

    // Add item to wishlist
    wishlist.items.push({
      product: productId,
      dateAdded: new Date(),
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Item added to wishlist successfully",
    });
  }
);

// Remove item from wishlist
export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw createError("Authentication required", 401);
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw createError("Wishlist not found", 404);
    }

    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist successfully",
    });
  }
);

// Clear entire wishlist
export const clearWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw createError("Authentication required", 401);
    }

    await Wishlist.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  }
);

// Get wishlist item count
export const getWishlistCount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw createError("Authentication required", 401);
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    const count = wishlist ? wishlist.items.length : 0;

    return res.status(200).json({
      success: true,
      data: { count },
      message: "Wishlist count retrieved successfully",
    });
  }
);
