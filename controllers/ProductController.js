const Product = require("../models/ProductModel");
const errors = require("restify-errors");

async function addProduct(req, res) {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.send(201, savedProduct);
  } catch (error) {
    console.error("Error adding a new product:", error.message);
    res.send(500, { error: "Internal Server Error" });
  }
}

async function getProductsByCategoryAndSubcategory(req, res) {
  const { mainCategory, subcategory } = req.params;

  try {
    const products = await Product.find({
      mainCategory,
      subCategory: subcategory,
    }).select("name brand description price");

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find().select(
      "name brand description price"
    );
    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProductByID(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId).select(
      "name brand description price"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProductDetailsByID(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function searchProducts(req, res) {
  const searchTerm = req.query.q;

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(searchTerm, "i") } },
        { brand: { $regex: new RegExp(searchTerm, "i") } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addProduct,
  getProductsByCategoryAndSubcategory,
  getAllProducts,
  getProductByID,
  getProductDetailsByID,
  searchProducts,
};
