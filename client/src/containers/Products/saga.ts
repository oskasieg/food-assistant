import { call, put, takeLatest } from "redux-saga/effects";
import { getToken } from "../../utils/cookies";
import {
  getEdamamProductsByNameSuccess,
  getProductsByFiltersSuccess,
  getProductsByNameAction,
  getProductsByNameSuccess,
  getSomeProductsSuccess,
  getUserProductsAction,
  getUserProductsSuccess,
} from "./actions";
import {
  ADD_PRODUCT_BY_ID,
  ADD_PRODUCT_REQUEST,
  GET_EDAMAM_PRODUCTS_BY_NAME_REQUEST,
  GET_PRODUCTS_BY_FILTERS_REQUEST,
  GET_PRODUCTS_BY_NAME_REQUEST,
  GET_SOME_PRODUCTS_REQUEST,
  GET_USER_PRODUCTS_REQUEST,
  REMOVE_PRODUCT_FROM_USER_REQUEST,
  REMOVE_PRODUCT_REQUEST,
} from "./constants";
import {
  IAddProductAction,
  IAddProductByIdAction,
  IgetEdamamProductsByNameAction,
  IGetProductsByFiltersAction,
  IGetProductsByNameAction,
  IGetSomeProductsAction,
  IRemoveProductAction,
  IremoveUserProductAction,
} from "./types";
import axios from "axios";
import showNotification from "../../utils/nottifications";
import { forwardTo } from "../../utils/history";

function* getEdamamProductsByname(action: IgetEdamamProductsByNameAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/edamam/${action.ingr}`,
      { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      const json = yield response.json();
      yield put(getEdamamProductsByNameSuccess(json));
    } else if (response.status === 400) {
      showNotification(
        "Błąd walidacji",
        "Nie podano nazwy produktu",
        "warning"
      );
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* addProduct(action: IAddProductAction) {
  try {
    const formData = new FormData();
    formData.append("name", action.product.name);
    if (action.product.type) formData.append("type", action.product.type);
    formData.append("values", JSON.stringify(action.product.values));
    if (action.product.image) formData.append("image", action.product.image);
    if (action.product.weight)
      formData.append("weight", action.product.weight.toString());

    const response = yield call(axios, "http://localhost:8001/user_product", {
      method: "POST",
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
      data: formData,
    });

    if (response.status === 200) {
      yield put(getUserProductsAction());
      showNotification("Sukces", "Dodano nowy produkt do profilu", "info");
      forwardTo("/profile/products");
    } else if (response.status === 400) {
      showNotification(
        "Błąd walidacji",
        "Nie podano wszystkich wartości",
        "warning"
      );
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* addProductById(action: IAddProductByIdAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_product/${action.id}`,
      { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      showNotification("Sukces", "Dodano nowy produkt do profilu", "info");

      yield put(getUserProductsAction());
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* removeProductFromUser(action: IremoveUserProductAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_product/${action.product_id}`,
      { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      showNotification(
        "Sukces",
        "Pomyślnie usunięto produkt z profilu",
        "info"
      );

      yield put(getUserProductsAction());
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* getUserProducts() {
  try {
    const token = getToken();

    const response = yield fetch(`http://localhost:8001/user_product/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getUserProductsSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* getSomeProducts(action: IGetSomeProductsAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_product/${action.ammount}`,
      { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getSomeProductsSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* getProductsByName(action: IGetProductsByNameAction) {
  try {
    const name = action.name === "" ? "all" : action.name;

    const response = yield call(
      fetch,
      `http://localhost:8001/product/search/${name}?limit=${action.limit}&skip=${action.skip}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      const json = yield response.json();
      yield put(getProductsByNameSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* removeProduct(action: IRemoveProductAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/product/${action.id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      showNotification("Sukces", "Pomyślnie usunięto produkt", "info");

      yield put(getProductsByNameAction("", 0, 200));
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* getProductsByFilters(action: IGetProductsByFiltersAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/product/search?limit=${action.limit}&skip=${action.skip}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ options: action.options }),
      }
    );

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getProductsByFiltersSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* mainSaga() {
  yield takeLatest(
    GET_EDAMAM_PRODUCTS_BY_NAME_REQUEST,
    getEdamamProductsByname
  );
  yield takeLatest(ADD_PRODUCT_REQUEST, addProduct);
  yield takeLatest(REMOVE_PRODUCT_FROM_USER_REQUEST, removeProductFromUser);
  yield takeLatest(GET_USER_PRODUCTS_REQUEST, getUserProducts);
  yield takeLatest(GET_SOME_PRODUCTS_REQUEST, getSomeProducts);
  yield takeLatest(ADD_PRODUCT_BY_ID, addProductById);
  yield takeLatest(GET_PRODUCTS_BY_NAME_REQUEST, getProductsByName);
  yield takeLatest(REMOVE_PRODUCT_REQUEST, removeProduct);
  yield takeLatest(GET_PRODUCTS_BY_FILTERS_REQUEST, getProductsByFilters);
}

export default mainSaga;
