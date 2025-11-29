import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  description: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);
