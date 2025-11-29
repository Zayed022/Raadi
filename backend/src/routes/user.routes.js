import express from "express";
import {
  googleLogin,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getUserProfile);
router.put("/profile", verifyJWT, updateUserProfile);

export default router;
