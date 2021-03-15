import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import styles from "./FacebookButton.module.scss";
import { IFacebookButtonProps } from "./types";
import { FaFacebookSquare } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  signInWithFacebookAction,
  signUpWithFacebookAction,
} from "../../containers/User/actions";

interface IFacebookResponse {
  userID: string;
  name: string;
  email: string;
  picture: { data: { url: string } };
}

const FacebookButton = (props: IFacebookButtonProps) => {
  const { type } = props;

  const dispatcher = useDispatch();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const responseFacebook = async (response: IFacebookResponse) => {
    if (isClicked) {
      if (type === "login") {
        dispatcher(signInWithFacebookAction(response.userID));
      } else {
        const name = response.name.split(" ")[0];
        const surname = response.name.split(" ")[1];

        dispatcher(
          signUpWithFacebookAction({
            email: response.email,
            facebookId: response.userID,
            name,
            surname,
            avatar: response.picture.data.url,
          })
        );
      }
      setIsClicked(false);
    }
  };

  return (
    <FacebookLogin
      appId="352816436053103"
      autoLoad={true}
      fields="name,email,picture"
      callback={(response: any) => {
        if (isClicked) {
          responseFacebook(response);
          setIsClicked(false);
        }
      }}
      size="medium"
      cssClass={styles.FacebookButton}
      icon={<FaFacebookSquare className={styles.FacebookButton__icon} />}
      textButton={type === "login" ? "Zaloguj się" : "Zarejestruj się"}
      onClick={() => setIsClicked(true)}
    ></FacebookLogin>
  );
};

export default FacebookButton;
