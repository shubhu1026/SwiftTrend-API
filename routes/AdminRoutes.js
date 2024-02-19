const restify = require("restify");
const adminController = require("../controllers/admin/AdminController");
const adminUserController = require("../controllers/admin/AdminUserController");
const adminProductController = require("../controllers/admin/AdminProductController");

function configureAdminRoutes(server) {
  // Admin
  server.get("/admins", adminController.getAllAdmins);
  server.post("/admins", adminController.createAdmin);
  server.get("/admins/:id", adminController.getAdminById);
  server.del("/admins/:id", adminController.deleteAdmin);
  server.put("/admins/:id", adminController.updateAdmin);

  // Admin User Routes
  server.get("/admin/users", adminUserController.getAllUsers);
  server.get("/admin/users/:id", adminUserController.getUserById);
  server.put("/admin/users/:id", adminUserController.updateUser);
  server.del("/admin/users/:id", adminUserController.deleteUser);

  // Admin Product Routes
  server.get("/admin/products", adminProductController.getAllProducts);
  server.post("/admin/products", adminProductController.createProduct);
  server.get("/admin/products/:id", adminProductController.getProductById);
  server.put("/admin/products/:id", adminProductController.updateProduct);
  server.del("/admin/products/:id", adminProductController.deleteProduct);
}

module.exports = configureAdminRoutes;
