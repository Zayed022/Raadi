import express from "express";
import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateQuantity,
  clearCart
} from "../controllers/cart.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/", getUserCart);
router.put("/update", updateQuantity);
router.delete("/remove", removeFromCart);
router.delete("/clear", clearCart);

export default router;
