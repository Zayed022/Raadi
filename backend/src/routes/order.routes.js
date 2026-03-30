import express from "express";
import {
  createOrder,
  initiatePayment,
  easybuzzWebhook,
  getUserOrders,
  generateInvoice,
  getAllOrders,
  updateOrderStatus,
  verifyPayment
} from "../controllers/order.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", createOrder); // supports guest checkout
router.post("/payment/verify", verifyPayment);
router.post("/initiate-payment", initiatePayment);
router.post("/webhook", easybuzzWebhook);
router.get("/invoice/:id", verifyJWT, generateInvoice);
router.patch("/:id/status", updateOrderStatus);
router.get("/", verifyJWT, getUserOrders);
router.get("/all", getAllOrders);


export default router;
