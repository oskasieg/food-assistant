const Recipe = require("../recipe/recipe.model");
const UserRecipe = require("./userRecipe.model");

const addUserRecipe = async (req, res) => {
  if (
    !req.body.user_id ||
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
    // wyliczanie wartosci odzywczych na podstawie wartosci produktow
    const values = {
      kcal: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
    };

    JSON.parse(req.body.products).forEach((product) => {
      if (product.values && product.unit) {
        if (product.unit === "pieces") {
          values.kcal += product.pieces * product.values.kcal;
          values.fat += product.pieces * product.values.fat;
          values.carbohydrates += product.pieces * product.values.carbohydrates;
          values.protein += product.pieces * product.values.protein;
        } else if (product.unit === "grams") {
          const p = product.weight / 100;
          values.kcal += p * product.values_per_100.kcal;
          values.fat += p * product.values_per_100.fat;
          values.carbohydrates += p * product.values_per_100.carbohydrates;
          values.protein += p * product.values_per_100.protein;
        }
      }
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

    // obsluga obrazkow
    if (req.files["image"]) {
      recipe[
        "image"
      ] = `http://localhost:8001/images/${req.files["image"][0].filename}`;
    }

    let steps = JSON.parse(recipe.steps);
    if (req.files["step_images[]"]) {
      for (let i = 0; i < req.files["step_images[]"].length; i++) {
        steps.forEach((step) => {
          if (step.hasImage && !step.image) {
            step.image = `http://localhost:8001/images/${req.files["step_images[]"][i].filename}`;
          }
        });
      }
    }

    // mapowanie listy krokow
    steps = steps.map((step) => {
      if (step.image) {
        return { name: step.name, image: step.image };
      } else {
        return { name: step.name };
      }
    });

    await UserRecipe.create({
      ...req.body,
      name: recipe.name[0].toUpperCase() + recipe.name.slice(1),

      values,
      createdAt: new Date(),
      products: JSON.parse(recipe.products),
      steps,
    });

    res.status(200).json({ message: "You have created a recipe!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const addUserRecipeById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No req.params!" });
  }

  try {
    let recipe = await Recipe.findOne({ _id: req.params.id });
    if (!recipe) {
      recipe = await UserRecipe.findOne({ _id: req.params.id });
    }
    if (!recipe) {
      return res.status(400).json({ message: "No recipe with this ID!" });
    }

    const recipeToAdd = {
      user_id: req.payloadId,
      name: recipe.name[0].toUpperCase() + recipe.name.slice(1),
      level: recipe.level,
      description: recipe.description,
      steps: recipe.steps,
      products: recipe.products,
      time_min: recipe.time_min,
      type: recipe.type,
      values: recipe.values,
      createdAt: new Date(),
      image: recipe.image,
      number_of_portions: recipe.number_of_portions,
    };

    const isAdded = await UserRecipe.create({
      ...recipeToAdd,
    });
    if (!isAdded) {
      return res.status(400).json({ message: "Can't add user recipe!" });
    }

    res.status(200).json({ message: "You have added a recipe!" });
  } catch (e) {
    console.error(e);
  }
};

const getUserRecipes = async (req, res) => {
  try {
    const userRecipes = await UserRecipe.find({ user_id: req.payloadId });

    if (userRecipes.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(userRecipes);
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const getUserRecipe = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No recipe ID!" });
  }

  try {
    let recipe = await UserRecipe.findOne({ _id: req.params.id });
    if (!recipe) {
      recipe = await Recipe.findOne({ _id: req.params.id });
    }
    if (!recipe) {
      return res.status(400).json({ message: "No recipe with that ID!" });
    }

    res.status(200).json(recipe);
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const getSomeUserRecipes = async (req, res) => {
  if (!req.params.ammount) {
    return res.status(400).json({ message: "No req.params!" });
  }

  try {
    const userRecipes = await UserRecipe.find();
    if (userRecipes.length === 0) {
      return res.status(200).json([]);
    }

    // const filteredRecipes = userRecipes.filter((recipe, index) => {
    //   return index === userRecipes.findIndex((p) => p.name === recipe.name);
    // });

    const filteredRecipes = userRecipes;

    if (req.params.ammount > filteredRecipes.length) {
      res.status(200).json(filteredRecipes);
    } else {
      res
        .status(200)
        .json(
          filteredRecipes.slice(filteredRecipes.length - req.params.ammount)
        );
    }
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
  }
};

const editUserRecipe = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No recipe ID!" });
  }

  if (
    !req.body.user_id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.steps ||
    !req.body.products ||
    !req.body.time_min
  ) {
    return res.status(400).json({ message: "No valid req.body!" });
  }

  try {
    // wyliczanie wartosci odzywczych na podstawie wartosci produktow
    const values = {
      kcal: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
    };

    JSON.parse(req.body.products).forEach((product) => {
      if (product.values || product.values_per_100) {
        if (product.unit === "pieces") {
          values.kcal += product.pieces * product.values.kcal;
          values.fat += product.pieces * product.values.fat;
          values.carbohydrates += product.pieces * product.values.carbohydrates;
          values.protein += product.pieces * product.values.protein;
        } else if (product.unit === "grams") {
          const p = product.weight / 100;
          values.kcal += p * product.values_per_100.kcal;
          values.fat += p * product.values_per_100.fat;
          values.carbohydrates += p * product.values_per_100.carbohydrates;
          values.protein += p * product.values_per_100.protein;
        } else {
          values.kcal += product.values.kcal;
          values.fat += product.values.fat;
          values.carbohydrates += product.values.carbohydrates;
          values.protein += product.values.protein;
        }
      }
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

    // mapowanie listy krokow
    let steps = JSON.parse(req.body.steps);
    if (req.files["step_images[]"]) {
      for (let i = 0; i < req.files["step_images[]"].length; i++) {
        steps.forEach((step) => {
          if (step.hasImage && !step.image) {
            step.image = `http://localhost:8001/images/${req.files["step_images[]"][i].filename}`;
          }
        });
      }
    }

    steps = steps.map((step) => {
      if (step.image) {
        return { name: step.name, image: step.image };
      } else {
        return { name: step.name };
      }
    });
    const recipe = {
      ...req.body,
      values: req.body.values ? JSON.parse(req.body.values) : values,
      image: req.files["image"]
        ? `http://localhost:8001/images/${req.files["image"][0].filename}`
        : req.body.image,
      products: JSON.parse(req.body.products),
      steps: steps,
      number_of_portions: req.body.number_of_portions
        ? parseInt(req.body.number_of_portions)
        : undefined,
    };

    const isUpdated = await UserRecipe.findByIdAndUpdate(
      { _id: req.params.id },
      { ...recipe }
    );

    if (!isUpdated) {
      return res.status(400).json({ message: "Can't edit recipe!" });
    }

    res.status(200).json({ message: "You have edited a recipe!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const removeFromUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No recipe ID!" });
  }

  try {
    const isRemoved = await UserRecipe.remove(
      { _id: req.params.id },
      { user_id: "" }
    );
    if (!isRemoved) {
      return res.status(400).json({ message: "Cant remove recipe from user!" });
    }

    res.status(200).json({ message: "You have removed recipe from user!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

module.exports = {
  addUserRecipe,
  getUserRecipes,
  getUserRecipe,
  editUserRecipe,
  removeFromUser,
  getSomeUserRecipes,
  addUserRecipeById,
};
