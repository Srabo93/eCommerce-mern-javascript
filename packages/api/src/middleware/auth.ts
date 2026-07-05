import type { MiddlewareHandler } from "hono";
import { defineAbilitiesFor } from "@proshop/ability";
import type { Actions, JwtPayloadCASL, Subjects } from "@proshop/ability";

export const authorize = (
  action: Actions,
  subject: Subjects,
): MiddlewareHandler => {
  return async (c, next) => {
    const payload = c.get("jwtPayload") as JwtPayloadCASL;
    const ability = defineAbilitiesFor({
      id: payload.id,
      role: payload.role as "admin" | "user",
    });

    if (!ability.can(action, subject)) {
      return c.json({ message: "Forbidden" }, 403);
    }
    await next();
  };
};
