import express from "express";
import {
  createAboutIntro,
  deleteAboutIntro,
  getAboutIntro,
} from "../controllers/aboutIntro.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Admin create/update section
router.post(
  "/",
  upload.fields([{ name: "mainImage", maxCount: 1 }]),
  createAboutIntro
);

// Public get section
router.get("/", getAboutIntro);
router.delete("/delete", deleteAboutIntro);


export default router;
