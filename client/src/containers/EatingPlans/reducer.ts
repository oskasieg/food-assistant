import {
  CHANGE_EATING_PLAN_DATE,
  CLEAR_EATING_PLAN,
  GET_EATING_PLAN_SUCCESS,
  SET_EATING_PLAN_DATE,
} from "./constants";
import { IEatingPlansReducerState, IEatingPlansReducerType } from "./types";

const initialState: IEatingPlansReducerState = {
  eatingPlan: {
    user_id: "",
    date: new Date(),
    breakfast: [],
    brunch: [],
    dinner: [],
    lunch: [],
    supper: [],
    water: 0,
    waterRequired: 0,
    values: {
      kcal: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0,
    },
  },
  date: new Date(),
};

const eatingPlanReducer = (
  state = initialState,
  action: IEatingPlansReducerType
) => {
  switch (action.type) {
    case SET_EATING_PLAN_DATE: {
      return { ...state, date: action.date };
    }
    case CHANGE_EATING_PLAN_DATE: {
      const newDate = new Date(state.date);
      if (action.action === "plus") {
        newDate.setDate(state.date.getDate() + 1);
      } else if (action.action === "minus") {
        newDate.setDate(state.date.getDate() - 1);
      } else {
        const date = new Date();
        newDate.setDate(date.getDate());
      }
      return {
        ...state,
        date: newDate,
      };
    }
    case GET_EATING_PLAN_SUCCESS: {
      return { ...state, eatingPlan: action.eatingPlan };
    }
    case CLEAR_EATING_PLAN: {
      return { ...state, eatingPlan: initialState.eatingPlan };
    }
    default:
      return state;
  }
};

export default eatingPlanReducer;
