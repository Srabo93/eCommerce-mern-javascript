import express from "express";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  createReview,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, isAdmin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router.route("/:id/reviews").post(protect, createReview);

export default router;
