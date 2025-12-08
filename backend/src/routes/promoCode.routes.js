import express from "express";
import { applyPromo, createPromoCode, deletePromoCode, getAllPromoCodes, updatePromoCode } from "../controllers/promoCode.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = express.Router();

router.post("/apply-promo", verifyJWT,applyPromo);
router.get("/", getAllPromoCodes);
router.post("/", createPromoCode);
router.put("/:id", updatePromoCode
);
router.delete("/:id", deletePromoCode);



export default router;
