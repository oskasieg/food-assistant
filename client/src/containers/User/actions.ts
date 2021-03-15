import { IUserFormValues } from "../../components/UserForm/types";
import {
  EDIT_USER_AVATAR_REQUEST,
  EDIT_USER_AVATAR_SUCCESS,
  EDIT_USER_PROFILE_REQUEST,
  EDIT_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  LOGIN_USER_REQUST,
  LOGOUT_USER_ACTION,
  REGISTER_USER_REQUEST,
  SEND_NEW_VERIFICATION_MAIL,
  SIGN_IN_WITH_FACEBOOK_REQUEST,
  SIGN_IN_WITH_GOOGLE_REQUEST,
  SIGN_UP_WITH_FACEBOOK_REQUEST,
  SIGN_UP_WITH_GOOGLE_REQUEST,
} from "./constants";
import { IFacebookProfile, IUserProfile } from "./types";

export const registerUserAction = (
  email: string,
  login: string,
  password: string
) => ({
  type: REGISTER_USER_REQUEST,
  login,
  email,
  password,
});

export const loginUserAction = (login: string, password: string) => ({
  type: LOGIN_USER_REQUST,
  login,
  password,
});

export const getUserProfileAction = () => ({
  type: GET_USER_PROFILE_REQUEST,
});

export const getUserProfileSuccess = (user: IUserProfile) => ({
  type: GET_USER_PROFILE_SUCCESS,
  user,
});

export const logoutUserAction = () => ({
  type: LOGOUT_USER_ACTION,
});

export const editUserProfileAction = (
  data: IUserFormValues,
  user_id: string
) => ({
  type: EDIT_USER_PROFILE_REQUEST,
  user_id,
  data,
});

export const editUserProfileSuccess = (user: IUserProfile) => ({
  type: EDIT_USER_PROFILE_SUCCESS,
  user,
});

export const sendNewVerificationMailAction = (
  user_id: string,
  email: string
) => ({
  type: SEND_NEW_VERIFICATION_MAIL,
  email,
  user_id,
});

export const signUpWithGoogleAction = (access_token: string) => ({
  type: SIGN_UP_WITH_GOOGLE_REQUEST,
  access_token,
});

export const signInWithGoogleAction = (access_token: string) => ({
  type: SIGN_IN_WITH_GOOGLE_REQUEST,
  access_token,
});

export const signUpWithFacebookAction = (user: IFacebookProfile) => ({
  type: SIGN_UP_WITH_FACEBOOK_REQUEST,
  user,
});

export const signInWithFacebookAction = (facebookId: string) => ({
  type: SIGN_IN_WITH_FACEBOOK_REQUEST,
  facebookId,
});

export const editUserAvatarAction = (avatar: File) => ({
  type: EDIT_USER_AVATAR_REQUEST,
  avatar,
});

export const editUserAvatarSuccess = (avatar: string) => ({
  type: EDIT_USER_AVATAR_SUCCESS,
  avatar,
});
