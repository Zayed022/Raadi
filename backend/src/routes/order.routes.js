import express from "express";
import {
  createOrder,
  initiatePayment,
  easybuzzWebhook,
  getUserOrders,
  generateInvoice,
  getAllOrders
} from "../controllers/order.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", verifyJWT,createOrder); // supports guest checkout
router.post("/initiate-payment", initiatePayment);
router.post("/webhook", easybuzzWebhook);
router.get("/invoice/:id", verifyJWT, generateInvoice);

router.get("/", verifyJWT, getUserOrders);
router.get("/all", getAllOrders);


export default router;
