import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getUserProductsAction } from "../../containers/Products/actions";
import { IProduct } from "../../containers/Products/types";
import {
  addRecipeAction,
  editRecipeAction,
  getRecipeAction,
} from "../../containers/Recipes/actions";
import { IRecipe, IStep } from "../../containers/Recipes/types";
import { getUserProfileAction } from "../../containers/User/actions";
import { IStoreType } from "../../utils/store";
import ListProducts from "../ListProducts/ListProducts";
import SearchProductBar from "../SearchProductBar/SearchProductBar";
import styles from "./AddRecipeForm.module.scss";
import AddRecipeFormValdiationSchema from "./AddRecipeFormValidationSchema";
import { IAddRecipeFormValues } from "./types";
import stylesButtons from "../../styles/buttons.module.scss";
import stylesValidation from "../../styles/validation.module.scss";
import { BiErrorCircle } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { BsPlusCircle } from "react-icons/bs";
import { RiEditBoxLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import useHiddenComponent from "../../hooks/useHiddenComponent";
import { MdCloudUpload } from "react-icons/md";

interface TParams {
  recipe_id: string;
}

const AddRecipeForm = (props: RouteComponentProps<TParams>) => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  // pobranie state ze store
  const state = useSelector((state: IStoreType) => state);
  const userProducts = state.products.userProducts;
  const user = state.user.data;
  const currentRecipe = state.recipes.recipe;

  // dodawanie krokow
  const [step, setStep] = useState<IStep>();
  const [steps, setSteps] = useState<IStep[]>([]);
  const [stepsError, setStepsError] = useState<string>("");
  const [stepImages, setStepsImages] = useState<File[]>([]);

  const mainHiddenFileInput = useRef(null);

  // dodawanie produktow
  const [productName, setProductName] = useState<string>("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsError, setProductsError] = useState<string>("");
  const [completedProducts, setCompletedProducts] = useState<boolean>(true);

  // reczne ustawianie kalorycznosci
  const [valuesVisible, setValuesVisible] = useState<boolean>(false);

  // wartosci poczatkowe
  const initialValues: IAddRecipeFormValues = {
    user_id: "",
    name: "",
    description: "",
    time_min: 0,
    type: "",
    image: "",
    number_of_portions: 0,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (steps.length === 0) {
        return;
      }

      if (products.length === 0) {
        return;
      }

      if (props.match.params.recipe_id) {
        const recipe: IRecipe = {
          user_id: values.user_id,
          name: values.name,
          description: values.description,
          time_min: values.time_min,
          type: values.type,
          steps,
          products,
          stepImages,
          _id: currentRecipe._id,
          image: values.image,
        };

        if (values.number_of_portions) {
          recipe["number_of_portions"] = values.number_of_portions;
        }

        if (
          values.kcal &&
          values.carbohydrates &&
          values.fat &&
          values.protein &&
          valuesVisible
        ) {
          recipe["values"] = {
            carbohydrates: values.carbohydrates,
            fat: values.fat,
            protein: values.protein,
            kcal: values.kcal,
          };
        }

        dispatcher(editRecipeAction(recipe));
      } else {
        const recipe = { ...values, steps, products, stepImages };

        dispatcher(addRecipeAction(recipe));
      }
    },
    validationSchema: AddRecipeFormValdiationSchema,
  });

  const {
    handleChange,
    handleSubmit,
    values,
    setFieldValue,
    errors,
    isValid,
    validateForm,
  } = formik;

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    if (steps.length === 0) setStepsError("Minimalna liczba kroków: 1");
    if (steps.length > 0) setStepsError("");
  }, [steps]);

  useEffect(() => {
    if (products.length === 0)
      setProductsError("Minimalna liczba produktów: 1");
    if (products.length > 0) setProductsError("");
  }, [products]);

  // przypisywanie pola user_id
  useEffect(() => {
    setFieldValue("user_id", user._id);
  }, [user, setFieldValue]);

  // pobieranie przepisu (jezeli w propsach jest id)
  useEffect(() => {
    if (props.match.params.recipe_id) {
      dispatcher(getRecipeAction(props.match.params.recipe_id));
    }
    dispatcher(getUserProductsAction());
    dispatcher(getUserProfileAction());
  }, [dispatcher, props]);

  // ustawianie domyslnych wartosci (edycja)
  useEffect(() => {
    if (props.match.params.recipe_id) {
      setSteps(currentRecipe.steps);
      setProducts(currentRecipe.products);
      setFieldValue("name", currentRecipe.name);
      setFieldValue("description", currentRecipe.description);
      setFieldValue("type", currentRecipe.type);
      setFieldValue("time_min", currentRecipe.time_min);
      setFieldValue("image", currentRecipe.image);
      setFieldValue("kcal", currentRecipe.values?.kcal);
      setFieldValue("carbohydrates", currentRecipe.values?.carbohydrates);
      setFieldValue("fat", currentRecipe.values?.fat);
      setFieldValue("protein", currentRecipe.values?.protein);
      setFieldValue("number_of_portions", currentRecipe?.number_of_portions);

      validateForm();
    }
  }, [currentRecipe, setFieldValue, props, validateForm]);

  // sprawdzanie czy jakis produkt nie ma wartosci odzywczych
  useEffect(() => {
    let completed = true;
    if (products.length === 0) {
      completed = false;
    }

    products.forEach((product: IProduct) => {
      if (!product.values) {
        completed = false;
      }
    });
    setCompletedProducts(completed);
  }, [products]);

  const addStep = () => {
    setStep({ name: "" });
    setSteps([...steps, { name: step?.name, image: step?.image }]);
  };

  const addImageToStep = (
    e: React.ChangeEvent<HTMLInputElement>,
    stepIndex: number,
    stepName?: string
  ) => {
    const newSteps = steps;
    newSteps.forEach((step: IStep) => {
      if (step.name === stepName) {
        if (e.target.files) step.image = e.target.files[0];
      }
    });
    setSteps(newSteps);

    if (e.target.files) {
      const newStepImages = stepImages;

      stepImages[stepIndex] = e.target.files[0];
      setStepsImages(newStepImages);
    }
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) {
      setSteps([]);
    } else {
      const newSteps = steps.filter((step: IStep, i: number) => {
        if (index === i) return false;
        return true;
      });
      setSteps(newSteps);
    }

    const newStepImages = stepImages.filter((el: File, i: number) => {
      return index !== i;
    });

    setStepsImages(newStepImages);
  };

  const addProduct = (product: IProduct) => {
    const correctedProduct: IProduct = {
      name: product.name,
      type: product.type,
    };

    // gdy pobiera z Edamam
    if (product.values && product.values_per_100 && product.weight) {
      correctedProduct["values"] = {
        carbohydrates: product.values.carbohydrates,
        fat: product.values.fat,
        protein: product.values.protein,
        kcal: product.values.kcal,
      };
      correctedProduct["values_per_100"] = product.values_per_100;
      correctedProduct["weight"] = product.weight;
    }

    if (product.unit && product.pieces) {
      correctedProduct["unit"] = product.unit;
      correctedProduct["pieces"] = product.pieces;
    }
    setProductName("");
    setProducts([...products, correctedProduct]);
  };

  const addProductFromUser = (product: IProduct) => {
    let productExist = false;
    products.forEach((p: IProduct) => {
      if (product.name === p.name) productExist = true;
    });
    if (productExist) return;

    const correctedProduct: IProduct = {
      name: product.name,
      values: product.values,
      values_per_100: product.values_per_100,
      current_values: product.values,
      type: product.type,
      unit: product.unit,
      pieces: product.pieces,
    };

    if (product.weight) {
      correctedProduct["weight"] = product.weight;
    }

    setProducts([...products, correctedProduct]);
  };

  const changeProductAmmount = (
    product: IProduct,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    let newProducts = products;

    newProducts = newProducts.map((p: IProduct) => {
      if (p.name === product.name) {
        if (p.unit === "pieces") {
          p.pieces =
            parseInt(e.currentTarget.value) > 0
              ? parseInt(e.currentTarget.value)
              : 1;
        } else if (p.unit === "grams") {
          p.weight =
            parseInt(e.currentTarget.value) > 0
              ? parseInt(e.currentTarget.value)
              : 1;
        }
        p = calculateProductValues(p);
      }

      return p;
    });

    setProducts(newProducts);
  };

  const changeProductUnit = (name: string, value: "pieces" | "grams") => {
    let newProducts = products;

    newProducts = newProducts.map((product: IProduct) => {
      if (product.name === name) {
        const calculatedProduct = calculateProductValues({
          ...product,
          unit: value,
        });
        return calculatedProduct;
      }

      return product;
    });

    setProducts(newProducts);
  };

  const calculateProductValues = (product: IProduct) => {
    if (product.unit === "pieces" && product.pieces && product.values) {
      product.current_values = {
        kcal: Math.round(product.values.kcal * product.pieces * 100) / 100,
        fat: Math.round(product.values.fat * product.pieces * 100) / 100,
        carbohydrates:
          Math.round(product.values.carbohydrates * product.pieces * 100) / 100,
        protein:
          Math.round(product.values.protein * product.pieces * 100) / 100,
      };
    } else if (
      product.unit === "grams" &&
      product.weight &&
      product.values_per_100
    ) {
      let p = product.weight / 100;

      product.current_values = {
        kcal: Math.round(product.values_per_100.kcal * p * 100) / 100,
        carbohydrates:
          Math.round(product.values_per_100.carbohydrates * p * 100) / 100,
        protein: Math.round(product.values_per_100.protein * p * 100) / 100,
        fat: Math.round(product.values_per_100.fat * p * 100) / 100,
      };
    }

    return product;
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) {
      setProducts([]);
    } else {
      const newProducts = products.filter((product: IProduct, i: number) => {
        if (index === i) {
          return false;
        }
        return true;
      });
      setProducts(newProducts);
    }
  };

  const confirmProduct = (i: number) => {
    const newProducts = products.map((product: IProduct, index: number) => {
      if (index === i) {
        return {
          ...product,
          values: {
            carbohydrates: 0,
            kcal: 0,
            protein: 0,
            fat: 0,
          },
        };
      }
      return product;
    });

    setProducts(newProducts);
  };

  const forceFileInputClick = (ref: any) => {
    if (ref) {
      ref.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFieldValue("image", e.target.files[0]);
  };

  return (
    <div className={hidden ? styles.AddRecipeFormHidden : styles.AddRecipeForm}>
      {props.match.params.recipe_id ? (
        <>
          <h3 style={{ color: "#4CAF50" }}>Edytowanie przepisu</h3>
          <RiEditBoxLine className={styles.AddRecipeForm__icon} />
        </>
      ) : (
        <>
          <h3 style={{ color: "#4CAF50" }}>Dodawanie nowego przepisu</h3>
          <BsPlusCircle className={styles.AddRecipeForm__icon} />
        </>
      )}

      <form onSubmit={handleSubmit} className={styles.AddRecipeForm__form}>
        <label htmlFor="image">Zdjęcie*</label>
        {currentRecipe.image &&
          props.match.params.recipe_id &&
          typeof currentRecipe.image === "string" && (
            <img
              className={styles.AddRecipeForm__image}
              src={currentRecipe.image}
              alt="recipe"
            />
          )}
        <MdCloudUpload
          className={styles.AddRecipeForm__uploadIcon}
          onClick={() => forceFileInputClick(mainHiddenFileInput)}
        />
        <input
          ref={mainHiddenFileInput}
          style={{ display: "none" }}
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFileChange(e)}
        />
        <label htmlFor="number_of_portions">Liczba porcji</label>
        <input
          type="number"
          name="number_of_portions"
          id="number_of_portions"
          value={values.number_of_portions}
          onChange={handleChange}
        />
        <div className={styles.AddRecipeForm__validation}>
          {errors.number_of_portions && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.number_of_portions}
            </div>
          )}
          {!errors.number_of_portions && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="name">Nazwa</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          value={values.name}
          autoComplete="off"
        />
        <div className={styles.AddRecipeForm__validation}>
          {errors.name && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.name}
            </div>
          )}
          {!errors.name && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="time_min">Czas wykonania</label>
        <input
          id="time_min"
          name="time_min"
          type="number"
          onChange={handleChange}
          value={values.time_min}
        />
        <div className={styles.AddRecipeForm__validation}>
          {errors.time_min && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.time_min}
            </div>
          )}
          {!errors.time_min && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="type">Rodzaj posiłku</label>
        <select
          id="type"
          name="type"
          value={values.type}
          onChange={handleChange}
        >
          <option value="">Wybierz...</option>
          <option value="breakfast">Śniadanie</option>
          <option value="brunch">Drugie śniadanie</option>
          <option value="soup">Zupy</option>
          <option value="pasta_rice">Makarony i dania z ryżu</option>
          <option value="meat_dish">Dania główne z mięsa</option>
          <option value="fish_dish">Dania główne z ryb i owoców morza</option>
          <option value="vegetable_dish">Dania główne z warzyw</option>
          <option value="other_dish">Inne dania główne</option>
          <option value="lunch">Desery</option>
          <option value="drink">Napoje</option>
          <option value="appetizer_salad">Przystawki i sałatki</option>
          <option value="bread">Chleby i bułki</option>
          <option value="salt_bread">Słone wypieki</option>
          <option value="supper">Kolacja</option>
          <option value="other">Inne</option>
        </select>
        <div className={styles.AddRecipeForm__validation}>
          {errors.type && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.type}
            </div>
          )}
          {!errors.type && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="description">Opis</label>
        <textarea
          autoComplete="off"
          id="description"
          name="description"
          onChange={handleChange}
          value={values.description}
        />
        <div className={styles.AddRecipeForm__validation}>
          {errors.description && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.description}
            </div>
          )}
          {!errors.description && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <h3 style={{ alignSelf: "center" }}>Lista kroków</h3>
        {steps.length > 0 &&
          steps.map((step: IStep, index: number) => (
            <div className={styles.AddRecipeForm__step} key={index}>
              <div className={styles.AddRecipeForm__stepText}>
                <span style={{ fontWeight: "bold" }}>{index + 1}.</span>{" "}
                {step.name}
              </div>
              <div className={styles.AddRecipeForm__stepButtons}>
                <label className={styles.AddRecipeForm__uploadButton}>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      addImageToStep(e, index, step.name)
                    }
                  />
                  <MdCloudUpload />
                </label>
                <TiDelete
                  onClick={() => removeStep(index)}
                  className={styles.AddRecipeForm__removeIcon}
                />
              </div>
              {step.image && typeof step.image === "string" && (
                <img
                  className={styles.AddRecipeForm__stepImage}
                  src={step.image}
                  alt="step"
                />
              )}
            </div>
          ))}
        <div className={styles.AddRecipeForm__validation}>
          {stepsError !== "" && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {stepsError}
            </div>
          )}
          {stepsError === "" && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="steps">Dodaj krok</label>
        <input
          autoComplete="off"
          id="steps"
          name="steps"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setStep({ name: e.currentTarget.value })
          }
          value={step ? step.name : ""}
        />
        <button
          className={stylesButtons.Button}
          type="button"
          onClick={() => addStep()}
        >
          Dodaj
        </button>
        {steps.length === 0 && (
          <p style={{ fontWeight: "bold", textAlign: "center" }}>Brak kroków</p>
        )}
        {!completedProducts && (
          <>
            <div className={stylesValidation.Error}>
              <span style={{ marginTop: "1rem" }}>
                Uwaga! Błąd walidacji produktów. Popraw dane, aby system mógł
                wyliczyć kaloryczność lub podaj wartości ręcznie!
              </span>
            </div>
            <button
              className={
                valuesVisible ? stylesButtons.RedButton : stylesButtons.Button
              }
              type="button"
              onClick={() => setValuesVisible(!valuesVisible)}
            >
              {valuesVisible ? "Anuluj" : "Podaj"}
            </button>
          </>
        )}
        {valuesVisible && (
          <div className={styles.AddRecipeForm__values}>
            <label htmlFor="kcal">Kcal</label>
            <input
              id="kcal"
              name="kcal"
              type="number"
              onChange={handleChange}
              value={values.kcal ? values.kcal : 0}
            />

            <label htmlFor="protein">Białko</label>
            <input
              id="protein"
              name="protein"
              type="number"
              onChange={handleChange}
              value={values.protein ? values.protein : 0}
            />
            <label htmlFor="carbohydrates">Węglowodany</label>
            <input
              id="carbohydrates"
              name="carbohydrates"
              type="number"
              onChange={handleChange}
              value={values.carbohydrates ? values.carbohydrates : 0}
            />
            <label htmlFor="fat">Tłuszcz</label>
            <input
              id="fat"
              name="fat"
              type="number"
              onChange={handleChange}
              value={values.fat ? values.fat : 0}
            />
          </div>
        )}
        <h3 style={{ alignSelf: "center" }}>Produkty</h3>

        <div
          className={styles.AddRecipeForm__products}
          style={{ flexDirection: "column" }}
        >
          {products.length > 0 &&
            products.map((product: IProduct, index: number) => (
              <div key={index} className={styles.AddRecipeForm__product}>
                <div className={styles.AddRecipeForm__productRow}>
                  <span style={{ fontWeight: "bold" }}>{index + 1}. </span>
                  {product.name}{" "}
                  {product.original_name && <>({product.original_name}) </>}
                  {product.current_values && (
                    <> ({product.current_values.kcal}kcal)</>
                  )}
                  {!product.current_values && product.values && (
                    <> ({product.values.kcal}kcal)</>
                  )}
                  <TiDelete
                    className={styles.AddRecipeForm__removeIcon}
                    onClick={() => removeProduct(index)}
                  />
                  {!product.values && (
                    <BsPlusCircle
                      onClick={() => confirmProduct(index)}
                      style={{ color: "green", cursor: "pointer" }}
                    />
                  )}
                </div>

                {product.unit && (
                  <div className={styles.AddRecipeForm__productInputs}>
                    <input
                      type="number"
                      value={
                        product.unit === "pieces"
                          ? product.pieces
                          : product.unit === "grams"
                          ? product.weight
                          : 0
                      }
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        changeProductAmmount(product, e)
                      }
                    />
                    <input
                      type="radio"
                      value="g"
                      checked={product.unit === "grams"}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        changeProductUnit(product.name, "grams")
                      }
                    />
                    <label htmlFor="unit">g</label>
                    <input
                      type="radio"
                      value="pieces"
                      checked={product.unit === "pieces"}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        changeProductUnit(product.name, "pieces")
                      }
                    />
                    <label htmlFor="unit">szt</label>
                  </div>
                )}
              </div>
            ))}
          {products.length === 0 && (
            <p style={{ fontWeight: "bold", textAlign: "center" }}>
              Brak produktów
            </p>
          )}
          <div className={styles.AddRecipeForm__validation}>
            {productsError !== "" && (
              <div
                style={{ fontSize: "19.2px" }}
                className={stylesValidation.Error}
              >
                <BiErrorCircle className={stylesValidation.Error__icon} />
                {productsError}
              </div>
            )}
            {productsError === "" && (
              <div className={stylesValidation.Correct}>
                <MdDone className={stylesValidation.Correct__icon} />
                Dobrze
              </div>
            )}
          </div>
        </div>
        <div className={styles.AddRecipeForm__searchBar}>
          <label style={{ fontWeight: "bold" }} htmlFor="products">
            Podaj samą nazwę produktu:{" "}
          </label>
          <label htmlFor="products">Nazwa</label>
          <input
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setProductName(e.currentTarget.value)
            }
            value={productName}
          />
          <button
            className={stylesButtons.Button}
            type="button"
            onClick={() =>
              addProduct({
                name: productName,
                type: "other",
              })
            }
          >
            Dodaj
          </button>
        </div>
        <div className={styles.AddRecipeForm__searchBar}>
          <label style={{ fontWeight: "bold" }} htmlFor="products">
            Znajdź produkt z bazy:
          </label>
          <SearchProductBar onProductClick={addProduct} />
        </div>
        <label style={{ fontWeight: "bold" }}>Twoje produkty:</label>
        <div
          style={{ marginTop: "1rem" }}
          className={styles.AddRecipeForm__listProducts}
        >
          <ListProducts
            products={userProducts}
            onProductAdd={addProductFromUser}
          />
        </div>
        <button
          className={
            !isValid
              ? stylesButtons.RedButtonDisabled
              : stylesButtons.GreenButton
          }
          type="submit"
          disabled={!isValid}
        >
          {props.match.params.recipe_id ? "Edytuj" : "Dodaj"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
