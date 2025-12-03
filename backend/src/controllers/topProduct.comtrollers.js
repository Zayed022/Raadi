import TopProduct from "../models/topProduct.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createTopProduct = async (req, res) => {
  try {
    const { name, mrp, price, position } = req.body;
    const localPath = req.files?.image?.[0]?.path;
    if (!localPath) return res.status(400).json({ message: "Image required" });

    const uploaded = await uploadOnCloudinary(localPath);

    const product = await TopProduct.create({
      name,
      mrp,
      price,
      position,
      image: uploaded.url
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const products = await TopProduct.find().sort({ position: 1 }).limit(8);
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
