import express from "express";
import { authUser, getUserProfile } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/profile").get(protect, getUserProfile);
router.route("/login").post(authUser);

export default router;
