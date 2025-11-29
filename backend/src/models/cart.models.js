import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true, min: 1 },
    price: Number
  }],
  totalPrice: Number,
  totalItems: Number
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
