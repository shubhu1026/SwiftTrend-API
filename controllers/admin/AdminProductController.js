const errors = require("restify-errors");
const Product = require("../../models/ProductModel");

function getAllProducts(req, res, next) {
  console.log("GET /products query parameters =>", req.query);
  // Find every entity in the database
  Product.find({})
    .then((products) => {
      // Return all of the Products in the system
      res.send(products);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
}

function createProduct(req, res, next) {
  const { name, description, price, quantity } = req.body;

  // Create a new product
  const newProduct = new Product({
    name,
    description,
    price,
    quantity,
  });

  // Save the product to the database
  newProduct
    .save()
    .then(() => {
      res.send(201, { success: "Product created successfully" });
      return next();
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error creating product"));
    });
}

function getProductById(req, res, next) {
  const productId = req.params.id;

  // Find the product by ID
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.send(product);
        return next();
      } else {
        throw new errors.NotFoundError("Product not found");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(
        new errors.InternalServerError("Error fetching product by ID")
      );
    });
}

function updateProduct(req, res, next) {
  const productId = req.params.id;
  const updateData = req.body;

  // Update the product by ID
  Product.findByIdAndUpdate(productId, updateData, { new: true })
    .then((updatedProduct) => {
      if (updatedProduct) {
        res.send(updatedProduct);
        return next();
      } else {
        throw new errors.NotFoundError("Product not found for updating");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error updating product"));
    });
}

function deleteProduct(req, res, next) {
  const productId = req.params.id;

  // Delete the product by ID
  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (deletedProduct) {
        res.send(deletedProduct);
        return next();
      } else {
        throw new errors.NotFoundError("Product not found for deletion");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error deleting product"));
    });
}

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
