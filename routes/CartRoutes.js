const restify = require("restify");
const cartController = require("../controllers/CartController");

function configureCartRoutes(server) {
  // Cart Routes
  server.get("/cart/:userId/items", cartController.getCartItems);

  server.post(
    "/cart/:userId/add/:productId/:quantity",
    cartController.addToCart
  );

  server.del("/cart/:userId/remove/:productId", cartController.removeFromCart);

  server.put(
    "/cart/:userId/changeQuantity/:productId/:newQuantity",
    cartController.changeQuantityInCart
  );
}

module.exports = configureCartRoutes;
