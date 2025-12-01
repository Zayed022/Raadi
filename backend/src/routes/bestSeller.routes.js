import express from "express";
import {
  addBestSeller,
  getBestSellers,
  deleteBestSeller,
  updateBestSeller
} from "../controllers/bestSeller.controllers.js";


const router = express.Router();

router.post("/", addBestSeller);
router.get("/", getBestSellers);
router.put("/:id",  updateBestSeller);
router.delete("/:id",  deleteBestSeller);

export default router;
