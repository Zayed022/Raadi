import mongoose from "mongoose";

const PromoCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true }, // cloudinary URL
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "#" },

    // background color like: "#fceae4" etc.
    bgColor: { type: String, default: "#f5f5f5" },

    // 1–5 fixed slots in the layout
    position: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      unique: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("PromoCard", PromoCardSchema);
