const User = require("../models/UserModel");
const errors = require("restify-errors");

async function getAllAddresses(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new errors.NotFoundError("User not found");
    }
    res.send(user.addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function addAddress(req, res) {
  const userId = req.params.userId;
  const newAddress = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new errors.NotFoundError("User not found");
    }
    user.addresses.push(newAddress);
    await user.save();
    res.send(201, user.addresses); // Sending status code 201 for "Created" along with the addresses
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.send(error);
  }
}

async function updateAddress(req, res) {
  const userId = req.params.userId;
  const addressId = req.params.addressId;
  const updatedAddress = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new errors.NotFoundError("User not found");
    }
    const addressIndex = user.addresses.findIndex(
      (address) => address._id == addressId
    );
    if (addressIndex === -1) {
      throw new errors.NotFoundError("Address not found");
    }
    user.addresses[addressIndex] = updatedAddress;
    await user.save();
    res.send(user.addresses);
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.send(error);
  }
}

async function deleteAddress(req, res) {
  const userId = req.params.userId;
  const addressId = req.params.addressId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new errors.NotFoundError("User not found");
    }
    user.addresses = user.addresses.filter(
      (address) => address._id != addressId
    );
    await user.save();
    res.send(user.addresses);
  } catch (error) {
    console.error("Error deleting address:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

module.exports = {
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
