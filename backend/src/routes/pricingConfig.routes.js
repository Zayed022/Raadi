import express from "express";

import { getPricingConfig, updatePricingConfig } from "../controllers/pricingConfig.controllers.js";

const router = express.Router();

router.get("/", getPricingConfig);
router.post("/update",  updatePricingConfig);

export default router;
