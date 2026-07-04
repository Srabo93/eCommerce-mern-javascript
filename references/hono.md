# Hono — Reference for Agentic Coding

This project uses **Hono** (v4.12.27) with `@hono/node-server` for the API in `packages/api/`.

## Official LLM Reference Files

Load these for comprehensive API docs and patterns:

- **Full docs (no examples, covers everything):** <https://hono.dev/llms-full.txt>
- **Tiny docs (core only):** <https://hono.dev/llms-small.txt>
- **Index / overview:** <https://hono.dev/llms.txt>

## Current Usage in This Project

Source: `packages/api/src/index.ts`

```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

// Graceful shutdown pattern:
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) { console.error(err); process.exit(1); }
    process.exit(0);
  });
});
```

## Key Conventions for This Project

| Aspect | Convention |
|---|---|
| **Server** | `@hono/node-server` — never Express/Node http directly |
| **Response helpers** | `c.json()`, `c.text()`, `c.html()` — never `c.res` |
| **Route handlers** | Arrow functions: `app.get("/", (c) => c.text("ok"))` |
| **Validation** | Use `zod` with `@hono/zod-validator` |
| **Error handling** | Hono's built-in error handling + custom `onError` middleware |
| **Route organization** | `app.route("/products", productRoutes)` pattern |
| **File naming** | `product.ts`, `user.ts`, `order.ts` — kebab-case, match resource name |
| **Graceful shutdown** | Handle `SIGINT`/`SIGTERM` (see `packages/api/src/index.ts:21-33`) |
| **Types** | `import type` for type-only imports (`verbatimModuleSyntax: true`) |

## Built-in Middleware Available

Hono ships with these built-in middleware (import from `hono/<name>`):

`basic-auth`, `bearer-auth`, `body-limit`, `cache`, `combine`, `compress`, `context-storage`, `cors`, `csrf`, `etag`, `ip-restriction`, `jsx-renderer`, `jwk`, `jwt`, `language`, `logger`, `method-override`, `pretty-json`, `request-id`, `secure-headers`, `timeout`, `timing`, `trailing-slash`

## Helpers Available

Import from `hono/<name>`: `accepts`, `adapter`, `conninfo`, `cookie`, `css`, `dev`, `factory`, `html`, `jwt`, `proxy`, `route`, `ssg`, `streaming`, `testing`, `websocket`

## Recommended Patterns

See the Hono docs for:
- **Best Practices**: <https://hono.dev/docs/guides/best-practices>
- **Building larger apps**: use `app.route()` to mount sub-apps
- **RPC**: share types between server and client via `hc`
- **Validation**: <https://hono.dev/docs/guides/validation>
- **Testing**: <https://hono.dev/docs/guides/testing>
