const restify = require("restify");
const productController = require("../controllers/ProductController");

function configureProductRoutes(server) {
  // Product Routes
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
  server.get("/home/products", productController.getHomeProductsData);
}

module.exports = configureProductRoutes;
