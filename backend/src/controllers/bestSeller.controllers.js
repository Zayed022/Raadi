import BestSeller from "../models/bestSeller.models.js";
import Product from "../models/product.models.js";

// Add Best Seller Product
export const addBestSeller = async (req, res) => {
  try {
    const { productId, position } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const exists = await BestSeller.findOne({ product: productId });
    if (exists) return res.status(400).json({ message: "Already exists in best sellers" });

    const bestSeller = await BestSeller.create({ product: productId, position });

    res.status(201).json({ success: true, bestSeller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all active best seller products with product details
export const getBestSellers = async (req, res) => {
  try {
    const items = await BestSeller.find({ isActive: true })
      .populate("product")
      .sort({ position: 1 });

    res.status(200).json({ success: true, bestSellers: items });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete
export const deleteBestSeller = async (req, res) => {
  await BestSeller.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Deleted successfully" });
};

// Update position / active
export const updateBestSeller = async (req, res) => {
  const updated = await BestSeller.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, updated });
};
