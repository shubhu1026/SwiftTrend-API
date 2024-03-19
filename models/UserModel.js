const mongoose = require("mongoose");
const { cartItemSchema } = require("./CartItemModel");
const { addressSchema } = require("./AddressModel");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  gender: String,
  dateOfBirth: Date,
  contactNumber: String,
  addresses: [addressSchema],
  cart: {
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
