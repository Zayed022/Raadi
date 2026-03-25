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

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "name, price, category and stock are required",
      });
    }

    // ✅ Get multiple images
    const imageFiles = req.files;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ✅ Upload all images to Cloudinary
    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);
        if (!result) {
          throw new Error("Image upload failed");
        }
        return result.url;
      })
    );

    // ✅ Create product with multiple images
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
      images: uploadedImages, // <-- key change
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
      error: error.message,
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
    } = req.query;

    let query = {};

    // SEARCH
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // PRICE RANGE
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // RATING
    if (rating) {
      query.ratings = { $gte: Number(rating) };
    }

    // CATEGORY
    if (category) {
      const categoryObj = await Category.findOne({
        name: { $regex: new RegExp("^" + category + "$", "i") }
      });

      if (categoryObj) query.category = categoryObj._id;
    }

    // SORT
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

    // Fetch ALL products (no pagination)
    const products = await Product.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      total: products.length,
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let newImages = [];

    // ✅ Safe file handling
    if (Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        if (!file?.path) continue;

        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.url) {
          newImages.push(uploaded.url);
        }
      }
    }

    // ✅ Fix existing images corruption
    const existingImages = Array.isArray(product.images)
      ? product.images
      : [];

    const updatedImages =
      newImages.length > 0
        ? [...existingImages, ...newImages]
        : existingImages;

    // ✅ CONTROLLED UPDATE (NO SPREAD)
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = Number(req.body.price) || product.price;
    product.stock = Number(req.body.stock) || product.stock;
    product.category = req.body.category || product.category;
    product.mrp = req.body.mrp ? Number(req.body.mrp) : product.mrp;
    product.discount = req.body.discount
      ? Number(req.body.discount)
      : product.discount;
    product.brand = req.body.brand || product.brand;

    product.images = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("🔥 Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message, // 👈 SHOW REAL ERROR
    });
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
/*
export const getProductByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const products = await Product.find({
      category: category._id,
    }).sort({ createdAt: -1 });

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
    });
  }
};
*/

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // If your Product.category stores ObjectId
    const categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${category}$`, "i") }
    });

    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({
      category: categoryDoc._id
    })
    .sort({ name: 1 })
    .collation({ locale: "en", strength: 2 }); // 🔥 Alphabetical A → Z

    return res.status(200).json({
      success: true,
      category: categoryDoc.name,
      count: products.length,
      products
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
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

export const toggleTopProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isTopProduct = !product.isTopProduct;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${
        product.isTopProduct ? "added to" : "removed from"
      } Top Products`,
      product,
    });
  } catch (error) {
    console.error("Toggle Top Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isFeatureProduct = !product.isFeatureProduct;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${
        product.isFeatureProduct ? "added to" : "removed from"
      } Featured Products`,
      product,
    });
  } catch (error) {
    console.error("Toggle Featured Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const toggleBestSeller = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isBestSeller = !product.isBestSeller;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${
        product.isBestSeller ? "marked as" : "removed from"
      } Best Seller`,
      product,
    });
  } catch (error) {
    console.error("Toggle Best Seller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const imageLocalPath = req.files?.image?.[0]?.path;

    if (!imageLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Upload new image
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // Replace image (single image case)
    product.images = [uploadedImage.url];

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Image Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



