import { call, put, takeLatest } from "redux-saga/effects";
import { getToken } from "../../utils/cookies";
import { forwardTo } from "../../utils/history";
import axios from "axios";
import {
  getRecipesByFiltersSuccess,
  getRecipesByNameAction,
  getRecipesByNameSuccess,
  getRecipeSuccess,
  getSomeRecipesSuccess,
  getUserRecipesAction,
  getUserRecipesSuccess,
} from "./actions";
import {
  ADD_RECIPE_BY_ID_REQUEST,
  ADD_RECIPE_REQUEST,
  EDIT_RECIPE_REQUEST,
  GET_RECIPES_BY_FILTERS_REQUEST,
  GET_RECIPES_BY_NAME_REQUEST,
  GET_RECIPE_REQUEST,
  GET_SOME_RECIPES_REQUEST,
  GET_USER_RECIPES_REQUEST,
  REMOVE_RECIPE_REQUEST,
  REMOVE_USER_RECIPE_REQUEST,
} from "./constants";
import {
  IAddRecipeAction,
  IAddRecipeByIdAction,
  IEditRecipeAction,
  IGetRecipeAction,
  IGetRecipesByFiltersAction,
  IGetRecipesByNameAction,
  IGetSomeRecipesAction,
  IRemoveRecipeAction,
  IRemoveUserRecipeAction,
  IStep,
} from "./types";
import showNotification from "../../utils/nottifications";

