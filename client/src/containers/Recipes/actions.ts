import { IFiltersOptions } from "../../components/AdvancedSearchBar/types";
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
import { IRecipe } from "./types";

export const addRecipeAction = (recipe: IRecipe) => ({
  type: ADD_RECIPE_REQUEST,
  recipe,
});

export const addRecipeByIdAction = (id: string) => ({
  type: ADD_RECIPE_BY_ID_REQUEST,
  id,
});

export const removeUserRecipeAction = (recipe_id: string) => ({
  type: REMOVE_USER_RECIPE_REQUEST,
  recipe_id,
});

export const removeRecipeAction = (id: string) => ({
  type: REMOVE_RECIPE_REQUEST,
  id,
});

export const editRecipeAction = (recipe: IRecipe) => ({
  type: EDIT_RECIPE_REQUEST,
  recipe,
});

export const getRecipesByNameAction = (
  name: string,
  skip: number,
  limit: number
) => ({
  type: GET_RECIPES_BY_NAME_REQUEST,
  name,
  skip,
  limit,
});

export const getRecipesByNameSuccess = (recipes: IRecipe[]) => ({
  type: GET_RECIPES_BY_NAME_SUCCESS,
  recipes,
});

export const getRecipesByFiltersAction = (
  options: IFiltersOptions,
  skip: number,
  limit: number
) => ({
  type: GET_RECIPES_BY_FILTERS_REQUEST,
  options,
  limit,
  skip,
});

export const getRecipesByFiltersSuccess = (recipes: IRecipe[]) => ({
  type: GET_RECIPES_BY_FILTERS_SUCCESS,
  recipes,
});

export const getUserRecipesAction = () => ({
  type: GET_USER_RECIPES_REQUEST,
});

export const getUserRecipesSuccess = (userRecipes: IRecipe[]) => ({
  type: GET_USER_RECIPES_SUCCESS,
  userRecipes,
});

export const getSomeRecipesAction = (ammount: number) => ({
  type: GET_SOME_RECIPES_REQUEST,
  ammount,
});

export const getSomeRecipesSuccess = (recipes: IRecipe[]) => ({
  type: GET_SOME_RECIPES_SUCCESS,
  recipes,
});

export const getRecipeAction = (recipe_id: string) => ({
  type: GET_RECIPE_REQUEST,
  recipe_id,
});

export const getRecipeSuccess = (recipe: IRecipe) => ({
  type: GET_RECIPE_SUCCESS,
  recipe,
});

export const clearRecipesAction = () => ({
  type: CLEAR_RECIPES,
});
