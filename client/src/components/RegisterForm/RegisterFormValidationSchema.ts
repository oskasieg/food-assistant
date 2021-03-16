import * as Yup from "yup";

const RegisterFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .max(25, "Maksymalna liczba znaków: 25")
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/,
      "Zły format (pamiętaj o '@')"
    )
    .required("Pole wymagane"),

  login: Yup.string()
    .min(3, "Minimalna liczba znaków: 3")
    .max(16, "Maksymalna liczba znaków: 16")
    .matches(/[a-zA-z0-9]/, "Wykryto nieodpowiednie znaki")
    .required("Pole wymagane"),

  password: Yup.string()
    .min(8, "Minimalna liczba znaków: 8")
    .max(25, "Maksymalna liczba znaków: 25")
    .required("Pole wymagane"),

  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same!")
    .required("Pole wymagane"),
});

export default RegisterFormValidationSchema;