function* addRecipe(action: IAddRecipeAction) {
  try {
    const formData = new FormData();

    formData.append("user_id", action.recipe.user_id);
    formData.append("name", action.recipe.name);
    if (action.recipe.number_of_portions)
      formData.append(
        "number_of_portions",
        action.recipe.number_of_portions.toString()
      );
    formData.append("description", action.recipe.description);
    const stepNames = action.recipe.steps.map((step: IStep) => {
      if (step.image) {
        return { name: step.name, hasImage: true };
      } else {
        return { name: step.name, hasImage: false };
      }
    });
    formData.append("steps", JSON.stringify(stepNames));
    if (action.recipe.stepImages) {
      for (let i = 0; i < action.recipe.stepImages.length; i++) {
        if (action.recipe.stepImages[i]) {
          formData.append("step_images[]", action.recipe.stepImages[i]);
        }
      }
    }
    formData.append("products", JSON.stringify(action.recipe.products));
    formData.append("time_min", action.recipe.time_min.toString());
    if (action.recipe.image) {
      formData.append("image", action.recipe.image);
    }
    formData.append("type", action.recipe.type);

    const response = yield call(axios, "http://localhost:8001/user_recipe", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      data: formData,
    });

    if (response.status === 200) {
      showNotification("Sukces", "Dodano nowy przepis do profilu", "info");

      forwardTo("/profile/recipes");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* addRecipeById(action: IAddRecipeByIdAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_recipe/${action.id}`,
      { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      showNotification("Sukces", "Dodano nowy przepis do profilu", "info");

      yield put(getUserRecipesAction());
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* getUserRecipes() {
  try {
    const response = yield call(fetch, "http://localhost:8001/user_recipe", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getUserRecipesSuccess(json));
    }
  } catch (e) {
    console.log(e);
  }
}

function* getRecipe(action: IGetRecipeAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_recipe/${action.recipe_id}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getRecipeSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* removeUserRecipe(action: IRemoveUserRecipeAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_recipe/remove/${action.recipe_id}`,
      { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      showNotification(
        "Sukces",
        "Pomyślnie usunięto przepis z profilu",
        "info"
      );
      yield put(getUserRecipesAction());
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* editRecipe(action: IEditRecipeAction) {
  try {
    const formData = new FormData();
    formData.append("user_id", action.recipe.user_id);
    formData.append("name", action.recipe.name);
    if (action.recipe.number_of_portions)
      formData.append(
        "number_of_portions",
        action.recipe.number_of_portions.toString()
      );
    formData.append("description", action.recipe.description);
    const stepNames = action.recipe.steps.map((step: IStep) => {
      if (step.image && typeof step.image === "string") {
        return { name: step.name, image: step.image };
      } else if (step.image && typeof step.image !== "string")
        return { name: step.name, hasImage: true };
      else {
        return { name: step.name, hasImage: false };
      }
    });
    formData.append("steps", JSON.stringify(stepNames));
    if (action.recipe.stepImages) {
      for (let i = 0; i < action.recipe.stepImages.length; i++) {
        if (action.recipe.stepImages[i]) {
          formData.append("step_images[]", action.recipe.stepImages[i]);
        }
      }
    }
    formData.append("products", JSON.stringify(action.recipe.products));
    formData.append("time_min", action.recipe.time_min.toString());
    if (action.recipe.image) {
      formData.append("image", action.recipe.image);
    }
    formData.append("type", action.recipe.type);
    if (action.recipe.values) {
      formData.append("values", JSON.stringify(action.recipe.values));
    }
    if (action.recipe.number_of_portions) {
      formData.append(
        "number_of_portions",
        action.recipe.number_of_portions.toString()
      );
    }

    const response = yield call(
      axios,
      `http://localhost:8001/user_recipe/${action.recipe._id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        data: formData,
      }
    );

    if (response.status === 200) {
      showNotification("Sukces", "Pomyślnie edytowano przepis", "info");

      yield put(getUserRecipesAction());
      forwardTo("/profile/recipes");
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* getSomeRecipes(action: IGetSomeRecipesAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/user_recipe/some/${action.ammount}`,
      { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getSomeRecipesSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* getRecipesByName(action: IGetRecipesByNameAction) {
  try {
    const name = action.name === "" ? "all" : action.name;

    const response = yield call(
      fetch,
      `http://localhost:8001/recipe/search/${name}?skip=${action.skip}&limit=${action.limit}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      const json = yield response.json();

      yield put(getRecipesByNameSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* removeRecipe(action: IRemoveRecipeAction) {
  try {
    const response = yield call(
      fetch,
      `http://localhost:8001/recipe/remove/${action.id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }
    );

    if (response.status === 200) {
      showNotification("Sukces", "Pomyślnie usunięto przepis", "info");
      yield put(getRecipesByNameAction("", 0, 200));
    } else if (response.status === 500) {
      showNotification("Błąd", "Wystąpił problem po stronie serwera", "danger");
    }
  } catch (e) {
    showNotification("Błąd", "Nie udało połączyć się z serwerem", "danger");
  }
}

function* getRecipesByFilters(action: IGetRecipesByFiltersAction) {
  try {
    const options = {
      options: JSON.stringify(action.options),
    };
    const response = yield call(
      fetch,
      `http://localhost:8001/recipe/search?limit=${action.limit}&skip=${action.skip}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(options),
      }
    );

    if (response.status === 200) {
      const json = yield response.json();
      yield put(getRecipesByFiltersSuccess(json));
    }
  } catch (e) {
    console.error(e);
  }
}

function* mainSaga() {
  yield takeLatest(ADD_RECIPE_REQUEST, addRecipe);
  yield takeLatest(REMOVE_USER_RECIPE_REQUEST, removeUserRecipe);
  yield takeLatest(EDIT_RECIPE_REQUEST, editRecipe);
  yield takeLatest(GET_USER_RECIPES_REQUEST, getUserRecipes);
  yield takeLatest(GET_RECIPE_REQUEST, getRecipe);
  yield takeLatest(GET_SOME_RECIPES_REQUEST, getSomeRecipes);
  yield takeLatest(ADD_RECIPE_BY_ID_REQUEST, addRecipeById);
  yield takeLatest(GET_RECIPES_BY_NAME_REQUEST, getRecipesByName);
  yield takeLatest(GET_RECIPES_BY_FILTERS_REQUEST, getRecipesByFilters);
  yield takeLatest(REMOVE_RECIPE_REQUEST, removeRecipe);
}

export default mainSaga;
