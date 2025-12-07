import express from "express";
import { createAboutBanner, deleteAboutBanner, getAboutBanner } from "../controllers/aboutBanner.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "bannerImage", maxCount: 1 }]),
  createAboutBanner
);

router.get("/", getAboutBanner);
router.delete("/delete", deleteAboutBanner);

export default router;
