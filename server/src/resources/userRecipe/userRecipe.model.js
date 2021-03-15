const mongoose = require("mongoose");

const userRecipesSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  name: {
    type: String,
    require: true,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  time_min: {
    type: Number,
  },
  type: {
    type: String,
    required: true,
  },
  values: {
    carbohydrates: Number,
    fat: Number,
    kcal: Number,
    protein: Number,
  },
  number_of_portions: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  image: String,
});

const UserRecipe = mongoose.model("UserRecipe", userRecipesSchema);

module.exports = UserRecipe;
