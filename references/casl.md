# CASL — Reference for Agentic Coding

This project uses **CASL v7** (`@casl/ability` v7) for isomorphic authorization, wrapped in `@proshop/ability` at `packages/ability/`.

## Official Documentation

- **Introduction:** <https://casl.js.org/v7/en/guide/intro>
- **Define rules:** <https://casl.js.org/v6/en/guide/define-rules>
- **Check abilities:** <https://casl.js.org/v6/en/guide/intro>
- **TypeScript support:** <https://casl.js.org/v6/en/advanced/typescript>
- **Subject type detection:** <https://casl.js.org/v5/en/guide/subject-type-detection>
- **@casl/mongoose:** <https://casl.js.org/v7/en/package/casl-mongoose>
- **GitHub repo:** <https://github.com/stalniy/casl>

## NPM Packages

| Package | Description |
|---|---|
| `@casl/ability` | Core: define + check permissions |
| `@casl/mongoose` | Mongoose/MongoDB integration (`accessibleBy`, `accessibleFieldsBy`) |
| `@casl/react` | React integration (useAbility hook) |
| `@casl/vue` | Vue integration |
| `@casl/angular` | Angular integration |
| `@casl/prisma` | Prisma integration |

## Current Usage in This Project

### `@proshop/ability` package (`packages/ability/`)

Wraps `@casl/ability` and exposes the app's authorization types and factory function.

Source: `packages/ability/src/types.ts`

```ts
export type Role = "admin" | "user";
export type Subjects = "Product" | "Review" | "Order" | "User" | "all";
export type Actions = "create" | "read" | "update" | "delete" | "manage";

export type JwtPayloadCASL = {
  id: string;
  role: Role;
  exp: number;
};
```

Source: `packages/ability/src/abilities.ts`

```ts
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { Role } from "./types.js";

export function defineAbilitiesFor(user: { id: string; role: Role }) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === "admin") {
    can("manage", "all");
  }

  if (user.role === "user") {
    can("read", "Product");
    can("create", "Review");
    can("read", "Order", { user: user.id });
    can("create", "Order", { user: user.id });
    can("update", "User", { _id: user.id });
  }

  return build();
}
```

### Hono middleware (`packages/api/src/middleware/auth.ts`)

```ts
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
```

### Usage in route handlers

```ts
// Middleware-based (preferred for simple checks):
users.get("/", authorize("manage", "User"), async (c) => { ... });

// Inline ability check (for conditional/field-level logic):
const ability = defineAbilitiesFor({ id: jwtPayload.id, role: jwtPayload.role });
if (!ability.can("update", "User" as any)) {
  throw new HTTPException(403, { message: "Forbidden" });
}
```

## Key Conventions for This Project

| Aspect | Convention |
|---|---|
| **Factory function** | `defineAbilitiesFor(user)` — always create fresh ability per request |
| **Ability builder** | `new AbilityBuilder(createMongoAbility)` — never `new AbilityBuilder(Ability)` (deprecated) |
| **Check method** | `ability.can(action, subject)` — returns boolean |
| **Forbidden check** | Return `c.json({ message: "Forbidden" }, 403)` or throw `HTTPException(403)` |
| **Actions** | `"create"`, `"read"`, `"update"`, `"delete"`, `"manage"` (manage = any action) |
| **Subjects** | String literals: `"Product"`, `"Review"`, `"Order"`, `"User"`, `"all"` |
| **Conditions** | Use MongoDB query operators: `{ user: user.id }`, `{ _id: user.id }` |
| **Role-based** | Admin gets `can("manage", "all")`; user gets granular permissions |
| **Imports** | `import { defineAbilitiesFor } from "@proshop/ability"` (not `@casl/ability` directly) |

## Pattern: Define Abilities

The core pattern — create a factory function that builds abilities based on user context:

```ts
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

type Actions = "create" | "read" | "update" | "delete" | "manage";
type Subjects = "Product" | "Review" | "Order" | "User" | "all";
type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilitiesFor(user: { id: string; role: string }) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user.role === "admin") {
    can("manage", "all");
  }

  if (user.role === "user") {
    can("read", "Product");
    can("create", "Review");
    can("read", "Order", { user: user.id });
    can("create", "Order", { user: user.id });
    cannot("delete", "Order"); // explicit deny
  }

  return build({
    detectSubjectType: (item) => (item as any).__type,
  });
}
```

## Pattern: Hono Authorization Middleware

Reusable middleware that checks ability before proceeding:

```ts
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
```

## Pattern: Mongoose Database Integration

Fetch only records the user is allowed to see:

```ts
import { accessibleRecordsPlugin } from "@casl/mongoose";
import mongoose from "mongoose";

mongoose.plugin(accessibleRecordsPlugin);

// In route handler:
const ability = defineAbilitiesFor({ id: user.id, role: user.role });
const posts = await Post.accessibleBy(ability).where({ hidden: false });
const updatablePosts = await Post.accessibleBy(ability, "update");
```

## Pattern: ForbiddenError

Throw when a specific permission check fails:

```ts
import { ForbiddenError } from "@casl/ability";

const ability = defineAbilitiesFor(user);
const post = await Post.findById(id);

ForbiddenError.from(ability).throwUnlessCan("read", post);
```

## What NOT to Do

- Do NOT use `new AbilityBuilder(Ability)` — use `createMongoAbility` (Ability is deprecated as factory)
- Do NOT use `defineAbility(can => ...)` shorthand — prefer `AbilityBuilder` for explicit control
- Do NOT forget `detectSubjectType` when using class instances — CASL needs to know how to identify subject types
- Do NOT create ability once and reuse — always call `defineAbilitiesFor(user)` per request
- Do NOT mix `@casl/ability` direct imports in API code — import from `@proshop/ability` (the app's wrapper)
- Do NOT use `cannot` without a corresponding `can` — denied actions are implicit unless explicitly blocked
- Do NOT forget that `manage` is a wildcard action — `can("manage", "all")` grants all permissions
