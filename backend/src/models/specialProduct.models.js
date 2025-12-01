import mongoose from "mongoose";

const SpecialProductSchema = new mongoose.Schema({
  title: { type: String, required: true }, // FRUITY OCEANIC
  description: { type: String, required: true }, // subtitle text
  image: { type: String, required: true }, // cloudinary url
  startingPrice: { type: Number, required: true }, // shown price
  isActive: { type: Boolean, default: false }, // choose which banner to display
}, { timestamps: true });

export default mongoose.model("SpecialProduct", SpecialProductSchema);
