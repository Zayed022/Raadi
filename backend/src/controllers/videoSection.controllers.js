import VideoSection from "../models/videoSection.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createVideoSection = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const thumbnailPath = req.files?.thumbnailImage?.[0]?.path;

    if (!thumbnailPath) {
      return res.status(400).json({ success: false, message: "Thumbnail required" });
    }

    const uploadThumbnail = await uploadOnCloudinary(thumbnailPath);

    const video = await VideoSection.create({
      videoUrl,
      thumbnailImage: uploadThumbnail.url,
    });

    return res.status(201).json({ success: true, video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getVideoSection = async (req, res) => {
  try {
    const video = await VideoSection.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
