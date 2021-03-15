import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUserAction } from "../../containers/User/actions";
import useOutsideClick from "../../hooks/useOutsideClick";
import { removeToken } from "../../utils/cookies";
import { forwardTo } from "../../utils/history";
import showNotification from "../../utils/nottifications";
import { IStoreType } from "../../utils/store";
import styles from "./Menu.module.scss";
import stylesButtons from "../../styles/buttons.module.scss";

const Menu = () => {
  const dispatcher = useDispatch();

  const ref = useRef(null);

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const user = useSelector((state: IStoreType) => state.user.data);

  const onButtonClick = () => {
    showNotification(
      "Wylogowano",
      `Do zobaczenia ponownie ${user.login}`,
      "info"
    );
    dispatcher(logoutUserAction());
    removeToken();
    forwardTo("/");
  };

  useOutsideClick(ref, () => {
    setMenuVisible(false);
  });

  return (
    <div
      ref={ref}
      className={styles.Menu}
      onClick={() => setMenuVisible(!menuVisible)}
    >
      <span className={styles.Menu__text}>MENU</span>
      <div className={styles.Menu__bars} />
      <div
        className={
          menuVisible ? styles.Menu__contentActive : styles.Menu__content
        }
      >
        {window.innerWidth < 800 && (
          <div className={styles.Menu__title}>MENU </div>
        )}
        <Link className={styles.Menu__option} to="/profile">
          Mój profil{" "}
        </Link>
        {user.isVerified && user.login !== "admin" && (
          <>
            <Link className={styles.Menu__option} to="/profile/edit">
              Edytuj profil
            </Link>
            <Link className={styles.Menu__option} to="/eatingPlan">
              Planowanie
            </Link>
            <Link className={styles.Menu__option} to="/profile/products">
              Moje produkty
            </Link>
            <Link className={styles.Menu__option} to="/profile/recipes">
              Moje przepisy
            </Link>
          </>
        )}
        {user.login === "admin" && (
          <Link className={styles.Menu__option} to="/profile/admin">
            Panel administratora
          </Link>
        )}
        <button
          onClick={() => onButtonClick()}
          className={stylesButtons.RedButton}
          type="button"
        >
          Wyloguj
        </button>
      </div>
    </div>
  );
};

export default Menu;
