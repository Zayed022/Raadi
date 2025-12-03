import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  mrp: Number,
  discount: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  isTopProduct: { type: Boolean, default: false },
  isFeatureProduct: {type: Boolean, default: false},
  isBestSeller: {type: Boolean, default: false},
  brand: String,
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
