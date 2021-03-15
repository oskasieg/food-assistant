import { IFiltersOptions } from "../../components/AdvancedSearchBar/types";
import { IProduct } from "../Products/types";
import {
  ADD_RECIPE_BY_ID_REQUEST,
  ADD_RECIPE_REQUEST,
  CLEAR_RECIPES,
  EDIT_RECIPE_REQUEST,
  GET_RECIPES_BY_FILTERS_REQUEST,
  GET_RECIPES_BY_FILTERS_SUCCESS,
  GET_RECIPES_BY_NAME_REQUEST,
  GET_RECIPES_BY_NAME_SUCCESS,
  GET_RECIPE_REQUEST,
  GET_RECIPE_SUCCESS,
  GET_SOME_RECIPES_REQUEST,
  GET_SOME_RECIPES_SUCCESS,
  GET_USER_RECIPES_REQUEST,
  GET_USER_RECIPES_SUCCESS,
  REMOVE_RECIPE_REQUEST,
  REMOVE_USER_RECIPE_REQUEST,
} from "./constants";

export interface IRecipesReducerState {
  userRecipes: IRecipe[];
  recipe: IRecipe;
  recipes: IRecipe[];
}

export interface IRecipeValues {
  kcal: number;
  carbohydrates: number;
  protein: number;
  fat: number;
}

export interface IStep {
  name?: string;
  image?: string | File;
}

export interface IRecipe {
  _id?: string;
  user_id: string;
  name: string;
  description: string;
  steps: IStep[];
  products: IProduct[];
  time_min: number;
  type:
    | ""
    | "breakfast"
    | "brunch"
    | "soup"
    | "pasta_rice"
    | "meat_dish"
    | "fish_dish"
    | "vegetable_dish"
    | "other_dish"
    | "lunch"
    | "supper"
    | "appetizer_salad"
    | "bread"
    | "drink"
    | "salt_bread"
    | "other";

  values?: IRecipeValues;
  current_values?: IRecipeValues;
  createdAt?: Date;
  image?: string | File;
  stepImages?: string[] | File[];
  number_of_portions?: number;
}

export interface IAddRecipeAction {
  type: typeof ADD_RECIPE_REQUEST;
  recipe: IRecipe;
}

export interface IAddRecipeByIdAction {
  type: typeof ADD_RECIPE_BY_ID_REQUEST;
  id: string;
}

export interface IRemoveUserRecipeAction {
  type: typeof REMOVE_USER_RECIPE_REQUEST;
  recipe_id: string;
}

export interface IRemoveRecipeAction {
  type: typeof REMOVE_RECIPE_REQUEST;
  id: string;
}

export interface IEditRecipeAction {
  type: typeof EDIT_RECIPE_REQUEST;
  recipe: IRecipe;
}

export interface IGetRecipesByNameAction {
  type: typeof GET_RECIPES_BY_NAME_REQUEST;
  name: string;
  skip: number;
  limit: number;
}

export interface IGetRecipesByNameSuccess {
  type: typeof GET_RECIPES_BY_NAME_SUCCESS;
  recipes: IRecipe[];
}

export interface IGetUserRecipesAction {
  type: typeof GET_USER_RECIPES_REQUEST;
}

export interface IGetUserRecipesSuccess {
  type: typeof GET_USER_RECIPES_SUCCESS;
  userRecipes: IRecipe[];
}

export interface IGetSomeRecipesAction {
  type: typeof GET_SOME_RECIPES_REQUEST;
  ammount: number;
}

export interface IGetSomeRecipesSuccess {
  type: typeof GET_SOME_RECIPES_SUCCESS;
  recipes: IRecipe[];
}

export interface IGetRecipeAction {
  type: typeof GET_RECIPE_REQUEST;
  recipe_id: string;
}

export interface IGetRecipeSuccess {
  type: typeof GET_RECIPE_SUCCESS;
  recipe: IRecipe;
}

export interface IGetRecipesByFiltersAction {
  type: typeof GET_RECIPES_BY_FILTERS_REQUEST;
  options: IFiltersOptions;
  skip: number;
  limit: number;
}

export interface IGetRecipesByFiltersSuccess {
  type: typeof GET_RECIPES_BY_FILTERS_SUCCESS;
  recipes: IRecipe[];
}

export interface IClearRecipesAction {
  type: typeof CLEAR_RECIPES;
}

export type RecipesReducerType =
  | IGetRecipeSuccess
  | IGetUserRecipesSuccess
  | IGetSomeRecipesSuccess
  | IGetRecipesByNameSuccess
  | IGetRecipesByFiltersSuccess
  | IClearRecipesAction;
