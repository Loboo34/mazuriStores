import { Request, Response } from 'express';
import User from '../models/user.model';
import { asyncHandler, createError } from '../middlewares/errorHandler.middleware';

// Get all users (Admin only)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const role = req.query.role as string;

  // Build query
  const query: any = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  if (role) {
    query.role = role;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get users with pagination
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
});

// Get user by ID (Admin only)
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw createError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
});

// Update user (Admin only)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address, role, isActive } = req.body;

  const user = await User.findById(id);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check for duplicate email or phone
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: id } 
    });
    if (existingUser) {
      throw createError('Email is already taken', 400);
    }
  }

  if (phone && phone !== user.phone) {
    const existingUser = await User.findOne({ 
      phone, 
      _id: { $ne: id } 
    });
    if (existingUser) {
      throw createError('Phone number is already taken', 400);
    }
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

// Delete user (Admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (id === req.user?.id) {
    throw createError('You cannot delete your own account', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw createError('User not found', 404);
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Deactivate user (Admin only)
export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent admin from deactivating themselves
  if (id === req.user?.id) {
    throw createError('You cannot deactivate your own account', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw createError('User not found', 404);
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
    data: { user }
  });
});

// Activate user (Admin only)
export const activateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw createError('User not found', 404);
  }

  user.isActive = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User activated successfully',
    data: { user }
  });
});

// Get user statistics (Admin only)
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        inactiveUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
        },
        adminUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
        },
        customerUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'customer'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRegistrations = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      recentRegistrations
    }
  });
});

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUserStats
};