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

async function getHomeProductsData(req, res) {
  try {
    // Define main categories
    const mainCategories = ["men", "women"];

    // Prepare the response object
    const homeData = [];

    // Loop through main categories
    for (const mainCategory of mainCategories) {
      const mainCategoryData = {};

      // Define subcategories
      const subCategories = ["accessories", "clothing", "footwear"];

      // Loop through subcategories
      for (const subCategory of subCategories) {
        const products = await getProductsByMaincategoryAndSubcategory(
          mainCategory,
          subCategory
        );
        const subCategoryCount = products.length;

        mainCategoryData[subCategory] = {
          products: products.slice(0, 5), // Take the first 5 products
          count: subCategoryCount,
        };
      }

      // Add data to the response object
      homeData.push({
        [mainCategory]: mainCategoryData,
      });
    }

    res.json(homeData);
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
  searchProducts,
  getHomeProductsData,
};
