const Coupon = require("../models/CouponModel");
const User = require("../models/UserModel");
const errors = require("restify-errors");

// Controller function to create a new coupon
async function createCoupon(req, res) {
  try {
    const { code, discountPercentage, description, expiryDate } = req.body;

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new errors.ConflictError("Coupon code already exists");
    }

    // Create a new coupon object
    const newCoupon = new Coupon({
      code,
      discountPercentage,
      description,
      expiryDate,
    });

    // Save the new coupon to the database
    await newCoupon.save();

    // Send a success response
    res.send(201, newCoupon);
  } catch (error) {
    console.error("Error creating coupon:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Controller function to retrieve all coupons
async function getAllCoupons(req, res) {
  try {
    // Find all coupons in the database
    const coupons = await Coupon.find();

    // Send the coupons as the response
    res.send(coupons);
  } catch (error) {
    console.error("Error retrieving coupons:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Controller function to retrieve a single coupon by its ID
async function getCouponById(req, res) {
  try {
    const { id } = req.params;

    // Find the coupon by its ID
    const coupon = await Coupon.findById(id);

    // If no coupon is found, return a 404 Not Found error
    if (!coupon) {
      throw new errors.NotFoundError("Coupon not found");
    }

    // Send the coupon as the response
    res.send(coupon);
  } catch (error) {
    console.error("Error retrieving coupon by ID:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Controller function to update a coupon by its ID
async function updateCoupon(req, res) {
  try {
    const { id } = req.params;
    const { code, discountPercentage, description, expiryDate } = req.body;

    // Find the coupon by its ID
    let coupon = await Coupon.findById(id);

    // If no coupon is found, return a 404 Not Found error
    if (!coupon) {
      throw new errors.NotFoundError("Coupon not found");
    }

    // Update the coupon fields
    coupon.code = code;
    coupon.discountPercentage = discountPercentage;
    coupon.description = description;
    coupon.expiryDate = expiryDate;

    // Save the updated coupon to the database
    await coupon.save();

    // Send the updated coupon as the response
    res.send(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

// Controller function to delete a coupon by its ID
async function deleteCoupon(req, res) {
  try {
    const { id } = req.params;

    // Find the coupon by its ID and delete it
    await Coupon.findByIdAndDelete(id);

    // Send a success response
    res.send(204);
  } catch (error) {
    console.error("Error deleting coupon:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function applyCoupon(req, res) {
  try {
    const { userId, couponCode } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      throw new errors.NotFoundError("Coupon not found");
    }

    // Check if the coupon is valid (not expired)
    if (coupon.expiryDate < new Date()) {
      throw new errors.BadRequestError("Coupon has expired");
    }

    // Associate the coupon with the user
    user.coupon = coupon._id;
    await user.save();

    res.send({ message: "Coupon applied successfully" });
  } catch (error) {
    console.error("Error applying coupon:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

async function removeCoupon(req, res) {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      throw new errors.NotFoundError("User not found");
    }

    // Remove the coupon association
    user.coupon = undefined;
    await user.save();

    res.send({ message: "Coupon removed successfully" });
  } catch (error) {
    console.error("Error removing coupon:", error.message);
    res.send(new errors.InternalServerError("Internal Server Error"));
  }
}

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  removeCoupon,
};
