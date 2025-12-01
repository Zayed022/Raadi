import mongoose from "mongoose";

const HomeBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bannerImage: { type: String, required: true }, // large left image (products)
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("HomeBanner", HomeBannerSchema);
