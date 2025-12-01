import HomeBanner from "../models/homeBanner.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createHomeBanner = async (req, res) => {
  try {
    const { title, isActive } = req.body;
    const bannerPath = req.files?.bannerImage?.[0]?.path;
    

    if (!bannerPath) return res.status(400).json({ message: "Banner image is required" });

    const bannerUploaded = await uploadOnCloudinary(bannerPath);
    const banner = await HomeBanner.create({
      title,
      bannerImage: bannerUploaded.url,
      isActive,
      
    });

    res.status(201).json({ success: true, banner });

  } catch (error) {
    console.error("Banner Create Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
