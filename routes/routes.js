const restify = require("restify");
const userRoutes = require("../routes/UserRoutes");
const productRoutes = require("../routes/ProductRoutes");

const configureRoutes = (server) => {
  server.get("/home", (req, res, next) => {
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

  // Users routes
  server.get("/users", userRoutes.getAllUsers);
  server.post("/users/signup", userRoutes.signup);
  server.post("/users/login", userRoutes.login);
  server.get("/users/:id", userRoutes.getUserById);
  server.post("/users/:id", userRoutes.updateUser);

  // Products routes
  server.post("/products", productRoutes.addProduct);
  server.get(
    "/products/:mainCategory/:subcategory",
    productRoutes.getProductsByCategoryAndSubcategory
  );
  server.get("/products", productRoutes.getAllProducts);
};

module.exports = configureRoutes;
