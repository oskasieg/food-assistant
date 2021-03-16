import * as Yup from "yup";

const AddProductValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimalna liczba znaków: 3")
    .max(25, "Maksymalna liczba znaków: 25")
    .required("Pole wymagane"),

  type: Yup.string().required("Nie wybrano rodzaju"),

  weight: Yup.number().min(1, "Błędna wartość").required("Pole wymagane"),

  kcal: Yup.number().min(0.1, "Błędna wartość").required("Pole wymagane"),

  fat: Yup.number().min(0.1, "Błędna wartość").required("Pole wymagane"),

  protein: Yup.number().min(0.1, "Błędna wartość").required("Pole wymagane"),

  carbohydrates: Yup.number()
    .min(0.1, "Błędna wartość")
    .required("Pole wymagane"),
});

export default AddProductValidationSchema;
