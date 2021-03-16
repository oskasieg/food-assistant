const Router = require("express");

const auth = require("../../utils/auth");
const {
  addUserRecipe,
  getUserRecipes,
  getUserRecipe,
  removeFromUser,
  editUserRecipe,
  getSomeUserRecipes,
  addUserRecipeById,
} = require("./userRecipe.controllers");

const uploadFile = require("../../utils/files");
const { addRecipe } = require("../recipe/recipe.controllers");

const router = Router();

// user_recipe

// dodawanie
router.route("/").post(
  auth.protect,
  uploadFile.fields([
    { name: "image", maxCount: 1 },
    { name: "step_images[]", maxCount: 15 },
  ]),
  (req, res) => {
    // dodanie przepisu do bazy
    addRecipe(req, res);

    // dodanie przepisu do uzytkownika
    addUserRecipe(req, res);
  }
);

router.route("/:id").post(auth.protect, (req, res) => {
  addUserRecipeById(req, res);
});

// pobieranie
router.route("/").get(auth.protect, (req, res) => {
  getUserRecipes(req, res);
});

router.route("/:id").get(auth.protect, (req, res) => {
  getUserRecipe(req, res);
});

router.route("/some/:ammount").get(auth.protect, (req, res) => {
  getSomeUserRecipes(req, res);
});

// edytowanie
router.route("/:id").put(
  auth.protect,
  uploadFile.fields([
    { name: "image", maxCount: 1 },
    { name: "step_images[]", maxCount: 15 },
  ]),
  (req, res) => {
    editUserRecipe(req, res);
  }
);

// usuwanie z bazy
router.route("/remove/:id").put(auth.protect, (req, res) => {
  removeFromUser(req, res);
});

module.exports = router;
