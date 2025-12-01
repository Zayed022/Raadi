import express from "express";
import {
  createPromoCard,
  getActivePromoCards,
  getAllPromoCards,
  updatePromoCard,
  deletePromoCard,
} from "../controllers/promoCard.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

// Public (frontend)
router.get("/", getActivePromoCards);

// Admin
router.get("/all",  getAllPromoCards);

router.post(
  "/",
  
  upload.fields([{ name: "image", maxCount: 1 }]),
  createPromoCard
);

router.put(
  "/:id",
  
  upload.fields([{ name: "image", maxCount: 1 }]),
  updatePromoCard
);

router.delete("/:id",  deletePromoCard);

export default router;
