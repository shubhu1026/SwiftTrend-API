const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const errors = require("restify-errors");

async function addToWishlist(req, res) {
  try {
    const { userId, productId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Check if the product already exists in the wishlist
    if (user.wishlist.includes(productId)) {
      throw new errors.BadRequestError("Product already exists in wishlist");
    }

    // Add the product to the wishlist
    user.wishlist.push(productId);
    await user.save();

    // Return the updated user with wishlist
    res.send(user);
  } catch (error) {
    console.error("Error adding item to wishlist:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function removeFromWishlist(req, res) {
  try {
    const { userId, productId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Check if the product exists in the wishlist
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      throw new errors.NotFoundError("Product not found in wishlist");
    }

    // Remove the product from the wishlist
    user.wishlist.splice(index, 1);
    await user.save();

    // Return the updated user with wishlist
    res.send(user);
  } catch (error) {
    console.error("Error removing item from wishlist:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function getUserWishlist(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Return the user's wishlist
    res.send(user.wishlist);
  } catch (error) {
    console.error("Error getting user's wishlist:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
