import user from "../containers/User/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import userSaga from "../containers/User/saga";
import { IUserReducerState } from "../containers/User/types";
import { all } from "redux-saga/effects";
import { IProductReducerState } from "../containers/Products/types";
import products from "../containers/Products/reducer";
import productsSaga from "../containers/Products/saga";
import { IRecipesReducerState } from "../containers/Recipes/types";
import recipesSaga from "../containers/Recipes/saga";
import recipes from "../containers/Recipes/reducer";
import { IEatingPlansReducerState } from "../containers/EatingPlans/types";
import eatingPlans from "../containers/EatingPlans/reducer";
import eatingPlansSaga from "../containers/EatingPlans/saga";

export interface IStoreType {
  user: IUserReducerState;
  products: IProductReducerState;
  recipes: IRecipesReducerState;
  eatingPlans: IEatingPlansReducerState;
}

const configureStore = () => {
  function* rootSaga() {
    yield all([userSaga(), productsSaga(), recipesSaga(), eatingPlansSaga()]);
  }

  const combinedReducers = combineReducers({
    user,
    products,
    recipes,
    eatingPlans,
  });
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combinedReducers,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
