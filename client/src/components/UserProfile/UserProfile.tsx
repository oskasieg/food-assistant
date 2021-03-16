import React from "react";
import { Link } from "react-router-dom";
import { IUserProfileProps } from "./types";
import styles from "./UserProfile.module.scss";
import stylesButtons from "../../styles/buttons.module.scss";
import useHiddenComponent from "../../hooks/useHiddenComponent";

const UserProfile = (props: IUserProfileProps) => {
  const { user } = props;

  const hidden = useHiddenComponent(100);

  return (
    <div className={hidden ? styles.UserProfileHidden : styles.UserProfile}>
      <h3>Twój profil</h3>
      <div className={styles.UserProfile__informations}>
        {user.avatar ? (
          <img
            src={user.avatar}
            className={styles.UserProfile__avatar}
            alt="avatar"
          />
        ) : null}
        <h4 style={{ alignSelf: "center" }}>{user.login}</h4>
        <div className={styles.UserProfile__row}>
          <p style={{ fontWeight: "bold" }}>Imię:</p> <p>{user.name}</p>
        </div>
        <div className={styles.UserProfile__row}>
          <p style={{ fontWeight: "bold" }}>Nazwisko:</p> <p>{user.surname}</p>
        </div>
        <div className={styles.UserProfile__row}>
          <p style={{ fontWeight: "bold" }}>Wiek:</p> <p>{user.age}</p>
        </div>
        <div className={styles.UserProfile__row}>
          <p style={{ fontWeight: "bold" }}>Płeć:</p>{" "}
          <p>{user.gender === "male" ? "mężczyzna" : "kobieta"}</p>
        </div>
        <div className={styles.UserProfile__row}>
          <p style={{ fontWeight: "bold" }}>Waga:</p> <p>{user.weight_kg}kg</p>
        </div>
        <div className={styles.UserProfile__row}>
          <p style={{ fontWeight: "bold" }}>Wzrost:</p>
          <p>{user.height_cm}cm</p>
        </div>
        <div className={stylesButtons.Button}>
          <Link className={styles.UserProfile__link} to="/profile/edit">
            Edytuj profil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
