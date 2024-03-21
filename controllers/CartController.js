const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const Coupon = require("../models/CouponModel");
const errors = require("restify-errors");

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

    let cartItem = user.cart.items.find(
      (item) =>
        item.product.equals(productId) &&
        item.color === color &&
        item.size === size
    );

    if (cartItem) {
      cartItem.quantity += parseInt(quantity, 10);
    } else {
      user.cart.items.push({
        product: productId,
        quantity: parseInt(quantity, 10),
        color,
        size,
      });
    }

    user.cart.total = await calculateTotal(user.cart.items);
    await user.save();
    res.send(user.cart);
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function removeFromCart(req, res) {
  try {
    const { userId, productId, color, size } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    user.cart.items = user.cart.items.filter(
      (item) =>
        !(
          item.product.equals(productId) &&
          item.color === color &&
          item.size === size
        )
    );

    user.cart.total = await calculateTotal(user.cart.items);
    await user.save();
    res.send(user.cart);
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function changeQuantityInCart(req, res) {
  try {
    const { userId, productId, newQuantity, color, size } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    const itemToChange = user.cart.items.find(
      (item) =>
        item.product.equals(productId) &&
        item.color === color &&
        item.size === size
    );

    if (itemToChange) {
      itemToChange.quantity = newQuantity;
    } else {
      throw new errors.NotFoundError("Item not found in the cart");
    }

    user.cart.total = await calculateTotal(user.cart.items);
    await user.save();
    res.send(user.cart);
  } catch (error) {
    console.error("Error changing quantity in cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function clearCart(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    user.cart.items = [];
    user.cart.total = 0;
    await user.save();
    res.send(user.cart);
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function calculateTotal(items) {
  let totalPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      const productPrice = product.price?.amount || 0;
      totalPrice += productPrice * item.quantity;
    } else {
      console.warn(`Product with ID ${item.product} not found.`);
    }
  }
  return totalPrice;
}

async function clearCart(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Clear the cart items
    user.cart.items = [];

    // Clear the total cost
    user.cart.total = 0;

    // Save the updated user
    await user.save();

    // Send a successful response with the cleared cart
    res.send(user.cart);
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function getCart(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    let cartSchema = [];
    let bagTotal = 0; // Initialize bag total
    let discount = 0; // Initialize discount
    let subtotal = 0; // Initialize subtotal
    let tax = 0; // Initialize tax
    let shippingFee = 0; // Initialize shipping fee
    let totalAmount = 0; // Initialize total amount

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

    // Calculate bag total
    bagTotal = await calculateTotal(user.cart.items);
    // Apply discount if applicable
    discount = await calculateDiscount(user, bagTotal);
    // Calculate subtotal after discount
    subtotal = bagTotal - discount;
    // Apply tax if applicable (you can adjust tax rate as per your requirement)
    tax = calculateTax(subtotal, 0.13); // Assuming 10% tax rate
    // Apply shipping fee if applicable
    shippingFee = calculateShippingFee(subtotal); // You can implement your own shipping fee logic
    // Calculate total amount
    totalAmount = subtotal + tax + shippingFee;

    // Send response with cart items and additional details
    res.send({
      cartItems: cartSchema,
      bagTotal: bagTotal,
      discount: discount,
      subtotal: subtotal,
      tax: tax,
      shippingFee: shippingFee,
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.error("Error getting cart items:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function calculateDiscount(user, bagTotal) {
  let discount = 0;

  // Check if the user has an associated coupon
  if (user.coupon) {
    // Fetch the associated coupon
    const coupon = await Coupon.findById(user.coupon);

    // Check if the coupon is still valid
    if (coupon && coupon.expiryDate >= new Date()) {
      // Apply discount percentage from the coupon
      discount = (coupon.discountPercentage / 100) * bagTotal;
    }
  }

  return discount;
}

function calculateTax(subtotal, taxRate) {
  return subtotal * taxRate;
}

function calculateShippingFee(subtotal) {
  let shippingFee = 0;

  if (subtotal >= 100) {
    shippingFee = 0; // Free shipping
  } else if (subtotal >= 50) {
    shippingFee = 10; // $10 shipping fee
  } else {
    shippingFee = 5; // $5 shipping fee
  }

  return shippingFee;
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  changeQuantityInCart,
  getCartItemsCount,
  clearCart,
};
