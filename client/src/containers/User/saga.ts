import {
  EDIT_USER_AVATAR_REQUEST,
  EDIT_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_REQUEST,
  LOGIN_USER_REQUST,
  REGISTER_USER_REQUEST,
  SEND_NEW_VERIFICATION_MAIL,
  SIGN_IN_WITH_FACEBOOK_REQUEST,
  SIGN_IN_WITH_GOOGLE_REQUEST,
  SIGN_UP_WITH_FACEBOOK_REQUEST,
  SIGN_UP_WITH_GOOGLE_REQUEST,
} from "./constants";
import { takeLatest, call, put } from "redux-saga/effects";
import { getToken, setToken } from "../../utils/cookies";
import axios from "axios";
import {
  editUserAvatarSuccess,
  editUserProfileSuccess,
  getUserProfileSuccess,
} from "./actions";
import {
  IEditUserAvatarAction,
  IEditUserProfileAction,
  IGetUserProfileAction,
  ILoginUserAction,
  IRegisterUserAction,
  ISendNewVerificationMailAction,
  ISignInWithFacebookAction,
  ISignInWithGoogleAction,
  ISignUpWithFacebookAction,
  ISignUpWithGoogleAction,
} from "./types";
import { forwardTo } from "../../utils/history";
import showNotification from "../../utils/nottifications";

