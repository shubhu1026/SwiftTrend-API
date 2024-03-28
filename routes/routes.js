const restify = require("restify");
const configureUserRoutes = require("../routes/UserRoutes");
const configureProductRoutes = require("../routes/ProductRoutes");
const configureAdminRoutes = require("../routes/AdminRoutes");
const configureCartRoutes = require("../routes/CartRoutes");
const configureAddressBookRoutes = require("../routes/AddressBookRoutes");
const configureCouponRoutes = require("../routes/CouponRoutes");
const configureOrderRoutes = require("../routes/OrderRoutes");

function configureRoutes(server) {
  server.get("/", (req, res, next) => {
    try {
      res.send(200, "Server is up and running!");
      return next();
    } catch (error) {
      console.error("Error in handling the request:", error);
      return next(
        new restify.errors.InternalServerError("Internal Server Error")
      );
    }
  });

  // Configure User Routes
  configureUserRoutes(server);

  // Configure Product Routes
  configureProductRoutes(server);

  // Configure Admin Routes
  configureAdminRoutes(server);

  // Configure Cart Routes
  configureCartRoutes(server);

  // Configure Address Book Routes
  configureAddressBookRoutes(server);

  // Configure Coupon Routes
  configureCouponRoutes(server);

  // Configure Order Routes
  configureOrderRoutes(server);
}

module.exports = configureRoutes;
