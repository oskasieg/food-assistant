const { sortByDateAsc, sortByDateDesc } = require("../../utils/sortByDate");
const User = require("../user/user.model");
const Recipe = require("./recipe.model");

const addRecipe = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.steps ||
    !req.body.products ||
    !req.body.time_min ||
    !req.body.type
  ) {
    return res.status(400).json({ message: "No valid req.body!" });
  }

  const recipe = req.body;

  try {
    // sprawdzanie czy taki przepis juz istnieje
    const recipeExist = await Recipe.findOne({ ...recipe });
    if (recipeExist) {
      return res
        .status(400)
        .json({ message: "The same recipe already exist!" });
    }

    // wyliczanie wartosci odzywczych na podstawie wartosci produktow
    const values = {
      kcal: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
    };

    JSON.parse(req.body.products).forEach((product) => {
      values.kcal += product.values.kcal;
      values.carbohydrates += product.values.carbohydrates;
      values.fat += product.values.fat;
      values.protein += product.values.protein;
    });

    if (req.body.number_of_portions) {
      values.kcal /= parseInt(req.body.number_of_portions);
      values.fat /= parseInt(req.body.number_of_portions);
      values.carbohydrates /= parseInt(req.body.number_of_portions);
      values.protein /= parseInt(req.body.number_of_portions);
    }

    values.kcal = +(Math.round(values.kcal + "e+2") + "e-2");
    values.carbohydrates = +(Math.round(values.carbohydrates + "e+2") + "e-2");
    values.fat = +(Math.round(values.fat + "e+2") + "e-2");
    values.protein = +(Math.round(values.protein + "e+2") + "e-2");

    if (req.file) {
      recipe["image"] = `http://localhost:8001/images/${req.file.filename}`;
    }

    await Recipe.create({
      ...req.body,
      name: req.body.name[0].toUpperCase() + req.body.name.slice(1),
      values,
      createdAt: new Date(),
      products: JSON.parse(recipe.products),
      steps: JSON.parse(recipe.steps),
    });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const getRecipe = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No recipe ID!" });
  }

  try {
    const recipe = await Recipe.findOne({ _id: req.params.id });
    if (!recipe) {
      return res.status(400).json({ message: "No recipe with that ID!" });
    }

    res.status(200).json(recipe);
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const getRecipesByName = async (req, res) => {
  if (!req.params.name) {
    return res.status(400).json({ message: "No req.params!" });
  }

  if (!req.query.limit || !req.query.skip) {
    return res.status(400).json({ message: "No req.query!" });
  }

  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    const name = req.params.name;

    let recipes = await Recipe.find();
    if (req.params.name === "all") {
      res.status(200).json(sortByDateDesc(recipes.slice(skip, skip + limit)));
    } else {
      let filteredRecipes = recipes.filter((recipe) => {
        if (
          recipe.name.substr(0, name.length).toLowerCase() ===
          name.toLowerCase()
        ) {
          return true;
        }
        return false;
      });

      if (filteredRecipes.length === 0) {
        recipes = await Recipe.fuzzySearch(name);
        filteredRecipes = recipes.slice(0, 3);
      }
      res
        .status(200)
        .json(sortByDateDesc(filteredRecipes.slice(skip, skip + limit)));
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

const getRecipesByFilters = async (req, res) => {
  if (!req.body.options) {
    return res.status(400).json({ message: "No options in req.body!" });
  }

  if (!req.query.limit || !req.query.skip) {
    return res.status(400).json({ message: "No req.query!" });
  }

  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    const options = JSON.parse(req.body.options);
    const recipes = await Recipe.find();
    let filteredRecipes = recipes;

    // kategorie
    if (options.types.length > 0) {
      filteredRecipes = recipes.filter((recipe) => {
        let hasType = false;
        for (let i = 0; i < options.types.length; i++) {
          if (options.types[i] === recipe.type) {
            hasType = true;
            break;
          }
        }

        if (hasType) {
          return true;
        }

        return false;
      });
    }

    // produkty
    if (options.products && options.products.length > 0) {
      // filtrowanie po nazwie
      let filteredRecipes1 = filteredRecipes.filter((recipe) => {
        let hasProduct = false;
        for (let i = 0; i < options.products.length; i++) {
          const productName = options.products[i].toLowerCase();
          if (productName[0] === "-") {
            continue;
          }
          for (let i = 0; i < recipe.products.length; i++) {
            if (
              recipe.products[i].original_name &&
              recipe.products[i].original_name
                .toLowerCase()
                .substr(0, productName.length) === productName
            ) {
              hasProduct = true;
              break;
            } else if (
              recipe.products[i].name
                .toLowerCase()
                .substr(0, productName.length) === productName
            ) {
              hasProduct = true;
              break;
            }
          }
        }

        if (hasProduct) {
          return true;
        }
        return false;
      });

      if (filteredRecipes1.length === 0) {
        filteredRecipes1 = filteredRecipes;
      }

      // filtrowanie gdy w nazwie jest '-'
      filteredRecipes1 = filteredRecipes1.filter((recipe) => {
        let hasProduct = false;
        for (let i = 0; i < options.products.length; i++) {
          const productName = options.products[i].toLowerCase();
          if (productName[0] !== "-") continue;

          for (let i = 0; i < recipe.products.length; i++) {
            if (
              recipe.products[i].original_name &&
              recipe.products[i].original_name
                .toLowerCase()
                .substr(0, productName.length - 1) === productName.slice(1)
            ) {
              hasProduct = true;
              break;
            } else if (
              recipe.products[i].name
                .toLowerCase()
                .substr(0, productName.length - 1) === productName.slice(1)
            ) {
              hasProduct = true;
              break;
            }
          }
        }
        if (!hasProduct) {
          return true;
        }
        return false;
      });

      filteredRecipes = filteredRecipes1;
    }

    // wartosci odzywcze
    if (options.values) {
      const values = options.values;
      filteredRecipes = filteredRecipes.filter((recipe) => {
        if (
          recipe.values.kcal >= values.kcal.min &&
          recipe.values.kcal <= values.kcal.max
        ) {
          if (
            recipe.values.fat >= values.fat.min &&
            recipe.values.fat <= values.fat.max
          ) {
            if (
              recipe.values.carbohydrates >= values.carbohydrates.min &&
              recipe.values.carbohydrates <= values.carbohydrates.max
            ) {
              if (
                recipe.values.protein >= values.protein.min &&
                recipe.values.protein <= values.protein.max
              ) {
                return true;
              }
            }
          }
        }
        return false;
      });
    }

    // czas wykonania
    if (options.time) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        if (recipe.time_min && recipe.time_min <= options.time) {
          return true;
        }
        return false;
      });
    }

    // ilosc porcji
    if (options.portions) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        if (recipe.number_of_portions) {
          if (options.portions === 7) {
            if (recipe.number_of_portions >= options.portions) {
              return true;
            }
          } else {
            if (recipe.number_of_portions <= options.portions) {
              return true;
            }
          }
        }
        return false;
      });
    }

    res
      .status(200)
      .json(sortByDateAsc(filteredRecipes.slice(skip, skip + limit)));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

const getSomeRecipes = async (req, res) => {
  if (!req.params.ammount) {
    return res.status(400).json({ message: "No req.params!" });
  }

  try {
    const recipes = await Recipe.find();
    if (recipes.length === 0) {
      return res.status(200).json([]);
    }

    if (req.params.ammount > recipes.length) {
      res.status(200).json(recipes);
    } else {
      res.status(200).json(recipes.slice(recipes.length - req.params.ammount));
    }
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
  }
};

const removeRecipe = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No recipe ID!" });
  }

  const user = await User.findOne({ _id: req.payloadId });
  if (user.login !== "admin") {
    return res.status(400).json({ message: "Only admin can delete recipe!" });
  }

  try {
    const isRemoved = await Recipe.deleteOne({ _id: req.params.id });
    if (!isRemoved) {
      return res.status(400).json({ message: "Cant remove recipe!" });
    }

    res.status(200).json({ message: "You have removed recipe!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

module.exports = {
  addRecipe,
  getRecipe,
  getSomeRecipes,
  removeRecipe,
  getRecipesByName,
  getRecipesByFilters,
};
