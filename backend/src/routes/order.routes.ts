import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderCustomerInfo,
  cancelOrder,
  getOrderStats,
  getDailySales
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate, validateParams, validateQuery, schemas } from '../middlewares/validate.middleware';

const router = Router();

router.post("/", validate(schemas.createOrder), createOrder);
router.get("/my-orders", validateQuery(schemas.pagination), getUserOrders);
router.get("/:id", validateParams(schemas.mongoId), getOrderById);
router.patch("/:id/cancel", validateParams(schemas.mongoId), cancelOrder);

// All routes require authentication
router.use(authenticate);

// User routes


// Admin routes
router.get('/', authorize('admin'), validateQuery(schemas.pagination), getAllOrders);
router.get('/admin/stats', authorize('admin'), getOrderStats);
router.get('/admin/sales', authorize('admin'), getDailySales);
router.patch('/:id/status', 
  authorize('admin'), 
  validateParams(schemas.mongoId), 
  validate(schemas.updateOrderStatus), 
  updateOrderStatus
);
router.patch('/:id/customer-info', 
  authorize('admin'), 
  validateParams(schemas.mongoId), 
  updateOrderCustomerInfo
);

export default router;