import mongoose from "mongoose";

const FeaturedProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  position: { type: Number, required: true, unique: true }, // 1-8 ordering
}, { timestamps: true });

export default mongoose.model("FeaturedProduct", FeaturedProductSchema);
