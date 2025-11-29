import Review from "../models/review.models.js";
import Product from "../models/product.models.js";

// ===========================
// Add or Update Review
// ===========================
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: "Rating is required" });
    }

    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if review exists by this user
    let review = await Review.findOne({ product: productId, user: userId });

    if (review) {
      // Update review
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        product: productId,
        user: userId,
        rating,
        comment
      });
    }

    // Recalculate average rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    product.ratings = avgRating;
    product.numReviews = reviews.length;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review added/updated successfully",
      review
    });

  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Get All Reviews for a product
// ===========================
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Delete Review
// ===========================
export const deleteReview = async (req, res) => {
  try {
    const { reviewId, productId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only allow review owner or admin
    if (req.user._id.toString() !== review.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.deleteOne();

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating,
      numReviews: reviews.length
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Delete Review Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
