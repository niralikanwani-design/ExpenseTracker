import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleAuthWrapper from "../src/components/common/GoogleAuthProvider";

function App() {
  return (
    <GoogleAuthWrapper>
      <>
        <RouterProvider router={router} />

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </>
    </GoogleAuthWrapper>
  );
}

export default App;
