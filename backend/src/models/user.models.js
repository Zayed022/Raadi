import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  googleId: { type: String },         
  avatar: { type: String },

  role: { type: String, enum: ["customer", "admin", "delivery"], default: "customer" },

  addresses: [{
    fullName: String,
    phone: String,
    pincode: String,
    state: String,
    city: String,
    landmark: String,
    type: { type: String, enum: ["home", "office"] }
  }],

  lastLogin: Date,
  refreshToken: String,
  loginMethod: { type: String, default: "google" }

}, { timestamps: true });

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