function* getUserProfile(action: IGetUserProfileAction) {
  try {
    const response = yield call(fetch, `http://localhost:8001/user/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const json = yield response.json();

    if (response.status === 200) {
      yield put(getUserProfileSuccess(json.user));
    } else {
      throw new Error(json.message);
    }
  } catch (e) {
    console.error(e);
  }
}

function* registerUser(action: IRegisterUserAction) {
  try {
    const body = {
      email: action.email,
      login: action.login,
      password: action.password,
    };

    const response = yield call(fetch, "http://localhost:8001/user/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const json = yield response.json();

      showNotification(
        "Konto utworzone",
        "Aby w pełni korzystać z konta zweryfikuj adres email.",
        "info"
      );

      setToken(json.token, json.user._id);
      yield put(getUserProfileSuccess(json.user));
      yield call(forwardTo, "/");
    } else if (response.status === 400) {
      showNotification("Błąd", "Nie wprowadzono wszystkich danych", "warning");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* loginUser(action: ILoginUserAction) {
  try {
    const body = { login: action.login, password: action.password };

    const response = yield call(fetch, "http://localhost:8001/user/login", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const json = yield response.json();
      yield put(getUserProfileSuccess(json));

      showNotification(
        "Zalogowano",
        `Witaj ponownie ${json.user.login}.`,
        "info"
      );

      setToken(json.token, json.user._id);
      yield call(forwardTo, "/profile");
    } else if (response.status === 400) {
      showNotification("Błąd", "Nie wprowadzono wszystkich danych", "warning");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* editUser(action: IEditUserProfileAction) {
  try {
    const response = yield call(fetch, `http://localhost:8001/user/profile/`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(action.data),
    });

    if (response.status === 200) {
      const json = yield response.json();

      showNotification("Sukces", `Profil został zaaktualizowany`, "info");

      yield put(editUserProfileSuccess(json));
      forwardTo("/profile");
    } else if (response.status === 400) {
      showNotification("Błąd", "Nie wprowadzono wszystkich danych", "warning");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* sendNewVerificationMail(action: ISendNewVerificationMailAction) {
  const body = { user_id: action.user_id, email: action.email };

  try {
    const response = yield call(
      fetch,
      "http://localhost:8001/user/register/mail",
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 200) {
      showNotification("Sukces", `Link weryfikujący wysłany ponownie`, "info");

      yield call(forwardTo, "/");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* signUpWithGoogle(action: ISignUpWithGoogleAction) {
  try {
    const googleProfile = yield call(
      fetch,
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${action.access_token}`
    );

    const googleProfileJson = yield googleProfile.json();
    const body = {
      email: googleProfileJson.email,
      name: googleProfileJson.given_name,
      surname: googleProfileJson.family_name,
      googleId: googleProfileJson.id,
      avatar: googleProfileJson.picture ? googleProfileJson.picture : undefined,
    };

    const response = yield call(
      fetch,
      "http://localhost:8001/user/register/google",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 200) {
      const json = yield response.json();

      setToken(json.token, json.user._id);
      yield put(getUserProfileSuccess(json.user));

      showNotification(
        "Zarejestrowano",
        `Uzupełnij swoje dane aby kontynuować`,
        "info"
      );

      yield call(forwardTo, "/profile");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* signInWithGoogle(action: ISignInWithGoogleAction) {
  try {
    const googleProfile = yield call(
      fetch,
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${action.access_token}`
    );

    const googleProfileJson = yield googleProfile.json();

    const response = yield call(
      fetch,
      "http://localhost:8001/user/login/google",
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ googleId: googleProfileJson.id }),
      }
    );

    if (response.status === 200) {
      const json = yield response.json();

      setToken(json.token, json.user._id);

      showNotification(
        "Zalogowano",
        `Witaj ponownie ${json.user.login}`,
        "info"
      );

      yield put(getUserProfileSuccess(json.user));
      yield call(forwardTo, "/profile");
    } else if (response.status === 400) {
      showNotification(
        "Błąd autoryzacji",
        "Użytkownik nie istnieje",
        "warning"
      );
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* signUpWithFacebook(action: ISignUpWithFacebookAction) {
  try {
    const response = yield call(
      fetch,
      "http://localhost:8001/user/register/facebook",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(action.user),
      }
    );

    if (response.status === 200) {
      const json = yield response.json();

      setToken(json.token, json.user._id);

      showNotification(
        "Zarejestrowano",
        `Uzupełnij swoje dane aby kontynuować`,
        "info"
      );

      yield put(getUserProfileSuccess(json.user));

      yield call(forwardTo, "/profile");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* signInWithFacebook(action: ISignInWithFacebookAction) {
  try {
    const response = yield call(
      fetch,
      "http://localhost:8001/user/login/facebook",
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ facebookId: action.facebookId }),
      }
    );

    if (response.status === 200) {
      const json = yield response.json();

      showNotification(
        "Zalogowano",
        `Witaj ponownie ${json.user.login}`,
        "info"
      );

      setToken(json.token, json.user._id);

      yield call(forwardTo, "/profile");
    } else if (response.status === 400) {
      showNotification(
        "Błąd autoryzacji",
        "Użytkownik nie istnieje",
        "warning"
      );
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* editUserAvatar(action: IEditUserAvatarAction) {
  try {
    const formData = new FormData();
    formData.append("avatar", action.avatar);
    const response = yield call(
      axios,
      "http://localhost:8001/user/profile/avatar",
      {
        method: "PUT",
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
        data: formData,
      }
    );

    if (response.status === 200) {
      showNotification("Sukces", "Pomyślnie zmieniono avatar", "info");
      yield put(editUserAvatarSuccess(response.data.avatar));
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    console.error(e);
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* mainSaga() {
  yield takeLatest(GET_USER_PROFILE_REQUEST, getUserProfile);
  yield takeLatest(REGISTER_USER_REQUEST, registerUser);
  yield takeLatest(LOGIN_USER_REQUST, loginUser);
  yield takeLatest(EDIT_USER_PROFILE_REQUEST, editUser);
  yield takeLatest(SEND_NEW_VERIFICATION_MAIL, sendNewVerificationMail);
  yield takeLatest(SIGN_UP_WITH_GOOGLE_REQUEST, signUpWithGoogle);
  yield takeLatest(SIGN_IN_WITH_GOOGLE_REQUEST, signInWithGoogle);
  yield takeLatest(SIGN_UP_WITH_FACEBOOK_REQUEST, signUpWithFacebook);
  yield takeLatest(SIGN_IN_WITH_FACEBOOK_REQUEST, signInWithFacebook);
  yield takeLatest(EDIT_USER_AVATAR_REQUEST, editUserAvatar);
}

export default mainSaga;
