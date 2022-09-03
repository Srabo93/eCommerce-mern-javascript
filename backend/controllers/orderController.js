import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
/**
 * @description Create new Order
 * @route POST /api/orders
 * @access private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    unorderedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  let orderItems = [];

  if (unorderedItems && unorderedItems.length === 0) {
    res.status(400);
    throw new Error("no ordered Items found");
  }

  /**
   * This sorting method is neccessary so it maps with the orderModel
   */
  unorderedItems.map((product) => {
    product.product.qty = product.qty;
    product.product.product = product.product._id;
    orderItems.push(product.product);
  });

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const orderCreated = await order.save();

  res.status(201).json(orderCreated);
});
export { addOrderItems };
