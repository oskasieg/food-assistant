import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  addEatingPlanAction,
  editEatingPlanAction,
  getEatingPlanAction,
  setEatingPlanDateAction,
} from "../../containers/EatingPlans/actions";
import { getUserProductsAction } from "../../containers/Products/actions";
import { IProduct } from "../../containers/Products/types";
import { getUserRecipesAction } from "../../containers/Recipes/actions";
import { IRecipe } from "../../containers/Recipes/types";
import { IStoreType } from "../../utils/store";
import ListProducts from "../ListProducts/ListProducts";
import ListRecipes from "../ListRecipes/ListRecipes";
import SearchProductBar from "../SearchProductBar/SearchProductBar";
import styles from "./EatingPlanForm.module.scss";
import stylesButtons from "../../styles/buttons.module.scss";
import { TiDelete } from "react-icons/ti";
import showNotification from "../../utils/nottifications";

interface TParams {
  date: string;
  dish: string;
}

const EatingPlanForm = (props: RouteComponentProps<TParams>) => {
  const dispatcher = useDispatch();

  const [elements, setElements] = useState<any>([]);

  const state = useSelector((state: IStoreType) => state);

  const userProducts = state.products.userProducts;
  const recipes = state.recipes.userRecipes;
  const filteredRecipes = recipes;
  // const filteredRecipes = recipes.filter((recipe: IRecipe) => {
  //   return recipe.type === props.match.params.dish;
  // });

  const eatingPlan = state.eatingPlans.eatingPlan;
  const user = useSelector((state: IStoreType) => state.user.data);
  const date = state.eatingPlans.date;

  useEffect(() => {
    const day = new Date(props.match.params.date);
    dispatcher(getEatingPlanAction(new Date(day.setHours(16))));
    dispatcher(getUserProductsAction());
    dispatcher(getUserRecipesAction());
    dispatcher(setEatingPlanDateAction(new Date(day.setHours(16))));
  }, [dispatcher, props]);

  useEffect(() => {
    const dish = props.match.params.dish;
    let mappedElements = [];

    switch (dish) {
      case "breakfast":
        mappedElements = eatingPlan.breakfast.map((el: any) => {
          if (el.number_of_portions) {
            el.number_of_portions = 1;
          }

          return el;
        });
        setElements(mappedElements);
        break;
      case "brunch":
        mappedElements = eatingPlan.brunch.map((el: any) => {
          if (el.number_of_portions) {
            el.number_of_portions = 1;
          }

          return el;
        });
        setElements(mappedElements);
        break;
      case "dinner":
        mappedElements = eatingPlan.dinner.map((el: any) => {
          if (el.number_of_portions) {
            el.number_of_portions = 1;
          }

          return el;
        });
        setElements(mappedElements);
        break;
      case "lunch":
        mappedElements = eatingPlan.lunch.map((el: any) => {
          if (el.number_of_portions) {
            el.number_of_portions = 1;
          }

          return el;
        });
        setElements(mappedElements);
        break;
      case "supper":
        mappedElements = eatingPlan.supper.map((el: any) => {
          if (el.number_of_portions) {
            el.number_of_portions = 1;
          }

          return el;
        });
        setElements(mappedElements);
        break;
      default:
        setElements([]);
    }
  }, [eatingPlan, props]);

  const addProduct = (product: IProduct) => {
    setElements([...elements, { ...product, current_values: product.values }]);
    showNotification("Sukces", "Dodano produkt do planu", "info");
  };

  const changeProductAmmount = (
    el: any,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    let newElements = elements;

    newElements = newElements.map((newEl: any) => {
      if (newEl._id === el._id) {
        if (newEl.unit === "pieces") {
          newEl.pieces =
            parseInt(e.currentTarget.value) > 0
              ? parseInt(e.currentTarget.value)
              : 1;
        } else if (newEl.unit === "grams") {
          newEl.weight =
            parseInt(e.currentTarget.value) > 0
              ? parseInt(e.currentTarget.value)
              : 1;
        }

        newEl = calculateProductValues(newEl);
      }

      return newEl;
    });

    setElements(newElements);
  };

  const changeProductUnit = (el: any, value: string) => {
    let newElements = elements;

    newElements = newElements.map((newEl: any) => {
      if (newEl._id === el._id) {
        const calculatedProduct = calculateProductValues({
          ...newEl,
          unit: value,
        });
        return calculatedProduct;
      }

      return newEl;
    });

    setElements(newElements);
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

  const addRecipe = (recipe: IRecipe) => {
    setElements([...elements, recipe]);
    showNotification("Sukces", "Dodano przepis do planu", "info");
  };

  const removeElement = (index: number) => {
    const filteredElements = elements.filter((el: any, i: number) => {
      if (i === index) {
        return false;
      }
      return true;
    });
    setElements(filteredElements);
  };

  const changeNumberOfPortions = (
    el_id: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    let newElements = elements;

    newElements = newElements.map((el: any) => {
      if (el._id === el_id && el.number_of_portions) {
        el.number_of_portions =
          parseInt(e.currentTarget.value) > 0
            ? parseInt(e.currentTarget.value)
            : 1;

        el = calculateRecipeValues(el);
      }

      return el;
    });
    setElements(newElements);
  };

  const calculateRecipeValues = (recipe: IRecipe) => {
    if (recipe.number_of_portions && recipe.values) {
      const values_per_portion = recipe.values;
      const portions = recipe.number_of_portions;
      const newValues = {
        kcal: 0,
        fat: 0,
        carbohydrates: 0,
        protein: 0,
      };
      newValues.kcal =
        Math.round(portions * values_per_portion.kcal * 100) / 100;
      newValues.fat = Math.round(portions * values_per_portion.fat * 100) / 100;
      newValues.carbohydrates =
        Math.round(portions * values_per_portion.carbohydrates * 100) / 100;
      newValues.protein =
        Math.round(portions * values_per_portion.protein * 100) / 100;

      recipe.current_values = newValues;

      return recipe;
    }
  };

  const confirmChanges = () => {
    // jezeli nie ma jeszcze planu w bazie
    if (!eatingPlan._id) {
      const ep = {
        ...eatingPlan,
        user_id: user._id,
        date: new Date(date.setHours(16)),
        [props.match.params.dish]: elements,
      };
      dispatcher(addEatingPlanAction(ep));
    }
    // w przeciwnym razie edytuje dany plan
    else {
      dispatcher(
        editEatingPlanAction({
          ...eatingPlan,
          [props.match.params.dish]: elements,
        })
      );
    }
  };

  const translateDish = (dishName: string) => {
    switch (dishName) {
      case "breakfast":
        return "śniadanie";
      case "brunch":
        return "drugie śniadanie";
      case "dinner":
        return "obiad";
      case "lunch":
        return "deser";
      case "supper":
        return "kolacja";
    }
  };

  return (
    <div className={styles.EatingPlanForm}>
      <h3>Planowanie posiłku: {translateDish(props.match.params.dish)}</h3>
      {elements.length > 0 &&
        elements.map((el: any, index: number) => (
          <div className={styles.EatingPlanForm__element} key={index}>
            <div className={styles.EatingPlanForm__elementRow}>
              <span style={{ fontWeight: "bold" }}>
                {index + 1}. {el.name}
              </span>{" "}
              {el.current_values && (
                <span> ({el.current_values.kcal}kcal)</span>
              )}
              {!el.current_values && el.values && <> ({el.values.kcal}kcal)</>}
              <TiDelete
                className={styles.EatingPlanForm__removeIcon}
                onClick={() => removeElement(index)}
              />
            </div>
            {el.unit && (
              <div className={styles.EatingPlanForm__elementInputs}>
                <input
                  type="number"
                  value={
                    el.unit === "pieces"
                      ? el.pieces
                      : el.unit === "grams"
                      ? el.weight
                      : 0
                  }
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    changeProductAmmount(el, e)
                  }
                />
                <input
                  type="radio"
                  value="g"
                  checked={el.unit === "grams"}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    changeProductUnit(el, "grams")
                  }
                />
                <label htmlFor="unit">g</label>
                <input
                  type="radio"
                  value="pieces"
                  checked={el.unit === "pieces"}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    changeProductUnit(el, "pieces")
                  }
                />
                <label htmlFor="unit">szt</label>
              </div>
            )}

            {el.number_of_portions && (
              <div className={styles.EatingPlanForm__elementInputs}>
                <label htmlFor="portions">Porcje:</label>
                <input
                  type="number"
                  value={el.number_of_portions}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    changeNumberOfPortions(el._id, e)
                  }
                />{" "}
              </div>
            )}
          </div>
        ))}
      <button
        className={stylesButtons.GreenButton}
        type="button"
        onClick={() => confirmChanges()}
      >
        Gotowe
      </button>
      <h3>Znajdź produkt z bazy:</h3>
      <SearchProductBar onProductClick={addProduct} />
      <h3>Twoje produkty:</h3>
      <ListProducts products={userProducts} onProductAdd={addProduct} />
      <h3>Twoje przepisy:</h3>
      <ListRecipes recipes={filteredRecipes} addRecipe={addRecipe} />
    </div>
  );
};

export default EatingPlanForm;
