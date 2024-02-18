const restify = require("restify");
const configureUserRoutes = require("../routes/UserRoutes");
const configureProductRoutes = require("../routes/ProductRoutes");

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
}

module.exports = configureRoutes;
