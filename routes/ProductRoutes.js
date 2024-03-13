const restify = require("restify");
const productController = require("../controllers/ProductController");

function configureProductRoutes(server) {
  // Product Routes
  server.get(
    "/products/:mainCategory/:subcategory",
    productController.getProductsByCategoryAndSubcategory
  );
  server.get("/products", productController.getAllProducts);
  server.get("/filteredProducts", productController.getFilteredProducts);
  server.get("/searchProducts", productController.searchProducts);
  server.get("/products/:productId", productController.getProductByID);
  server.get(
    "/productDetails/:productId",
    productController.getProductDetailsByID
  );
  server.get("/home/products", productController.getHomeProductsData);
}

module.exports = configureProductRoutes;
