import express from "express";
import {
  addReview,
  getReviews,
  deleteReview
} from "../controllers/review.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", verifyJWT, addReview);
router.get("/:productId", getReviews);
router.delete("/delete", verifyJWT, deleteReview);

export default router;
