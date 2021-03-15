import { useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserAvatarAction,
  editUserProfileAction,
  getUserProfileAction,
} from "../../containers/User/actions";
import { IUserFormProps, IUserFormValues } from "./types";
import { IStoreType } from "../../utils/store";
import styles from "./UserForm.module.scss";
import UserFormValdiationSchema from "./UserFormValidationSchema";

import stylesButtons from "../../styles/buttons.module.scss";
import stylesValidation from "../../styles/validation.module.scss";
import { BiErrorCircle, BiMaleSign, BiFemaleSign } from "react-icons/bi";
import useHiddenComponent from "../../hooks/useHiddenComponent";
import { MdCloudUpload } from "react-icons/md";

const UserForm = (props: IUserFormProps) => {
  const { type } = props;

  const hidden = useHiddenComponent(500);

  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(getUserProfileAction());
  }, [dispatcher]);

  const user = useSelector((state: IStoreType) => state.user.data);

  const hiddenFileInput = useRef(null);

  const initialValues: IUserFormValues = {
    name: user.name || "",
    surname: user.surname || "",
    gender: user.gender || "female",
    age: user.age || 16,
    weight_kg: user.weight_kg || 50,
    height_cm: user.height_cm || 150,
    avatar: user.avatar || undefined,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatcher(editUserProfileAction(values, user._id));
    },
    validationSchema: UserFormValdiationSchema,
  });

  const {
    handleChange,
    handleSubmit,
    values,
    isValid,
    errors,
    validateForm,
    setFieldValue,
  } = formik;

  useEffect(() => {
    setFieldValue("avatar", user.avatar);
    setFieldValue("name", user.name);
    setFieldValue("surname", user.surname);
    setFieldValue("age", user.age);
    setFieldValue("gender", user.gender);
    setFieldValue("weight_kg", user.weight_kg);
    setFieldValue("height_cm", user.height_cm);
  }, [setFieldValue, user, validateForm]);

  useEffect(() => {
    validateForm();
  }, [validateForm, values]);

  useEffect(() => {
    dispatcher(getUserProfileAction());
  }, [dispatcher]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      dispatcher(editUserAvatarAction(e.target.files[0]));
    }
  };

  const forceFileInputClick = (ref: any) => {
    if (ref) {
      ref.current.click();
    }
  };

  return (
    <div className={hidden ? styles.UserFormHidden : styles.UserForm}>
      {type === "add" && <h3>Uzupełnij swoje dane</h3>}
      {type === "edit" && <h3>Edytuj swoje dane</h3>}

      <form onSubmit={handleSubmit} className={styles.UserForm__form}>
        <div className={styles.UserForm__avatar}>
          {values.avatar && typeof values.avatar === "string" && (
            <img src={values.avatar} alt="avatar" />
          )}
          <MdCloudUpload
            className={styles.UserForm__uploadIcon}
            onClick={() => forceFileInputClick(hiddenFileInput)}
          />
          <input
            style={{ display: "none" }}
            ref={hiddenFileInput}
            className={styles.UserForm__fileInput}
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileChange(e)
            }
          />
        </div>
        <label htmlFor="name">Imię</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          value={values.name}
          autoComplete="off"
        />
        <div className={styles.UserForm__validation}>
          {errors.name && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.name}
            </div>
          )}
        </div>
        <label htmlFor="surname">Nazwisko</label>
        <input
          id="surname"
          name="surname"
          type="text"
          onChange={handleChange}
          value={values.surname}
          autoComplete="off"
        />
        <div className={styles.UserForm__validation}>
          {errors.surname && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.surname}
            </div>
          )}
        </div>
        <label htmlFor="age">Wiek</label>
        <select id="age" name="age" onChange={handleChange} value={values.age}>
          {Array.from({ length: 84 }, (_, i) => i + 16).map((el: number) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
        <label htmlFor="gender">Płeć</label>
        <div className={styles.UserForm__gender}>
          <input
            type="radio"
            value="female"
            name="gender"
            id="gender"
            onChange={handleChange}
            checked={values.gender === "female"}
          />
          <BiFemaleSign className={styles.UserForm__icon} />
          <input
            type="radio"
            value="male"
            name="gender"
            id="gender"
            onChange={handleChange}
            checked={values.gender === "male"}
          />{" "}
          <BiMaleSign className={styles.UserForm__icon} />
          <div className={styles.UserForm__validation} />
        </div>

        <label htmlFor="weight_kg">Waga (kg)</label>
        <input
          id="weight_kg"
          name="weight_kg"
          onChange={handleChange}
          value={values.weight_kg}
          type="number"
        />
        <div className={styles.UserForm__validation}>
          {errors.weight_kg && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.weight_kg}
            </div>
          )}
        </div>
        <label htmlFor="height_cm">Wzrost (cm)</label>
        <input
          id="height_cm"
          name="height_cm"
          onChange={handleChange}
          value={values.height_cm}
          type="number"
        />
        <div className={styles.UserForm__validation}>
          {errors.height_cm && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.height_cm}
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
          Zatwierdź
        </button>
      </form>
    </div>
  );
};

export default UserForm;
