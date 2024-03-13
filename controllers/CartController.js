const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
async function getCartItems(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      res.send(404, { code: "NotFound", message: "User not found" });
      return;
    }
    let cartSchema = []
    for(let i=0;i<user.cart.items.length;i++){
      let data = {
        productId :  user.cart.items[i].product,
        quantity : user.cart.items[i].quantity,
        productDetails : await Product.findById(user.cart.items[i].product),
      }
      cartSchema.push(data)
    }
    res.send(200, cartSchema);
  } catch (error) {
    console.error("Error getting cart items:", error.message);
    res.send(500, { code: "InternalServer", message: "Internal Server Error" });
  }
}

async function getCartItemsCount(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      res.send(404, { code: "NotFound", message: "User not found" });
      return;
    }
    let totalCount = 0;
    user.cart.items.forEach(item => {
      totalCount += item.quantity;
    });

    // Return the items in the cart
    res.send(200, {"totalCount" : totalCount});
  } catch (error) {
    console.error("Error getting cart items:", error.message);
    res.send(500, { code: "InternalServer", message: "Internal Server Error" });
  }
}

async function addToCart(req, res) {
  try {
    const { userId, productId } = req.params;
    let { quantity } = req.params;

    // Parse quantity as an integer
    quantity = parseInt(quantity, 10);

    // Find the user
    let user = await User.findById(userId);

    if (!user) {
      res.send(404, { code: "NotFound", message: "User not found" });
      return;
    }

    // Check if the product is already in the cart
    const existingItem = user.cart.items.find((item) =>
      item.product.equals(productId)
    );

    if (existingItem) {
      // If the product is already in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it as a new item
      user.cart.items.push({ product: productId, quantity });
    }

    // Update the total cost
    user.cart.total = calculateTotal(user.cart.items);

    // Save the user
    await user.save();

    // Send a successful response with the updated cart
    res.send(200, user.cart);
  } catch (error) {
    console.error("Error adding to cart:", error.message);

    // Send an error response
    res.send(500, { code: "InternalServer", message: "Internal Server Error" });
  }
}

async function removeFromCart(req, res) {
  try {
    const { userId, productId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      res.send(404, { code: "NotFound", message: "User not found" });
      return;
    }

    // Remove the item with the specified product id from the cart
    user.cart.items = user.cart.items.filter(
      (item) => !item.product.equals(productId)
    );

    // Update the total cost
    user.cart.total = calculateTotal(user.cart.items);

    // Save the updated user
    await user.save();

    // Send a successful response with the updated cart
    res.send(200, user.cart);
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    res.send(500, { code: "InternalServer", message: "Internal Server Error" });
  }
}

async function changeQuantityInCart(req, res) {
  try {
    const { userId, productId, newQuantity } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      res.send(404, { code: "NotFound", message: "User not found" });
      return;
    }

    // Find the item with the specified product id in the cart
    const itemToChange = user.cart.items.find((item) =>
      item.product.equals(productId)
    );

    if (itemToChange) {
      // If the item is found, update the quantity
      itemToChange.quantity = newQuantity;
    } else {
      // If the item is not found, throw an error or handle accordingly
      res.send(404, {
        code: "NotFound",
        message: "Item not found in the cart",
      });
      return;
    }

    // Update the total cost
    user.cart.total = calculateTotal(user.cart.items);

    // Save the updated user
    await user.save();

    // Send a successful response with the updated cart
    res.send(200, user.cart);
  } catch (error) {
    console.error("Error changing quantity in cart:", error.message);
    res.send(500, { code: "InternalServer", message: "Internal Server Error" });
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
  getCartItemsCount
};
