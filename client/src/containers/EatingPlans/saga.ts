import { call, put, takeLatest } from "redux-saga/effects";
import { getToken } from "../../utils/cookies";
import { forwardTo } from "../../utils/history";
import showNotification from "../../utils/nottifications";
import {
  clearEatingPlanAction,
  getEatingPlanAction,
  getEatingPlanSuccess,
} from "./actions";
import {
  ADD_EATING_PLAN_REQUEST,
  EDIT_EATING_PLAN_REQUEST,
  GET_EATING_PLAN_REQUEST,
} from "./constants";
import {
  IAddEatingPlanAction,
  IEditEatingPlanRequest,
  IGetEatingPlanRequest,
} from "./types";

function* addEatingPlan(action: IAddEatingPlanAction) {
  try {
    const response = yield call(fetch, "http://localhost:8001/eating_plan", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(action.eatingPlan),
    });

    if (response.status === 200) {
      yield put(getEatingPlanAction(action.eatingPlan.date));
      showNotification("Sukces", "Utworzono nowy plan jedzenia", "info");
      forwardTo("/eatingPlan");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* getEatingPlan(action: IGetEatingPlanRequest) {
  try {
    const date = new Date(action.date);
    const paramDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    const response = yield call(
      fetch,
      `http://localhost:8001/eating_plan/${paramDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (response.status === 200) {
      const json = yield response.json();
      yield put(getEatingPlanSuccess(json));
    } else if (response.status === 201) {
      yield put(clearEatingPlanAction());
    }
  } catch (e) {
    console.error(e);
  }
}

function* editEatingPlan(action: IEditEatingPlanRequest) {
  const date = new Date(action.eatingPlan.date);

  const paramDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/eating_plan/${paramDate}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(action.eatingPlan),
      }
    );

    if (response.status === 200) {
      yield put(getEatingPlanAction(action.eatingPlan.date));
      showNotification("Sukces", "Pomyślnie edytowano plan jedzenia", "info");
      forwardTo("/eatingPlan");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* mainSaga() {
  yield takeLatest(ADD_EATING_PLAN_REQUEST, addEatingPlan);
  yield takeLatest(GET_EATING_PLAN_REQUEST, getEatingPlan);
  yield takeLatest(EDIT_EATING_PLAN_REQUEST, editEatingPlan);
}

export default mainSaga;
