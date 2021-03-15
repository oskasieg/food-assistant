import { UserReducerType, IUserReducerState } from "./types";
import {
  EDIT_USER_AVATAR_SUCCESS,
  GET_USER_PROFILE_SUCCESS,
  LOGOUT_USER_ACTION,
} from "./constants";

const initialState: IUserReducerState = {
  data: {
    _id: "",
    login: "",
    password: "",
    email: "",
    name: "",
    surname: "",
    avatar: "",
    age: 0,
    weight_kg: 0,
    height_cm: 0,
    gender: "",
    isVerified: false,
  },
  isLogged: false,
};

const userReducer = (state = initialState, action: UserReducerType) => {
  switch (action.type) {
    case GET_USER_PROFILE_SUCCESS: {
      return { data: action.user, isLogged: true };
    }

    case LOGOUT_USER_ACTION: {
      return { data: {}, isLogged: false };
    }

    case EDIT_USER_AVATAR_SUCCESS: {
      return { ...state, data: { ...state.data, avatar: action.avatar } };
    }

    default:
      return state;
  }
};

export default userReducer;
