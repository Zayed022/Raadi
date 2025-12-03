import AboutIntro from "../models/aboutIntro.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE / UPDATE (we'll just create a new one, frontend always fetches latest)
export const createAboutIntro = async (req, res) => {
  try {
    const {
      eyebrow,
      title,
      description,
      buttonText,
      buttonLink,
      rightCardTitle,
      rightPoints,
    } = req.body;

    const localPath = req.files?.mainImage?.[0]?.path;

    if (!localPath) {
      return res.status(400).json({ success: false, message: "Main image is required" });
    }

    const uploadedImg = await uploadOnCloudinary(localPath);

    const pointsArray =
      typeof rightPoints === "string"
        ? rightPoints.split("|").map((p) => p.trim()).filter(Boolean)
        : Array.isArray(rightPoints)
        ? rightPoints
        : [];

    const intro = await AboutIntro.create({
      eyebrow,
      title,
      description,
      buttonText,
      buttonLink,
      rightCardTitle,
      rightPoints: pointsArray,
      mainImage: uploadedImg.url,
    });

    return res.status(201).json({
      success: true,
      intro,
    });
  } catch (error) {
    console.error("Create AboutIntro Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET latest intro section
export const getAboutIntro = async (req, res) => {
  try {
    const intro = await AboutIntro.findOne().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      intro,
    });
  } catch (error) {
    console.error("Get AboutIntro Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
