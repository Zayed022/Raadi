import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  amount: Number,
  payload: Object
}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);
