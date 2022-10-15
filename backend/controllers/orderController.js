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

/**
 * @description Get Order By Id
 * @route GET /api/order/:id
 * @access private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

/**
 * @description Update Order to Paid
 * @route PUT /api/orders/:id/pay
 * @access private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { id, status, payer, update_time } = req.body;

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id,
    status,
    update_time,
    email_address: payer.email_address,
  };

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

/**
 * @description Get All Orders By User
 * @route GET /api/myorders
 * @access private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    res.status(404);
    throw new Error("no orders found");
  }

  res.json(orders);
});

/**
 * ADMIN AREA
 */

/**
 * @description Get All Orders
 * @route GET /api/orders
 * @access private
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name");

  if (!orders) {
    res.status(404);
    throw new Error("no orders found");
  }

  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
};
