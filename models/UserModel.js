const mongoose = require("mongoose");
const { cartItemSchema } = require("./CartItemModel");
const { addressSchema } = require("./AddressModel");
const { orderSchema } = require("./OrderModel");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  gender: String,
  dateOfBirth: Date,
  contactNumber: String,
  addresses: [addressSchema],
  orders: [orderSchema],
  cart: {
    items: [cartItemSchema],
    shippingAddress: addressSchema,
    total: {
      type: Number,
      default: 0,
    },
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
