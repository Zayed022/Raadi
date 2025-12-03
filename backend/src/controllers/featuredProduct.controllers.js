import FeaturedProduct from "../models/featuredProduct.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createFeaturedProduct = async (req, res) => {
  try {
    const { name, shortDescription, mrp, price, position } = req.body;
    const localPath = req.files?.image?.[0]?.path;

    if (!localPath) {
      return res.status(400).json({ message: "Image required" });
    }

    const uploadedImg = await uploadOnCloudinary(localPath);

    const product = await FeaturedProduct.create({
      name,
      shortDescription,
      mrp,
      price,
      position,
      image: uploadedImg.url,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Create Featured Error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await FeaturedProduct.find().sort({ position: 1 }).limit(8);
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Get Featured Error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};
