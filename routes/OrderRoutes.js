const orderController = require("../controllers/OrderController");

function configurOrderRoutes(server) {
  server.get("/orders/:userId", orderController.getAllOrders);
  server.post("/placeOrder/:userId", orderController.placeOrder);
}

module.exports = configurOrderRoutes;
