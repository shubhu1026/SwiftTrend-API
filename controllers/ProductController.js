const Product = require("../models/ProductModel");
const errors = require("restify-errors");

async function getProductsByCategoryAndSubcategory(req, res) {
  const { mainCategory, subcategory } = req.params;

  try {
    const products = await Product.find({
      mainCategory,
      subCategory: subcategory,
    }).select("name brand description price images");

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find().select(
      "name brand description price images"
    );
    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getFilteredProducts(req, res) {
  try {
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const gender = req.query.gender;
    const searchText = req.query.searchText;
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const colors = req.query.colors ? req.query.colors.split(',') : [];
    const sortBy = req.query.sortBy; // Added query parameter for sorting

    const query = {};

    if (!isNaN(minPrice)) {
      query['price.amount'] = { $gte: minPrice };
    }

    if (!isNaN(maxPrice)) {
      query['price.amount'] = { ...query['price.amount'], $lte: maxPrice };
    }

    if (gender) {
      query.gender = gender;
    }

    if (categories.length > 0) {
      query.subCategory = { $in: categories };
    }

    if (colors.length > 0) {
      query['productAvailability.color'] = { $in: colors };
    }

    if (searchText) {
      query.$or = [
        { name: { $regex: new RegExp(searchText, "i") } },
        { brand: { $regex: new RegExp(searchText, "i") } }
      ];
    }

    let sortOptions = {};

    // Define sorting options based on query parameter
    switch (sortBy) {
      case 'priceHighToLow':
        sortOptions = { 'price.amount': -1 };
        break;
      case 'priceLowToHigh':
        sortOptions = { 'price.amount': 1 };
        break;
      case 'nameAToZ':
        sortOptions = { name: 1 };
        break;
      case 'nameZToA':
        sortOptions = { name: -1 };
        break;
      case 'ratingHighToLow':
        sortOptions = { rating: -1 };
        break;
      case 'ratingLowToHigh':
        sortOptions = { rating: 1 };
        break;
      default:
        // Default sorting by createdAt in descending order
        sortOptions = { createdAt: -1 };
        break;
    }

    // Execute the query with filters and sorting
    const products = await Product.find(query).sort(sortOptions);

    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error.message);
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

async function getProductByID(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId).select(
      "name brand description price images"
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
  // Filter out items with zero stock
    const availableItems = product.productAvailability.filter(item => item.inStock > 0);

    // Extract unique sizes
    const uniqueSizes = [...new Set(availableItems.map(item => item.size))];

    // Extract unique colors
    const uniqueColors = [...new Set(availableItems.map(item => item.color))];

    // Calculate total stock count
    const totalStockCount = availableItems.reduce((total, item) => total + item.inStock, 0);

    const productDetails = {
      _id: product._id,
      name: product.name,
      brand: product.brand,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      description: product.description,
      price: product.price,
      images: product.images,
      material: product.material,
      gender: product.gender,
      rating: product.rating,
      productAvailability : product.productAvailability,
      sizes: uniqueSizes,
      colors: uniqueColors,
      inStock: totalStockCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    res.json(productDetails);
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
    }).select("name brand description price images");

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
  getFilteredProducts,
  searchProducts
};
