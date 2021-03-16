import { IRecipe } from "../../containers/Recipes/types";

export interface IListRecipesProps {
  recipes: IRecipe[];
  removeRecipe?: (recipe_id: any) => void;
  addRecipe?: (recipe: IRecipe) => void;
}
