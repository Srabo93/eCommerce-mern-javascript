import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
/*Routes */
import productRoutes from "./routes/productRoutes.js";
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
 * App Configuration
 */
app.use(cors());
/**
 * Mount Routes
 */
app.use("/api/products", productRoutes);
/**
 * Custom Error Handler
 */
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
