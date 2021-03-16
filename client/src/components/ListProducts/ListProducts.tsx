import React from "react";
import { IProduct } from "../../containers/Products/types";
import { IListProductsProps } from "./types";
import styles from "./ListProducts.module.scss";
import { TiDelete } from "react-icons/ti";
import useHiddenComponent from "../../hooks/useHiddenComponent";
import { IoMdAddCircle } from "react-icons/io";

const ListProducts = (props: IListProductsProps) => {
  const { onProductAdd, onProductRemove, removeProduct } = props;

  const hidden = useHiddenComponent(100);

  return (
    <div className={hidden ? styles.ListProductsHidden : styles.ListProducts}>
      {props.products.map((product: IProduct, index: number) => (
        <div className={styles.ListProducts__product} key={index}>
          {product.image && typeof product.image === "string" && (
            <img
              src={product.image}
              alt="product"
              className={styles.ListProducts__image}
            />
          )}
          {!product.image && (
            <div
              className={styles.ListProducts__image}
              style={{ width: "100%" }}
            >
              Brak zdjęcia
            </div>
          )}
          <p className={styles.ListProducts__title}>
            {product.name} {product.weight && <span>({product.weight}g)</span>}
          </p>

          {product.values && (
            <p className={styles.ListProducts__row}>
              <span>
                <span style={{ fontWeight: "bold" }}>K:</span>{" "}
                {product.values.kcal}
              </span>{" "}
              <span>
                <span style={{ fontWeight: "bold" }}>W:</span>{" "}
                {product.values.carbohydrates}
              </span>
            </p>
          )}

          {product.values && (
            <p className={styles.ListProducts__row}>
              <span>
                <span style={{ fontWeight: "bold" }}>B:</span>{" "}
                {product.values.protein}
              </span>{" "}
              <span>
                <span style={{ fontWeight: "bold" }}>T:</span>{" "}
                {product.values.fat}
              </span>
            </p>
          )}
          {onProductAdd && (
            <IoMdAddCircle
              onClick={() => onProductAdd(product)}
              className={styles.ListProducts__addButton}
            />
          )}
          {onProductRemove && (
            <TiDelete
              className={styles.ListProducts__removeButton}
              onClick={() => onProductRemove(index)}
            />
          )}
          {removeProduct && (
            <TiDelete
              className={styles.ListProducts__removeButton}
              onClick={() => removeProduct(product._id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ListProducts;
