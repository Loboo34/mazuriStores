import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import {
  asyncHandler,
  createError,
} from "../middlewares/errorHandler.middleware";

//get items in cart
export const getCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw createError("User ID is required", 400);
    }

    const cartItems = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cartItems) {
      throw createError("Cart not found", 404);
    }

    res.status(200).json(cartItems);
  }
);

//add item to cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;
  if (!userId || !productId || !quantity) {
    throw createError("User ID, product ID, and quantity are required", 400);
  }

  // Get product to get the price
  const product = await Product.findById(productId);
  if (!product) {
    throw createError("Product not found", 404);
  }

  // Find existing cart or create new one
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart
    cart = new Cart({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
    });
  } else {
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
  }

  await cart.save();

  // Populate product details and return
  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.status(200).json(populatedCart);
});

export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params; // Product ID (not cart item ID)
    const { quantity } = req.body;

    if (!userId || !id || quantity === undefined) {
      throw createError("User ID, product ID, and quantity are required", 400);
    }

    // Find cart item by product ID instead of cart item ID
    const cart = await Cart.findOneAndUpdate(
      { user: userId, "items.product": id },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    ).populate("items.product");

    if (!cart) {
      throw createError("Cart item not found", 404);
    }

    return res.status(200).json(cart);
  }
);

export const removeFromCart = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params; // Product ID (not cart item ID)

    if (!userId || !id) {
      return res
        .status(400)
        .json({ message: "User ID and product ID are required" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: id } } },
      { new: true }
    ).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json(cart);
  }
);
