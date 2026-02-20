import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: String,
    image: String,
  },
  { timestamps: true }
);

// 🔥 AUTO GENERATE SLUG
CategorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.model("Category", CategorySchema);