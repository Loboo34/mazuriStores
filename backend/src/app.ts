import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "./config/env.config";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware";
//import notFound from './middlewares/errorHandler.middleware';

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import categoryRoutes from "./routes/category.routes";
import adminRoutes from "./routes/admin.routes";
import paymentRoutes from "./routes/payment.routes";
import cartRoutes from "./routes/cart.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mazuri Stores API is running",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: "1.0.0",
  });
});

// API routes
const apiVersion = `/api/${config.API_VERSION}`;

app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/users`, userRoutes);
app.use(`${apiVersion}/products`, productRoutes);
app.use(`${apiVersion}/orders`, orderRoutes);
app.use(`${apiVersion}/categories`, categoryRoutes);
app.use(`${apiVersion}/admin`, adminRoutes);
app.use(`${apiVersion}/payments`, paymentRoutes);
app.use(`${apiVersion}/cart`, cartRoutes);
app.use(`${apiVersion}/upload`, uploadRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Mazuri Stores API",
    description: "Authentic African E-commerce Platform",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: `${apiVersion}/auth`,
      products: `${apiVersion}/products`,
      orders: `${apiVersion}/orders`,
      categories: `${apiVersion}/categories`,
      payments: `${apiVersion}/payments`,
      admin: `${apiVersion}/admin`,
    },
  });
});

// 404 handler
//app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
