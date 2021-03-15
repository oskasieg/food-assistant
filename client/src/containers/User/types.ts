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

export interface IUserProfile {
  _id: string;
  email: string;
  login: string;
  password: string;
  avatar: string;
  name: string;
  surname: string;
  age: number;
  gender: string;
  weight_kg: number;
  height_cm: number;
  isVerified: boolean;
  googleId?: string;
  facebookId?: string;
}

export interface IFacebookProfile {
  email: string;
  name: string;
  surname: string;
  avatar: string;
  facebookId: string;
}

export interface IUserReducerState {
  data: IUserProfile;
  isLogged: boolean;
}

export interface IRegisterUserAction {
  type: typeof REGISTER_USER_REQUEST;
  email: string;
  login: string;
  password: string;
}

export interface ILoginUserAction {
  type: typeof LOGIN_USER_REQUST;
  login: string;
  password: string;
}

export interface IGetUserProfileAction {
  type: typeof GET_USER_PROFILE_REQUEST;
}

export interface IGetUserProfileSuccess {
  type: typeof GET_USER_PROFILE_SUCCESS;
  user: IUserProfile;
}

export interface ILogoutUserAction {
  type: typeof LOGOUT_USER_ACTION;
}

export interface IEditUserProfileAction {
  type: typeof EDIT_USER_PROFILE_REQUEST;
  data: IUserFormValues;
}

export interface IEditUserProfileSuccess {
  type: typeof EDIT_USER_PROFILE_SUCCESS;
  user: IUserProfile;
}

export interface ISendNewVerificationMailAction {
  type: typeof SEND_NEW_VERIFICATION_MAIL;
  email: string;
  user_id: string;
}

export interface ISignUpWithGoogleAction {
  type: typeof SIGN_UP_WITH_GOOGLE_REQUEST;
  access_token: string;
}

export interface ISignInWithGoogleAction {
  type: typeof SIGN_IN_WITH_GOOGLE_REQUEST;
  access_token: string;
}

export interface ISignUpWithFacebookAction {
  type: typeof SIGN_UP_WITH_FACEBOOK_REQUEST;
  user: IFacebookProfile;
}

export interface ISignInWithFacebookAction {
  type: typeof SIGN_IN_WITH_FACEBOOK_REQUEST;
  facebookId: string;
}

export interface IEditUserAvatarAction {
  type: typeof EDIT_USER_AVATAR_REQUEST;
  avatar: File;
}

export interface IEditUserAvatarSuccess {
  type: typeof EDIT_USER_AVATAR_SUCCESS;
  avatar: string;
}

export type UserReducerType =
  | IGetUserProfileSuccess
  | ILogoutUserAction
  | IEditUserProfileSuccess
  | IEditUserAvatarSuccess;
