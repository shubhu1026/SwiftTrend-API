const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  mainCategory: { type: String, required: true },
  subCategory: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  images: [{ type: String, required: true }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  material: { type: String },
  gender: {
    type: String,
    enum: ["men", "women"],
    required: true,
  },
  rating: { type: Number },
  reviews: [
    {
      id: { type: String },
      user: {
        id: { type: String },
        name: { type: String },
      },
      text: { type: String },
      rating: { type: Number },
      date: { type: String },
    },
  ],
  availability: {
    inStock: { type: Boolean },
    stockCount: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
