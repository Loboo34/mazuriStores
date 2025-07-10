import mongoose from "mongoose";
import { config } from "./env.config";

const mongoUri = config.MONGODB_URI as string;

const connectDB = async (): Promise<void> => {
  try {
    // Add connection options for better stability with MongoDB Atlas
    const conn = await mongoose.connect(mongoUri, {});
    console.log(`connected to db: ${mongoUri}`);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔄 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.error("🔍 Connection details:", {
      uri: config.MONGODB_URI.replace(/\/\/.*@/, "//***:***@"), // Hide credentials in logs
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
};

export default connectDB;
