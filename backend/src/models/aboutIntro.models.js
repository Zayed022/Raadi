import mongoose from "mongoose";

const AboutIntroSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "Welcome to Perfume World" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, default: "Read More" },

    // ⭐ NEW — product linked to this intro section
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    mainImage: { type: String, required: true },

    rightCardTitle: { type: String, default: "Product Features" },
    rightPoints: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("AboutIntro", AboutIntroSchema);
