const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true, 
  // Canadian Postal Code validation
  match: [/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Please enter a valid Canadian postal code'] },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = { Address, addressSchema };
