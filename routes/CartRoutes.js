const restify = require("restify");
const cartController = require("../controllers/CartController");

function configureCartRoutes(server) {
  // Cart Routes
  server.get("/cart/:userId", cartController.getCart);
  server.get("/cart/:userId/totalCount", cartController.getCartItemsCount);
  server.post(
    "/cart/:userId/add/:productId/:quantity/:color/:size",
    cartController.addToCart
  );
  server.del(
    "/cart/:userId/remove/:productId/:color/:size",
    cartController.removeFromCart
  );
  server.del("/cart/:userId", cartController.clearCart);
  server.put(
    "/cart/:userId/changeQuantity/:productId/:newQuantity/:color/:size",
    cartController.changeQuantityInCart
  );
  server.post(
    "/cart/:userId/changeQuantity/:productId/:newQuantity/:color/:size",
    cartController.changeQuantityInCart
  );
}

module.exports = configureCartRoutes;
