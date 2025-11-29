import Category from "../models/category.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import slugify from "slugify";

// ===========================
// Create Category (Admin)
// ===========================
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Check duplicate
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    // Upload image file
    const imageLocalPath = req.files?.image?.[0]?.path;
    let uploadedImage = null;

    if (imageLocalPath) {
      uploadedImage = await uploadOnCloudinary(imageLocalPath);
    }

    const newCategory = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      image: uploadedImage?.url || null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });

  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ===========================
// Get All Categories
// ===========================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: categories.length,
      categories,
    });

  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// Get Category By Slug
// ===========================
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, category });

  } catch (error) {
    console.error("Category Slug Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Update Category
// ===========================
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let updateData = { ...req.body };

    if (name) {
      updateData.slug = slugify(name, { lower: true });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Delete Category
// ===========================
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
