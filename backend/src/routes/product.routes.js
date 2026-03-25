import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getRecommendedProducts,
  getTopProducts,
  getFeatureProducts,
  getBestSeller,
  toggleTopProduct,
  toggleFeaturedProduct,
  toggleBestSeller,
  updateProductImage
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// public routes
router.get("/", getAllProducts);
router.get("/top-products", getTopProducts);
router.get("/feature-products", getFeatureProducts);
router.get("/best-seller", getBestSeller);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

// admin routes
router.post(
  "/add-product",
  
  upload.fields([
    { name: "images", maxCount: 5 }
  ]) ,
  createProduct
);

router.put("/:id",upload.fields([
  { name: "images", maxCount: 5 }
]), updateProduct);
router.delete("/:id", deleteProduct);
router.get("/recommended/:productId", getRecommendedProducts);
router.patch("/:id/toggle-top", toggleTopProduct);
router.patch("/:id/toggle-featured", toggleFeaturedProduct);
router.patch("/:id/toggle-bestseller", toggleBestSeller);
router.put("/:id/update-image", upload.fields([{ name: "image", maxCount: 1 }]), updateProductImage);

router.get("/:id", getProductById);



export default router;
