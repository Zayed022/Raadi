import express from "express";
import { createAboutBanner, getAboutBanner } from "../controllers/aboutBanner.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "bannerImage", maxCount: 1 }]),
  createAboutBanner
);

router.get("/", getAboutBanner);

export default router;
