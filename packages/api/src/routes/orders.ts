import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { Order } from "../models/Order.js";
import { HTTPException } from "hono/http-exception";

type Variables = JwtVariables<{ id: string; isAdmin: boolean; exp: number }>;

const orderItemSchema = z.object({
  name: z.string(),
  qty: z.number(),
  image: z.string(),
  price: z.number(),
  product: z.string(),
});

const createOrderSchema = z.object({
  orderItems: z.array(orderItemSchema).min(1),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string(),
  itemsPrice: z.number(),
  taxPrice: z.number(),
  shippingPrice: z.number(),
  totalPrice: z.number(),
});

const paySchema = z.object({
  id: z.string(),
  status: z.string(),
  update_time: z.string(),
  payer: z.object({ email_address: z.string() }),
});

export const orders = new Hono<{ Variables: Variables }>();

orders.use("/*", jwt({ secret: process.env.JWT_SECRET!, alg: "HS256" }));

orders.post("/", zValidator("json", createOrderSchema), async (c) => {
  const payload = c.req.valid("json");
  const { id } = c.get("jwtPayload");

  let order;
  try {
    order = await Order.create({ ...payload, user: id });
  } catch (error) {
    console.log(error);
  }

  return c.json(order, 201);
});

orders.get("/myorders", async (c) => {
  const { id } = c.get("jwtPayload");
  let myOrders;
  try {
    myOrders = await Order.find({ user: id });
  } catch (error) {
    console.log(error);
  }
  return c.json(myOrders);
});

orders.get("/", async (c) => {
  let allOrders;
  try {
    allOrders = await Order.find().populate("user", "id name");
  } catch (error) {
    console.log(error);
  }
  return c.json(allOrders);
});

orders.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");
    let order;
    try {
      order = await Order.findById(id).populate("user", "name email");
    } catch (error) {
      console.log(error);
    }
    if (!order) {
      throw new HTTPException(404, { message: "Order not found" });
    }
    return c.json(order);
  },
);

orders.put(
  "/:id/pay",
  zValidator("param", z.object({ id: z.string() })),
  zValidator("json", paySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { id: paymentId, status, update_time, payer } = c.req.valid("json");

    let order;
    try {
      order = await Order.findById(id);
    } catch (error) {
      console.log(error);
    }
    if (!order) {
      throw new HTTPException(404, { message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: paymentId,
      status,
      updateTime: update_time,
      emailAddress: payer.email_address,
    };

    let updatedOrder;
    try {
      updatedOrder = await order.save();
    } catch (error) {
      console.log(error);
    }

    return c.json(updatedOrder);
  },
);

orders.put(
  "/:id/deliver",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");

    let order;
    try {
      order = await Order.findById(id);
    } catch (error) {
      console.log(error);
    }
    if (!order) {
      throw new HTTPException(404, { message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    let updatedOrder;
    try {
      updatedOrder = await order.save();
    } catch (error) {
      console.log(error);
    }

    return c.json(updatedOrder);
  },
);
