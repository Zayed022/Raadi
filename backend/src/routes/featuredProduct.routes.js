import express from "express";
import { createFeaturedProduct, getFeaturedProducts } from "../controllers/featuredProduct.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createFeaturedProduct
);

router.get("/", getFeaturedProducts);

export default router;
