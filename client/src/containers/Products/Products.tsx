import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ListProducts from "../../components/ListProducts/ListProducts";
import { IStoreType } from "../../utils/store";
import { getUserProductsAction, removeUserProductAction } from "./actions";
import styles from "./Products.module.scss";
import stylesButtons from "../../styles/buttons.module.scss";

const Products = () => {
  const dispatcher = useDispatch();

  const userProducts = useSelector(
    (state: IStoreType) => state.products.userProducts
  );

  useEffect(() => {
    dispatcher(getUserProductsAction());
  }, [dispatcher]);

  const removeProduct = (product_id: string) => {
    dispatcher(removeUserProductAction(product_id));
  };

  return (
    <div className={styles.Products}>
      <Link className={styles.Products__link} to="/profile/product/add">
        <div className={stylesButtons.Button}>Dodaj produkt</div>
      </Link>
      <h3>Twoje produkty:</h3>
      <ListProducts products={userProducts} removeProduct={removeProduct} />
    </div>
  );
};

export default Products;
