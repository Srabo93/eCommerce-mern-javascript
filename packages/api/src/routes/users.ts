import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { User } from "../models/User.js";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { HTTPException } from "hono/http-exception";

type Variables = JwtVariables<{ id: string; isAdmin: boolean; exp: number }>;

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  isAdmin: z.boolean().optional(),
});

export const users = new Hono<{ Variables: Variables }>();

users.use("/*", jwt({ secret: process.env.JWT_SECRET!, alg: "HS256" }));

users.get("/", async (c) => {
  let users;
  try {
    users = await User.find({}, { id: 1, email: 1, name: 1, createdAt: 1 });
  } catch (error) {
    console.log(error);
  }
  return c.json(users);
});

users.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");

    let user;
    try {
      user = await User.findById(id, {
        id: 1,
        email: 1,
        name: 1,
        createdAt: 1,
      });
    } catch (error) {
      console.log(error);
    }
    return c.json(user);
  },
);

users.put(
  "/:id",
  zValidator("json", updateSchema),
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    let updatedUser;
    try {
      await User.findByIdAndUpdate(id, payload, {
        id: 1,
        name: 1,
        email: 1,
        createdAt: 1,
      });

      updatedUser = await User.findById(id, {
        id: 1,
        name: 1,
        email: 1,
        createdAt: 1,
      });
    } catch (error) {
      console.log(error);
    }

    return c.json(updatedUser);
  },
);

users.delete(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");
    let deleted;

    try {
      const exist = await User.findById(id);
      if (exist) {
        deleted = await User.findByIdAndDelete(id);
      }
    } catch (error) {
      console.log(error);
    }

    if (!deleted) {
      throw new HTTPException(400);
    }
    return new Response(null, { status: 204 });
  },
);

users.get("/me", async (c) => {
  const { id } = c.get("jwtPayload");
  let user;
  try {
    user = await User.findById(id, { email: 1, name: 1 });
  } catch (error) {
    console.log(error);
  }
  return c.json(user);
});
