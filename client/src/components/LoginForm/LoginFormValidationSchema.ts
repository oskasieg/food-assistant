import * as Yup from "yup";

const LoginFormValidationSchema = Yup.object().shape({
  login: Yup.string().required("Pole wymagane"),
  password: Yup.string().required("Pole wymagane"),
});

export default LoginFormValidationSchema;
