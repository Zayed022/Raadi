import Product from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Category from "../models/category.models.js";
// ===========================
// Create Product (Admin Only)
// ===========================
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      mrp,
      discount,
      brand,
      stock,
      isTopProduct,
      isFeatureProduct,
      isBestSeller,
    } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "name, price, category and stock are required",
      });
    }

    // Check if image has been uploaded
    const imageLocalPath = req.files?.image?.[0]?.path;

    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
      return res.status(400).json({ success: false, message: "Failed to upload image" });
    }

    // Create Product
    const product = await Product.create({
      name,
      description,
      price,
      mrp,
      discount,
      brand,
      stock,
      category,
      isTopProduct,
      isFeatureProduct,
      isBestSeller,
      images: [uploadedImage.url],
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// ===========================
// Get All Products with Filters, Search & Pagination
// ===========================
export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      rating,
      sort,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12
    } = req.query;

    let query = {};

    // SEARCH FILTER
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // PRICE RANGE
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // RATING FILTER
    if (rating) {
      query.ratings = { $gte: Number(rating) };
    }

    // CATEGORY FILTER
    if (category) {
      const categoryObj = await Category.findOne({
        name: { $regex: new RegExp("^" + category + "$", "i") }
      });

      if (categoryObj) query.category = categoryObj._id;
    }

    // SORT OPTIONS
    let sortOption = {};
    switch (sort) {
      case "price_low":
        sortOption.price = 1;
        break;
      case "price_high":
        sortOption.price = -1;
        break;
      case "rating":
        sortOption.ratings = -1;
        break;
      case "latest":
        sortOption.createdAt = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortOption);

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });

  } catch (err) {
    console.error("Get Products Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};




// ===========================
// Get Single Product by ID
// ===========================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Update Product (Admin)
// ===========================
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Delete Product (Admin)
// ===========================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Get Products by Category
// ===========================
export const getProductByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Find the category by name (case-insensitive)
    const category = await Category.findOne({
      name: { $regex: new RegExp("^" + categoryName + "$", "i") }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Fetch products belonging to the found category
    const products = await Product.find({ category: category._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      category: category.name,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("Get Products by Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};


// ===========================
// Recommended Products
// ===========================
export const getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const recommended = await Product.find({
      category: product.category,
      _id: { $ne: productId } // exclude self
    })
      .sort({ ratings: -1, sold: -1 }) // prioritize best items
      .limit(10);

    return res.status(200).json({
      success: true,
      count: recommended.length,
      recommended
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTopProduct: true })
      .sort({ createdAt: -1 }) 
      .limit(8);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Top Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getFeatureProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatureProduct: true })
      .sort({ createdAt: -1 }) 
      .limit(8);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Top Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getBestSeller= async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .sort({ createdAt: -1 }) 
      .limit(8);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Top Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

