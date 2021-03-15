import { IProduct, IProductValues } from "../../containers/Products/types";
import { IRecipe, IRecipeValues } from "../../containers/Recipes/types";

export interface IListProductsAndRecipesProps {
  products?: IProduct[];
  recipes?: IRecipe[];
  mode: "default" | "products" | "recipes";
}

export interface IProductAndRecipe {
  name: string;
  values?: IRecipeValues;
  createdAt?: Date;
  image?: string;
  type: "product" | "recipe";
  _id: string;
  user_id?: string;
  weight?: number;
  values_per_100?: IProductValues;
  current_values?: IProductValues;
}
