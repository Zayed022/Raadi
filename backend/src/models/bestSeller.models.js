import mongoose from "mongoose";

const BestSellerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  isActive: { type: Boolean, default: true },
  position: { type: Number, default: 0 } // for ordering
}, { timestamps: true });

export default mongoose.model("BestSeller", BestSellerSchema);
