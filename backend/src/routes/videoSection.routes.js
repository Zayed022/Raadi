import express from "express";
import { createVideoSection, getVideoSection } from "../controllers/videoSection.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post(
  "/",
  
  upload.fields([{ name: "thumbnailImage", maxCount: 1 }]),
  createVideoSection
);

router.get("/", getVideoSection);

export default router;
