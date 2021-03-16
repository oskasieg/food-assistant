const config = require("./config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const path = require("path");
const { connect } = require("./utils/db");

const userRouter = require("./resources/user/user.router");
const userProductRouter = require("./resources/userProduct/userProduct.router");
const edamamRouter = require("./resources/edamam/edamam.router");
const recipeRouter = require("./resources/recipe/recipe.router");
const eatingPlanRouter = require("./resources/eatingPlan/eatingPlan.router");
const userRecipeRouter = require("./resources/userRecipe/userRecipe.router");
const productRouter = require("./resources/product/product.router");

const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  "/images",
  express.static(path.join(__dirname, "..", "public", "images"))
);

app.use("/user", userRouter);
app.use("/user_product", userProductRouter);
app.use("/user_recipe", userRecipeRouter);
app.use("/recipe", recipeRouter);
app.use("/edamam", edamamRouter);
app.use("/eating_plan", eatingPlanRouter);
app.use("/product", productRouter);

const start = async () => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`Server is running on: http://localhost:${config.port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = start;
