const { OrderModel } = require("../models/OrderModel");
const User = require("../models/UserModel");
const errors = require("restify-errors");

// Controller function to retrieve all orders
async function getAllOrders(req, res) {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
    if (!user) {
      throw new errors.NotFoundError("User not found");
    }
    res.send(user.orders);
    } catch (error) {
        console.error("Error retrieving orders:", error.message);
        res.send(new errors.InternalServerError("Internal Server Error"));
    }
}

async function placeOrder(req, res) {

    try {
        const { userId } = req.params;
        const { items } = req.body;

        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            throw new errors.NotFoundError("User not found");
        }

        // Create a new order
        let newOrder = new OrderModel({
            items: items,
            shippingAddress: req.body.shippingAddress,
            totalAmount: req.body.totalAmount,
            bagTotal: req.body.bagTotal,
            discount: req.body.discount,
            subtotal: req.body.subtotal,
            tax: req.body.tax,
            shippingFee: req.body.shippingFee,
            paymentMethod: req.body.paymentMethod,
            paymentId: req.body.paymentId,
            status: "placed"
        });



        // Save the order to the database
        //await newOrder.save();
        user.orders.push(newOrder);

        // Clear the cart items
        user.cart.items = [];

        // Clear the total cost
        user.cart.total = 0;

        // Save the updated user
        await user.save();

        res.send(201, {
            success: "Order placed successfully",
            order: newOrder,
        });

    } catch (error) {
        console.error("Error placing order:", error.message);
        res.send(new errors.InternalServerError("Internal Server Error"));
    }
}

module.exports = {
    getAllOrders,
    placeOrder
};