import { Router } from 'express';
import {
  getDashboardStats,
  getSalesAnalytics,
  getOrderStatusDistribution,
  getTopSellingProducts,
  getRecentOrders,
  getLowStockProducts,
  getCustomerAnalytics,
  getRevenueByCategory
} from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/sales-analytics', getSalesAnalytics);
router.get('/dashboard/order-status', getOrderStatusDistribution);
router.get('/dashboard/top-products', getTopSellingProducts);
router.get('/dashboard/recent-orders', getRecentOrders);
router.get('/dashboard/low-stock', getLowStockProducts);
router.get('/dashboard/customer-analytics', getCustomerAnalytics);
router.get('/dashboard/revenue-by-category', getRevenueByCategory);

export default router;