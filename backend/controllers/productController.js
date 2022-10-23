import asyncHandler from "express-async-handler";
import fs from "fs";
import Product from "../models/productModel.js";

/**
 * @description Fetch all Routes
 * @route GET /api/products
 * @access public
 */
const getProducts = asyncHandler(async (req, res) => {
  let keyword = {
    name: {
      $regex: req.query.keyword,
      $options: "i",
    },
  };
  if (req.query.keyword === undefined) {
    keyword = {};
  }
  const products = await Product.find(keyword);
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
 * @description Create a Review
 * @route POST /api/products/:id/reviews
 * @access private
 */
const createReview = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { rating, comment } = req.body.reviewData;

  const product = await Product.findById(req.params.id);

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Product received Review" });
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

  fs.unlink(`frontend/public${product.image}`, function (err) {
    if (err) throw err;

    console.log("File deleted!");
  });

  res.json({ message: "Product deleted successfully" });
});

/**
 * @description Create a new Product
 * @route POST /api/products
 * @access Private Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: "Sample Product",
    image: "/images/sample-product.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    description: "Sample Description",
    price: 0,
    countInStock: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * @description Update a Product
 * @route PUT /api/products/:id
 * @access Private Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { productInfo } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = productInfo.name;
  product.price = productInfo.price;
  product.description = productInfo.description;
  product.image = productInfo.image;
  product.brand = productInfo.brand;
  product.category = productInfo.category;
  product.countInStock = productInfo.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
};
