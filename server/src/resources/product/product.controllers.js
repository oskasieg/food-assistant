const {
  realtimebidding,
} = require("googleapis/build/src/apis/realtimebidding");
const Product = require("../../resources/product/product.model");
const { sortByDateDesc } = require("../../utils/sortByDate");
const User = require("../user/user.model");

const addProduct = async (req, res) => {
  if (!req.body.name || !req.body.values) {
    return res.status(400).json({ message: "No data!" });
  }

  const product = req.body;
  try {
    const productExist = await Product.findOne({
      name: product.name,
    });

    if (!productExist) {
      const filteredProduct = {
        user_id: req.payloadId,
        values: JSON.parse(product.values),
        name: product.name[0].toUpperCase() + product.name.slice(1),
        createdAt: new Date(),
        type: product.type !== "" ? product.type : undefined,
        image: product.image,
        pieces: 1,
        unit: "grams",
      };

      if (product.weight) {
        filteredProduct["weight"] = parseInt(product.weight);
        let values_per_100 = {};
        values_per_100.kcal =
          (filteredProduct.values.kcal * 100) / filteredProduct.weight;
        values_per_100.fat =
          (filteredProduct.values.fat * 100) / filteredProduct.weight;
        values_per_100.carbohydrates =
          (filteredProduct.values.carbohydrates * 100) / filteredProduct.weight;
        values_per_100.protein =
          (filteredProduct.values.protein * 100) / filteredProduct.weight;
        filteredProduct["values_per_100"] = values_per_100;
      }

      if (req.file) {
        filteredProduct[
          "image"
        ] = `http://localhost:8001/images/${req.file.filename}`;
      }

      await Product.create(filteredProduct);
    }
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const getSomeProducts = async (req, res) => {
  if (!req.params.ammount) {
    return res.status(400).json({ message: "No req.params!" });
  }

  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(200).json([]);
    }

    const filteredProducts = products;
    // const filteredProducts = products.filter((product, index) => {
    //   return index === products.findIndex((p) => p.name === product.name);
    // });
    if (req.params.ammount > filteredProducts.length) {
      res.status(200).json(sortByDateDesc(filteredProducts));
    } else {
      res
        .status(200)
        .json(
          sortByDateDesc(
            filteredProducts.slice(filteredProducts.length - req.params.ammount)
          )
        );
    }
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
  }
};

const getProductsByName = async (req, res) => {
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

    let products = await Product.find();
    if (req.params.name === "all") {
      res.status(200).json(sortByDateDesc(products.slice(skip, skip + limit)));
    } else {
      let filteredProducts = products.filter((product) => {
        if (
          product.name.substr(0, name.length).toLowerCase() ===
          name.toLowerCase()
        ) {
          return true;
        }
        return false;
      });

      if (filteredProducts.length === 0) {
        products = await Product.fuzzySearch(name);
        filteredProducts = products.slice(0, 3);
      }

      res
        .status(200)
        .json(sortByDateDesc(filteredProducts.slice(skip, skip + limit)));
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

const getProductsByFilters = async (req, res) => {
  if (!req.body.options) {
    return res.status(400).json({ message: "No req.body!" });
  }

  if (!req.query.limit || !req.query.skip) {
    return res.status(400).json({ message: "No req.query!" });
  }

  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    const options = req.body.options;
    const products = await Product.find();
    let filteredProducts = products;

    // kategorie
    if (options.types.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        let hasType = false;
        for (let i = 0; i < options.types.length; i++) {
          if (options.types[i] === product.type) {
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
    // wartosci odzywcze
    if (options.values) {
      const values = options.values;
      filteredProducts = filteredProducts.filter((product) => {
        if (
          product.values.kcal >= values.kcal.min &&
          product.values.kcal <= values.kcal.max
        ) {
          if (
            product.values.fat >= values.fat.min &&
            product.values.fat <= values.fat.max
          ) {
            if (
              product.values.carbohydrates >= values.carbohydrates.min &&
              product.values.carbohydrates <= values.carbohydrates.max
            ) {
              if (
                product.values.protein >= values.protein.min &&
                product.values.protein <= values.protein.max
              ) {
                return true;
              }
            }
          }
        }
        return false;
      });
    }
    res.status(200).json(filteredProducts.slice(skip, limit + skip));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

const removeProduct = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No req.params.id!" });
  }

  const user = await User.findOne({ _id: req.payloadId });
  if (user.login !== "admin") {
    return res.status(400).json({ message: "Only admin can remove products!" });
  }

  try {
    const isRemoved = await Product.deleteOne({ _id: req.params.id });
    if (!isRemoved) {
      return res.status(400).json({ message: "Can't remove this product!" });
    }

    res.status(200).json({ message: "You have removed product!" });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  addProduct,
  removeProduct,
  getSomeProducts,
  getProductsByName,
  getProductsByFilters,
};
