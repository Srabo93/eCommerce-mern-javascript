import express from "express";
import { addOrderitems } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/").post(protect, addOrderitems);

export default router;
