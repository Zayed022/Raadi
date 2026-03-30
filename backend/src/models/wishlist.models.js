import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // 🔥 replace user

  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ]
}, { timestamps: true });

export default mongoose.model("Wishlist", WishlistSchema);