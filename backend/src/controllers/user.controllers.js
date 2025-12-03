import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

// ===========================
// Generate Access + Refresh Tokens
// ===========================
const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ===========================
// Google Login / Signup
// ===========================
export const googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, avatar, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        phone,
        lastLogin: new Date()
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: false,        // true in production under https
  sameSite: "lax",      // or "none" with https
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});

return res.status(200).json({
  success: true,
  message: "Login Successful",
  user,
});


  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ===========================
// Logout Controller
// ===========================
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: "" }
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ===========================
// Get User Profile (Protected)
// ===========================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-refreshToken");

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===========================
// Update User Profile
// ===========================
export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true }
    ).select("-refreshToken");

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
