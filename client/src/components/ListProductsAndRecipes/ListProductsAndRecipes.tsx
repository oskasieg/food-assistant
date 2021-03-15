import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addProductByIdAction,
  getUserProductsAction,
} from "../../containers/Products/actions";
import { IProduct } from "../../containers/Products/types";
import {
  addRecipeByIdAction,
  getUserRecipesAction,
} from "../../containers/Recipes/actions";
import { IRecipe } from "../../containers/Recipes/types";
import dateToString from "../../utils/dateToString";
import { IStoreType } from "../../utils/store";
import styles from "./ListProductsAndRecipes.module.scss";
import { IListProductsAndRecipesProps, IProductAndRecipe } from "./types";
import stylesButtons from "../../styles/buttons.module.scss";
import { BsPlusCircle } from "react-icons/bs";

const ListProductsAndRecipes = ({
  recipes,
  products,
  mode,
}: IListProductsAndRecipesProps) => {
  const dispatcher = useDispatch();

  const state = useSelector((state: IStoreType) => state);

  const [items, setItems] = useState<IProductAndRecipe[]>([]);

  const userProducts = state.products.userProducts;
  const userRecipes = state.recipes.userRecipes;

  // mapowanie propsow na items
  useEffect(() => {
    if (
      recipes &&
      products /*&&
      recipes.length > 0 &&
      products.length > 0 // <- gdy nie ma w bazie produktow*/
    ) {
      const newItems: IProductAndRecipe[] = [];
      recipes.forEach((recipe: IRecipe) => {
        newItems.push({
          name: recipe.name,
          values: recipe.values,
          createdAt: recipe.createdAt,
          image:
            recipe.image && typeof recipe.image === "string"
              ? recipe.image
              : "",
          type: "recipe",
          _id: recipe._id ? recipe._id : "",
          user_id: recipe.user_id,
        });
      });

      products.forEach((product: IProduct) => {
        newItems.push({
          name: product.name,
          values: product.values,
          createdAt: product.createdAt,
          image:
            product.image && typeof product.image === "string"
              ? product.image
              : "",
          type: "product",
          _id: product._id ? product._id : "",
          user_id: product.user_id,
          weight: product.weight ? product.weight : undefined,
          values_per_100: product.values_per_100
            ? product.values_per_100
            : undefined,
        });
      });
      newItems.sort((a: IProductAndRecipe, b: IProductAndRecipe) => {
        if (a.createdAt && b.createdAt) {
          if (a.createdAt > b.createdAt) return -1;
          else return 1;
        }
        return 0;
      });

      setItems(newItems.reverse());
    }
  }, [recipes, products]);

  const addUserProductById = (id: string) => {
    dispatcher(addProductByIdAction(id));
  };

  const addRecipeById = (id: string) => {
    dispatcher(addRecipeByIdAction(id));
  };

  // pobieranie produktow i przepisow uzytkownika
  useEffect(() => {
    dispatcher(getUserProductsAction());
    dispatcher(getUserRecipesAction());
  }, [dispatcher]);

  const checkIfOwnProduct = (item: IProductAndRecipe) => {
    let own = false;
    userProducts.forEach((product: IProduct) => {
      if (product._id === item._id) {
        own = true;
      }
      if (item.values && product.values) {
        if (
          product.name === item.name &&
          product.values.kcal === item.values.kcal
        ) {
          own = true;
        }
      } else if (product.name === item.name) {
        own = true;
      }
    });
    return own;
  };

  const checkIfOwnRecipe = (item: IProductAndRecipe) => {
    let own = false;
    userRecipes.forEach((recipe: IRecipe) => {
      if (recipe.values && item.values) {
        if (
          recipe.name === item.name &&
          recipe.values.kcal === item.values.kcal
        ) {
          own = true;
        }
      } else if (recipe.name === item.name) {
        own = true;
      }
      if (recipe._id === item._id) {
        own = true;
      }
    });
    return own;
  };

  return (
    <div className={styles.ListProductsAndRecipes}>
      {mode === "default" && (
        <>
          <h3 style={{ textAlign: "center" }}>
            Ostatnio dodane przez użytkowników
          </h3>
          <h3>Produkty:</h3>
          <div className={styles.ListProductsAndRecipes__items}>
            {items
              .filter((item: IProductAndRecipe) => item.type === "product")
              .map((item: IProductAndRecipe, index: number) => (
                <div
                  key={index}
                  className={styles.ListProductsAndRecipes__item}
                >
                  {!checkIfOwnProduct(item) && (
                    <BsPlusCircle
                      className={styles.ListProductsAndRecipes__itemButton}
                      onClick={() => addUserProductById(item._id)}
                    />
                  )}
                  {item.image && item.image !== "" && (
                    <img
                      className={styles.ListProductsAndRecipes__image}
                      src={item.image}
                      alt="item"
                    />
                  )}
                  {item.image === "" && (
                    <div
                      className={styles.ListProductsAndRecipes__image}
                      style={{ width: "100%" }}
                    >
                      Brak zdjęcia
                    </div>
                  )}
                  <h4 className={styles.ListProductsAndRecipes__title}>
                    {item.name} {item.weight && <span>({item.weight}g)</span>}
                  </h4>

                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>K: </span>
                        {item.values.kcal}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>W: </span>
                        {item.values.carbohydrates}
                      </span>{" "}
                    </p>
                  )}
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>B: </span>
                        {item.values.protein}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>T: </span>
                        {item.values.fat}
                      </span>{" "}
                    </p>
                  )}
                  <div
                    className={styles.ListProductsAndRecipes__row}
                    style={{ fontWeight: "bold" }}
                  >
                    {item.createdAt && dateToString(item.createdAt)}
                  </div>
                  <div className={styles.ListProductsAndRecipes__row}>
                    {item.type === "recipe" && (
                      <Link to={`/recipe/${item._id}`}>Zobacz</Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <h3>Przepisy:</h3>
          <div className={styles.ListProductsAndRecipes__items}>
            {items
              .filter((item: IProductAndRecipe) => item.type === "recipe")
              .map((item: IProductAndRecipe, index: number) => (
                <div
                  key={index}
                  className={styles.ListProductsAndRecipes__item}
                >
                  {!checkIfOwnRecipe(item) && (
                    <BsPlusCircle
                      className={styles.ListProductsAndRecipes__itemButton}
                      onClick={() => addRecipeById(item._id)}
                    />
                  )}
                  {item.image && item.image !== "" && (
                    <img
                      className={styles.ListProductsAndRecipes__image}
                      src={item.image}
                      alt="item"
                    />
                  )}
                  {item.image === "" && (
                    <div
                      className={styles.ListProductsAndRecipes__image}
                      style={{ width: "100%" }}
                    >
                      Brak zdjęcia
                    </div>
                  )}
                  <h4 className={styles.ListProductsAndRecipes__title}>
                    {item.name} {item.weight && <span>({item.weight}g)</span>}
                  </h4>
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>K: </span>
                        {item.values.kcal}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>W: </span>
                        {item.values.carbohydrates}
                      </span>{" "}
                    </p>
                  )}
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>B: </span>
                        {item.values.protein}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>T: </span>
                        {item.values.fat}
                      </span>{" "}
                    </p>
                  )}

                  <div
                    className={styles.ListProductsAndRecipes__row}
                    style={{ fontWeight: "bold" }}
                  >
                    {item.createdAt && dateToString(item.createdAt)}
                  </div>
                  <div className={styles.ListProductsAndRecipes__row}>
                    {item.type === "recipe" && (
                      <Link
                        className={styles.ListProductsAndRecipes__link}
                        to={`/recipe/${item._id}`}
                      >
                        <div className={stylesButtons.Button}> Zobacz</div>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {mode === "products" && (
        <>
          <h4>Ilość wyników: {products && products.length}</h4>
          <div className={styles.ListProductsAndRecipes__items}>
            {items
              .filter((item: IProductAndRecipe) => item.type === "product")
              .map((item: IProductAndRecipe, index: number) => (
                <div
                  key={index}
                  className={styles.ListProductsAndRecipes__item}
                >
                  {!checkIfOwnProduct(item) && (
                    <BsPlusCircle
                      className={styles.ListProductsAndRecipes__itemButton}
                      onClick={() => addUserProductById(item._id)}
                    />
                  )}
                  {item.image && item.image !== "" && (
                    <img
                      className={styles.ListProductsAndRecipes__image}
                      src={item.image}
                      alt="item"
                    />
                  )}
                  {item.image === "" && (
                    <div
                      className={styles.ListProductsAndRecipes__image}
                      style={{ width: "100%" }}
                    >
                      Brak zdjęcia
                    </div>
                  )}
                  <h4 className={styles.ListProductsAndRecipes__title}>
                    {item.name} {item.weight && <span>({item.weight}g)</span>}
                  </h4>
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>K: </span>
                        {item.values.kcal}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>W: </span>
                        {item.values.carbohydrates}
                      </span>{" "}
                    </p>
                  )}
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>B: </span>
                        {item.values.protein}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>T: </span>
                        {item.values.fat}
                      </span>{" "}
                    </p>
                  )}

                  <div
                    className={styles.ListProductsAndRecipes__row}
                    style={{ fontWeight: "bold" }}
                  >
                    {item.createdAt && dateToString(item.createdAt)}
                  </div>
                  <div className={styles.ListProductsAndRecipes__row}>
                    {item.type === "recipe" && (
                      <div className={stylesButtons.Button}>
                        <Link
                          className={styles.ListProductsAndRecipes__link}
                          to={`/recipe/${item._id}`}
                        >
                          Zobacz
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {mode === "recipes" && (
        <>
          <h4>Ilość wyników: {recipes && recipes.length}</h4>

          <div className={styles.ListProductsAndRecipes__items}>
            {items
              .filter((item: IProductAndRecipe) => item.type === "recipe")
              .map((item: IProductAndRecipe, index: number) => (
                <div
                  key={index}
                  className={styles.ListProductsAndRecipes__item}
                >
                  {!checkIfOwnRecipe(item) && (
                    <BsPlusCircle
                      className={styles.ListProductsAndRecipes__itemButton}
                      onClick={() => addRecipeById(item._id)}
                    />
                  )}
                  {item.image && item.image !== "" && (
                    <img
                      className={styles.ListProductsAndRecipes__image}
                      src={item.image}
                      alt="item"
                    />
                  )}
                  {item.image === "" && (
                    <div
                      className={styles.ListProductsAndRecipes__image}
                      style={{ width: "100%" }}
                    >
                      Brak zdjęcia
                    </div>
                  )}
                  <h4 className={styles.ListProductsAndRecipes__title}>
                    {item.name} {item.weight && <span>({item.weight}g)</span>}
                  </h4>
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>K: </span>
                        {item.values.kcal}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>W: </span>
                        {item.values.carbohydrates}
                      </span>{" "}
                    </p>
                  )}
                  {item.values && (
                    <p className={styles.ListProductsAndRecipes__row}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>B: </span>
                        {item.values.protein}
                      </span>
                      <span>
                        <span style={{ fontWeight: "bold" }}>T: </span>
                        {item.values.fat}
                      </span>{" "}
                    </p>
                  )}

                  <div
                    className={styles.ListProductsAndRecipes__row}
                    style={{ fontWeight: "bold" }}
                  >
                    {item.createdAt && dateToString(item.createdAt)}
                  </div>
                  <div className={styles.ListProductsAndRecipes__row}>
                    {item.type === "recipe" && (
                      <Link
                        className={styles.ListProductsAndRecipes__link}
                        to={`/recipe/${item._id}`}
                      >
                        <div className={stylesButtons.Button}> Zobacz</div>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListProductsAndRecipes;
