import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||                  // if using cookies
      req.header("Authorization")?.replace("Bearer ", ""); // frontend Bearer token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing token",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = user; // attach user to req for controllers
    next();

  } catch (error) {
    console.error("JWT Verification Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized or expired session",
    });
  }
};
