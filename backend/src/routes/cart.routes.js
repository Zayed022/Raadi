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

router.post("/add", verifyJWT, addToCart);
router.get("/", verifyJWT, getUserCart);
router.put("/update", verifyJWT, updateQuantity);
router.delete("/remove", verifyJWT, removeFromCart);
router.delete("/clear", verifyJWT, clearCart);

export default router;
