import { Hono } from "hono";
import { sign, verify, decode } from "hono/jwt";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { HTTPException } from "hono/http-exception";
import crypto from "node:crypto";

const registerSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

const refreshTokenPayloadSchema = z.object({
  id: z.string(),
  jti: z.string(),
});

type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;

export const auth = new Hono();

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const REFRESH_DAYS = 7;

auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { name, email, password } = c.req.valid("json");

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new HTTPException(422, { message: "User is already registered" });
  }

  let user;

  try {
    user = await User.create({ name, email, password, isAdmin: false });
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    throw new HTTPException(500, { message: "Something went wrong" });
  }

  const accessToken = await sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
    },
    ACCESS_SECRET,
  );

  const jti = crypto.randomUUID();
  const refreshToken = await sign(
    {
      id: user.id,
      jti,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * REFRESH_DAYS,
    },
    REFRESH_SECRET,
  );

  await RefreshToken.create({
    user: user.id,
    token: jti,
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });

  return c.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      isAdmin: user.isAdmin,
    },
  });
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  if (!(await foundUser.matchPassword(password))) {
    throw new HTTPException(400, { message: "Invalid credentials" });
  }

  const accessToken = await sign(
    {
      id: foundUser.id,
      isAdmin: foundUser.isAdmin,
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
    },
    ACCESS_SECRET,
  );

  const jti = crypto.randomUUID();
  const refreshToken = await sign(
    {
      id: foundUser.id,
      jti,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * REFRESH_DAYS,
    },
    REFRESH_SECRET,
  );

  await RefreshToken.create({
    user: foundUser.id,
    token: jti,
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });

  return c.json({
    accessToken,
    refreshToken,
    user: {
      id: foundUser.id,
      isAdmin: foundUser.isAdmin,
    },
  });
});

auth.post("/refresh", zValidator("json", refreshTokenBodySchema), async (c) => {
  const { refreshToken } = c.req.valid("json");

  let payload: RefreshTokenPayload;

  try {
    const verified = await verify(refreshToken, REFRESH_SECRET, "HS256");
    payload = refreshTokenPayloadSchema.parse(verified);
  } catch {
    throw new HTTPException(401, { message: "Invalid refresh token" });
  }

  const stored = await RefreshToken.findOne({ token: payload.jti });

  if (!stored) {
    throw new HTTPException(401, { message: "Refresh token revoked" });
  }

  const user = await User.findById(payload.id);

  if (!user) {
    await RefreshToken.deleteOne({ _id: stored._id });
    throw new HTTPException(401, { message: "User not found" });
  }

  const accessToken = await sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
    },
    ACCESS_SECRET,
  );

  const newJti = crypto.randomUUID();
  const newRefreshToken = await sign(
    {
      id: user.id,
      jti: newJti,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * REFRESH_DAYS,
    },
    REFRESH_SECRET,
  );

  await RefreshToken.deleteOne({ _id: stored._id });
  await RefreshToken.create({
    user: user.id,
    token: newJti,
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });

  return c.json({ accessToken, refreshToken: newRefreshToken });
});

auth.post("/logout", zValidator("json", refreshTokenBodySchema), async (c) => {
  const { refreshToken } = c.req.valid("json");

  const { payload } = decode(refreshToken);
  if (payload?.jti) {
    await RefreshToken.deleteOne({ token: payload.jti });
  }

  return c.json({ message: "Logged out" });
});
