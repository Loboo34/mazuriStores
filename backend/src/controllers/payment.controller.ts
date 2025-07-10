import { Request, Response } from 'express';
import Order from '../models/order.model';
import Transaction from '../models/transaction.model';
import { 
  initiateSTKPush, 
  queryStkPushStatus, 
  validateCallback, 
  extractPaymentDetails 
} from '../utils/mpesa.util';
import { asyncHandler, createError } from '../middlewares/errorHandler.middleware';
import { MpesaCallbackRequest } from '../types/express';

// Initiate M-Pesa STK Push payment
export const initiateMpesaPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, phoneNumber, amount } = req.body;
  const userId = req.user?.id;

  // Validate order
  const order = await Order.findById(orderId);
  if (!order) {
    throw createError('Order not found', 404);
  }

  // Check if user owns the order or is admin
  if (order.user && order.user.toString() !== userId && req.user?.role !== 'admin') {
    throw createError('Access denied', 403);
  }

  // Check if order is already paid
  if (order.paymentStatus === 'paid') {
    throw createError('Order is already paid', 400);
  }

  // Validate amount matches order total
  if (Math.abs(amount - order.total) > 0.01) {
    throw createError('Payment amount does not match order total', 400);
  }

  try {
    // Initiate STK Push
    const stkResponse = await initiateSTKPush(
      phoneNumber,
      amount,
      order.orderNumber,
      `Payment for order ${order.orderNumber}`
    );

    // Create transaction record
    const transaction = await Transaction.create({
      order: orderId,
      user: userId,
      amount,
      paymentMethod: 'mpesa',
      mpesaData: {
        merchantRequestId: stkResponse.MerchantRequestID,
        checkoutRequestId: stkResponse.CheckoutRequestID,
        phoneNumber
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully. Please check your phone for M-Pesa prompt.',
      data: {
        merchantRequestId: stkResponse.MerchantRequestID,
        checkoutRequestId: stkResponse.CheckoutRequestID,
        transactionId: transaction.transactionId,
        customerMessage: stkResponse.CustomerMessage
      }
    });
  } catch (error) {
    console.error('M-Pesa payment initiation error:', error);
    throw createError('Failed to initiate payment. Please try again.', 500);
  }
});

// Query M-Pesa payment status
export const queryMpesaPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { checkoutRequestId } = req.params;

  try {
    // Find transaction
    const transaction = await Transaction.findOne({
      'mpesaData.checkoutRequestId': checkoutRequestId
    }).populate('order');

    if (!transaction) {
      throw createError('Transaction not found', 404);
    }

    // Query M-Pesa status
    const statusResponse = await queryStkPushStatus(checkoutRequestId);

    // Update transaction with status
    transaction.mpesaData = {
      ...transaction.mpesaData,
      resultCode: parseInt(statusResponse.ResultCode),
      resultDesc: statusResponse.ResultDesc
    };

    if (statusResponse.ResultCode === '0') {
      transaction.status = 'completed';
      transaction.processedAt = new Date();

      // Update order payment status
      const order = await Order.findById(transaction.order);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }
    } else {
      transaction.status = 'failed';
    }

    await transaction.save();

    res.status(200).json({
      success: true,
      data: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        resultCode: statusResponse.ResultCode,
        resultDesc: statusResponse.ResultDesc
      }
    });
  } catch (error) {
    console.error('M-Pesa status query error:', error);
    throw createError('Failed to query payment status', 500);
  }
});

