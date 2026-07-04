import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);
const options = {
  page: 1,
  collation: {
    locale: "en",
  },
  pagination: true,
};

Product.paginate({}, options, function (err, result) {
  if (err) {
    console.log(err);
  }
  result.docs;
  result.totalDocs = 100;
  result.limit = 2;
  result.page = 1;
  result.totalPages = 10;
  result.hasNextPage = true;
  result.nextPage = 2;
  result.hasPrevPage = false;
  result.prevPage = null;
  result.pagingCounter = 1;
});
export default Product;
