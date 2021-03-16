import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IStoreType } from "../../utils/store";
import Menu from "../Menu/Menu";
import styles from "./Header.module.scss";

const Header = () => {
  const isLogged = useSelector((state: IStoreType) => state.user.isLogged);

  return (
    <div className={styles.Header}>
      {isLogged && <Menu />}
      <div className={styles.Header__logo}>
        <Link className={styles.Header__link} to="/">
          Food assistant
        </Link>
      </div>
    </div>
  );
};

export default Header;
