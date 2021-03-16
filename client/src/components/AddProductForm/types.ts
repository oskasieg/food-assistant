export interface IAddProductFormValues {
  name: string;
  kcal: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  weight?: number;
  type?:
    | "fruit"
    | "vegetable"
    | "packaged"
    | "sweets"
    | "dairy"
    | "bread"
    | "other"
    | "meat"
    | "";

  image?: File;
}
