import React from "react";
import { useDispatch } from "react-redux";
import { sendNewVerificationMailAction } from "../../containers/User/actions";
import { IUserVerificationProps } from "./types";
import styles from "./UserVerification.module.scss";
import { FiAlertTriangle } from "react-icons/fi";
import stylesButtons from "../../styles/buttons.module.scss";

const UserVerification = (props: IUserVerificationProps) => {
  const dispatcher = useDispatch();

  const { user } = props;

  const onButtonClick = () => {
    dispatcher(sendNewVerificationMailAction(user._id, user.email));
  };

  return (
    <div className={styles.UserVerification}>
      <h1 style={{ color: "#f44336" }}>Konto nie aktywowane!</h1>
      <FiAlertTriangle className={styles.UserVerification__icon} />
      <h4>
        Wygląda na to, że nie sprawdziłeś jeszcze poczty!<br></br>
      </h4>
      <h4>Znajduje się tam link do aktywacji Twojego konta</h4>
      <h4>
        Link jest ważny tylko 30min. Aby wygenerować nowy kliknij przycisk:
      </h4>
      <button className={stylesButtons.Button} onClick={() => onButtonClick()}>
        Generuj link
      </button>
    </div>
  );
};

export default UserVerification;
