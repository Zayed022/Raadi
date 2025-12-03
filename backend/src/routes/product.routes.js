import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByCategory,
  getRecommendedProducts,
  getTopProducts,
  getFeatureProducts,
  getBestSeller
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// public routes
router.get("/", getAllProducts);
router.get("/top-products", getTopProducts);
router.get("/feature-products", getFeatureProducts);
router.get("/best-seller", getBestSeller);
router.get("/category/:categoryName", getProductByCategory);
router.get("/:id", getProductById);

// admin routes
router.post(
  "/add-product",
  
  upload.fields([{ name: "image", maxCount: 1 }]),
  createProduct
);

router.put("/:id", verifyJWT, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/recommended/:productId", getRecommendedProducts);


router.get("/:id", getProductById);



export default router;
