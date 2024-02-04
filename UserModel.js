const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  gender: String,
  dateOfBirth: Date,
  contactNumber: String,
  address: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
