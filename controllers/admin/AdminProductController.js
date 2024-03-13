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

function addProduct(req, res, next) {
  const {
    name,
    brand,
    mainCategory,
    subCategory,
    description,
    price,
    images,
    // sizes,
    // colors,
    material,
    gender,
    rating,
    productAvailability
  } = req.body;

  // Create a new product
  const newProduct = new Product({
    name,
    brand,
    mainCategory,
    subCategory,
    description,
    price,
    images,
    // sizes,
    // colors,
    material,
    gender,
    rating,
    productAvailability
  });



  // Save the product to the database
  newProduct
    .save()
    .then(() => {
      res.send(201, {
        success: "Product added successfully",
        product: newProduct,
      });
      return next();
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error adding product"));
    });
}

function addMulitpleProducts(req, res, next) {
  const productsToAdd = req.body;

  // Validate that the request body is an array
  if (!Array.isArray(productsToAdd)) {
    return next(
      new errors.BadRequestError(
        "Invalid request format. Expected an array of products."
      )
    );
  }

  // Create an array to store the newly added products
  const addedProducts = [];

  // Iterate through each product in the array and add it to the database
  Promise.all(
    productsToAdd.map((productData) => {
      const {
        name,
        brand,
        mainCategory,
        subCategory,
        description,
        price,
        images,
        // sizes,
        // colors,
        material,
        gender,
        rating,
        productAvailability
      } = productData;

      // Create a new product
      const newProduct = new Product({
        name,
        brand,
        mainCategory,
        subCategory,
        description,
        price,
        images,
        // sizes,
        // colors,
        material,
        gender,
        rating,
        productAvailability
      });

      // Save the product to the database and push it to the addedProducts array
      return newProduct.save().then((addedProduct) => {
        addedProducts.push(addedProduct);
      });
    })
  )
    .then(() => {
      const addedProductsCount = addedProducts.length;
      res.send(201, {
        success: `Added ${addedProductsCount} product(s) successfully`,
        products: addedProducts,
      });
      return next();
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error adding products"));
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

function deleteAllProducts(req, res, next) {
  // Delete all products in the database
  Product.deleteMany({})
    .then(() => {
      res.send({ success: "All products deleted successfully" });
      return next();
    })
    .catch((error) => {
      console.error(error);
      return next(
        new errors.InternalServerError("Error deleting all products")
      );
    });
}

module.exports = {
  getAllProducts,
  addProduct,
  addMulitpleProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
