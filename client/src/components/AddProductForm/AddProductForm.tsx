import React, { useEffect } from "react";
import styles from "./AddProductForm.module.scss";
import { useFormik } from "formik";
import { IAddProductFormValues } from "./types";
import { useDispatch } from "react-redux";
import { addProductAction } from "../../containers/Products/actions";
import AddProductValidationSchema from "./AddProductValidationSchema";
import SearchProductBar from "../SearchProductBar/SearchProductBar";
import stylesButtons from "../../styles/buttons.module.scss";
import stylesValidation from "../../styles/validation.module.scss";
import { BsPlusCircle } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import useHiddenComponent from "../../hooks/useHiddenComponent";

const AddProductForm = () => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  const initialValues: IAddProductFormValues = {
    name: "",
    carbohydrates: 0,
    fat: 0,
    kcal: 0,
    protein: 0,
    weight: 0,
    type: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatcher(
        addProductAction({
          name: values.name,
          values: {
            kcal: values.kcal,
            carbohydrates: values.carbohydrates,
            fat: values.fat,
            protein: values.protein,
          },
          type: values.type,
          image: values.image,
          weight: values.weight,
        })
      );
    },
    validationSchema: AddProductValidationSchema,
  });

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    validateForm,
    isValid,
  } = formik;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      formik.setFieldValue("image", e.target.files[0]);
    }
  };

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  return (
    <div
      className={hidden ? styles.AddProductFormHidden : styles.AddProductForm}
    >
      <h3 style={{ color: "#4CAF50" }}>Dodawanie nowego produktu</h3>
      <BsPlusCircle className={styles.AddProductForm__icon} />
      <h4>Znajdź produkt:</h4>
      <SearchProductBar />
      <h4>lub</h4>
      <h4>Dodaj produkt ręcznie:</h4>
      <form onSubmit={handleSubmit} className={styles.AddProductForm__form}>
        <label htmlFor="image">Zdjęcie*</label>
        <input
          className={styles.AddProductForm__inputFile}
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange(e)
          }
        />
        <label htmlFor="name">Nazwa</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          value={values.name}
          autoComplete="off"
        />
        <div className={styles.AddProductForm__validation}>
          {errors.name && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.name}
            </div>
          )}
          {!errors.name && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="type">Rodzaj</label>
        <select
          id="type"
          name="type"
          value={values.type}
          onChange={handleChange}
        >
          <option value="">Wybierz...</option>
          <option value="fruit">Owoc</option>
          <option value="vegetable">Warzywo</option>
          <option value="packaged">Pakowana żywność</option>
          <option value="sweets">Słodycze</option>
          <option value="bread">Pieczywo</option>
          <option value="meat">Mięso</option>
          <option value="dairy">Nabiał</option>
          <option value="other">Inne</option>
        </select>
        <div className={styles.AddProductForm__validation}>
          {errors.type && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.type}
            </div>
          )}
          {!errors.type && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="weight">Waga</label>
        <input
          type="number"
          name="weight"
          id="weight"
          value={values.weight}
          onChange={handleChange}
        />
        <div className={styles.AddProductForm__validation}>
          {errors.weight && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.weight}
            </div>
          )}
          {!errors.weight && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="values.kcal">Kalorie</label>
        <input
          id="kcal"
          name="kcal"
          type="number"
          onChange={handleChange}
          value={values.kcal}
        />
        <div className={styles.AddProductForm__validation}>
          {errors.kcal && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.kcal}
            </div>
          )}
          {!errors.kcal && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="carbohydrates">Węglowodany</label>
        <input
          id="carbohydrates"
          name="carbohydrates"
          type="number"
          onChange={handleChange}
          value={values.carbohydrates}
        />
        <div className={styles.AddProductForm__validation}>
          {errors.carbohydrates && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.carbohydrates}
            </div>
          )}
          {!errors.carbohydrates && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="protein">Białko</label>
        <input
          id="protein"
          name="protein"
          type="number"
          onChange={handleChange}
          value={values.protein}
        />
        <div className={styles.AddProductForm__validation}>
          {errors.protein && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.protein}
            </div>
          )}
          {!errors.protein && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
            </div>
          )}
        </div>
        <label htmlFor="fat">Tłuszcz</label>
        <input
          id="fat"
          name="fat"
          type="number"
          onChange={handleChange}
          value={values.fat}
        />
        <div className={styles.AddProductForm__validation}>
          {errors.fat && (
            <div className={stylesValidation.Error}>
              <BiErrorCircle className={stylesValidation.Error__icon} />
              {errors.fat}
            </div>
          )}
          {!errors.fat && (
            <div className={stylesValidation.Correct}>
              <MdDone className={stylesValidation.Correct__icon} />
              Dobrze
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
          Dodaj
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
