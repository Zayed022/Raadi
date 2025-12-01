import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", GallerySchema);
