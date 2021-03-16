const Product = require("../resources/product/product.model");
const Recipe = require("../resources/recipe/recipe.model");
const { connect, close } = require("../utils/db");

// EXAMPLE //////////////////////////////

const fuzzySearch = async (value) => {
  await connect();

  try {
    const filteredResults = await Recipe.fuzzySearch(value);

    for (let i = 0; i < 3; i++) {
      console.log(
        "\n" +
          (i + 1) +
          ". " +
          "Nazwa: " +
          filteredResults[i].name +
          " --- Confidence Score: " +
          filteredResults[i]._doc.confidenceScore +
          "\n"
      );
    }

    console.log("Ilosc znalezionych: " + filteredResults.length);
  } catch (e) {
    console.error(e);
  }

  await close();
};

fuzzySearch("Pyszne spageti");
