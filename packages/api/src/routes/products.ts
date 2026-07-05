import { Hono } from "hono";
import { Product } from "../models/Product.js";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables<{ id: string; isAdmin: boolean; exp: number }>;

const createSchema = z.object({
  name: z.string(),
  image: z.string(),
  brand: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.string(),
  countInStock: z.number(),
});

const updateSchema = z.object({
  name: z.string().optional(),
  price: z.string(),
  description: z.string().max(1000),
  image: z.string(),
  brand: z.string(),
  category: z.string(),
  countInStock: z.number(),
});
export const products = new Hono<{ Variables: Variables }>();

products.use("/*", jwt({ secret: process.env.JWT_SECRET!, alg: "HS256" }));

products.get("/", async (c) => {
  let products;
  try {
    products = await Product.find({}).select("-user, -__v");
  } catch (error) {
    console.log(error);
  }

  return c.json(products);
});

products.post("/", zValidator("json", createSchema), async (c) => {
  const payload = c.req.valid("json");
  const { id } = c.get("jwtPayload");

  let product;
  try {
    product = await Product.create({
      ...payload,
      user: id,
      price: Number(payload.price),
    });
  } catch (error) {
    console.log(error);
  }

  return c.json(product, 201);
});

products.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");
    let product;
    try {
      product = await Product.findById(id).select("-__v, -updatedAt");
    } catch (error) {
      console.log(error);
    }
    return c.json(product);
  },
);

products.put(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  zValidator("json", updateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    let updated;
    try {
      updated = await Product.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true, fields: "-user, -__v, -updatedAt" },
      );
    } catch (error) {
      console.log(error);
    }
    return c.json(updated);
  },
);

products.delete(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");

    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }

    return new Response(null, { status: 204 });
  },
);
