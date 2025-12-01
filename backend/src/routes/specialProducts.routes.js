import express from "express";
import {
  createSpecialProduct,
  getActiveSpecialProduct,
  getAllSpecialProducts,
  updateSpecialProduct,
  deleteSpecialProduct
} from "../controllers/specialProduct.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createSpecialProduct
);

router.get("/active", getActiveSpecialProduct);
router.get("/", getAllSpecialProducts);

router.put("/:id",  upload.fields([{ name: "image", maxCount: 1 }]), updateSpecialProduct);
router.delete("/:id",  deleteSpecialProduct);

export default router;
