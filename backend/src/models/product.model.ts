import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  culturalStory: string;
  price: number;
  images: string[];
  image: string;
  category: string;
  tags: string[];
  availability: "in-stock" | "out-of-stock" | "limited";
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  materials: string[];
  origin: string;
  artisan?: {
    name: string;
    bio: string;
    location: string;
  };
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    culturalStory: {
      type: String,
      required: [true, "Cultural story is required"],
      trim: true,
      maxlength: [2000, "Cultural story cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "home-decor",
        "artifacts",
        "kitchen",
        "wall-art",
        "woven-items",
        "hair-accessories",
        "beaded-mirror",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: {
      type: String,
      enum: ["in-stock", "out-of-stock", "limited"],
      default: "in-stock",
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      required: false,
      unique: true,
      uppercase: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    materials: [
      {
        type: String,
        trim: true,
      },
    ],
    origin: {
      type: String,
      required: false,
      trim: true,
    },
    artisan: {
      name: { type: String, trim: true },
      bio: { type: String, trim: true },
      location: { type: String, trim: true },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1 });
productSchema.index({ availability: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Auto-generate SKU if not provided
productSchema.pre("save", function (next) {
  if (!this.sku) {
    const prefix = this.category.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${prefix}-${timestamp}`;
  }
  next();
});

// Update availability based on stock
productSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.availability = "out-of-stock";
  } else if (this.stock <= 5) {
    this.availability = "limited";
  } else {
    this.availability = "in-stock";
  }
  next();
});

export default mongoose.model<IProduct>("Product", productSchema);
