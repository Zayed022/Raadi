// src/controllers/gallery.controllers.js
import Gallery from "../models/gallery.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// GET: Public – get all active gallery images
export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Get Gallery Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST: Admin – add image
export const addGalleryImage = async (req, res) => {
  try {
    const { title, description } = req.body;

    const imageLocalPath = req.files?.image?.[0]?.path;
    if (!imageLocalPath) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to upload image" });
    }

    const imageDoc = await Gallery.create({
      imageUrl: uploadedImage.url,
      title,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery image added",
      image: imageDoc,
    });
  } catch (error) {
    console.error("Add Gallery Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE: Admin – soft delete image (or hard delete)
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery image not found" });
    }

    // Soft delete (keep record but hide from public)
    image.isActive = false;
    await image.save();

    // If you want hard delete instead:
    // await image.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
