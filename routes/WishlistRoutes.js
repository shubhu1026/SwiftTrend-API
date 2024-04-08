const wishlistcontroller = require("../controllers/WishlistController");

function configureWishlistRoutes(server) {
  // Route to add a product to a user's wishlist
  server.post(
    "/users/:userId/wishlist/:productId",
    wishlistcontroller.addToWishlist
  );

  // Route to remove a product from a user's wishlist
  server.del(
    "/users/:userId/wishlist/:productId",
    wishlistcontroller.removeFromWishlist
  );

  // Route to get a user's wishlist
  server.get("/users/:userId/wishlist", wishlistcontroller.getUserWishlist);
}

module.exports = configureWishlistRoutes;
