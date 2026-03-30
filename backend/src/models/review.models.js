import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

   
    name: { type: String, required: true },
    email: { type: String },

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);