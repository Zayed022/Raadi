import Order from "../models/order.models.js";
import Cart from "../models/cart.models.js";
import Product from "../models/product.models.js";
import Payment from "../models/payment.models.js";
import PDFDocument from "pdfkit";
import path from "path";
import { razorpay } from "../utils/config.js";
import crypto from "crypto";

// ===========================
// Create Order (Guest + Logged-in)
// ===========================

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      customerDetails,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    // ❌ No user now
    const userId = null;

    const order = await Order.create({
      user: userId,
      customerDetails,
      items,
      shippingAddress,
      totalAmount,
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      paymentInfo: { status: "pending" },
    });

    // ==========================
    // COD FLOW
    // ==========================
    if (paymentMethod === "cod") {
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        });
      }

      return res.status(201).json({
        success: true,
        cod: true,
        orderId: order._id,
      });
    }

    // ==========================
    // RAZORPAY FLOW
    // ==========================
    let razorpayOrder;

    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: order._id.toString(),
      });
    } catch (error) {
      console.error("RAZORPAY ERROR:", error);
      throw error;
    }

    // ✅ Save payment properly
    await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      cod: false,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ success: false });
    }

    payment.status = "success";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    const order = await Order.findById(orderId);

    if (order.paymentInfo.status === "paid") {
      return res.json({ success: true });
    }

    order.paymentInfo = {
      transactionId: razorpay_payment_id,
      status: "paid",
    };

    order.orderStatus = "confirmed";

    await order.save();

    // ✅ Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ success: false });
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



// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  // Page
  PAGE_W: 595.28,
  PAGE_H: 841.89,
  M: 48,           // margin
  get CW() { return this.PAGE_W - this.M * 2; }, // content width = 499.28

  // Palette
  BLACK:       "#0A0A0A",
  CHARCOAL:    "#2C2C2C",
  GRAY:        "#6B6B6B",
  LIGHT_GRAY:  "#C4C4C4",
  RULE:        "#E4E4E4",
  BG_STRIPE:   "#F7F7F7",
  BG_SUBTLE:   "#F0F0F0",

  BRAND:       "#0F2A4A",   // deep navy — primary brand
  BRAND_MID:   "#1A3F6F",
  BRAND_SOFT:  "#E6EDF5",

  SUCCESS:     "#14532D",
  SUCCESS_BG:  "#DCFCE7",
  DANGER:      "#7F1D1D",
  DANGER_BG:   "#FEE2E2",
  WARN:        "#78350F",
  WARN_BG:     "#FEF3C7",

  WHITE:       "#FFFFFF",

  // Table column X positions (from left margin)
  COL: {
    NAME:  0,
    SKU:   210,
    QTY:   290,
    PRICE: 340,
    TOTAL: 430,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const drawHRule = (doc, y, color = T.RULE, lw = 0.5) => {
  doc.save()
    .moveTo(T.M, y)
    .lineTo(T.PAGE_W - T.M, y)
    .lineWidth(lw)
    .strokeColor(color)
    .stroke()
    .restore();
};

const labelValue = (doc, label, value, lx, ly, vx, vy, valueColor = T.BLACK) => {
  doc.font("Helvetica").fontSize(7.5).fillColor(T.GRAY)
    .text(label.toUpperCase(), lx, ly, { characterSpacing: 0.9, lineBreak: false });
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(valueColor)
    .text(value, vx, vy, { lineBreak: false });
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

/** Draws the top brand header banner */
const drawHeader = (doc, orderId) => {
  const H = 96;

  // Navy banner
  doc.rect(0, 0, T.PAGE_W, H).fill(T.BRAND);

  // Vertical accent bar (left edge pop)
  doc.rect(0, 0, 5, H).fill("#E8A020");

  // Brand name
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor(T.WHITE)
    .text("RAADI", T.M + 6, 30, { characterSpacing: 5, lineBreak: false });

  // Tagline under brand
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("rgba(255,255,255,0.45)")
    .text("ONLINE STORE", T.M + 6, 58, { characterSpacing: 2.5, lineBreak: false });

  // Right side: INVOICE label + number
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("rgba(255,255,255,0.5)")
    .text("INVOICE", T.PAGE_W - T.M - 150, 28, { width: 150, align: "right", characterSpacing: 2.5, lineBreak: false });

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(T.WHITE)
    .text(`INV-${orderId}`, T.PAGE_W - T.M - 180, 46, { width: 180, align: "right", lineBreak: false });
};

/** Draws the meta info row (dates, status, etc.) */
const drawMeta = (doc, order) => {
  const Y = 112;
  const BOX_H = 70;

  // Light background strip
  doc.rect(T.M, Y, T.CW, BOX_H).fill(T.BG_STRIPE);

  // Subtle top border
  doc.rect(T.M, Y, T.CW, 1.5).fill(T.BRAND_SOFT);

  const pad = 14;
  const colW = T.CW / 4;

  const date = new Date(order.createdAt);
  const dateStr  = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr  = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const payStatus = order.paymentInfo?.status ?? "pending";
  const isPaid    = payStatus.toLowerCase() === "paid";
  const isCOD     = payStatus.toLowerCase() === "cod" || payStatus.toLowerCase() === "pending";

  let statusColor = T.WARN;
  if (isPaid)     statusColor = T.SUCCESS;
  if (isCOD)      statusColor = T.WARN;

  const metaCols = [
    { label: "Order Date", value: dateStr },
    { label: "Order Time", value: timeStr },
    { label: "Order Status", value: order.orderStatus ?? "N/A" },
    { label: "Payment", value: payStatus.toUpperCase(), color: statusColor },
  ];

  metaCols.forEach((col, i) => {
    const cx = T.M + i * colW + pad;

    // Vertical divider (except first)
    if (i > 0) {
      doc.save()
        .moveTo(T.M + i * colW, Y + 14)
        .lineTo(T.M + i * colW, Y + BOX_H - 14)
        .lineWidth(0.5)
        .strokeColor(T.RULE)
        .stroke()
        .restore();
    }

    labelValue(doc, col.label, col.value, cx, Y + pad, cx, Y + pad + 14, col.color || T.BLACK);
  });
};

/** Draws billing address + payment method side by side */
const drawAddress = (doc, order) => {
  const Y = 198;
  const addr = order.shippingAddress;
  const isPaid = order.paymentInfo?.status?.toLowerCase() === "paid";

  // Section label
  doc.font("Helvetica").fontSize(7.5).fillColor(T.GRAY)
    .text("BILL TO / SHIP TO", T.M, Y, { characterSpacing: 1.1 });

  const lY = Y + 14;
  doc.font("Helvetica-Bold").fontSize(12).fillColor(T.BLACK)
    .text(addr.fullName, T.M, lY);
  doc.font("Helvetica").fontSize(10).fillColor(T.CHARCOAL)
    .text(addr.landmark, T.M, lY + 16);
  doc.font("Helvetica").fontSize(10).fillColor(T.CHARCOAL)
    .text(`${addr.city}, ${addr.state}`, T.M, lY + 30);
  doc.font("Helvetica").fontSize(10).fillColor(T.CHARCOAL)
    .text(`PIN: ${addr.pincode}`, T.M, lY + 44);
  doc.font("Helvetica").fontSize(10).fillColor(T.GRAY)
    .text(`Phone: ${addr.phone}`, T.M, lY + 58);

  // Right side — payment method card
  const cardX = T.PAGE_W - T.M - 160;
  const cardW = 160;
  const cardH = 72;
  const cardY = lY;

  doc.roundedRect(cardX, cardY, cardW, cardH, 6)
    .fill(isPaid ? T.SUCCESS_BG : T.WARN_BG);

  doc.font("Helvetica").fontSize(7.5).fillColor(T.GRAY)
    .text("PAYMENT METHOD", cardX, cardY + 10, { width: cardW, align: "center", characterSpacing: 1 });

  doc.font("Helvetica-Bold").fontSize(15).fillColor(isPaid ? T.SUCCESS : T.WARN)
    .text(isPaid ? "ONLINE" : "CASH ON DELIVERY", cardX, cardY + 26, { width: cardW, align: "center" });

  const methodLine = isPaid ? "Prepaid · Secured" : "Collect at delivery";
  doc.font("Helvetica").fontSize(8.5).fillColor(isPaid ? T.SUCCESS : T.WARN)
    .text(methodLine, cardX, cardY + 50, { width: cardW, align: "center" });

  drawHRule(doc, Y + 88);
};

/** Draws the items table header */
const drawTableHeader = (doc, y) => {
  // Header bg
  doc.rect(T.M, y, T.CW, 24).fill(T.BRAND);

  const { NAME, QTY, PRICE, TOTAL } = T.COL;

  const headers = [
    { label: "#",           x: NAME,          w: 18,  align: "left" },
    { label: "DESCRIPTION", x: NAME + 22,     w: 175, align: "left" },
    { label: "QTY",         x: QTY,           w: 40,  align: "center" },
    { label: "UNIT PRICE",  x: PRICE,         w: 80,  align: "right" },
    { label: "AMOUNT",      x: TOTAL,         w: 67,  align: "right" },
  ];

  headers.forEach(({ label, x, w, align }) => {
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(T.WHITE)
      .text(label, T.M + x, y + 8, { width: w, align, characterSpacing: 0.8, lineBreak: false });
  });

  return y + 24;
};

/** Draws all item rows and returns { nextY, grandTotal } */
const drawItems = (doc, items, startY) => {
  let y = startY;
  let grandTotal = 0;
  const ROW_H = 28;
  const { NAME, QTY, PRICE, TOTAL } = T.COL;

  items.forEach((item, idx) => {
    const product  = item.product;
    const name     = product?.name || "Deleted Product";
    const sku      = product?.sku  || `SKU-${idx + 1}`;
    const price    = product?.price ?? item.price ?? 0;
    const qty      = item?.quantity ?? 1;
    const rowTotal = price * qty;
    grandTotal += rowTotal;

    // Alternating stripe
    if (idx % 2 === 0) {
      doc.rect(T.M, y, T.CW, ROW_H).fill(T.BG_STRIPE);
    } else {
      doc.rect(T.M, y, T.CW, ROW_H).fill(T.WHITE);
    }

    const textY = y + 9;

    // Row number
    doc.font("Helvetica").fontSize(8.5).fillColor(T.LIGHT_GRAY)
      .text(`${idx + 1}`, T.M + NAME, textY, { width: 18, align: "left", lineBreak: false });

    // Product name
    doc.font("Helvetica-Bold").fontSize(10).fillColor(T.BLACK)
      .text(name, T.M + NAME + 22, textY, { width: 172, lineBreak: false });

    // Qty — centered, pill badge
    const qtyStr = qty.toString();
    const pillW  = 26;
    const pillX  = T.M + QTY + (40 - pillW) / 2;
    doc.roundedRect(pillX, y + 7, pillW, 14, 3).fill(T.BRAND_SOFT);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(T.BRAND)
      .text(qtyStr, pillX, y + 10, { width: pillW, align: "center", lineBreak: false });

    // Unit price
    doc.font("Helvetica").fontSize(10).fillColor(T.CHARCOAL)
      .text(inr(price), T.M + PRICE, textY, { width: 80, align: "right", lineBreak: false });

    // Row total
    doc.font("Helvetica-Bold").fontSize(10).fillColor(T.BLACK)
      .text(inr(rowTotal), T.M + TOTAL, textY, { width: 67, align: "right", lineBreak: false });

    y += ROW_H;
  });

  // Closing rule
  drawHRule(doc, y, T.RULE, 0.75);

  return { nextY: y + 16, grandTotal };
};

/** Draws the totals summary block */
const drawSummary = (doc, grandTotal, startY) => {
  const LABEL_X   = T.PAGE_W - T.M - 240;
  const LABEL_W   = 140;
  const VALUE_W   = 100;
  const VALUE_X   = LABEL_X + LABEL_W;
  let y = startY;

  const rows = [
    { label: "Subtotal",      value: inr(grandTotal), bold: false },
    { label: "GST / Tax",     value: inr(0),          bold: false },
    { label: "Shipping",      value: "FREE",          bold: false },
  ];

  rows.forEach(({ label, value }) => {
    doc.font("Helvetica").fontSize(10).fillColor(T.GRAY)
      .text(label, LABEL_X, y, { width: LABEL_W, align: "left", lineBreak: false });
    doc.font("Helvetica").fontSize(10).fillColor(T.CHARCOAL)
      .text(value, VALUE_X, y, { width: VALUE_W, align: "right", lineBreak: false });
    y += 20;
  });

  // Divider before grand total
  doc.save()
    .moveTo(LABEL_X, y + 4)
    .lineTo(T.PAGE_W - T.M, y + 4)
    .lineWidth(0.5)
    .strokeColor(T.RULE)
    .stroke()
    .restore();

  y += 12;

  // Grand total banner
  const GTBOX_W = 240;
  const GTBOX_H = 38;
  doc.rect(T.PAGE_W - T.M - GTBOX_W, y, GTBOX_W, GTBOX_H).fill(T.BRAND);
  // Gold accent strip on left of grand-total box
  doc.rect(T.PAGE_W - T.M - GTBOX_W, y, 4, GTBOX_H).fill("#E8A020");

  doc.font("Helvetica-Bold").fontSize(9).fillColor("rgba(255,255,255,0.65)")
    .text("GRAND TOTAL", T.PAGE_W - T.M - GTBOX_W + 12, y + 7,
      { width: 90, align: "left", characterSpacing: 1, lineBreak: false });

  doc.font("Helvetica-Bold").fontSize(18).fillColor(T.WHITE)
    .text(inr(grandTotal), T.PAGE_W - T.M - 120, y + 7,
      { width: 108, align: "right", lineBreak: false });

  return y + GTBOX_H + 20;
};

/** Draws a thank-you note + footer strip */
const drawFooter = (doc, orderId) => {
  const NOTE_Y = 730;

  // Thank-you note
  doc.font("Helvetica-Bold").fontSize(11).fillColor(T.BRAND)
    .text("Thank you for your order!", T.M, NOTE_Y, { lineBreak: false });
  doc.font("Helvetica").fontSize(9).fillColor(T.GRAY)
    .text(
      "If you have any questions about this invoice, please contact us at support@raadi.in",
      T.M, NOTE_Y + 16, { width: 340 }
    );

  // QR / reference box (right side, decorative)
  const REF_X = T.PAGE_W - T.M - 130;
  doc.rect(REF_X, NOTE_Y - 4, 130, 48).fill(T.BG_SUBTLE);
  doc.font("Helvetica").fontSize(7.5).fillColor(T.GRAY)
    .text("ORDER REFERENCE", REF_X, NOTE_Y + 2, { width: 130, align: "center", characterSpacing: 0.8 });
  doc.font("Helvetica-Bold").fontSize(9).fillColor(T.CHARCOAL)
    .text(`${orderId}`, REF_X, NOTE_Y + 16, { width: 130, align: "center" });

  // Bottom footer strip
  const FY = T.PAGE_H - 36;
  doc.rect(0, FY, T.PAGE_W, 36).fill(T.BRAND);

  // Gold bar
  doc.rect(0, FY, T.PAGE_W, 3).fill("#E8A020");

  doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.55)")
    .text(
      "RAADI Online Store  ·  www.raadi.in  ·  support@raadi.in  ·  This is a computer-generated invoice and does not require a signature.",
      0, FY + 12, { width: T.PAGE_W, align: "center" }
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
export const generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("items.product")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ── Setup ──────────────────────────────────────────────────────────────
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,          // we handle margins manually for full-bleed control
      info: {
        Title:    `Invoice INV-${orderId}`,
        Author:   "RAADI Online Store",
        Subject:  `Order ${orderId}`,
        Creator:  "RAADI Invoice System",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${orderId}.pdf`);
    doc.pipe(res);

    // ── Render sections ────────────────────────────────────────────────────
    drawHeader(doc, orderId);
    drawMeta(doc, order);
    drawAddress(doc, order);

    // Items table
    const TABLE_START_Y = 302;
    doc.font("Helvetica").fontSize(7.5).fillColor(T.GRAY)
      .text("ORDER ITEMS", T.M, TABLE_START_Y - 14, { characterSpacing: 1.1 });

    let y = drawTableHeader(doc, TABLE_START_Y);
    const { nextY, grandTotal } = drawItems(doc, order.items, y);

    drawSummary(doc, grandTotal, nextY);
    drawFooter(doc, orderId);

    // ── Finalize ───────────────────────────────────────────────────────────
    doc.end();

  } catch (error) {
    console.error("Invoice generation error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Could not generate invoice", error });
    }
  }
};



// ===========================
// Admin: Get All Orders (Paginated + Filters)
// ===========================
export const getAllOrders = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      status,
      search,
      startDate,
      endDate
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    let query = {};

    // -------------------------
    // Status Filter
    // -------------------------
    if (status) {
      query.orderStatus = status;
    }

    // -------------------------
    // Search by Name / Phone / OrderId
    // -------------------------
    if (search) {
      const regex = new RegExp(search, "i");

      query.$or = [
        { "customerDetails.name": regex },
        { "customerDetails.phone": regex },
        { _id: search } // direct search by orderId
      ];
    }

    // -------------------------
    // Date Range Filter
    // -------------------------
    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate)   query.createdAt.$lte = new Date(endDate);
    }

    // -------------------------
    // FETCH ORDERS
    // -------------------------
    const orders = await Order.find(query)
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      totalOrders,
      page,
      pages: Math.ceil(totalOrders / limit),
      orders
    });

  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update status
    order.orderStatus = status;

    // Automatically set deliveredAt timestamp
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



