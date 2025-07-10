import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriber extends Document {
  _id: string;
  email: string;
  isActive: boolean;
  source: string;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    newProducts: boolean;
  };
  subscribedAt: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "website",
      enum: ["website", "checkout", "admin", "import"],
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      promotions: {
        type: Boolean,
        default: true,
      },
      newProducts: {
        type: Boolean,
        default: true,
      },
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ subscribedAt: -1 });

export default mongoose.model<ISubscriber>("Subscriber", subscriberSchema);
