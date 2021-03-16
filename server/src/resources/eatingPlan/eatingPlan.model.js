const mongoose = require("mongoose");

const eatingPlanSchema = new mongoose.Schema({
  user_id: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    unique: true,
    type: Date,
  },
  breakfast: Array,
  brunch: Array,
  dinner: Array,
  lunch: Array,
  supper: Array,
  water: Number,
  waterRequired: Number,
  values: {
    kcal: Number,
    carbohydrates: Number,
    fat: Number,
    protein: Number,
  },
});

const EatingPlan = mongoose.model("eatingPlan", eatingPlanSchema);

module.exports = EatingPlan;
