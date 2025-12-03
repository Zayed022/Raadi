import mongoose from "mongoose";

const AboutIntroSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "Welcome to Perfume World" }, // small top text
    title: { type: String, required: true },                         // Raadi aromas and fragrance
    description: { type: String, required: true },                   // paragraph
    buttonText: { type: String, default: "Read more" },
    buttonLink: { type: String, default: "/about" },

    mainImage: { type: String, required: true },                     // bottle image (Cloudinary URL)

    rightCardTitle: { type: String, default: "Product" },
    rightPoints: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("AboutIntro", AboutIntroSchema);
