import React from "react";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import {
  signInWithGoogleAction,
  signUpWithGoogleAction,
} from "../../containers/User/actions";
import { IGoogleButtonProps } from "./types";
import styles from "./GoogleButton.module.scss";
import { FaGoogle } from "react-icons/fa";

interface IGoogleResponse {
  accessToken: string;
}

const GoogleButton = (props: IGoogleButtonProps) => {
  const { type } = props;

  const dispatcher = useDispatch();

  const responseGoogle = (response: IGoogleResponse) => {
    if (type === "register") {
      dispatcher(signUpWithGoogleAction(response.accessToken));
    } else {
      dispatcher(signInWithGoogleAction(response.accessToken));
    }
  };

  return (
    <GoogleLogin
      clientId="829174535714-4f6vohq0bdugbnvbfo6m7u1u5fo9ifo8.apps.googleusercontent.com"
      render={(renderProps) => (
        <button
          className={styles.GoogleButton}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <FaGoogle className={styles.GoogleButton__icon} />
          {type === "register" ? "Zarejestruj się" : "Zaloguj się"}
        </button>
      )}
      onSuccess={(response: any) => responseGoogle(response)}
      onFailure={(response: any) => responseGoogle(response)}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleButton;
