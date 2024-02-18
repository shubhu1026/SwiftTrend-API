const restify = require("restify");
const productController = require("../controllers/ProductController");

function configureProductRoutes(server) {
  // Product Routes
  server.post("/products", productController.addProduct);
  server.get(
    "/products/:mainCategory/:subcategory",
    productController.getProductsByCategoryAndSubcategory
  );
  server.get("/products", productController.getAllProducts);
  server.get("/products/:productId", productController.getProductByID);
  server.get(
    "/productDetails/:productId",
    productController.getProductDetailsByID
  );
  server.get("/search", productController.searchProducts);
}

module.exports = configureProductRoutes;
