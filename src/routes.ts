
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const AuthLayout = lazy(() => import("./components/AuthLayout"));
const Dashboard  = lazy(() => import("./pages/Dashboard"));
const ExpenseList  =  lazy(() => import("./pages/ExpenseList"));

const router = createBrowserRouter([
  {
    path: "/Auth",
    Component: AuthLayout,
    children: [
      { index: true, Component: SignIn },
      { path: "signIn", Component: SignIn },
      { path: "signUp", Component: SignUp }
    ],
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "expenses", Component: ExpenseList }
    ],
  },
  {
    path: "*", 
    Component: MainLayout, 
    children: [
        { path: "*", Component: Dashboard}
    ]
  }
]);

export default router;