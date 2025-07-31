import { Request, Response } from "express";
import Order from "../models/order.model";
import Product from "../models/product.model";
import User from "../models/user.model";
import {
  asyncHandler,
  createError,
} from "../middlewares/errorHandler.middleware";

// Create new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    items,
    customerInfo,
    paymentMethod,
    deliveryOption,
    deliveryAddress,
    notes,
  } = req.body;
  const userId = req.user?.id; // This might be undefined for guest orders

  // Generate order number
  const generateOrderNumber = () => {
    const prefix = "ORD";
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp.slice(-8)}-${random}`;
  };

  // Validate and calculate order totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      throw createError(`Product not found: ${item.product}`, 404);
    }

    if (product.availability === "out-of-stock") {
      throw createError(`Product out of stock: ${product.name}`, 400);
    }

    if (product.stock < item.quantity) {
      throw createError(`Insufficient stock for product: ${product.name}`, 400);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : product.image || "",
    });

    // Update product stock
    product.stock -= item.quantity;

    // Ensure required fields are present before saving
    if (!product.image && product.images && product.images.length > 0) {
      product.image = product.images[0];
    }

    await product.save();
  }

  // Calculate delivery fee
  const deliveryFee = deliveryOption === "delivery" ? 0 : 0; // Free delivery
  const tax = 0; // No tax for now
  const total = subtotal + deliveryFee + tax;

  // Create order data
  const orderData: any = {
    orderNumber: generateOrderNumber(),
    customerInfo,
    items: orderItems,
    subtotal,
    deliveryFee,
    tax,
    total,
    paymentMethod,
    deliveryOption,
    deliveryAddress:
      deliveryOption === "delivery" ? deliveryAddress : undefined,
    notes,
  };

  // Add user if authenticated, otherwise it's a guest order
  if (userId) {
    orderData.user = userId;
  }

  // Create order
  const order = await Order.create(orderData);

  // Populate user data if exists
  if (userId) {
    await order.populate("user", "name email phone");
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: { order },
  });
});

// Get all orders (Admin only)
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const paymentStatus = req.query.paymentStatus as string;
    const search = req.query.search as string;
    const sort = (req.query.sort as string) || "-createdAt";

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customerInfo.name": { $regex: search, $options: "i" } },
        { "customerInfo.email": { $regex: search, $options: "i" } },
        { "customerInfo.phone": { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "name images")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
);

// Get user orders
export const getUserOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    // Build query
    const query: any = { user: userId };

    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
);

// Get order by ID
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("items.product", "name images sku");

    if (!order) {
      throw createError("Order not found", 404);
    }

    // Check if user can access this order
    if (userRole !== "admin" && order.user?.toString() !== userId) {
      throw createError("Access denied", 403);
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  }
);

// Update order status (Admin only)
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      throw createError("Order not found", 404);
    }

    const oldStatus = order.status;
    order.status = status;

    if (notes) {
      order.notes = notes;
    }

    // Set delivery date if order is delivered
    if (status === "delivered" && oldStatus !== "delivered") {
      order.actualDelivery = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: { order },
    });
  }
);

// Update order customer info (Admin only)
export const updateOrderCustomerInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { customerInfo, deliveryAddress } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      throw createError("Order not found", 404);
    }

    if (customerInfo) {
      order.customerInfo = { ...order.customerInfo, ...customerInfo };
    }

    if (deliveryAddress !== undefined) {
      order.deliveryAddress = deliveryAddress;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order customer information updated successfully",
      data: { order },
    });
  }
);

// Cancel order
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cancelReason } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const order = await Order.findById(id).populate("items.product");

  if (!order) {
    throw createError("Order not found", 404);
  }

  // Check if user can cancel this order
  if (userRole !== "admin" && order.user?.toString() !== userId) {
    throw createError("Access denied", 403);
  }

  // Check if order can be cancelled
  if (["shipped", "delivered", "cancelled"].includes(order.status)) {
    throw createError("Order cannot be cancelled", 400);
  }

  // Restore product stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = "cancelled";
  order.cancelReason = cancelReason;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: { order },
  });
});

// Get order statistics (Admin only)
export const getOrderStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          averageOrderValue: { $avg: "$total" },
        },
      },
    ]);

    // Get recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ["delivered", "shipped"] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats[0],
        recentOrders,
        recentRevenue: recentRevenue[0]?.revenue || 0,
      },
    });
  }
);

// Get daily sales data (Admin only)
export const getDailySales = asyncHandler(
  async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["delivered", "shipped"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
          date: { $first: "$createdAt" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { salesData },
    });
  }
);

export default {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderCustomerInfo,
  cancelOrder,
  getOrderStats,
  getDailySales,
};
