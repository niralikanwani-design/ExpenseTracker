
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const AuthLayout = lazy(() => import("./components/AuthLayout"));
const Dashboard  = lazy(() => import("./pages/Dashboard"));
const TransactionList  =  lazy(() => import("./pages/TransactionList"));
const AddUpdateTransaction = lazy(() => import("./components/Transaction/AddUpdateTransaction"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

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
    path: "/Transactions",
    Component: MainLayout,
    children: [
      { index: true, Component: TransactionList },
      { path: "Add", Component: AddUpdateTransaction },
      { path: "Update/:id", Component: AddUpdateTransaction }
    ],
  },
  {
    path: "*", 
    Component: AuthLayout, 
    children: [
        { index: true, Component: SignIn }
    ]
  },
  {
    path: "/EditProfile",
    Component: MainLayout,
    children: [
      { path: ":id", Component: EditProfile },
    ],
  },  
  {
    path: "/ChangePassword",
    Component: MainLayout,
    children: [
      { index: true, Component: ChangePassword },
    ],
  },
]);

export default router;