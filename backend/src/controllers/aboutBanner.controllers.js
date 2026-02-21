import AboutBanner from "../models/aboutBanner.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createAboutBanner = async (req, res) => {
  try {
    const { title, order = 0 } = req.body;
    const localPath = req.files?.bannerImage?.[0]?.path;

    if (!localPath) {
      return res.status(400).json({
        success: false,
        message: "Banner image required",
      });
    }

    const uploadedImg = await uploadOnCloudinary(localPath);

    const banner = await AboutBanner.create({
      title,
      bannerImage: uploadedImg.url,
      order,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      banner,
    });
  } catch (err) {
    console.error("Create About Banner Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET banner
export const getAboutBanner = async (req, res) => {
  try {
    const banners = await AboutBanner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      banners,
    });
  } catch (err) {
    console.error("Get About Banner Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const deleteAboutBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await AboutBanner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    console.error("Delete About Banner Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
