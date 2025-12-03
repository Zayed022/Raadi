import mongoose from "mongoose";

const SpecialProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  startingPrice: { type: Number, required: true },

  // ⭐ NEW — Link to actual Product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  isActive: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("SpecialProduct", SpecialProductSchema);
