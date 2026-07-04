# AGENTS.md — Proshop MERN + Hono Monorepo

## Build / Lint / Test Commands

```bash
# Root (pnpm workspace) — runs in all packages/* recursively
pnpm build        # pnpm --color run -r build
pnpm dev          # pnpm --color run -r -p dev (parallel)
pnpm test         # pnpm --color run -r test
pnpm lint         # pnpm --color run -r lint
pnpm check        # pnpm --color run -r check
pnpm format       # placeholder (no-op)

# @proshop/api (packages/api)
pnpm --filter @proshop-api build     # tsc -p ./tsconfig.build.json
pnpm --filter @proshop-api dev       # tsx watch src/index.ts
pnpm --filter @proshop-api start     # node dist/index.js

# Legacy frontend (CRA) — run from legacy/frontend
pnpm --filter legacy-frontend test               # react-scripts test (all tests)
pnpm --filter legacy-frontend test -- --watchAll=false  # single-run
pnpm --filter legacy-frontend test -- -- --verbose      # verbose output
# Single test file:
pnpm --filter legacy-frontend test -- -- --testPathPattern="Product.test.js"

# Legacy backend (Express)
pnpm --filter legacy-backend start       # node backend/server
pnpm --filter legacy-backend server      # nodemon backend/server (dev)
pnpm --filter legacy-backend dev         # concurrently runs server + CRA client
pnpm --filter legacy-backend data:import  # node backend/seeder
pnpm --filter legacy-backend data:delete  # node backend/seeder -d

# Docker (full stack including Mongo 8, MinIO, Mailpit)
docker compose up -d          # start all services
docker compose up server      # start just the Hono API with deps
docker compose down           # stop everything
```

**Key notes:**
- Package manager is **pnpm 10.25.0** (corepack-enabled). Never use npm/yarn.
- Workspaces defined in `pnpm-workspace.yaml` → `packages/*`
- All commands run from repo root unless noted.
- The monorepo is in active migration: `legacy/` = working Express + CRA app; `packages/` = new Hono + TBD-frontend (early stage).
- No lint/format/check scripts exist yet for packages — they are placeholders.

## Project Structure

```
/
├── compose.yaml              # Docker compose: Mongo 8, MinIO, Mailpit, Hono API
├── packages/                 # New monorepo (pnpm workspace)
│   ├── api/                  # Hono + TypeScript backend
│   │   ├── src/index.ts      # Server entry point
│   │   ├── src/routes/       # Route handlers (auth.ts, order.ts, product.ts, user.ts)
│   │   ├── src/models/       # Mongoose models (User.ts, Product.ts, Order.ts)
│   │   ├── src/middleware/    # Custom middleware (auth.ts)
│   │   ├── src/config/       # Config (database.ts)
│   │   ├── src/data/         # Seed data (users.ts, products.ts)
│   │   └── src/seed.ts       # Seeder script
│   └── ui/                   # Frontend placeholder (TBD framework)
├── legacy/                   # Complete working app (moved here)
│   ├── backend/              # Express + Mongoose
│   │   ├── config/db.js
│   │   ├── controllers/      # productController, userController, orderController
│   │   ├── middlewares/      # authMiddleware, errorMiddleware
│   │   ├── models/           # productModel, userModel, orderModel
│   │   ├── routes/           # productRoutes, userRoutes, orderRoutes, uploadRoutes
│   │   └── utils/generateToken.js
│   └── frontend/             # React 18 + CRA + Chakra UI + Redux Toolkit
│       └── src/
│           ├── components/   # Reusable UI components
│           ├── features/     # Redux slices + RTK Query API services
│           ├── pages/        # Screen components (HomeScreen, ProductScreen, etc.)
│           ├── tests/unit/   # Jest + React Testing Library tests
│           └── theme/        # Chakra UI custom theme
└── tsconfig.json             # Root TS config (strict, NodeNext)
```

## Code Style Guidelines

### TypeScript (packages/api — new code)

- **Use `import type`** for type-only imports (`verbatimModuleSyntax: true`).
- **Use explicit `export` on declarations** rather than separate `export {}` blocks.
- **Use `export default` sparingly**; prefer named exports.
- **Avoid `any`** — use `unknown` and narrow with type guards.
- **Use arrow functions** for route handlers: `app.get("/", (c) => c.text("ok"))`.
- **Use `c.json()`, `c.text()`, `c.html()`** (Hono context methods) — never `c.res`.
- **Use `zod` or `@hono/validator`** for request validation if needed.
- **Use `@hono/node-server`** (not Express/Node http directly).
- **Graceful shutdown**: handle `SIGINT`/`SIGTERM` (see `packages/api/src/index.ts:21-33`).
- **Naming**: `camelCase` for variables/functions, `PascalCase` for types/interfaces, `kebab-case` for files.
- **Imports order**: standard library → third-party → internal (no blank-line groups, keep tight).
- **Error handling**: use Hono's built-in error handling + custom `onError` middleware.
- **File naming**: `product.ts`, `user.ts`, `order.ts` (match the route/resource name).
- **Env vars**: access via `process.env` (loaded by compose.yaml or `.env`).

