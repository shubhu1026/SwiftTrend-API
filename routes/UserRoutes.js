const restify = require("restify");
const userController = require("../controllers/UserController");

function configureUserRoutes(server) {
  // User Routes
  server.get("/users", userController.getAllUsers);
  server.post("/signup", userController.signup);
  server.post("/login", userController.login);
  server.get("/users/:id", userController.getUserById);
  server.post("/users/:id", userController.updateUser);
}

module.exports = configureUserRoutes;
