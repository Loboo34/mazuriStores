import { Request, Response } from 'express';
import Order from '../models/order.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import { asyncHandler } from '../middlewares/errorHandler.middleware';

// Get dashboard overview statistics
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Get current month stats
  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    todayOrders,
    todayRevenue,
    monthlyOrders,
    monthlyRevenue,
    lastMonthOrders,
    lastMonthRevenue
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: true }),
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),
    Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfToday },
          status: { $in: ['delivered', 'shipped'] }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          status: { $in: ['delivered', 'shipped'] }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    Order.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    }),
    Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $in: ['delivered', 'shipped'] }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
  ]);

  // Calculate growth percentages
  const ordersGrowth = lastMonthOrders > 0 
    ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100 
    : 0;

  const revenueGrowth = lastMonthRevenue[0]?.total > 0 
    ? ((monthlyRevenue[0]?.total || 0) - lastMonthRevenue[0]?.total) / lastMonthRevenue[0]?.total * 100 
    : 0;

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        totalUsers,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        monthlyOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100
      }
    }
  });
});

// Get sales analytics
export const getSalesAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const period = req.query.period as string || 'daily';
  const days = parseInt(req.query.days as string) || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let groupBy: any;
  let sortBy: any;

  switch (period) {
    case 'hourly':
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      };
      sortBy = { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 };
      break;
    case 'weekly':
      groupBy = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      sortBy = { '_id.year': 1, '_id.week': 1 };
      break;
    case 'monthly':
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
      sortBy = { '_id.year': 1, '_id.month': 1 };
      break;
    default: // daily
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
      sortBy = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'shipped', 'processing'] }
      }
    },
    {
      $group: {
        _id: groupBy,
        orders: { $sum: 1 },
        revenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        date: { $first: '$createdAt' }
      }
    },
    { $sort: sortBy }
  ]);

  res.status(200).json({
    success: true,
    data: { salesData }
  });
});

// Get order status distribution
export const getOrderStatusDistribution = asyncHandler(async (req: Request, res: Response) => {
  const statusDistribution = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$total' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: { statusDistribution }
  });
});

// Get top selling products
export const getTopSellingProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const days = parseInt(req.query.days as string) || 30;

const startDate = new Date();
startDate.setDate(startDate.getDate() - days);

  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        productName: { $first: '$items.name' },
        productImage: { $first: '$items.image' }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit }
  ]);

  res.status(200).json({
    success: true,
    data: { topProducts }
  });
});

// Get recent orders
export const getRecentOrders = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('orderNumber customerInfo total status createdAt');

  res.status(200).json({
    success: true,
    data: { recentOrders }
  });
});

// Get low stock products
export const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const threshold = parseInt(req.query.threshold as string) || 10;

  const lowStockProducts = await Product.find({
    stock: { $lte: threshold },
    isActive: true
  })
    .sort({ stock: 1 })
    .select('name images stock availability sku');

  res.status(200).json({
    success: true,
    data: { lowStockProducts }
  });
});

// Get customer analytics
export const getCustomerAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    newCustomers,
    returningCustomers,
    topCustomers
  ] = await Promise.all([
    User.countDocuments({
      createdAt: { $gte: startDate },
      role: 'customer'
    }),
    Order.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: { orderCount: { $gt: 1 } }
      },
      {
        $count: 'returningCustomers'
      }
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['delivered', 'shipped'] }
        }
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 },
          customerInfo: { $first: '$customerInfo' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      newCustomers,
      returningCustomers: returningCustomers[0]?.returningCustomers || 0,
      topCustomers
    }
  });
});

// Get revenue by category
export const getRevenueByCategory = asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const categoryRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $sum: 1 },
        itemsSold: { $sum: '$items.quantity' }
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: { categoryRevenue }
  });
});

export default {
  getDashboardStats,
  getSalesAnalytics,
  getOrderStatusDistribution,
  getTopSellingProducts,
  getRecentOrders,
  getLowStockProducts,
  getCustomerAnalytics,
  getRevenueByCategory
};