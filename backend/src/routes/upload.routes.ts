import { Router } from "express";
import { Request, Response } from "express";
import { upload, uploadToCloudinary } from "../utils/imageUpload.util";
import { asyncHandler } from "../middlewares/errorHandler.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Single image upload endpoint
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided",
      });
      return;
    }

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "mazuri-stores/products",
        `product_${Date.now()}`
      );

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: imageUrl,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }
  })
);

export default router;
