import React from "react";
import { useDispatch } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import MainPage from "./components/MainPage/MainPage";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import UserForm from "./components/UserForm/UserForm";
import { getUserProfileAction } from "./containers/User/actions";
import User from "./containers/User/User";
import { getTokenUser } from "./utils/cookies";
import history from "./utils/history";
import Products from "./containers/Products/Products";
import Recipes from "./containers/Recipes/Recipes";
import AddRecipeForm from "./components/AddRecipeForm/AddRecipeForm";
import Recipe from "./components/Recipe/Recipe";
import EatingPlanForm from "./components/EatingPlanForm/EatingPlanForm";
import EatingPlans from "./containers/EatingPlans/EatingPlans";
import AdminPanel from "./containers/AdminPanel/AdminPanel";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import "animate.css/animate.min.css";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import "./styles/typography.css";

const App = () => {
  const dispatcher = useDispatch();

  const tokenExist = getTokenUser();
  if (tokenExist) {
    dispatcher(getUserProfileAction());
  }

  return (
    <Router history={history}>
      <ReactNotification />
      <Header />
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/login" component={LoginForm} />
        <Route exact path="/register" component={RegisterForm} />
        <Route path="/register/:user_id/:token" component={User} />
        <Route exact path="/profile" component={User} />
        <Route path="/profile/edit" render={() => <UserForm type="edit" />} />
        <Route path="/profile/products" component={Products} />
        <Route exact path="/profile/recipes" component={Recipes} />
        <Route path="/profile/recipe/add" component={AddRecipeForm} />
        <Route path="/profile/product/add" component={AddProductForm} />
        <Route
          path="/profile/recipe/edit/:recipe_id"
          component={AddRecipeForm}
        />
        <Route path="/recipe/:recipe_id" component={Recipe} />
        <Route exact path="/eatingPlan" component={EatingPlans} />
        <Route path="/eatingplan/edit/:date/:dish" component={EatingPlanForm} />
        <Route path="/profile/admin" component={AdminPanel} />
      </Switch>
    </Router>
  );
};

export default App;
