import express from "express";
import { createHomeBanner, deleteHomeBanner, getActiveBanner } from "../controllers/homeBanner.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
  ]),
  createHomeBanner
);

router.get("/", getActiveBanner);
router.delete("/delete", deleteHomeBanner);

export default router;
