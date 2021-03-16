import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import { IFiltersProps, IFiltersOptions, IFilterValues, IType } from "./types";
import styles from "./Filters.module.scss";
import { useDispatch } from "react-redux";
import { clearProductsAction } from "../../containers/Products/actions";
import { clearRecipesAction } from "../../containers/Recipes/actions";
import stylesButtons from "../../styles/buttons.module.scss";
import { TiDelete } from "react-icons/ti";

const Filters = ({ visible, changeVisible, mode, onSubmit }: IFiltersProps) => {
  const dispatcher = useDispatch();

  const [productTypes, setProductTypes] = useState<IType[]>([
    { type: "fruit", checked: false, value: "Owoce" },
    { type: "vegetable", checked: false, value: "Warzywa" },
    { type: "packaged", checked: false, value: "Pakowane" },
    { type: "sweets", checked: false, value: "Słodycze" },
    { type: "dairy", checked: false, value: "Nabiał" },
    { type: "bread", checked: false, value: "Pieczywo" },
    { type: "meat", checked: false, value: "Mięsa" },
    { type: "nutritionix", checked: false, value: "Nutritionix" },
    { type: "edamam", checked: false, value: "Edamam" },
    { type: "other", checked: false, value: "Inne" },
  ]);
  const [productValues, setProductValues] = useState<IFilterValues>({
    kcal: {
      min: 0,
      max: 500,
    },
    carbohydrates: {
      min: 0,
      max: 30,
    },
    fat: {
      min: 0,
      max: 30,
    },
    protein: {
      min: 0,
      max: 30,
    },
  });

  const [recipeTypes, setRecipeTypes] = useState<IType[]>([
    {
      type: "breakfast",
      checked: false,
      value: "Śniadanie",
    },
    {
      type: "brunch",
      checked: false,
      value: "Drugie śniadanie",
    },
    {
      type: "soup",
      checked: false,
      value: "Zupy",
    },
    {
      type: "pasta_rice",
      checked: false,
      value: "Makarony i dania z ryżu",
    },
    {
      type: "meat_dish",
      checked: false,
      value: "Dania główne z mięsa",
    },
    {
      type: "fish_dish",
      checked: false,
      value: "Dania główne z ryb i owoców morza",
    },
    {
      type: "vegetable_dish",
      checked: false,
      value: "Dania główne z warzyw",
    },
    {
      type: "other_dish",
      checked: false,
      value: "Inne dania główne",
    },
    {
      type: "lunch",
      checked: false,
      value: "Desery",
    },
    {
      type: "drink",
      checked: false,
      value: "Napoje",
    },
    {
      type: "appetizer_salad",
      checked: false,
      value: "Przystawki i sałatki",
    },
    {
      type: "bread",
      checked: false,
      value: "Chleby i bułki",
    },
    {
      type: "salt_bread",
      checked: false,
      value: "Słone wypieki",
    },
    {
      type: "supper",
      checked: false,
      value: "Kolacja",
    },
    {
      type: "other",
      checked: false,
      value: "Inne",
    },
  ]);
  const [recipeProducts, setRecipeProducts] = useState<string[]>([]);
  const [recipeValues, setRecipeValues] = useState<IFilterValues>({
    kcal: {
      min: 0,
      max: 1500,
    },
    carbohydrates: {
      min: 0,
      max: 100,
    },
    fat: {
      min: 0,
      max: 100,
    },
    protein: {
      min: 0,
      max: 100,
    },
  });
  const [recipeTime, setRecipeTime] = useState<number>(90);
  const [recipePortions, setRecipePortions] = useState<number>(6);

  const [productName, setProductName] = useState<string>("");

  const changeProductTypes = (value: string) => {
    let newTypes = productTypes;

    newTypes = newTypes.map((type: IType) => {
      if (type.type === value) {
        type.checked = !type.checked;
      }

      return type;
    });

    setProductTypes(newTypes);
  };

  const changeProductValues = (
    valueName: string,
    type: "min" | "max",
    value: number
  ) => {
    switch (valueName) {
      case "kcal": {
        if (type === "min") {
          setProductValues({
            ...productValues,
            kcal: { ...productValues.kcal, min: value },
          });
        } else if (type === "max") {
          setProductValues({
            ...productValues,
            kcal: {
              ...productValues.kcal,
              max: value,
            },
          });
        }
        break;
      }
      case "protein": {
        if (type === "min") {
          setProductValues({
            ...productValues,
            protein: { ...productValues.protein, min: value },
          });
        } else if (type === "max") {
          setProductValues({
            ...productValues,
            protein: {
              ...productValues.protein,
              max: value,
            },
          });
        }
        break;
      }
      case "carbohydrates": {
        if (type === "min") {
          setProductValues({
            ...productValues,
            carbohydrates: { ...productValues.carbohydrates, min: value },
          });
        } else if (type === "max") {
          setProductValues({
            ...productValues,
            carbohydrates: {
              ...productValues.carbohydrates,
              max: value,
            },
          });
        }
        break;
      }
      case "fat": {
        if (type === "min") {
          setProductValues({
            ...productValues,
            fat: { ...productValues.fat, min: value },
          });
        } else if (type === "max") {
          setProductValues({
            ...productValues,
            fat: {
              ...productValues.fat,
              max: value,
            },
          });
        }
        break;
      }
    }
  };

  const changeRecipeTypes = (value: string) => {
    let newTypes = recipeTypes;

    newTypes = newTypes.map((type: IType) => {
      if (type.type === value) {
        type.checked = !type.checked;
      }

      return type;
    });

    setRecipeTypes(newTypes);
  };

  const changeRecipeProducts = (type: "add" | "remove", name: string) => {
    if (type === "add") {
      let productExist = false;
      recipeProducts.forEach((product: string) => {
        if (product === name) productExist = true;
      });

      if (!productExist) {
        setRecipeProducts([...recipeProducts, name]);
        setProductName("");
      }
    } else if (type === "remove") {
      let newRecipeProducts = recipeProducts;
      newRecipeProducts = newRecipeProducts.filter((product: string) => {
        if (product === name) return false;
        return true;
      });

      setRecipeProducts(newRecipeProducts);
    }
  };

  const changeRecipeValues = (
    valueName: string,
    type: "min" | "max",
    value: number
  ) => {
    switch (valueName) {
      case "kcal": {
        if (type === "min") {
          setRecipeValues({
            ...recipeValues,
            kcal: { ...recipeValues.kcal, min: value },
          });
        } else if (type === "max") {
          setRecipeValues({
            ...recipeValues,
            kcal: {
              ...recipeValues.kcal,
              max: value,
            },
          });
        }
        break;
      }
      case "protein": {
        if (type === "min") {
          setRecipeValues({
            ...recipeValues,
            protein: { ...recipeValues.protein, min: value },
          });
        } else if (type === "max") {
          setRecipeValues({
            ...recipeValues,
            protein: {
              ...recipeValues.protein,
              max: value,
            },
          });
        }
        break;
      }
      case "carbohydrates": {
        if (type === "min") {
          setRecipeValues({
            ...recipeValues,
            carbohydrates: { ...recipeValues.carbohydrates, min: value },
          });
        } else if (type === "max") {
          setRecipeValues({
            ...recipeValues,
            carbohydrates: {
              ...recipeValues.carbohydrates,
              max: value,
            },
          });
        }
        break;
      }
      case "fat": {
        if (type === "min") {
          setRecipeValues({
            ...recipeValues,
            fat: { ...recipeValues.fat, min: value },
          });
        } else if (type === "max") {
          setRecipeValues({
            ...recipeValues,
            fat: {
              ...recipeValues.fat,
              max: value,
            },
          });
        }
        break;
      }
    }
  };

  const createOptionsAndSubmit = () => {
    dispatcher(clearProductsAction());
    dispatcher(clearRecipesAction());

    let options: IFiltersOptions = {
      types: [],
    };
    if (mode === "products") {
      productTypes.forEach((type: IType) => {
        if (type.checked) options.types.push(type.type);

        options.values = {
          kcal: {
            min: productValues.kcal.min,
            max: productValues.kcal.max,
          },
          carbohydrates: {
            min: productValues.carbohydrates.min,
            max: productValues.carbohydrates.max,
          },
          fat: {
            min: productValues.fat.min,
            max: productValues.fat.max,
          },
          protein: {
            min: productValues.protein.min,
            max: productValues.protein.max,
          },
        };
      });
    } else if (mode === "recipes") {
      recipeTypes.forEach((type: IType) => {
        if (type.checked) options.types.push(type.type);
      });

      if (recipeProducts.length > 0) {
        options["products"] = recipeProducts;
      }

      options.values = {
        kcal: {
          min: recipeValues.kcal.min,
          max: recipeValues.kcal.max,
        },
        carbohydrates: {
          min: recipeValues.carbohydrates.min,
          max: recipeValues.carbohydrates.max,
        },
        fat: {
          min: recipeValues.fat.min,
          max: recipeValues.fat.max,
        },
        protein: {
          min: recipeValues.protein.min,
          max: recipeValues.protein.max,
        },
      };

      options.time = recipeTime;
      options.portions = recipePortions;
    }

    onSubmit(options);
    changeVisible();
  };

  return (
    <Modal
      open={visible}
      onClose={changeVisible}
      className={styles.Filters__modal}
    >
      <div className={styles.Filters}>
        <Fade in={visible}>
          <div className={styles.Filters__paper}>
            <h3 className={styles.Filters__title}>Wybierz filtry</h3>

            {window.innerWidth < 800 && (
              <TiDelete
                className={styles.Filters__closeIcon}
                onClick={changeVisible}
              />
            )}

            <h3>Kategoria</h3>
            {mode === "products" &&
              productTypes.map((type: IType, index: number) => (
                <div key={index} className={styles.Filters__option}>
                  <input
                    type="checkbox"
                    value={type.type}
                    checked={type.checked}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductTypes(e.currentTarget.value)
                    }
                  />
                  <label htmlFor="type" key={index}>
                    {type.value}
                  </label>
                </div>
              ))}
            {mode === "recipes" &&
              recipeTypes.map((type: IType, index: number) => (
                <div key={index} className={styles.Filters__option}>
                  <input
                    type="checkbox"
                    value={type.type}
                    checked={type.checked}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeTypes(e.currentTarget.value)
                    }
                  />
                  <label htmlFor="type" key={index}>
                    {type.value}
                  </label>
                </div>
              ))}

            {/* productValues */}
            {mode === "products" && (
              <>
                <h3>Wartości odżywcze</h3>
                <p>Kalorie</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="kcal">Od</label>
                  <input
                    type="number"
                    value={productValues.kcal.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "kcal",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="kcal">Do</label>
                  <input
                    type="number"
                    value={productValues.kcal.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "kcal",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>

                <p>Węglowodany</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="carbohydrates">Od</label>
                  <input
                    type="number"
                    value={productValues.carbohydrates.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "carbohydrates",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="carbohydrates">Do</label>
                  <input
                    type="number"
                    value={productValues.carbohydrates.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "carbohydrates",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>

                <p>Białko</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="protein">Od</label>
                  <input
                    type="number"
                    value={productValues.protein.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "protein",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="protein">Do</label>
                  <input
                    type="number"
                    value={productValues.protein.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "protein",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>

                <p>Tłuszcz</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="fat">Od</label>
                  <input
                    type="number"
                    value={productValues.fat.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "fat",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="fat">Do</label>
                  <input
                    type="number"
                    value={productValues.fat.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeProductValues(
                        "fat",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>
              </>
            )}

            {/* recipeProducts */}
            {mode === "recipes" && (
              <>
                <h3>Składniki</h3>
                {recipeProducts.length === 0 && (
                  <p style={{ fontSize: "1.2em", textAlign: "center" }}>
                    Brak wybranych składników.
                  </p>
                )}
                {recipeProducts.length > 0 && (
                  <div>
                    {recipeProducts.map((product, index: number) => (
                      <div
                        key={index}
                        className={styles.Filters__option}
                        style={{
                          fontSize: "1.2em",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {product}{" "}
                        <TiDelete
                          className={styles.Filters__removeIcon}
                          onClick={() =>
                            changeRecipeProducts("remove", product)
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div
                  className={styles.Filters__option}
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    value={productName}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      setProductName(e.currentTarget.value)
                    }
                  />
                  <button
                    style={{ height: "32.38px", marginTop: "0", padding: "0" }}
                    className={stylesButtons.GreenButton}
                    onClick={() => changeRecipeProducts("add", productName)}
                    type="button"
                  >
                    Dodaj
                  </button>
                </div>
              </>
            )}

            {/* recipeValues */}
            {mode === "recipes" && (
              <>
                <h3>Wartości odżywcze</h3>
                <p>Kalorie</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="kcal">Od</label>
                  <input
                    type="number"
                    value={recipeValues.kcal.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "kcal",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="kcal">Do</label>
                  <input
                    type="number"
                    value={recipeValues.kcal.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "kcal",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>

                <p>Węglowodany</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="carbohydrates">Od</label>
                  <input
                    type="number"
                    value={recipeValues.carbohydrates.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "carbohydrates",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="carbohydrates">Do</label>
                  <input
                    type="number"
                    value={recipeValues.carbohydrates.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "carbohydrates",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>

                <p>Białko</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="protein">Od</label>
                  <input
                    type="number"
                    value={recipeValues.protein.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "protein",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="protein">Do</label>
                  <input
                    type="number"
                    value={recipeValues.protein.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "protein",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>

                <p>Tłuszcz</p>
                <div
                  className={styles.Filters__optionValues}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <label htmlFor="fat">Od</label>
                  <input
                    type="number"
                    value={recipeValues.fat.min}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "fat",
                        "min",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                  <label htmlFor="fat">Do</label>
                  <input
                    type="number"
                    value={recipeValues.fat.max}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      changeRecipeValues(
                        "fat",
                        "max",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>
              </>
            )}

            {/* recipeTime */}
            {mode === "recipes" && (
              <>
                <h3>Czas przygotowania</h3>
                <div
                  className={styles.Filters__option}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <button
                    className={stylesButtons.RedButton}
                    style={
                      recipeTime === 15
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    type="button"
                    onClick={() => setRecipeTime(15)}
                  >
                    -15min
                  </button>
                  <button
                    className={stylesButtons.RedButton}
                    style={
                      recipeTime === 30
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    type="button"
                    onClick={() => setRecipeTime(30)}
                  >
                    -30min
                  </button>
                  <button
                    className={stylesButtons.RedButton}
                    style={
                      recipeTime === 60
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    type="button"
                    onClick={() => setRecipeTime(60)}
                  >
                    -60min
                  </button>
                  <button
                    className={stylesButtons.RedButton}
                    style={
                      recipeTime === 90
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    type="button"
                    onClick={() => setRecipeTime(90)}
                  >
                    {" "}
                    -90min
                  </button>
                </div>
              </>
            )}

            {/* recipePortions */}
            {mode === "recipes" && (
              <>
                <h3>Porcje</h3>
                <div
                  className={styles.Filters__option}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <button
                    type="button"
                    className={stylesButtons.RedButton}
                    style={
                      recipePortions === 2
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    onClick={() => setRecipePortions(2)}
                  >
                    -2
                  </button>
                  <button
                    type="button"
                    className={stylesButtons.RedButton}
                    style={
                      recipePortions === 4
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    onClick={() => setRecipePortions(4)}
                  >
                    -4
                  </button>
                  <button
                    type="button"
                    className={stylesButtons.RedButton}
                    style={
                      recipePortions === 6
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    onClick={() => setRecipePortions(6)}
                  >
                    -6
                  </button>
                  <button
                    type="button"
                    className={stylesButtons.RedButton}
                    style={
                      recipePortions === 7
                        ? { backgroundColor: "#827d7d", width: "100px" }
                        : { width: "100px" }
                    }
                    onClick={() => setRecipePortions(7)}
                  >
                    +7
                  </button>
                </div>
              </>
            )}

            <button
              style={{
                alignSelf: "center",
                marginTop: "2.5rem",
                marginBottom: "1rem",
              }}
              className={stylesButtons.Button}
              onClick={() => createOptionsAndSubmit()}
              type="submit"
            >
              Szukaj
            </button>
          </div>
        </Fade>
      </div>
    </Modal>
  );
};

export default Filters;
