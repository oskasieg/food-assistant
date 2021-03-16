import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAction,
  clearSuggestedProducts,
  getEdamamProductsByNameAction,
} from "../../containers/Products/actions";
import { IProduct } from "../../containers/Products/types";
import { IStoreType } from "../../utils/store";
import styles from "./SearchProductBar.module.scss";
import { ISearchProductBar } from "./types";
import { BsPlusCircle } from "react-icons/bs";

const SearchProductBar = (props: ISearchProductBar) => {
  const { onProductClick } = props;

  const dispatcher = useDispatch();

  const suggestedProducts = useSelector(
    (state: IStoreType) => state.products.suggestedProducts
  );

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.length > 0) {
        dispatcher(getEdamamProductsByNameAction(value));
      } else {
        dispatcher(clearSuggestedProducts());
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [dispatcher, value]);

  const onSuggestedProductClick = (product: IProduct) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      dispatcher(addProductAction(product));
    }
    dispatcher(clearSuggestedProducts());
    setValue("");
  };

  return (
    <div className={styles.SearchProductBar}>
      <label htmlFor="value">Nazwa</label>
      <input
        autoComplete="off"
        type="text"
        id="value"
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setValue(e.currentTarget.value)
        }
        value={value}
      />
      {/* component z lista */}
      {suggestedProducts.length > 0 &&
        suggestedProducts.map((product: IProduct, index: number) => (
          <div className={styles.SearchProductBar__list}>
            <div key={index} className={styles.SearchProductBar__element}>
              {product.name.toLowerCase()}{" "}
              {product.values && <>{product.values.kcal} kcal</>}
              <BsPlusCircle
                className={styles.SearchProductBar__icon}
                onClick={() => onSuggestedProductClick(product)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchProductBar;
