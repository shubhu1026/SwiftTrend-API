const restify = require("restify");
const productController = require("../controllers/ProductController");

function configureProductRoutes(server) {
  // Product Routes
  server.get(
    "/products/:mainCategory/:subcategory",
    productController.getProductsByCategoryAndSubcategory
  );
  server.get(
    "/products1/:userId/:mainCategory/:subcategory",
    productController.getProductsByCategoryAndSubcategory1
  );
  server.get("/products", productController.getAllProducts);
  server.get("/products1/:userId", productController.getAllProducts1);
  server.get("/filteredProducts", productController.getFilteredProducts);
  server.get("/filteredProducts1/:userId", productController.getFilteredProducts1);
  server.get("/searchProducts", productController.searchProducts);
  server.get("/products/:productId", productController.getProductByID);
  server.get(
    "/productDetails/:productId",
    productController.getProductDetailsByID
  );
  server.get(
    "/productDetails/:userId/:productId",
    productController.fetchProductDetailsByID
  );
  server.get("/home/products", productController.getHomeProductsData);
}

module.exports = configureProductRoutes;
