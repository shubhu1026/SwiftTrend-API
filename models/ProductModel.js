const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    mainCategory: { type: String, enum: ["men", "women"], required: true },
    subCategory: {
      type: String,
      enum: ["accessories", "clothing", "footwear"],
      required: true,
    },
    description: { type: String, required: true },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    images: [{ type: String, required: true }],
    productAvailability: [
      {
        color: { type: String },
        size: { type: String },
        inStock: { type: Number },
      },
    ],
    // sizes: [{ type: String, enum: ["S", "M", "L", "XL", "XXL", "XXXL"] }],
    // colors: [{ type: String }],
    material: { type: String },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    rating: { type: Number },
    // inStock: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true } }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
