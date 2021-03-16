export interface IAddRecipeFormValues {
  user_id: string;
  name: string;
  description: string;
  time_min: number;
  type:
    | ""
    | "breakfast"
    | "brunch"
    | "lunch"
    | "supper"
    | "other"
    | "pasta_rice"
    | "meat_dish"
    | "other_dish"
    | "fish_dish"
    | "vegetable_dish"
    | "soup"
    | "appetizer_salad"
    | "bread"
    | "drink"
    | "salt_bread";
  image?: File | string;
  kcal?: number;
  fat?: number;
  carbohydrates?: number;
  protein?: number;
  number_of_portions: number;
}
