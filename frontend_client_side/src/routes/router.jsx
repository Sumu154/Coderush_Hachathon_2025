import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./PrivateRoutes";

// layout imports
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// page imports
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import AddItemPage from "../pages/AddItemPage";
import ProfilePage from "../pages/ProfilePage";
import Services from "../pages/Services";
import AddServiceForm from "../components/servicesComponents/AddServiceForm";
import AddServicePage from "../pages/AddServicePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/services",
        element: <Services></Services>
      },
      {
        path: "/addServices",
        element: <AddServicePage></AddServicePage>
      },
      {
        path: "/add-item",
        element: <AddItemPage />
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/login',
        element: <LoginPage />
      },
      {
        path: '/auth/register',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: "/dashboard",
        element: <ProfilePage />
      }
    ]
  },
  // Uncomment this for 404 page support
  // {
  //   path: '*',
  //   element: <ErrorPage />
  // },
]);

export default router;
