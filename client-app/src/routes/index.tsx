import { createBrowserRouter } from "react-router-dom";
import Layout from "../presentation/Layout";
import ErrorPage from "../error-page";
import Tasks from "../presentation/pages/Tasks";
import Login from "../presentation/pages/Login";
import Signup from "../presentation/pages/Signup";
import ProtectedRoute from "../ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
