const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true }, // New field: name
  mobile: { type: String, required: true }, // New field: phone number
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = { Address, addressSchema };
