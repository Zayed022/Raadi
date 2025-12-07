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
      productId
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const localPath = req.files?.mainImage?.[0]?.path;
    if (!localPath)
      return res.status(400).json({ success: false, message: "Main image is required" });

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
      productId,
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

export const deleteAboutIntro = async (req, res) => {
  try {
    // fetch the latest intro same as your GET logic
    const intro = await AboutIntro.findOne().sort({ createdAt: -1 });

    if (!intro) {
      return res.status(404).json({
        success: false,
        message: "No About Intro section found to delete"
      });
    }

    // OPTIONAL: remove existing image from Cloudinary
   

    await intro.deleteOne();

    return res.status(200).json({
      success: true,
      message: "About Intro section deleted successfully"
    });

  } catch (error) {
    console.error("Delete AboutIntro Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
