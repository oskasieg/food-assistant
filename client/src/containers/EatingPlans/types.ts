import { IRecipeValues } from "../Recipes/types";
import { IProductValues } from "../Products/types";
import {
  ADD_EATING_PLAN_REQUEST,
  CHANGE_EATING_PLAN_DATE,
  CLEAR_EATING_PLAN,
  EDIT_EATING_PLAN_REQUEST,
  GET_EATING_PLAN_REQUEST,
  GET_EATING_PLAN_SUCCESS,
  SET_EATING_PLAN_DATE,
} from "./constants";

export interface IDish {
  current_values?: IProductValues;
  name: string;
  values: IProductValues | IRecipeValues;
  pieces: number;
  weight: number;
}

export interface IEatingPlan {
  _id?: string;
  user_id: string;
  date: Date;
  breakfast: IDish[];
  brunch: IDish[];
  dinner: IDish[];
  lunch: IDish[];
  supper: IDish[];
  water: number;
  waterRequired: number;
  values: IProductValues;
}

export interface IEatingPlansReducerState {
  eatingPlan: IEatingPlan;
  date: Date;
}

export interface ISetEatingPlanDate {
  type: typeof SET_EATING_PLAN_DATE;
  date: Date;
}

export interface IChangeEatingPlanDateAction {
  type: typeof CHANGE_EATING_PLAN_DATE;
  action: "plus" | "minus";
}

export interface IAddEatingPlanAction {
  type: typeof ADD_EATING_PLAN_REQUEST;
  eatingPlan: IEatingPlan;
}

export interface IEditEatingPlanRequest {
  type: typeof EDIT_EATING_PLAN_REQUEST;
  eatingPlan: IEatingPlan;
}

export interface IGetEatingPlanRequest {
  type: typeof GET_EATING_PLAN_REQUEST;
  date: Date;
}

export interface IGetEatingPlanSuccess {
  type: typeof GET_EATING_PLAN_SUCCESS;
  eatingPlan: IEatingPlan;
}

export interface IClearEatingPlanAction {
  type: typeof CLEAR_EATING_PLAN;
}

export type IEatingPlansReducerType =
  | IGetEatingPlanSuccess
  | IGetEatingPlanRequest
  | IChangeEatingPlanDateAction
  | ISetEatingPlanDate
  | IClearEatingPlanAction;
