import {
  CLEAR_RECIPES,
  GET_RECIPES_BY_FILTERS_SUCCESS,
  GET_RECIPES_BY_NAME_SUCCESS,
  GET_RECIPE_SUCCESS,
  GET_SOME_RECIPES_SUCCESS,
  GET_USER_RECIPES_SUCCESS,
} from "./constants";
import { IRecipesReducerState, RecipesReducerType } from "./types";

const initialState: IRecipesReducerState = {
  userRecipes: [],
  recipe: {
    name: "",
    description: "",
    time_min: 0,
    steps: [],
    products: [],
    user_id: "",
    type: "",
  },
  recipes: [],
};

const recipesReducer = (state = initialState, action: RecipesReducerType) => {
  switch (action.type) {
    case GET_USER_RECIPES_SUCCESS: {
      return { ...state, userRecipes: action.userRecipes };
    }
    case GET_RECIPE_SUCCESS: {
      return { ...state, recipe: action.recipe };
    }
    case GET_SOME_RECIPES_SUCCESS: {
      return { ...state, recipes: action.recipes };
    }
    case GET_RECIPES_BY_NAME_SUCCESS: {
      return { ...state, recipes: [...state.recipes, ...action.recipes] };
    }
    case GET_RECIPES_BY_FILTERS_SUCCESS: {
      return { ...state, recipes: [...state.recipes, ...action.recipes] };
    }
    case CLEAR_RECIPES: {
      return { ...state, recipes: [] };
    }
    default:
      return state;
  }
};

export default recipesReducer;
