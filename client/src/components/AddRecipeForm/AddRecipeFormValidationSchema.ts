import * as Yup from "yup";

const AddRecipeFormValdiationSchema = Yup.object().shape({
  number_of_portions: Yup.number()
    .min(1, "Minimalna ilość porcji: 1")
    .required("Pole wymagane"),

  type: Yup.string().required("Nie wybrano rodzaju"),

  name: Yup.string()
    .min(3, "Minimalna liczba znaków: 3")
    .max(35, "Maksymalna liczba znaków: 35")
    .required("Pole wymagane"),

  time_min: Yup.number()
    .min(5, "Minimalny czas wykonania: 15min")
    .max(180, "Maksymalny czas wykonania: 180")
    .required("Pole wymagane"),

  description: Yup.string()
    .min(10, "Minimalna liczba znaków: 10")
    .max(254, "Maksymalna liczba znaków 254")
    .required("Pole wymagane"),
});

export default AddRecipeFormValdiationSchema;
