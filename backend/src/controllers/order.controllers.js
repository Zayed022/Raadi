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

    const order = await Order.findById(orderId)
      .populate("items.product")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${orderId}.pdf`
    );

    // Start PDF stream BEFORE writing content
    doc.pipe(res);

    // -------------------------------
    // HEADER
    // -------------------------------
    doc.fontSize(26).font("Helvetica-Bold").text("INVOICE", 40, 30);

    doc.moveDown(2);

    doc.fontSize(12).font("Helvetica");
    doc.text(`Invoice No: INV-${orderId}`);
    doc.text(`Order ID: ${orderId}`);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Payment Status: ${order.paymentInfo.status}`);
    doc.text(`Order Status: ${order.orderStatus}`);

    doc.moveDown(2);

    // -------------------------------
    // ADDRESS
    // -------------------------------
    const addr = order.shippingAddress;

    doc.fontSize(14).font("Helvetica-Bold").text("Billing & Shipping Address");
    doc.fontSize(12).font("Helvetica");
    doc.text(addr.fullName);
    doc.text(`${addr.city}, ${addr.state}`);
    doc.text(`PIN: ${addr.pincode}`);
    doc.text(`Phone: ${addr.phone}`);

    doc.moveDown(2);

    // -------------------------------
    // ITEMS TABLE
    // -------------------------------
    doc.fontSize(14).font("Helvetica-Bold").text("Order Items");
    doc.moveDown(1);

    const startY = doc.y;

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Item", 40, startY);
    doc.text("Qty", 250, startY);
    doc.text("Price", 320, startY);
    doc.text("Total", 420, startY);

    doc.moveTo(40, startY + 15).lineTo(550, startY + 15).stroke("#999");

    let y = startY + 25;
    let grandTotal = 0;

    doc.font("Helvetica").fontSize(12);

    order.items.forEach((item) => {
      const product = item.product;

      const name = product?.name || "Deleted Product";
      const price = product?.price ?? item.price ?? 0;
      const qty = item?.quantity ?? 1;

      const rowTotal = price * qty;
      grandTotal += rowTotal;

      doc.text(name, 40, y, { width: 180 });
      doc.text(qty.toString(), 250, y);
      doc.text(`₹${price}`, 320, y);
      doc.text(`₹${rowTotal}`, 420, y);

      y += 22;

      // row separator
      doc.moveTo(40, y).lineTo(550, y).stroke("#eee");
      y += 8;
    });

    doc.moveDown(2);

    // -------------------------------
    // SUMMARY
    // -------------------------------
    doc.fontSize(14).font("Helvetica-Bold").text("Summary");

    doc.fontSize(12).font("Helvetica");
    doc.text(`Subtotal: ₹${grandTotal}`);
    doc.text(`Tax: ₹0`);
    doc.text(`Shipping: ₹0`);
    doc.text(`Payment Method: ${order.paymentInfo.status === "paid" ? "Online" : "COD"}`);

    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(14);
    doc.text(`Grand Total: ₹${grandTotal}`);

    // -------------------------------
    // FOOTER
    // -------------------------------
    doc.fontSize(10).fillColor("#777");
    doc.text(
      "Thank you for shopping with RAADI.",
      40,
      780,
      { align: "center" }
    );

    // END PDF STREAM
    doc.end();

  } catch (error) {
    console.error("Invoice Error:", error);

    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Could not generate invoice", error });
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



