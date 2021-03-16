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

export interface IProductValues {
  kcal: number;
  carbohydrates: number;
  protein: number;
  fat: number;
}

export interface IProduct {
  _id?: string;
  name: string;
  original_name?: string;
  user_id?: string;
  unit?: "grams" | "pieces";
  pieces?: number;
  weight?: number;
  values?: IProductValues;
  values_per_100?: IProductValues;
  current_values?: IProductValues;
  createdAt?: Date;
  image?: File | string;
  type?:
    | "fruit"
    | "vegetable"
    | "packaged"
    | "sweets"
    | "dairy"
    | "bread"
    | "meat"
    | "other"
    | "";
}

export interface IProductReducerState {
  suggestedProducts: IProduct[];
  userProducts: IProduct[];
  products: IProduct[];
}

export interface IgetEdamamProductsByNameAction {
  type: typeof GET_EDAMAM_PRODUCTS_BY_NAME_REQUEST;
  ingr: string;
}

export interface IGetEdemamProductByNameSuccess {
  type: typeof GET_EDAMAM_PRODUCTS_BY_NAME_SUCCESS;
  products: IProduct;
}

export interface IClearSuggestedProducts {
  type: typeof CLEAR_SUGGESTED_PRODUCTS;
}

export interface IAddProductAction {
  type: typeof ADD_PRODUCT_REQUEST;
  product: IProduct;
}

export interface IAddProductByIdAction {
  type: typeof ADD_PRODUCT_BY_ID;
  id: string;
}

export interface IremoveUserProductAction {
  type: typeof REMOVE_PRODUCT_FROM_USER_REQUEST;
  product_id: string;
}

export interface IGetUserProductsAction {
  type: typeof GET_USER_PRODUCTS_REQUEST;
}

export interface IGetUserProductsSuccess {
  type: typeof GET_USER_PRODUCTS_SUCCESS;
  products: IProduct[];
}

export interface IGetSomeProductsAction {
  type: typeof GET_SOME_PRODUCTS_REQUEST;
  ammount: number;
}

export interface IGetSomeProductsSuccess {
  type: typeof GET_SOME_PRODUCTS_SUCCESS;
  products: IProduct[];
}

export interface IGetProductsByNameAction {
  type: typeof GET_PRODUCTS_BY_NAME_REQUEST;
  name: string;
  skip: number;
  limit: number;
}

export interface IGetProductsByNameSuccess {
  type: typeof GET_PRODUCTS_BY_NAME_SUCCESS;
  products: IProduct[];
}

export interface IRemoveProductAction {
  type: typeof REMOVE_PRODUCT_REQUEST;
  id: string;
}

export interface IGetProductsByFiltersAction {
  type: typeof GET_PRODUCTS_BY_FILTERS_REQUEST;
  options: IFiltersOptions;
  skip: number;
  limit: number;
}

export interface IGetProductsByFiltersSuccess {
  type: typeof GET_PRODUCTS_BY_FILTERS_SUCCESS;
  products: IProduct[];
}

export interface IClearProductAction {
  type: typeof CLEAR_PRODUCTS;
}

export type ProductReducerType =
  | IGetEdemamProductByNameSuccess
  | IClearSuggestedProducts
  | IGetUserProductsSuccess
  | IGetSomeProductsSuccess
  | IGetProductsByNameSuccess
  | IGetProductsByFiltersSuccess
  | IClearProductAction;
