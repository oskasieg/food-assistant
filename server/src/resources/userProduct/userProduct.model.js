const mongoose = require("mongoose");

const userProductSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  values: {
    kcal: Number,
    carbohydrates: Number,
    protein: Number,
    fat: Number,
  },
  weight: Number,
  values_per_100: {
    kcal: Number,
    carbohydrates: Number,
    protein: Number,
    fat: Number,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  unit: String,
  pieces: Number,
  type: String,
});

const UserProduct = mongoose.model("userProduct", userProductSchema);

module.exports = UserProduct;
