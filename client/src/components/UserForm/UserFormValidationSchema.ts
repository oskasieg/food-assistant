import * as Yup from "yup";

const UserFormValdiationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimalna liczba znaków: 3")
    .max(20, "Maksymalna liczba znaków: 20")
    .matches(/[a-zA-Z]+/, "Zły format")
    .required("Pole wymagane"),

  surname: Yup.string()
    .min(3, "Minimalna liczba znaków: 3")
    .max(20, "Maksymalna liczba znaków: 20")
    .matches(/[a-zA-Z]+/, "Zły format")
    .required("Pole wymagane"),

  weight_kg: Yup.number()
    .min(20, "Minimalna waga: 20kg")
    .required("Pole wymagane"),
  height_cm: Yup.number()
    .min(100, "Minimalny wzrost: 100cm")
    .required("Pole wymagane"),
});

export default UserFormValdiationSchema;
