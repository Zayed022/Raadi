import express from "express";
import { createTopProduct, getTopProducts } from "../controllers/topProduct.comtrollers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), createTopProduct);
router.get("/", getTopProducts);

export default router;
