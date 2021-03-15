import { IFiltersOptions } from "../../components/AdvancedSearchBar/types";
import {
  ADD_PRODUCT_BY_ID,
  ADD_PRODUCT_REQUEST,
  CLEAR_PRODUCTS,
  CLEAR_SUGGESTED_PRODUCTS,
  GET_EDAMAM_PRODUCTS_BY_NAME_REQUEST,
  GET_EDAMAM_PRODUCTS_BY_NAME_SUCCESS,
  GET_PRODUCTS_BY_FILTERS_REQUEST,
  GET_PRODUCTS_BY_FILTERS_SUCCESS,
  GET_PRODUCTS_BY_NAME_REQUEST,
  GET_PRODUCTS_BY_NAME_SUCCESS,
  GET_SOME_PRODUCTS_REQUEST,
  GET_SOME_PRODUCTS_SUCCESS,
  GET_USER_PRODUCTS_REQUEST,
  GET_USER_PRODUCTS_SUCCESS,
  REMOVE_PRODUCT_FROM_USER_REQUEST,
  REMOVE_PRODUCT_REQUEST,
} from "./constants";
import { IProduct } from "./types";

export const getEdamamProductsByNameAction = (ingr: string) => ({
  type: GET_EDAMAM_PRODUCTS_BY_NAME_REQUEST,
  ingr,
});

export const getEdamamProductsByNameSuccess = (products: IProduct[]) => ({
  type: GET_EDAMAM_PRODUCTS_BY_NAME_SUCCESS,
  products,
});

export const clearSuggestedProducts = () => ({
  type: CLEAR_SUGGESTED_PRODUCTS,
});

export const addProductAction = (product: IProduct) => ({
  type: ADD_PRODUCT_REQUEST,
  product,
});

export const addProductByIdAction = (id: string) => ({
  type: ADD_PRODUCT_BY_ID,
  id,
});

export const removeUserProductAction = (product_id: string) => ({
  type: REMOVE_PRODUCT_FROM_USER_REQUEST,
  product_id,
});

export const getUserProductsAction = () => ({
  type: GET_USER_PRODUCTS_REQUEST,
});

export const getUserProductsSuccess = (products: IProduct[]) => ({
  type: GET_USER_PRODUCTS_SUCCESS,
  products,
});

export const getProductsByNameAction = (
  name: string,
  skip: number,
  limit: number
) => ({
  type: GET_PRODUCTS_BY_NAME_REQUEST,
  name,
  skip,
  limit,
});

export const getProductsByNameSuccess = (products: IProduct[]) => ({
  type: GET_PRODUCTS_BY_NAME_SUCCESS,
  products,
});

export const getProductsByFiltersAction = (
  options: IFiltersOptions,
  skip: number,
  limit: number
) => ({
  type: GET_PRODUCTS_BY_FILTERS_REQUEST,
  options,
  skip,
  limit,
});

export const getProductsByFiltersSuccess = (products: IProduct[]) => ({
  type: GET_PRODUCTS_BY_FILTERS_SUCCESS,
  products,
});

export const getSomeProductsAction = (ammount: number) => ({
  type: GET_SOME_PRODUCTS_REQUEST,
  ammount,
});

export const getSomeProductsSuccess = (products: IProduct[]) => ({
  type: GET_SOME_PRODUCTS_SUCCESS,
  products,
});

export const removeProductAction = (id: string) => ({
  type: REMOVE_PRODUCT_REQUEST,
  id,
});

export const clearProductsAction = () => ({
  type: CLEAR_PRODUCTS,
});
