import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUserAction } from "../../containers/User/actions";
import { ILoginFormValues } from "./types";
import styles from "./LoginForm.module.scss";
import LoginFormValidationSchema from "./LoginFormValidationSchema";

import stylesValidation from "../../styles/validation.module.scss";
import { BiErrorCircle } from "react-icons/bi";
import stylesButtons from "../../styles/buttons.module.scss";
import useHiddenComponent from "../../hooks/useHiddenComponent";

const LoginForm = () => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  const initialValues: ILoginFormValues = {
    login: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatcher(loginUserAction(values.login, values.password));
    },
    validationSchema: LoginFormValidationSchema,
  });

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isValid,
    validateForm,
  } = formik;

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  return (
    <div className={hidden ? styles.LoginFormHidden : styles.LoginForm}>
      <h3>Formularz logowania</h3>
      <form onSubmit={handleSubmit} className={styles.LoginForm__form}>
        <label htmlFor="login">Login:</label>
        <input
          id="login"
          name="login"
          type="text"
          onChange={handleChange}
          value={values.login}
          autoComplete="off"
        />
        <div className={styles.LoginForm__validation}>
          {errors.login && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.login}
            </div>
          )}
        </div>

        <label htmlFor="password"> Hasło</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={values.password}
          autoComplete="off"
        />
        <div className={styles.LoginForm__validation}>
          {errors.password && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.password}
            </div>
          )}
        </div>

        <button
          className={
            !isValid
              ? stylesButtons.RedButtonDisabled
              : stylesButtons.GreenButton
          }
          type="submit"
          disabled={!isValid}
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
