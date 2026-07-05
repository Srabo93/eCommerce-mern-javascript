import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { connectDB } from "./config/database.js";
import { auth } from "./routes/auth.js";
import { users } from "./routes/users.js";
import { orders } from "./routes/orders.js";
import { products } from "./routes/products.js";

await connectDB();

const app = new Hono();

app.use(cors());
app.use(logger());

const api = app.basePath("/api");

api.route("/auth", auth);
api.route("/users", users);
api.route("/orders", orders);
api.route("/products", products);

const server = serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

process.on("SIGINT", () => server.close());
process.on("SIGTERM", () => server.close());
