import PromoCard from "../models/promoCard.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create / Add promo card (admin)
export const createPromoCard = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, bgColor, position, isActive } = req.body;

    if (!title || !position) {
      return res
        .status(400)
        .json({ success: false, message: "Title and position are required" });
    }

    const imageLocalPath = req.files?.image?.[0]?.path;
    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    const card = await PromoCard.create({
      title,
      subtitle,
      buttonText,
      buttonLink,
      bgColor,
      position,
      isActive,
      image: uploadedImage.url,
    });

    return res.status(201).json({ success: true, card });
  } catch (error) {
    console.error("Create PromoCard Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all active promo cards (for frontend)
export const getActivePromoCards = async (req, res) => {
  try {
    const cards = await PromoCard.find({ isActive: true }).sort({ position: 1 });
    return res.status(200).json({ success: true, cards });
  } catch (error) {
    console.error("Get PromoCards Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all (admin)
export const getAllPromoCards = async (req, res) => {
  try {
    const cards = await PromoCard.find().sort({ position: 1 });
    return res.status(200).json({ success: true, cards });
  } catch (error) {
    console.error("Get All PromoCards Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update promo card (admin)
export const updatePromoCard = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const imageLocalPath = req.files?.image?.[0]?.path;
    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      updateData.image = uploadedImage.url;
    }

    const updated = await PromoCard.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Promo card not found" });
    }

    return res.status(200).json({ success: true, card: updated });
  } catch (error) {
    console.error("Update PromoCard Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete promo card (admin)
export const deletePromoCard = async (req, res) => {
  try {
    const card = await PromoCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Promo card not found" });
    }

    await card.deleteOne();

    return res.status(200).json({ success: true, message: "Promo card deleted" });
  } catch (error) {
    console.error("Delete PromoCard Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
