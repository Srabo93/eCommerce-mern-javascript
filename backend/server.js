import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
/*Security*/
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";
import xss from "xss-clean";
import morgan from "morgan";
/*Routes */
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
/*Middleware */
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
/*Externals */
import colors from "colors";
import cors from "cors";
/**
 * Load ENV's
 */
dotenv.config();
/**
 * Connect to Database
 */
connectDB();
/**
 * Initialize Express App
 */
const app = express();
/**
 * Security Packages
 */
app.use(helmet());
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * App Configuration
 */
app.use(cors());
app.use(express.json());

/**
 *HPP Security, req sanitizing, rate limiting
 */
app.use(hpp());
app.use(mongoSanitize());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
/**
 * Mount Routes
 */
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

/**
 * Custom Error Handler
 */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
