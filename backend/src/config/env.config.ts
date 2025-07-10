import dotenv from "dotenv";
dotenv.config();

// Validate required environment variables first
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  API_VERSION: process.env.API_VERSION || "v1",

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI!, // Non-null assertion after validation
  DB_NAME: process.env.DB_NAME || "mazuri_stores",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET!, // Non-null assertion after validation
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "30d",

  // Admin Configuration
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@mazuristores.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
  ADMIN_NAME: process.env.ADMIN_NAME || "Admin User",

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "900000",
    10
  ),
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "100",
    10
  ),

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
};

export default config;
