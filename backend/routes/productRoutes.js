import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const router = express.Router();
/**
 * @description Fetch all Routes
 * @route GET /api/products
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);
/**
 * @description Fetch single product
 * @route GET /api/products/:id
 * @access public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: "Product not found" });
    res.json(product);
  })
);

export default router;
