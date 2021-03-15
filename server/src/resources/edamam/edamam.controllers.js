const translate = require("@vitalets/google-translate-api");
const unirest = require("unirest");
const Product = require("../product/product.model");

const getProductByName = async (req, res) => {
  if (!req.params.ingr) {
    return res.status(400).json({ message: "No ingr in req.params!" });
  }

  try {
    // tlumaczenie PL -> ENG
    const translatedIngr = await translate(req.params.ingr, { to: "en" });

    // pobieranie danych z Edamam API
    const response = await unirest
      .get("https://api.edamam.com/api/food-database/v2/parser")
      .query({
        ingr: translatedIngr.text,
        app_id: "f51ff80e",
        app_key: "e73e5e437aa7fb5187c4900c0f0cfb57",
      });

    // regulacja ile elementow wyodrebnic
    const sliced = response.body.hints.slice(0, 1);

    // wyodrebnienie danych i utworzenie tablicy z produktami Edamam
    let products = [];
    if (sliced.length > 0) {
      const translatedName = await translate(sliced[0].food.label, {
        to: "pl",
      });

      products = sliced.map((hint) => {
        const product = {
          name: translatedName.text,
          values: {
            kcal: Math.round(hint.food.nutrients.ENERC_KCAL * 100) / 100,
            carbohydrates: Math.round(hint.food.nutrients.CHOCDF * 100) / 100,
            protein: Math.round(hint.food.nutrients.PROCNT * 100) / 100,
            fat: Math.round(hint.food.nutrients.FAT * 10) / 10,
          },
          image: hint.food.image,
          weight: hint.measures[0].weight,
          unit: "grams",
          pieces: 1,
          type: "edamam",
        };

        const values_per_100 = {
          kcal:
            Math.round(((product.values.kcal * 100) / product.weight) * 100) /
            100,
          carbohydrates:
            Math.round(
              ((product.values.carbohydrates * 100) / product.weight) * 100
            ) / 100,
          fat:
            Math.round(((product.values.fat * 100) / product.weight) * 100) /
            100,
          protein:
            Math.round(
              ((product.values.protein * 100) / product.weight) * 100
            ) / 100,
        };

        product["values_per_100"] = values_per_100;

        return product;
      });
    }

    // szukanie produktow w bazie
    let filtered = [];
    const userProducts = await Product.find();
    if (userProducts.length > 0) {
      filtered = userProducts.filter((product) => {
        // eliminuje produkty, ktore dany uzytkownik juz posiada
        if (product.user_id === req.payloadId) {
          return false;
        }

        // usuwa duplikaty
        if (filtered.find((p) => p.name === product.name)) {
          return false;
        }
        // szuka element po nazwie
        if (
          product.name.substr(0, req.params.ingr.length) ===
          req.params.ingr[0].toUpperCase() + req.params.ingr.slice(1)
        ) {
          return true;
        }
      });
    }

    res
      .status(200)
      .json(products.length > 0 ? products.concat(filtered) : filtered);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

module.exports = { getProductByName };
