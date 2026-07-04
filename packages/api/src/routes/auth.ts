import { Hono } from "hono";
import { sign } from "hono/jwt";
import { User } from "../models/User.js";
import { HTTPException } from "hono/http-exception";

export const auth = new Hono();

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  if (!(await foundUser.matchPassword(password))) {
    throw new HTTPException(400, { message: "Invalid credentials" });
  }

  const payload = {
    id: foundUser.id,
    email,
    isAdmin: foundUser.isAdmin,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10,
  };

  const token = await sign(payload, process.env.JWT_SECRET!);
  return c.json({ token, user: payload });
});
