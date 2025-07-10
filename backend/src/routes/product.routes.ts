import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getProductStats,
} from "../controllers/product.controller";
import {
  authenticate,
  authorize,
  optionalAuth,
} from "../middlewares/auth.middleware";
import {
  validate,
  validateParams,
  validateQuery,
  schemas,
} from "../middlewares/validate.middleware";
import { upload } from "../utils/imageUpload.util";

const router = Router();

// Public routes
router.get("/", validateQuery(schemas.pagination), getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", validateParams(schemas.mongoId), getProductById);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize("admin"));

router.post(
  "/",
  upload.single("image"),
  validate(schemas.createProduct),
  createProduct
);

router.put(
  "/:id",
  validateParams(schemas.mongoId),
  upload.single("image"),
  validate(schemas.updateProduct),
  updateProduct
);

router.delete("/:id", validateParams(schemas.mongoId), deleteProduct);
router.patch(
  "/:id/toggle-featured",
  validateParams(schemas.mongoId),
  toggleFeatured
);
router.get("/admin/stats", getProductStats);

export default router;
