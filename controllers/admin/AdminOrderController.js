const { OrderModel } = require("../../models/OrderModel");
const User = require("../../models/UserModel");
const Product = require("../../models/ProductModel");
const errors = require("restify-errors");

// Controller function to retrieve all orders of all users with user information
async function getAllOrdersForAllUsers(req, res) {
  try {
    // Find all users with their orders
    const usersWithOrders = await User.find().populate("orders");

    // Array to store all orders with user information
    let allOrders = [];

    // Iterate through each user and retrieve their orders
    for (const user of usersWithOrders) {
      for (const order of user.orders) {
        // Populate product details for each item in the order
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          item.product = product;
        }
        // Add the order to the list of all orders with user details
        const orderDetails = {
          order: order,
          user: {
            _id: user._id,
            fullName: user.fullName,
            // Add other user details as needed
          },
        };
        allOrders.push(orderDetails);
      }
    }

    // Send all orders with user information in the response
    res.send(allOrders);
  } catch (error) {
    console.error("Error retrieving orders:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Controller function to edit an order status
async function updateOrderStatus(req, res) {
  const orderId = req.params.orderId;
  try {
    // Find the order by ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new errors.NotFoundError("Order not found");
    }

    // Update the order status
    order.status = req.body.status || order.status;

    // Save the updated order
    await order.save();

    res.send(200, {
      success: "Order status updated successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error editing order:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Controller function to delete an order
async function deleteOrder(req, res) {
  const orderId = req.params.orderId;
  try {
    // Find the order by ID and remove it
    await OrderModel.findByIdAndDelete(orderId);
    res.send(200, { success: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function getOrderDetails(req, res) {
  const orderId = req.params.orderId;
  try {
    // Find the user that contains the order
    const user = await User.findOne({ "orders._id": orderId });

    if (!user) {
      throw new errors.NotFoundError("Order not found");
    }

    // Find the order within the user's orders
    const order = user.orders.find((order) => order._id.toString() === orderId);

    if (!order) {
      throw new errors.NotFoundError("Order not found");
    }

    // Combine order details with user details
    const orderDetails = {
      order: order,
      user: {
        _id: user._id,
        fullName: user.fullName,
        // Add other user details as needed
      },
    };

    // Send the order details in the response
    res.send(orderDetails);
  } catch (error) {
    console.error("Error retrieving order details:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

module.exports = {
  getAllOrdersForAllUsers,
  updateOrderStatus,
  deleteOrder,
  getOrderDetails,
};
