import Wishlist from "../models/wishlist.models.js";
import Product from "../models/product.models.js";

// ===========================
// Add product to wishlist
// ===========================
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });

  } catch (error) {
    console.error("AddToWishlist Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Get Wishlist
// ===========================
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        wishlist: [],
      });
    }

    return res.status(200).json({ success: true, wishlist });

  } catch (error) {
    console.error("GetWishlist Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Remove specific product
// ===========================
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });

  } catch (error) {
    console.error("RemoveWishlist Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Clear Wishlist
// ===========================
export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });

  } catch (error) {
    console.error("ClearWishlist Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
