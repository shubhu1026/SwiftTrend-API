const restify = require("restify");
const couponController = require("../controllers/CouponController");

function configureCouponRoutes(server) {
  // Coupon Routes
  server.post("/coupons", couponController.createCoupon);
  server.get("/coupons", couponController.getAllCoupons);
  server.get("/coupons/:id", couponController.getCouponById);
  server.put("/coupons/:id", couponController.updateCoupon);
  server.del("/coupons/:id", couponController.deleteCoupon);

  server.post(
    "/apply-coupon/:userId/:couponCode",
    couponController.applyCoupon
  );
  server.post("/remove-coupon/:userId", couponController.removeCoupon);
}

module.exports = configureCouponRoutes;
