import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

/**
 * @description Fetch all Routes
 * @route GET /api/products
 * @access public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

/**
 * @description Fetch single product
 * @route GET /api/products/:id
 * @access public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    res.json(product);
  }
});

/**
 * ADMIN AREA
 */

/**
 * @description Delete a product
 * @route DEL /api/products/:id
 * @access Private Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.remove();
  res.json({ message: "Product deleted successfully" });
});

export { getProductById, getProducts, deleteProduct };
