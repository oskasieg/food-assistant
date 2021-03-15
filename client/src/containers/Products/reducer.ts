import {
  CLEAR_PRODUCTS,
  CLEAR_SUGGESTED_PRODUCTS,
  GET_EDAMAM_PRODUCTS_BY_NAME_SUCCESS,
  GET_PRODUCTS_BY_FILTERS_SUCCESS,
  GET_PRODUCTS_BY_NAME_SUCCESS,
  GET_SOME_PRODUCTS_SUCCESS,
  GET_USER_PRODUCTS_SUCCESS,
} from "./constants";
import { IProductReducerState, ProductReducerType } from "./types";

const initialValue: IProductReducerState = {
  suggestedProducts: [],
  userProducts: [],
  products: [],
};

const productReducer = (state = initialValue, action: ProductReducerType) => {
  switch (action.type) {
    case GET_EDAMAM_PRODUCTS_BY_NAME_SUCCESS: {
      return { ...state, suggestedProducts: action.products };
    }
    case CLEAR_SUGGESTED_PRODUCTS: {
      return { ...state, suggestedProducts: [] };
    }
    case GET_USER_PRODUCTS_SUCCESS: {
      return { ...state, userProducts: action.products };
    }
    case GET_SOME_PRODUCTS_SUCCESS: {
      return { ...state, products: action.products };
    }
    case GET_PRODUCTS_BY_NAME_SUCCESS: {
      return { ...state, products: [...state.products, ...action.products] };
    }
    case GET_PRODUCTS_BY_FILTERS_SUCCESS: {
      return { ...state, products: [...state.products, ...action.products] };
    }
    case CLEAR_PRODUCTS: {
      return { ...state, products: [] };
    }
    default:
      return state;
  }
};

export default productReducer;
