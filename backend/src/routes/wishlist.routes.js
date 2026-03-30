import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} from "../controllers/wishlist.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/", getWishlist);
router.delete("/remove", removeFromWishlist);
router.delete("/clear", clearWishlist);

export default router;
