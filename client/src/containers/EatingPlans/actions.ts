import {
  ADD_EATING_PLAN_REQUEST,
  CHANGE_EATING_PLAN_DATE,
  CLEAR_EATING_PLAN,
  EDIT_EATING_PLAN_REQUEST,
  GET_EATING_PLAN_REQUEST,
  GET_EATING_PLAN_SUCCESS,
  SET_EATING_PLAN_DATE,
} from "./constants";
import { IEatingPlan } from "./types";

export const changeEatingPlanDateAction = (action: string) => ({
  type: CHANGE_EATING_PLAN_DATE,
  action,
});

export const setEatingPlanDateAction = (date: Date) => ({
  type: SET_EATING_PLAN_DATE,
  date,
});

export const addEatingPlanAction = (eatingPlan: IEatingPlan) => ({
  type: ADD_EATING_PLAN_REQUEST,
  eatingPlan,
});

export const editEatingPlanAction = (eatingPlan: IEatingPlan) => ({
  type: EDIT_EATING_PLAN_REQUEST,
  eatingPlan,
});

export const getEatingPlanAction = (date: Date) => ({
  type: GET_EATING_PLAN_REQUEST,
  date,
});

export const getEatingPlanSuccess = (eatingPlan: IEatingPlan) => ({
  type: GET_EATING_PLAN_SUCCESS,
  eatingPlan,
});

export const clearEatingPlanAction = () => ({
  type: CLEAR_EATING_PLAN,
});
