import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  changeEatingPlanDateAction,
  getEatingPlanAction,
} from "../../containers/EatingPlans/actions";
import { getSomeProductsAction } from "../../containers/Products/actions";
import { getSomeRecipesAction } from "../../containers/Recipes/actions";
import useHiddenComponent from "../../hooks/useHiddenComponent";
import { IStoreType } from "../../utils/store";
import AdvancedSearchBar from "../AdvancedSearchBar/AdvancedSearchBar";
import FacebookButton from "../FacebookButton/FacebookButton";
import GoogleButton from "../GoogleButton/GoogleButton";
import ListProductsAndRecipes from "../ListProductsAndRecipes/ListProductsAndRecipes";
import Summary from "../Summary/Summary";
import styles from "./MainPage.module.scss";

const MainPage = () => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  const state = useSelector((state: IStoreType) => state);

  const user = state.user;
  const products = state.products.products;
  const recipes = state.recipes.recipes;
  const date = state.eatingPlans.date;
  const eatingPlan = state.eatingPlans.eatingPlan;

  const [mode, setMode] = useState<"default" | "recipes" | "products">(
    "default"
  );

  const changeMode = (value: "default" | "recipes" | "products") => {
    setMode(value);
  };

  useEffect(() => {
    dispatcher(changeEatingPlanDateAction("today"));
    dispatcher(getSomeProductsAction(6));
    dispatcher(getSomeRecipesAction(6));
  }, [dispatcher]);

  useEffect(() => {
    dispatcher(getEatingPlanAction(date));
  }, [dispatcher, date]);

  return (
    <div className={hidden ? styles.MainPageHidden : styles.MainPage}>
      {!user.isLogged && (
        <div className={styles.MainPage__buttons}>
          <div className={styles.MainPage__button}>
            <Link className={styles.MainPage__link} to="/register">
              Zarejestruj się
            </Link>
          </div>
          <div className={styles.MainPage__button}>
            <Link className={styles.MainPage__link} to="/login">
              Zaloguj się
            </Link>
          </div>
          <GoogleButton type="login" />
          <GoogleButton type="register" />
          <FacebookButton type="login" />
          <FacebookButton type="register" />
        </div>
      )}
      {user.isLogged && (
        <>
          <Summary eatingPlan={eatingPlan} />
          <AdvancedSearchBar changeMode={changeMode} mode={mode} />
          <ListProductsAndRecipes
            products={products}
            recipes={recipes}
            mode={mode}
          />
        </>
      )}
    </div>
  );
};

export default MainPage;
