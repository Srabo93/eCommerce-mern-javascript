import path from "path";
import express from "express";
import Product from "../models/productModel.js";
import multer from "multer";
import asyncHandler from "express-async-handler";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "frontend/public/images/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  "/",
  upload.single("uploadedImg"),
  asyncHandler(async (req, res) => {
    const { id } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.image = `/${req.file.path.replace(/frontend\/public\//g, "")}`;

    await product.save();

    res.json({
      status: 201,
      path: `/${req.file.path.replace(/frontend\/public\//g, "")}`,
    });
  })
);

export default router;
