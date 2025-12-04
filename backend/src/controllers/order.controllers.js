import Order from "../models/order.models.js";
import Cart from "../models/cart.models.js";
import Product from "../models/product.models.js";
import Payment from "../models/payment.models.js";
import PDFDocument from "pdfkit";
import path from "path";
// ===========================
// Create Order (Guest + Logged-in)
// ===========================
// ===========================
// Create Order (COD + Online Payments)
// ===========================
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, customerDetails, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const userId = req.user?._id || null;

    // Create base order
    const order = await Order.create({
      user: userId,
      customerDetails,
      items,
      shippingAddress,
      totalAmount,
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      paymentInfo: { status: paymentMethod === "cod" ? "pending" : "pending" }
    });

    // ==========================
    // COD FLOW: CONFIRM ORDER IMMEDIATELY
    // ==========================
    if (paymentMethod === "cod") {
      // Reduce stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, sold: item.quantity }
        });
      }

      // Clear cart for logged-in users
      if (userId) {
        await Cart.findOneAndDelete({ user: userId });
      }

      return res.status(201).json({
        success: true,
        cod: true,
        message: "Order placed successfully with Cash on Delivery",
        orderId: order._id,
      });
    }

    // ==========================
    // ONLINE PAYMENT FLOW → REQUIRE PAYMENT INITIATION
    // ==========================
    return res.status(201).json({
      success: true,
      cod: false,
      message: "Order created, proceed to payment",
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


export const generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ------------ PDF INITIAL SETUP ------------
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${orderId}.pdf`
    );

    doc.pipe(res);

    // ------------ LOGO + HEADER -------------
    const logoPath = path.join(process.cwd(), "public", "temp", "Raadi.png");

    try {
      doc.image(logoPath, 40, 20, { width: 90 });
    } catch (e) {
      console.log("Logo not loaded:", e.message);
    }

    doc.fontSize(26).font("Helvetica-Bold").text("INVOICE", 350, 35);

    doc.moveDown(3);

    // ------------ ORDER INFO ------------
    doc.fontSize(12).font("Helvetica");

    doc.text(`Invoice No: INV-${orderId}`);
    doc.text(`Order ID: ${orderId}`);
    doc.text(`Placed On: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Payment Status: ${order.paymentInfo.status.toUpperCase()}`);
    doc.text(`Order Status: ${order.orderStatus.toUpperCase()}`);

    doc.moveDown(2);

    // ------------ ADDRESS ------------
    const addr = order.shippingAddress;

    doc.fontSize(14).font("Helvetica-Bold").text("Billing & Shipping Address");
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(12);
    doc.text(addr.fullName);
    doc.text(`${addr.city}, ${addr.state}`);
    doc.text(`PIN: ${addr.pincode}`);
    doc.text(`Phone: ${addr.phone}`);

    doc.moveDown(2);

    // ------------ ITEMS TABLE ------------
    doc.fontSize(14).font("Helvetica-Bold").text("Order Items");
    doc.moveDown(0.7);

    const tableTop = doc.y;

    // HEADER ROW
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Item", 40, tableTop)
      .text("Qty", 250, tableTop)
      .text("Price", 320, tableTop)
      .text("Total", 420, tableTop);

    doc
      .moveTo(40, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke("#999");

    // ROWS
    let y = tableTop + 25;
    doc.font("Helvetica").fontSize(12);

    order.items.forEach((item) => {
      const total = item.quantity * item.product.price;

      doc.text(item.product.name, 40, y, { width: 200 });
      doc.text(item.quantity, 250, y);
      doc.text(`₹${item.product.price}`, 320, y);
      doc.text(`₹${total}`, 420, y);

      y += 22;

      doc
        .moveTo(40, y)
        .lineTo(550, y)
        .stroke("#eee");

      y += 5;
    });

    doc.moveDown(3);

    // ------------ SUMMARY BOX ------------
    const summaryY = y + 20;

    doc.rect(40, summaryY, 510, 120).stroke("#cccc");

    doc.font("Helvetica-Bold").fontSize(14).text("Summary", 50, summaryY + 10);

    const summary = [
      ["Subtotal:", `₹${order.totalAmount}`],
      ["Tax:", "₹0"],
      ["Shipping:", "₹0"],
      [
        "Payment Method:",
        order.paymentInfo.status === "paid" ? "Online" : "Cash on Delivery",
      ],
    ];

    let sy = summaryY + 40;

    doc.font("Helvetica").fontSize(12);

    summary.forEach(([label, value]) => {
      doc.text(label, 50, sy);
      doc.text(value, 500, sy, { align: "right" });
      sy += 20;
    });

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .text("Grand Total:", 50, sy + 10)
      .text(`₹${order.totalAmount}`, 500, sy + 10, { align: "right" });

    // ------------ FOOTER ------------
    doc.fontSize(10).fillColor("#777");
    doc.text(
      "Thank you for choosing RAADI. For support, email support@raadi.com",
      40,
      780,
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Could not generate invoice" });
  }
};


