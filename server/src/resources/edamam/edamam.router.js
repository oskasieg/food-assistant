const Router = require("express");
const auth = require("../../utils/auth");
const controllers = require("./edamam.controllers");

const router = Router();

router.route("/:ingr").get(auth.protect, (req, res) => {
  controllers.getProductByName(req, res);
});

module.exports = router;
