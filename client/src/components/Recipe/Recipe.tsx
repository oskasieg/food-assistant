import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { IProduct } from "../../containers/Products/types";
import {
  addRecipeByIdAction,
  getRecipeAction,
  getUserRecipesAction,
} from "../../containers/Recipes/actions";
import { IRecipe, IStep } from "../../containers/Recipes/types";
import { IStoreType } from "../../utils/store";
import styles from "./Recipe.module.scss";
import { GiKnifeFork } from "react-icons/gi";
import { BiTime } from "react-icons/bi";
import dateToString from "../../utils/dateToString";
import stylesButtons from "../../styles/buttons.module.scss";
import useHiddenComponent from "../../hooks/useHiddenComponent";

interface TParams {
  recipe_id: string;
}

const Recipe = (props: RouteComponentProps<TParams>) => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  useEffect(() => {
    dispatcher(getRecipeAction(props.match.params.recipe_id));
    dispatcher(getUserRecipesAction());
  }, [dispatcher, props]);

  const state = useSelector((state: IStoreType) => state);
  const recipe = state.recipes.recipe;
  const userRecipes = state.recipes.userRecipes;

  const checkIfOwnRecipe = () => {
    let own = false;
    userRecipes.forEach((r: IRecipe) => {
      if (recipe._id === r._id) {
        own = true;
      }
    });

    return own;
  };

  const addRecipeById = () => {
    if (recipe._id) {
      dispatcher(addRecipeByIdAction(recipe._id));
    }
  };

  const translateType = (type: string) => {
    switch (type) {
      case "pasta_rice":
        return "Makarony i dania z ryżu";
      case "meat_dish":
        return "Dania główne z mięsa";
      case "soup":
        return "Zupy";
      case "appetizer_salad":
        return "Przystawki i sałatki";
      case "other_dish":
        return "Inne dania główne";
      case "lunch":
        return "Desery";
      case "fish_dish":
        return "Dania główne z ryb i owoców morza";
      case "vegetable_dish":
        return "Dania główne z warzyw";
      case "bread":
        return "Chleby i bułki";
      case "drink":
        return "Napoje";
      case "salt_bread":
        return "Słone wypieki";
    }
  };

  return (
    <div className={hidden ? styles.RecipeHidden : styles.Recipe}>
      <div className={styles.Recipe__informations}>
        <div className={styles.Recipe__title}>
          <h4>{recipe.name}</h4>
          <h4 style={{ fontWeight: "initial" }}>
            Typ posiłku: {translateType(recipe.type)}
          </h4>
        </div>
        {recipe.image && typeof recipe.image === "string" && (
          <img
            className={styles.Recipe__mainImage}
            src={recipe.image}
            alt="recipe"
          />
        )}

        <div className={styles.Recipe__row}>
          <div>
            <BiTime className={styles.Recipe__icon} /> {recipe.time_min}min
          </div>
          <div>
            <GiKnifeFork className={styles.Recipe__icon} />{" "}
            {recipe.number_of_portions}
          </div>
        </div>
        {recipe.values && (
          <div className={styles.Recipe__row}>
            <span>
              <span style={{ fontWeight: "bold" }}>K: </span>
              {recipe.values.kcal}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>W: </span>
              {recipe.values.carbohydrates}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>B: </span>
              {recipe.values.protein}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>T: </span>
              {recipe.values.fat}
            </span>
          </div>
        )}
        <div className={styles.Recipe__row}>
          <div className={styles.Recipe__description}>{recipe.description}</div>
        </div>

        {recipe.createdAt && (
          <div className={styles.Recipe__row}>
            <span style={{ fontWeight: "bold" }}>Data utworzenia: </span>
            {dateToString(recipe.createdAt)}
          </div>
        )}
        {!checkIfOwnRecipe() && (
          <button
            style={{ marginTop: "0", marginBottom: "1rem" }}
            className={stylesButtons.GreenButton}
            onClick={addRecipeById}
          >
            Dodaj
          </button>
        )}
      </div>
      <div className={styles.Recipe__products}>
        <p style={{ fontWeight: "bold", marginTop: "1rem" }}>
          Potrzebne produkty:
        </p>
        {recipe.products.map((product: IProduct, index: number) => (
          <p key={index}>
            <span style={{ fontWeight: "bold" }}>{index + 1}.</span>{" "}
            {product.name}{" "}
            {product.original_name && <>({product.original_name})</>}{" "}
            {product.values && product.values.kcal}kcal
          </p>
        ))}
      </div>

      <div className={styles.Recipe__steps}>
        <p style={{ fontWeight: "bold", marginTop: "1rem" }}>Lista kroków:</p>
        {recipe.steps.map((step: IStep, index: number) => (
          <p className={styles.Recipe__step} key={index}>
            {index + 1}. {step.name}{" "}
            {step.image && typeof step.image === "string" && (
              <img src={step.image} alt="step" />
            )}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Recipe;
