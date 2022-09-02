import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";

/**
 * @description Create new Order
 * @route POST /api/orders
 * @access private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderedItems,
    shippingAdress,
    paymentMethod,
    itemsPrice,
    tax,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderedItems && orderedItems.length === 0) {
    res.status(400);
    throw new Error("no ordered Items found");
    return;
  }
  const order = new Order({
    user: req.user._id,
    orderedItems,
    shippingAdress,
    paymentMethod,
    itemsPrice,
    tax,
    shippingPrice,
    totalPrice,
  });

  const orderCreated = await order.save();

  res.status(201).json(orderCreated);
});
export { addOrderItems };
