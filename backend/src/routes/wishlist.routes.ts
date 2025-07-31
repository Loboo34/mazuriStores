import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistCount,
} from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate, schemas } from "../middlewares/validate.middleware";

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

// Wishlist routes
router.get("/", getWishlist);
router.get("/count", getWishlistCount);
router.post("/", validate(schemas.addToWishlist), addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.delete("/", clearWishlist);

export default router;
