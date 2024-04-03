const mongoose = require("mongoose");
const { cartItemSchema } = require("./CartItemModel");
const { addressSchema } = require("./AddressModel");

const orderSchema = new mongoose.Schema({
  items: [cartItemSchema],
  shippingAddress: addressSchema,
  totalAmount: {
    type: Number,
    default: 0,
  },
  bagTotal: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: String,
  paymentId: String,
  status: {
    type: String,
    enum: ["placed", "shipped", "delivered", "cancelled"],
    required: true,
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = { OrderModel, orderSchema };
