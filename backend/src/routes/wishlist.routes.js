import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} from "../controllers/wishlist.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", verifyJWT, addToWishlist);
router.get("/", verifyJWT, getWishlist);
router.delete("/remove", verifyJWT, removeFromWishlist);
router.delete("/clear", verifyJWT, clearWishlist);

export default router;