### JavaScript (legacy/backend — existing code)

- **ES Modules** (`"type": "module"` in package.json) — use `import`/`export`.
- **Named exports** for controllers and middleware, **default exports** for models.
- **Import with `.js` extension** in all relative imports (required by ESM).
- **Async error handling**: wrap route handlers with `express-async-handler`.
- **Error pattern**: `res.status(XXX); throw new Error("message")`.
- **Comment blocks**: JSDoc-style `/** @description ... @route ... @access ... */` above handlers.
- **Schema definitions**: `mongoose.Schema({ ... }, { timestamps: true })` with `timestamps: true`.
- **Auth pattern**: `protect` middleware decodes JWT → attaches `req.user`; `isAdmin` checks `req.user.isAdmin`.
- **Admin endpoints**: clearly separated with comment `/* ADMIN AREA */`.
- **Consistent model patterns**: subdocuments for embedded data (e.g., `reviews`), `default: 0` for numerics.

### React / Redux (legacy/frontend — existing code)

- **Functional components only**, no class components.
- **One component per file**, default export.
- **File naming**: `PascalCase.js` for components/screens, `camelCase.js` for slices/services.
- **Screen suffix**: page-level components named `*Screen.js`.
- **Import order**: React → third-party (react-router, chakra, redux) → local features → local components.
- **Chakra UI**: use component props for styling (not CSS files); responsive arrays for breakpoints.
- **Redux Toolkit**: `createSlice` for local state, `createApi` with `fetchBaseQuery` for API.
- **RTK Query**: extend base `api` via `api.injectEndpoints()`; use generated hooks.
- **Selectors**: export selector functions (e.g., `selectAllItems`) from slice files.
- **Testing**: React Testing Library + Jest; wrap in `<Router>` and `<ChakraProvider>` as needed.
- **Test file naming**: `*.test.js` co-located in `tests/unit/`.
- **Avoid direct CSS imports** except for global reset (`styles.css`).
- **LocalStorage**: persist auth token and cart; read on app init in slices.

### General Conventions

- **No semicolons** (except where required to disambiguate).
- **No trailing commas** (not enforced, but existing code mostly avoids them).
- **String quotes**: single quotes (default prettier); double quotes only for JSON.
- **Indentation**: 2 spaces.
- **Naming**: `camelCase` for JS/TS, `PascalCase` for React components, `UPPER_SNAKE_CASE` for constants/env vars.
- **Console logs**: avoid committing `console.log` (use proper logging).
- **Git commits**: conventional-style short messages (e.g., "add shipping address screen").
- **Don't add comments unless asked**. Existing code has generous JSDoc — follow that pattern only in legacy.
- **Security**: validate/sanitize inputs at the API boundary; use helmet/rate-limiting in production.
- **Secrets**: never commit `.env` files or hardcode secrets.

### Testing Patterns

```jsx
// Legacy frontend test pattern (React Testing Library + Jest)
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import Component from "../../components/Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(
      <Router>
        <ChakraProvider>
          <Component prop={value} />
        </ChakraProvider>
      </Router>
    );
    expect(screen.getByText("expected text")).toBeInTheDocument();
  });
});
```

### Docker / Infra

- **Dev environment**: `docker compose up` runs Mongo 8, MinIO, Mailpit, and the Hono API.
- **Env vars expected by compose.yaml**: `MONGODB_URI`, `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`.
- **Legacy env vars**: `MONGO_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `REACT_APP_PAYPAL_CLIENT_ID`.
- **Dockerfile**: multi-stage is not used; `pnpm install --frozen-lockfile --filter @proshop/api`.

### What NOT to Do

- Do NOT use npm or yarn — only pnpm.
- Do NOT add files to `legacy/` unless explicitly asked — it's the old app.
- Do NOT add comments to new code unless asked.
- Do NOT commit secrets, `.env` files, `node_modules`, or `dist`.
- Do NOT create empty commits.

## Reference Files

When working on a specific technology, first load the corresponding reference for patterns and conventions:

- `references/hono.md` — Hono framework reference with links to official LLM docs, current usage, key conventions, and available middleware/helpers
- `references/mongoose.md` — Mongoose ODM reference with TypeScript patterns, schema conventions, and Mongoose 9 best practices
- `references/pnpm.md` — pnpm CLI commands, workspace/filtering reference, Docker and Podman patterns, monorepo best practices
