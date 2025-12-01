import mongoose from "mongoose";

const AboutBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bannerImage: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("AboutBanner", AboutBannerSchema);
