import AboutBanner from "../models/aboutBanner.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createAboutBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const localPath = req.files?.bannerImage?.[0]?.path;

    if (!localPath) return res.status(400).json({ message: "Banner image required" });

    const uploadedImg = await uploadOnCloudinary(localPath);

    const banner = await AboutBanner.create({
      title,
      bannerImage: uploadedImg.url
    });

    res.status(201).json({ success: true, banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET banner
export const getAboutBanner = async (req, res) => {
  try {
    const banner = await AboutBanner.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
