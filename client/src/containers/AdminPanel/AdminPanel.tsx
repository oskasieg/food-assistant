import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListProducts from "../../components/ListProducts/ListProducts";
import ListRecipes from "../../components/ListRecipes/ListRecipes";
import { IStoreType } from "../../utils/store";
import {
  getProductsByNameAction,
  removeProductAction,
} from "../Products/actions";
import { getRecipesByNameAction, removeRecipeAction } from "../Recipes/actions";
import styles from "./AdminPanel.module.scss";

const AdminPanel = () => {
  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(getProductsByNameAction("", 0, 200));
    dispatcher(getRecipesByNameAction("", 0, 200));
  }, [dispatcher]);

  const state = useSelector((state: IStoreType) => state);

  const products = state.products.products;
  const recipes = state.recipes.recipes;

  const removeProduct = (id: string) => {
    dispatcher(removeProductAction(id));
    window.location.reload();
  };

  const removeRecipe = (id: string) => {
    dispatcher(removeRecipeAction(id));
    window.location.reload();
  };

  return (
    <div className={styles.AdminPanel}>
      <h1>Panel administratora</h1>
      <h3>Zweryfikuj poprawność elementów i zadecyduj co z nimi zrobić:</h3>
      <h3 style={{ width: "100%", textAlign: "left" }}>Produkty:</h3>
      <div className={styles.AdminPanel__items}>
        <ListProducts products={products} removeProduct={removeProduct} />
      </div>
      <h3 style={{ width: "100%", textAlign: "left" }}>Przepisy:</h3>
      <div className={styles.AdminPanel__items}>
        <ListRecipes recipes={recipes} removeRecipe={removeRecipe} />
      </div>
    </div>
  );
};

export default AdminPanel;
