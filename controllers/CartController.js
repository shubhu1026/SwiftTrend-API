const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const errors = require("restify-errors");

async function getCartItems(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    let cartSchema = [];
    for (let i = 0; i < user.cart.items.length; i++) {
      const cartItem = user.cart.items[i];
      const product = await Product.findById(cartItem.product);

      if (product) {
        const data = {
          productId: cartItem.product,
          quantity: cartItem.quantity,
          // Include color and size from the cart item
          color: cartItem.color,
          size: cartItem.size,
          productDetails: product,
        };
        cartSchema.push(data);
      } else {
        console.warn(`Product with ID ${cartItem.product} not found.`);
      }
    }

    res.send(cartSchema);
  } catch (error) {
    console.error("Error getting cart items:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function getCartItemsCount(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    let totalCount = 0;
    user.cart.items.forEach((item) => {
      totalCount += item.quantity;
    });

    // Return the items in the cart
    res.send({ totalCount: totalCount });
  } catch (error) {
    console.error("Error getting cart items:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function addToCart(req, res) {
  try {
    const { userId, productId, quantity, color, size } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Check if the item already exists in the cart
    let cartItem = user.cart.items.find(
      (item) =>
        item.product.equals(productId) &&
        item.color === color &&
        item.size === size
    );

    if (cartItem) {
      // If the item already exists, update the quantity
      cartItem.quantity += parseInt(quantity, 10);
    } else {
      // If the item doesn't exist, create a new cart item
      user.cart.items.push({
        product: productId,
        quantity: parseInt(quantity, 10),
        color,
        size,
      });
    }

    // Save the updated user
    await user.save();

    // Send a successful response with the updated cart
    res.send(user.cart);
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function removeFromCart(req, res) {
  try {
    const { userId, productId, color, size } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Remove the item with the specified product id, color, and size from the cart
    user.cart.items = user.cart.items.filter(
      (item) =>
        !(
          item.product.equals(productId) &&
          item.color === color &&
          item.size === size
        )
    );

    // Update the total cost
    user.cart.total = calculateTotal(user.cart.items);

    // Save the updated user
    await user.save();

    // Send a successful response with the updated cart
    res.send(user.cart);
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function changeQuantityInCart(req, res) {
  try {
    const { userId, productId, newQuantity, color, size } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Find the item with the specified product id, color, and size in the cart
    const itemToChange = user.cart.items.find(
      (item) =>
        item.product.equals(productId) &&
        item.color === color &&
        item.size === size
    );

    if (itemToChange) {
      // If the item is found, update the quantity
      itemToChange.quantity = newQuantity;
    } else {
      // If the item is not found, throw an error or handle accordingly
      throw new errors.NotFoundError("Item not found in the cart");
    }

    // Update the total cost
    user.cart.total = calculateTotal(user.cart.items);

    // Save the updated user
    await user.save();

    // Send a successful response with the updated cart
    res.send(user.cart);
  } catch (error) {
    console.error("Error changing quantity in cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Helper function to calculate the total cost based on items in the cart
function calculateTotal(items) {
  return items.reduce((total, item) => {
    const productPrice = item.product.price?.amount || 0; // Use optional chaining
    return total + productPrice * item.quantity;
  }, 0);
}

module.exports = {
  getCartItems,
  addToCart,
  removeFromCart,
  changeQuantityInCart,
  getCartItemsCount,
};
