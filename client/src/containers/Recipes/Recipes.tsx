import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ListRecipes from "../../components/ListRecipes/ListRecipes";
import { IStoreType } from "../../utils/store";
import { getUserProductsAction } from "../Products/actions";
import { getUserRecipesAction, removeUserRecipeAction } from "./actions";
import styles from "./Recipes.module.scss";
import stylesButtons from "../../styles/buttons.module.scss";
import "../../styles/typography.css";

const Recipes = () => {
  const dispatcher = useDispatch();

  const recipes = useSelector((state: IStoreType) => state.recipes.userRecipes);

  useEffect(() => {
    dispatcher(getUserProductsAction());
    dispatcher(getUserRecipesAction());
  }, [dispatcher]);

  const removeRecipe = (recipe_id: string) => {
    dispatcher(removeUserRecipeAction(recipe_id));
  };

  return (
    <div className={styles.Recipes}>
      <Link className={styles.Recipes__link} to="/profile/recipe/add">
        <div className={stylesButtons.Button}>Dodaj przepis</div>
      </Link>

      <h3>Twoje przepisy:</h3>
      <ListRecipes recipes={recipes} removeRecipe={removeRecipe} />
    </div>
  );
};

export default Recipes;
