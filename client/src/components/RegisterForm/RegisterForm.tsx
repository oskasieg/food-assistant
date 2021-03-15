import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerUserAction } from "../../containers/User/actions";
import { IRegisterFormValues } from "./types";
import styles from "./RegisterForm.module.scss";
import RegisterFormValidationSchema from "./RegisterFormValidationSchema";
import stylesValidation from "../../styles/validation.module.scss";
import { BiErrorCircle } from "react-icons/bi";
import stylesButtons from "../../styles/buttons.module.scss";
import { MdDone } from "react-icons/md";
import useHiddenComponent from "../../hooks/useHiddenComponent";

const RegisterForm = () => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  const initialValues: IRegisterFormValues = {
    email: "",
    login: "",
    password: "",
    repeatPassword: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatcher(
        registerUserAction(values.email, values.login, values.password)
      );
    },
    validationSchema: RegisterFormValidationSchema,
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
    <div className={hidden ? styles.RegisterFormHidden : styles.RegisterForm}>
      <h3>Formularz rejestracji</h3>
      <form onSubmit={handleSubmit} className={styles.RegisterForm__form}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="text"
          onChange={handleChange}
          value={values.email}
          autoComplete="off"
        />
        <div className={styles.RegisterForm__validation}>
          {errors.email && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.email}
            </div>
          )}
          {!errors.email && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>

        <label htmlFor="login">Login:</label>
        <input
          id="login"
          name="login"
          type="text"
          onChange={handleChange}
          value={values.login}
          autoComplete="off"
        />
        <div className={styles.RegisterForm__validation}>
          {errors.login && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.login}
            </div>
          )}
          {!errors.login && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>

        <label htmlFor="password">Hasło: </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={values.password}
        />
        <div className={styles.RegisterForm__validation}>
          {errors.password && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.password}
            </div>
          )}
          {!errors.password && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>

        <label htmlFor="repeatPassword">Powtórz hasło: </label>
        <input
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          onChange={handleChange}
          value={values.repeatPassword}
        />
        <div className={styles.RegisterForm__validation}>
          {errors.repeatPassword && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.repeatPassword}
            </div>
          )}
          {!errors.repeatPassword && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={
            !isValid
              ? stylesButtons.RedButtonDisabled
              : stylesButtons.GreenButton
          }
        >
          Zarejestruj
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
