const UserProduct = require("../../resources/userProduct/userProduct.model");
const Product = require("../product/product.model");

const addUserProduct = async (req, res) => {
  if (!req.body.name || !req.body.values) {
    return res.status(400).json({ message: "No data!" });
  }

  const product = req.body;

  try {
    const productExist = await UserProduct.findOne({
      name: product.name,
      user_id: req.payloadId,
    });

    if (productExist) {
      return res
        .status(400)
        .json({ message: "You already have product with the same name!" });
    }

    const filteredProduct = {
      user_id: req.payloadId,
      values: JSON.parse(product.values),
      name: product.name[0].toUpperCase() + product.name.slice(1),
      createdAt: new Date(),
      type: product.type !== "" ? product.type : undefined,
      image: product.image,
      weight: product.weight ? parseInt(product.weight) : undefined,
      unit: "grams",
      pieces: 1,
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

    await UserProduct.create(filteredProduct);
    res.status(200).json({ message: "Product have been added!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// dodaje produkt z glownej bazy produktow
const addUserProductById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No req.params!" });
  }

  try {
    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      product = await UserProduct.findOne({ _id: req.params.id });
    }

    if (!product) {
      return res.status(400).json({ message: "No product with that ID" });
    }

    const isAdded = await UserProduct.create({
      name: product.name,
      createdAt: new Date(),
      values: product.values,
      type: product.type,
      user_id: req.payloadId,
      image: product.image,
      weight: product.weight,
      values_per_100: product.values_per_100,
      unit: "grams",
      pieces: 1,
    });
    if (!isAdded) {
      return res.status(400).json({ message: "Can't add this product!" });
    }

    res.status(200).json({ message: "Product have been added!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const userProducts = await UserProduct.find({
      user_id: req.payloadId,
    });
    res.status(200).json(userProducts);
  } catch (e) {
    console.error(e);
  }
};

const getSomeUserProducts = async (req, res) => {
  if (!req.params.ammount) {
    return res.status(400).json({ message: "No req.params!" });
  }

  try {
    const userProducts = await UserProduct.find();
    if (userProducts.length === 0) {
      return res.status(200).json([]);
    }

    const filteredProducts = userProducts.filter((product, index) => {
      return index === userProducts.findIndex((p) => p.name === product.name);
    });

    if (req.params.ammount > filteredProducts.length) {
      res.status(200).json(filteredProducts);
    } else {
      res
        .status(200)
        .json(
          filteredProducts.slice(filteredProducts.length - req.params.ammount)
        );
    }
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
  }
};

const removeUserProduct = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No req.params.id!" });
  }

  try {
    const isRemoved = await UserProduct.remove({ _id: req.params.id });
    if (!isRemoved) {
      return res
        .status(400)
        .json({ message: "Can't remove product from user!" });
    }

    res.status(200).json({ message: "You have removed product from user!" });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  addUserProduct,
  getUserProducts,
  removeUserProduct,
  getSomeUserProducts,
  addUserProductById,
};
