import { Router } from "express";
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cart.controller";
import { optionalAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", optionalAuth, getCartItems);
router.post("/", optionalAuth, addToCart);
router.put("/:id", optionalAuth, updateCartItem);
router.delete("/:id", optionalAuth, removeFromCart);

export default router;
