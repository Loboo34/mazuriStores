import { Router } from 'express';
import {
  initiateMpesaPayment,
  queryMpesaPaymentStatus,
  handleMpesaCallback,
  handleMpesaTimeout,
  getPaymentHistory,
  getAllTransactions,
  getTransactionById,
  getPaymentStats
} from '../controllers/payment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate, validateParams, schemas } from '../middlewares/validate.middleware';

const router = Router();

// M-Pesa callback routes (no authentication required)
router.post('/mpesa/callback', handleMpesaCallback);
router.post('/mpesa/timeout', handleMpesaTimeout);

// Protected routes
router.use(authenticate);

// User routes
router.post('/mpesa/initiate', validate(schemas.initiatePayment), initiateMpesaPayment);
router.get('/mpesa/status/:checkoutRequestId', queryMpesaPaymentStatus);
router.get('/history', getPaymentHistory);
router.get('/transaction/:id', validateParams(schemas.mongoId), getTransactionById);

// Admin routes
router.get('/admin/transactions', authorize('admin'), getAllTransactions);
router.get('/admin/stats', authorize('admin'), getPaymentStats);

export default router;