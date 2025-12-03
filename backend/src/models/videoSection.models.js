import mongoose from "mongoose";

const VideoSectionSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },       // Youtube or MP4 URL
    thumbnailImage: { type: String, required: true }, // cloudinary image
  },
  { timestamps: true }
);

export default mongoose.model("VideoSection", VideoSectionSchema);