// Handle M-Pesa callback
export const handleMpesaCallback = asyncHandler(async (req: MpesaCallbackRequest, res: Response) => {
  console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

  // Validate callback structure
  if (!validateCallback(req.body)) {
    console.error('Invalid M-Pesa callback structure');
    return res.status(400).json({
      ResultCode: 1,
      ResultDesc: 'Invalid callback structure'
    });
  }

  try {
    const paymentDetails = extractPaymentDetails(req.body);
    
    if (!paymentDetails) {
      console.error('Failed to extract payment details from callback');
      return res.status(400).json({
        ResultCode: 1,
        ResultDesc: 'Failed to extract payment details'
      });
    }

    // Find transaction
    const transaction = await Transaction.findOne({
      'mpesaData.checkoutRequestId': paymentDetails.checkoutRequestId
    }).populate('order');

    if (!transaction) {
      console.error('Transaction not found for checkout request:', paymentDetails.checkoutRequestId);
      return res.status(404).json({
        ResultCode: 1,
        ResultDesc: 'Transaction not found'
      });
    }

    // Update transaction with callback data
    transaction.mpesaData = {
      ...transaction.mpesaData,
      ...paymentDetails
    };

    if (paymentDetails.resultCode === 0) {
      // Payment successful
      transaction.status = 'completed';
      transaction.processedAt = new Date();

      // Update order
      const order = await Order.findById(transaction.order);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }

      console.log('Payment completed successfully:', transaction.transactionId);
    } else {
      // Payment failed
      transaction.status = 'failed';
      console.log('Payment failed:', paymentDetails.resultDesc);
    }

    await transaction.save();

    // Respond to M-Pesa
    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully'
    });
  } catch (error) {
    console.error('M-Pesa callback processing error:', error);
    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Internal server error'
    });
  }
});

// Handle M-Pesa timeout
export const handleMpesaTimeout = asyncHandler(async (req: Request, res: Response) => {
  console.log('M-Pesa Timeout received:', JSON.stringify(req.body, null, 2));

  try {
    const { CheckoutRequestID } = req.body;

    if (CheckoutRequestID) {
      // Find and update transaction
      const transaction = await Transaction.findOne({
        'mpesaData.checkoutRequestId': CheckoutRequestID
      });

      if (transaction) {
        transaction.status = 'failed';
        transaction.mpesaData = {
          ...transaction.mpesaData,
          resultDesc: 'Transaction timeout'
        };
        await transaction.save();
      }
    }

    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Timeout processed successfully'
    });
  } catch (error) {
    console.error('M-Pesa timeout processing error:', error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Internal server error'
    });
  }
});

// Get payment history for user
export const getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
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

  // Get transactions with pagination
  const transactions = await Transaction.find(query)
    .populate('order', 'orderNumber total status')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
});

// Get all transactions (Admin only)
export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;
  const paymentMethod = req.query.paymentMethod as string;
  const search = req.query.search as string;

  // Build query
  const query: any = {};

  if (status) {
    query.status = status;
  }

  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  if (search) {
    query.$or = [
      { transactionId: { $regex: search, $options: 'i' } },
      { 'mpesaData.mpesaReceiptNumber': { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get transactions with pagination
  const transactions = await Transaction.find(query)
    .populate('order', 'orderNumber customerInfo total')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
});

// Get transaction by ID
export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const transaction = await Transaction.findById(id)
    .populate('order', 'orderNumber customerInfo total status')
    .populate('user', 'name email phone');

  if (!transaction) {
    throw createError('Transaction not found', 404);
  }

  // Check if user can access this transaction
  const transactionUserId = typeof transaction.user === 'string' 
    ? transaction.user 
    : (transaction.user as any)._id.toString();
  
  if (userRole !== 'admin' && transactionUserId !== userId) {
    throw createError('Access denied', 403);
  }

  res.status(200).json({
    success: true,
    data: { transaction }
  });
});

// Get payment statistics (Admin only)
export const getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        pendingTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        mpesaTransactions: {
          $sum: { $cond: [{ $eq: ['$paymentMethod', 'mpesa'] }, 1, 0] }
        },
        cardTransactions: {
          $sum: { $cond: [{ $eq: ['$paymentMethod', 'card'] }, 1, 0] }
        },
        cashTransactions: {
          $sum: { $cond: [{ $eq: ['$paymentMethod', 'cash'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get recent transaction trends (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentStats = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: null,
        recentTransactions: { $sum: 1 },
        recentAmount: { $sum: '$amount' },
        recentCompleted: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      ...recentStats[0]
    }
  });
});

export default {
  initiateMpesaPayment,
  queryMpesaPaymentStatus,
  handleMpesaCallback,
  handleMpesaTimeout,
  getPaymentHistory,
  getAllTransactions,
  getTransactionById,
  getPaymentStats
};