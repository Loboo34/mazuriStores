import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken, generateRefreshToken } from "../utils/jwt.util";
import {
  asyncHandler,
  createError,
} from "../middlewares/errorHandler.middleware";
import { comparePassword } from "../utils/password.util";

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    throw createError("User with this email or phone already exists", 400);
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    phone,
   // address,
  });

  // Generate tokens
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = generateRefreshToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("🔍 Login attempt:", { email, password });

  // Find user by email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  console.log("🔍 Found user:", {
    email: user.email,
    storedHash: user.password,
  });

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  console.log("🔍 Password comparison:", {
    inputPassword: password,
    storedHash: user.password,
    isValid: isPasswordValid,
  });

  if (!isPasswordValid) {
    throw createError("Invalid  password", 401);
  }

  if (!user.isActive) {
    throw createError("Account is deactivated. Please contact support", 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = generateRefreshToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      token,
      refreshToken,
    },
  });
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  
  // Ensure user is authenticated
  if (!req.user) {
    throw createError("User not authenticated", 401);
  }

  const user = await User.findById(req.user?.id);

  if (!user) {
    throw createError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Update user profile
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, phone, address, dateOfBirth, gender } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      throw createError("User not found", 404);
    }

    // Check if phone number is already taken by another user
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({
        phone,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        throw createError("Phone number is already taken", 400);
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select("+password");

    if (!user) {
      throw createError("User not found", 404);
    }

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      throw createError("Current password is incorrect", 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);

// Logout (client-side token removal)
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Refresh token
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError("Refresh token is required", 400);
    }

    try {
      const decoded =
        require("../utils/jwt.util").verifyRefreshToken(refreshToken);

      // Verify user still exists
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw createError("User not found or inactive", 401);
      }

      // Generate new tokens
      const newToken = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const newRefreshToken = generateRefreshToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      res.status(200).json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      throw createError("Invalid refresh token", 401);
    }
  }
);

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  refreshToken,
};
