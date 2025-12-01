// src/routes/gallery.routes.js
import express from "express";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/gallery.controllers.js";


import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

// Public – used in homepage “Our Gallery”
router.get("/", getGalleryImages);

// Admin only
router.post(
  "/",
  
  upload.fields([{ name: "image", maxCount: 1 }]),
  addGalleryImage
);

router.delete("/:id",  deleteGalleryImage);

export default router;
