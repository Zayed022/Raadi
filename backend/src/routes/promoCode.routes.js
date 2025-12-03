import express from "express";
import { applyPromo } from "../controllers/promoCode.controllers.js";


const router = express.Router();

router.post("/apply-promo", applyPromo);


export default router;
