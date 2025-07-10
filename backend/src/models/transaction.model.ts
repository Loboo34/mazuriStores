import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  _id: string;
  transactionId: string;
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: "mpesa" | "card" | "cash";
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";

  // M-Pesa specific fields
  mpesaData?: {
    merchantRequestId?: string;
    checkoutRequestId?: string;
    mpesaReceiptNumber?: string;
    phoneNumber?: string;
    resultCode?: number;
    resultDesc?: string;
  };

  // Card payment specific fields
  cardData?: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };

  // General payment data
  paymentData?: any;

  // Refund information
  refundData?: {
    refundId?: string;
    refundAmount?: number;
    refundReason?: string;
    refundedAt?: Date;
  };

  notes?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "KES",
      enum: ["KES", "USD", "EUR"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["mpesa", "card", "cash"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    // M-Pesa specific fields
    mpesaData: {
      merchantRequestId: String,
      checkoutRequestId: String,
      mpesaReceiptNumber: String,
      phoneNumber: String,
      resultCode: Number,
      resultDesc: String,
    },

    // Card payment specific fields
    cardData: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number,
    },

    // General payment data
    paymentData: Schema.Types.Mixed,

    // Refund information
    refundData: {
      refundId: String,
      refundAmount: Number,
      refundReason: String,
      refundedAt: Date,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    processedAt: {
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
transactionSchema.index({ order: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ paymentMethod: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ "mpesaData.checkoutRequestId": 1 });
transactionSchema.index({ "mpesaData.mpesaReceiptNumber": 1 });

// Auto-generate transaction ID
transactionSchema.pre("save", function (next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.transactionId = `TXN${timestamp.slice(-8)}${random}`;
  }
  next();
});

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
