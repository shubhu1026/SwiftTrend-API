const mongoose = require("mongoose");
const { cartItemSchema } = require("./CartItemModel"); // Adjust the path accordingly

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  gender: String,
  dateOfBirth: Date,
  contactNumber: String,
  address: String,
  cart: {
    items: [cartItemSchema], // Use the schema directly here
    total: {
      type: Number,
      default: 0,
    },
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
