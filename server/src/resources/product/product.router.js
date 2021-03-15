const Router = require("express");
const auth = require("../../utils/auth");
const controllers = require("./product.controllers");

// /product

const router = Router();

router.route("/:ammount").get(auth.protect, (req, res) => {
  controllers.getSomeProducts(req, res);
});

router.route("/search/:name").get(auth.protect, (req, res) => {
  controllers.getProductsByName(req, res);
});

router.route("/search").put(auth.protect, (req, res) => {
  controllers.getProductsByFilters(req, res);
});

router.route("/:id").delete(auth.protect, (req, res) => {
  controllers.removeProduct(req, res);
});

module.exports = router;
