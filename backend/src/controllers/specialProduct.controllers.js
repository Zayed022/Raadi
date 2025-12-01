import SpecialProduct from "../models/specialProduct.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE Special Product Banner
export const createSpecialProduct = async (req, res) => {
  try {
    const { title, description, startingPrice, isActive } = req.body;

    const imageLocalPath = req.files?.image?.[0]?.path;
    if (!imageLocalPath) return res.status(400).json({ message: "Image is required" });

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    const newSpecial = await SpecialProduct.create({
      title,
      description,
      startingPrice,
      isActive,
      image: uploadedImage.url,
    });

    return res.status(201).json({ success: true, special: newSpecial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET Active Featured Special Product
export const getActiveSpecialProduct = async (req, res) => {
  try {
    const special = await SpecialProduct.findOne({ isActive: true });

    if (!special) return res.status(404).json({ message: "No active special product found" });

    return res.status(200).json({ success: true, special });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Specials
export const getAllSpecialProducts = async (req, res) => {
  try {
    const specials = await SpecialProduct.find();
    res.status(200).json({ success: true, specials });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Special Product
export const updateSpecialProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files?.image?.[0]?.path) {
      const newImg = await uploadOnCloudinary(req.files.image[0].path);
      updateData.image = newImg.url;
    }

    const updated = await SpecialProduct.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete
export const deleteSpecialProduct = async (req, res) => {
  await SpecialProduct.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Deleted Successfully" });
};
