export interface IUserFormProps {
  type: "add" | "edit";
}

export interface IUserFormValues {
  name: string;
  surname: string;
  gender: string;
  age: number;
  weight_kg: number;
  height_cm: number;
  avatar?: File | string;
}
