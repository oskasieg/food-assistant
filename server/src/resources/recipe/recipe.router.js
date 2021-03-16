const Router = require("express");
const auth = require("../../utils/auth");
const {
  addRecipe,
  getRecipe,
  removeRecipe,
  getSomeRecipes,
  getRecipesByName,
  getRecipesByFilters,
} = require("./recipe.controllers");

const uploadFile = require("../../utils/files");

const router = Router();

// /recipe

// dodawanie
router.route("/").post(auth.protect, uploadFile.single("image"), (req, res) => {
  addRecipe(req, res);
});

// pobieranie

router.route("/:id").get(auth.protect, (req, res) => {
  getRecipe(req, res);
});

router.route("/some/:ammount").get(auth.protect, (req, res) => {
  getSomeRecipes(req, res);
});

router.route("/search").put(auth.protect, (req, res) => {
  getRecipesByFilters(req, res);
});

router.route("/search/:name").get(auth.protect, (req, res) => {
  getRecipesByName(req, res);
});

// usuwanie z bazy
router.route("/remove/:id").delete(auth.protect, (req, res) => {
  removeRecipe(req, res);
});

module.exports = router;
