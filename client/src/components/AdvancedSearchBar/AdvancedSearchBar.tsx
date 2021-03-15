import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import {
  IAdvancedSearchBarProps,
  IAdvancedSearchBarValues,
  IFiltersOptions,
} from "./types";
import styles from "./AdvancedSearchBar.module.scss";
import { useDispatch } from "react-redux";
import {
  clearProductsAction,
  getProductsByFiltersAction,
  getProductsByNameAction,
} from "../../containers/Products/actions";
import {
  getRecipesByFiltersAction,
  getRecipesByNameAction,
  clearRecipesAction,
} from "../../containers/Recipes/actions";
import Filters from "./Filters";
import usePageBottom from "../../hooks/usePageBottom";
import { MdFilterVintage } from "react-icons/md";
import stylesButtons from "../../styles/buttons.module.scss";

const AdvancedSearchBar = ({ changeMode, mode }: IAdvancedSearchBarProps) => {
  const dispatcher = useDispatch();

  const isPageBottom = usePageBottom();

  const [skip, setSkip] = useState<number>(0);
  // eslint-disable-next-line
  const [limit, setLimit] = useState<number>(12);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [filtersMode, setFiltersMode] = useState<
    "products" | "recipes" | "default"
  >("default");

  const searchRecipes = (values: IAdvancedSearchBarValues) => {
    changeMode("recipes");
    dispatcher(getRecipesByNameAction(values.value, skip, limit));
  };

  const searchProducts = useCallback(
    (values: IAdvancedSearchBarValues) => {
      changeMode("products");
      dispatcher(getProductsByNameAction(values.value, skip, limit));
    },

    [changeMode, dispatcher, limit, skip]
  );

  const initialValues: IAdvancedSearchBarValues = {
    value: "",
    type: "products",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (
        values.type === "default" ||
        values.type === "products" ||
        values.type === "recipes"
      ) {
        changeMode(values.type);
      }

      if (values.options) {
        switch (values.type) {
          case "recipes": {
            dispatcher(getRecipesByFiltersAction(values.options, skip, limit));
            break;
          }
          case "products": {
            dispatcher(getProductsByFiltersAction(values.options, skip, limit));
            break;
          }
        }
      } else if (values.type !== "") {
        switch (values.type) {
          case "recipes":
            searchRecipes(values);
            break;
          case "products":
            searchProducts(values);
            break;
        }
      }
    },
  });

  const { handleChange, handleSubmit, values, setFieldValue } = formik;

  useEffect(() => {
    if (!isPageBottom) return;
    setSkip(skip + limit);
    // eslint-disable-next-line
  }, [isPageBottom]);

  useEffect(() => {
    if (formik.isSubmitting && skip > 0) {
      handleSubmit();
    }
    // eslint-disable-next-line
  }, [skip, formik.isSubmitting]);

  useEffect(() => {
    if (
      values.type === "default" ||
      values.type === "products" ||
      values.type === "recipes"
    ) {
      setFiltersMode(values.type);
    }
  }, [values.type]);

  const clearItems = () => {
    setSkip(0);
    if (filtersMode !== "default") {
      dispatcher(clearProductsAction());
      dispatcher(clearRecipesAction());
    }
    if (values.options) values.options = undefined;
  };

  const onFiltersSubmit = (options: IFiltersOptions) => {
    setSkip(0);
    setFieldValue("options", options);
    handleSubmit();
  };

  return (
    <div className={styles.AdvancedSearchBar}>
      <Filters
        visible={modalVisible}
        changeVisible={() => setModalVisible(false)}
        mode={filtersMode}
        onSubmit={onFiltersSubmit}
      />
      <h3>Wyszukaj</h3>
      <form onSubmit={handleSubmit} className={styles.AdvancedSearchBar__form}>
        <div className={styles.AdvancedSearchBar__fields}>
          <input
            autoComplete="off"
            className={styles.AdvancedSearchBar__input}
            type="text"
            id="value"
            name="value"
            onChange={handleChange}
            value={values.value}
          />

          {/*<select
            id="type"
            name="type"
            onChange={handleChange}
            value={values.type}
          >
            <option value="default">Wybierz typ</option>
            <option value="products">Produkty</option>
            <option value="recipes">Przepisy</option>
          </select>*/}
          {filtersMode !== "default" && (
            <MdFilterVintage
              className={styles.AdvancedSearchBar__icon}
              onClick={() => setModalVisible(true)}
            />
          )}
        </div>
        <div className={styles.AdvancedSearchBar__radios}>
          <label htmlFor="type">
            <input
              type="radio"
              name="type"
              onChange={handleChange}
              checked={values.type === "products"}
              value="products"
            />{" "}
            produkty
          </label>
          <label htmlFor="type">
            <input
              type="radio"
              name="type"
              onChange={handleChange}
              checked={values.type === "recipes"}
              value="recipes"
            />{" "}
            przepisy
          </label>
        </div>
        <button
          style={{ marginTop: "1rem" }}
          className={stylesButtons.Button}
          onClick={() => clearItems()}
          type="submit"
        >
          Szukaj
        </button>
      </form>
    </div>
  );
};

export default AdvancedSearchBar;
