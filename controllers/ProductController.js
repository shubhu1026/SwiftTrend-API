const Product = require("../models/ProductModel");
const errors = require("restify-errors");

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

async function getHomeProductsData(req, res) {
  try {
    let schema = [
      {
        mainCategory: "men",
        subCategory: [],
      },
      {
        mainCategory: "women",
        subCategory: [],
      },
    ];
    const subCategories = ["accessories", "clothing", "footwear"];
    for (let i = 0; i < schema.length; i++) {
      for (let j = 0; j < subCategories.length; j++) {
        let subcategorySchema = {
          categoryName: subCategories[j],
          products: [],
          count: null,
        };
        const products = await getProductsByMaincategoryAndSubcategory(
          schema[i].mainCategory,
          subCategories[j]
        );
        console.log(subcategorySchema);
        const subCategoryCount = products.length;
        (subcategorySchema.products = products.slice(0, 5)),
          (subcategorySchema.count = subCategoryCount);
        schema[i].subCategory.push(subcategorySchema);
      }
    }
    console.log(JSON.stringify(schema));
    res.json(schema);
  } catch (error) {
    console.error("Error fetching home data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProductsByMaincategoryAndSubcategory(
  mainCategory,
  subcategory
) {
  try {
    const products = await Product.find({
      mainCategory,
      subCategory: subcategory,
    }).select("name brand description price");

    return products;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
}

module.exports = {
  getProductsByCategoryAndSubcategory,
  getAllProducts,
  getProductByID,
  getProductDetailsByID,
  getHomeProductsData,
};
