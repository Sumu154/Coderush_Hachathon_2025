import { createBrowserRouter } from "react-router-dom";


import PrivateRoute from "./PrivateRoutes";


// layout import
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";



// pages import
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
<<<<<<< Updated upstream
import AddItemPage from "../pages/AddItemPage";
=======
import ProfilePage from "../pages/ProfilePage";
>>>>>>> Stashed changes









const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>
      },
      {
        path: "/add-item",
        element: <AddItemPage />
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: '/auth/login',
        element: <LoginPage></LoginPage>
      },
      {
        path: '/auth/register',
        element: <RegisterPage></RegisterPage>
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute> <DashboardLayout></DashboardLayout> </PrivateRoute>,
    children: [
      {
        path: "/dashboard", 
        element: <PrivateRoute> <ProfilePage></ProfilePage> </PrivateRoute>
      },
      // for student
      
      
    ]
  },
  // {
  //   path: '*',
  //   element: <Error></Error>
  // },
]);

export default router;