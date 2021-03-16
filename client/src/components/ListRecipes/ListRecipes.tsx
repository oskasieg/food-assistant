import React from "react";
import { IListRecipesProps } from "./types";
import styles from "./ListRecipes.module.scss";
import { IRecipe } from "../../containers/Recipes/types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import stylesButtons from "../../styles/buttons.module.scss";
import { IStoreType } from "../../utils/store";
import "../../styles/typography.css";
import { TiDelete } from "react-icons/ti";
import { AiFillEdit } from "react-icons/ai";
import useHiddenComponent from "../../hooks/useHiddenComponent";
import { IoMdAddCircle } from "react-icons/io";

const ListRecipes = (props: IListRecipesProps) => {
  const { recipes, removeRecipe, addRecipe } = props;

  const hidden = useHiddenComponent(100);

  const user = useSelector((state: IStoreType) => state.user.data);

  return (
    <div className={hidden ? styles.ListRecipesHidden : styles.ListRecipes}>
      {recipes.map((recipe: IRecipe, index: number) => (
        <div key={index} className={styles.ListRecipes__recipe}>
          <p className={styles.ListRecipes__title}>
            {recipe.name} {recipe.time_min && <>({recipe.time_min}min)</>}
          </p>
          {recipe.image && typeof recipe.image === "string" && (
            <img
              className={styles.ListRecipes__image}
              src={recipe.image}
              alt="recipe"
            />
          )}
          {!recipe.image && (
            <div
              className={styles.ListRecipes__image}
              style={{ width: "100%" }}
            >
              Brak zdjęcia
            </div>
          )}
          <div className={styles.ListRecipes__buttons}>
            {removeRecipe && (
              <TiDelete
                className={styles.ListRecipes__removeButton}
                onClick={() => removeRecipe(recipe._id)}
              />
            )}
            {user.login !== "admin" && removeRecipe && (
              <Link to={`/profile/recipe/edit/${recipe._id}`}>
                <AiFillEdit className={styles.ListRecipes__editButton} />
              </Link>
            )}
            {addRecipe && (
              <IoMdAddCircle
                onClick={() => addRecipe(recipe)}
                className={styles.ListRecipes__addButton}
              />
            )}
          </div>
          {recipe.values && (
            <p className={styles.ListRecipes__values}>
              <span>
                <span style={{ fontWeight: "bold" }}>K: </span>
                {recipe.values.kcal}{" "}
              </span>
              <span>
                <span style={{ fontWeight: "bold" }}>W: </span>
                {recipe.values.carbohydrates}{" "}
              </span>
            </p>
          )}
          {recipe.values && (
            <p className={styles.ListRecipes__values}>
              <span>
                <span style={{ fontWeight: "bold" }}>B: </span>
                {recipe.values.protein}{" "}
              </span>
              <span>
                <span style={{ fontWeight: "bold" }}>T: </span>
                {recipe.values.fat}{" "}
              </span>{" "}
            </p>
          )}

          <button
            style={{ width: "170px" }}
            type="button"
            className={stylesButtons.Button}
          >
            <Link
              className={styles.ListRecipes__link}
              to={`/recipe/${recipe._id}`}
            >
              Zobacz więcej
            </Link>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListRecipes;
