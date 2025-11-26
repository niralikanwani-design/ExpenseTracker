
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const AuthLayout = lazy(() => import("./components/AuthLayout"));
const Dashboard  = lazy(() => import("./pages/Dashboard"));
const ExpenseList  =  lazy(() => import("./pages/ExpenseList"));
const AddExpense = lazy(() => import("./components/Expense/AddExpense"));
const AddIncome = lazy(() => import("./components/Expense/AddIncome"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: SignIn },
      { path: "signIn", Component: SignIn },
      { path: "signUp", Component: SignUp }
    ],
  },
  {
    path: "/Dashboard",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
    ],
  },
  {
    path: "/Expenses",
    Component: MainLayout,
    children: [
      { index: true, Component: ExpenseList },
      { path: "addExpense", Component: AddExpense },
      { path: "addIncome", Component: AddIncome }
    ],
  },
  {
    path: "*", 
    Component: AuthLayout, 
    children: [
        { index: true, Component: SignIn }
    ]
  }
]);

export default router;