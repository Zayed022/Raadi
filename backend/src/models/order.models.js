import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 

  customerDetails: {
    name: String,
    email: String,
    phone: String,
  },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    price: Number
  }],

  shippingAddress: {
    fullName: String,
    phone: String,
    pincode: String,
    state: String,
    city: String,
    landmark: String
  },

  paymentInfo: {
    transactionId: String,
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" }
  },

  totalAmount: Number,
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending"
  },

  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
