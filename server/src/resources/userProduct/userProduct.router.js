const Router = require("express");
const auth = require("../../utils/auth");
const controllers = require("./userProduct.controllers");
const { removeUserProduct } = require("./userProduct.controllers");
const uploadFile = require("../../utils/files");
const { addProduct } = require("../product/product.controllers");

const router = Router();

// /user_product/

// dodawanie
router.route("/").post(auth.protect, uploadFile.single("image"), (req, res) => {
  // dodawanie do bazy
  addProduct(req, res);

  // dodawanie do uzytkownika
  controllers.addUserProduct(req, res);
});

router.route("/:id").post(auth.protect, (req, res) => {
  controllers.addUserProductById(req, res);
});

// pobieranie
router.route("/").get(auth.protect, (req, res) => {
  controllers.getUserProducts(req, res);
});

router.route("/:ammount").get(auth.protect, (req, res) => {
  controllers.getSomeUserProducts(req, res);
});

// usuwanie od uzytkownika
router.route("/:id").put(auth.protect, (req, res) => {
  removeUserProduct(req, res);
});

module.exports = router;
