const Product = require("../models/ProductModel");

async function addProduct(req, res) {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding a new product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProductsByCategoryAndSubcategory(req, res) {
  const { mainCategory, subcategory } = req.params;

  try {
    const products = await Product.find({
      mainCategory,
      subCategory: subcategory,
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addProduct,
  getProductsByCategoryAndSubcategory,
  getAllProducts,
};
