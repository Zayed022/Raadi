import Order from "../models/order.models.js";
import Cart from "../models/cart.models.js";
import Product from "../models/product.models.js";
import Payment from "../models/payment.models.js";

// ===========================
// Create Order (Guest + Logged-in)
// ===========================
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, customerDetails, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const userId = req.user?._id || null;

    const order = await Order.create({
      user: userId,
      customerDetails,
      items,
      shippingAddress,
      totalAmount,
      orderStatus: "pending",
      paymentInfo: { status: "pending" }
    });

    return res.status(201).json({
      success: true,
      message: "Order created, waiting for payment",
      orderId: order._id
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ===========================
// Initiate EasyBuzz Payment
// ===========================
export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // EasyBuzz Payment Payload
    const paymentPayload = {
      amount: order.totalAmount * 100, // in paise if required
      txn_id: order._id.toString(),
      name: order.customerDetails.name,
      email: order.customerDetails.email,
      phone: order.customerDetails.phone,
      udf1: order._id.toString(),
      udf2: "Ecommerce Payment",
      callback_url: `${process.env.SERVER_URL}/api/v1/payment/webhook`,
    };

    return res.status(200).json({
      success: true,
      message: "Payment initiated",
      paymentPayload,
    });

  } catch (error) {
    console.error("Payment Init Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// EasyBuzz Payment Webhook
// ===========================
export const easybuzzWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const { txnid, status, amount } = payload;

    const order = await Order.findById(txnid);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentInfo.status = status === "success" ? "paid" : "failed";
    order.paymentInfo.transactionId = payload.payment_id;
    order.orderStatus = status === "success" ? "confirmed" : "pending";

    await order.save();

    // Create Payment record
    await Payment.create({
      orderId: order._id,
      easybuzzTransactionId: payload.payment_id,
      status,
      amount,
      payload,
    });

    // Reduce stock only if paid
    if (status === "success") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, sold: item.quantity }
        });
      }

      await Cart.findOneAndDelete({ user: order.user });
    }

    return res.status(200).json({ success: true, message: "Webhook processed" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Get User Orders
// ===========================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
