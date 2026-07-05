import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { User } from "../models/User.js";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { HTTPException } from "hono/http-exception";
import { authorize } from "../middleware/auth.js";
import { defineAbilitiesFor } from "@proshop/ability";
import type { Variables } from "../types.ts";

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export const users = new Hono<{ Variables: Variables }>();

users.use("/*", jwt({ secret: process.env.JWT_SECRET!, alg: "HS256" }));

users.get("/", authorize("manage", "User"), async (c) => {
  let users;
  try {
    users = await User.find(
      {},
      { id: 1, email: 1, name: 1, role: 1, createdAt: 1 },
    );
  } catch (error) {
    console.log(error);
  }
  return c.json(users);
});

users.get(
  "/:id",
  authorize("manage", "User"),
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");

    let user;
    try {
      user = await User.findById(id, {
        id: 1,
        email: 1,
        name: 1,
        role: 1,
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

    const jwtPayload = c.get("jwtPayload");
    const ability = defineAbilitiesFor({
      id: jwtPayload.id,
      role: jwtPayload.role,
    });

    if (!ability.can("update", "User" as any)) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    let updatedUser;
    try {
      updatedUser = await User.findByIdAndUpdate(id, payload, {
        fields: {
          id: 1,
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
        },
        new: true,
      });
    } catch (error) {
      console.log(error);
    }

    return c.json(updatedUser);
  },
);

users.delete(
  "/:id",
  authorize("manage", "User"),
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
    user = await User.findById(id, { email: 1, name: 1, role: 1 });
  } catch (error) {
    console.log(error);
  }
  return c.json(user);
});
