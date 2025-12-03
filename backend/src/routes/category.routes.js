import express from "express";
import { 
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
} from "../controllers/category.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post(
  "/",
  
  
  upload.fields([{ name: "image", maxCount: 1 }]),
  createCategory
);

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

router.put("/:id", verifyJWT,  updateCategory);
router.delete("/:id", verifyJWT,  deleteCategory);

export default router;
