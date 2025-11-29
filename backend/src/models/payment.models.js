import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  easybuzzTransactionId: String,
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  amount: Number,
  payload: Object // store webhook response
}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);
