import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log("Validation - Request body:", req.body);
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      console.log("Validation errors:", errors);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    console.log("Validation passed");
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: "Query validation failed",
        errors,
      });
      return;
    }

    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: "Parameter validation failed",
        errors,
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // User schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^254[0-9]{9}$/)
      .required(),
    address: Joi.string().max(200).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string()
      .pattern(/^254[0-9]{9}$/)
      .optional(),
    address: Joi.string().max(200).optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    culturalStory: Joi.string().min(10).max(2000).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string()
      .valid(
        "home-decor",
        "artifacts",
        "kitchen",
        "wall-art",
        "woven-items",
        "hair-accessories",
        "beaded-mirror"
      )
      .required(),
    availability: Joi.string()
      .valid("in-stock", "out-of-stock", "limited")
      .default("in-stock"),
    tags: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
    rating: Joi.number().min(0).max(5).optional(),
    reviews: Joi.number().min(0).optional(),
    sku: Joi.string().optional().trim().uppercase(),
    stock: Joi.number().min(0).required(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0),
      width: Joi.number().min(0),
      height: Joi.number().min(0),
    }).optional(),
    materials: Joi.array().items(Joi.string()).optional(),
    origin: Joi.string().optional(),
    artisan: Joi.object({
      name: Joi.string(),
      bio: Joi.string(),
      location: Joi.string(),
    }).optional(),
    image: Joi.string().optional(),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    culturalStory: Joi.string().min(10).max(2000).optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string()
      .valid(
        "home-decor",
        "artifacts",
        "kitchen",
        "wall-art",
        "woven-items",
        "hair-accessories",
        "beaded-mirror"
      )
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().min(0).optional(),
    availability: Joi.string()
      .valid("in-stock", "out-of-stock", "limited")
      .optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0),
      width: Joi.number().min(0),
      height: Joi.number().min(0),
    }).optional(),
    materials: Joi.array().items(Joi.string()).optional(),
    origin: Joi.string().optional(),
    artisan: Joi.object({
      name: Joi.string(),
      bio: Joi.string(),
      location: Joi.string(),
    }).optional(),
    featured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string()).optional(),
  }),

  // Order schemas
  createOrder: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
        })
      )
      .min(1)
      .required(),
    customerInfo: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^254[0-9]{9}$/)
        .required(),
      address: Joi.string().allow("").optional(),
    }).required(),
    paymentMethod: Joi.string().valid("mpesa", "card", "cash").required(),
    deliveryOption: Joi.string().valid("pickup", "delivery").required(),
    deliveryAddress: Joi.string()
      .allow("")
      .when("deliveryOption", {
        is: "delivery",
        then: Joi.string().min(1).required(),
        otherwise: Joi.string().allow("").optional(),
      }),
    notes: Joi.string().max(500).optional(),
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string()
      .valid(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
      )
      .required(),
    notes: Joi.string().max(500).optional(),
  }),

  // Payment schemas
  initiatePayment: Joi.object({
    orderId: Joi.string().required(),
    phoneNumber: Joi.string()
      .pattern(/^254[0-9]{9}$/)
      .required(),
    amount: Joi.number().min(1).required(),
  }),

  // Cart schemas
  addToCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
  }),

  updateCartItem: Joi.object({
    quantity: Joi.number().min(1).required(),
  }),

  // Category schemas
  createCategory: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(500).optional(),
    icon: Joi.string().required(),
    parentCategory: Joi.string().optional(),
    sortOrder: Joi.number().optional(),
  }),

  // Newsletter subscription
  subscribe: Joi.object({
    email: Joi.string().email().required(),
  }),

  // Common parameter schemas
  mongoId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  // Query schemas
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    search: Joi.string().optional(),
  }),
};

export default {
  validate,
  validateQuery,
  validateParams,
  schemas,
};
