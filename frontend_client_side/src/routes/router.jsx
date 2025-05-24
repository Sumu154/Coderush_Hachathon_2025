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
import AddServiceForm from "../components/servicesComponents/AddServiceForm";
import AddServicePage from "../pages/AddServicePage";
import ServicePaymentPage from "../pages/ServicePaymentPage";
import ServicePage from "../pages/ServicePage";
import MessagesPage from "../pages/MessagesPage";
import FeedbackPage from "../pages/FeedbackPage";
import ServiceDetailsPage from "../pages/ServiceDetailsPage";
import UsersPage from "../pages/UsersPage";



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
        element: <ServicePage />
      },
      {
        path: "/chat",
        element: <MessagesPage></MessagesPage>
      },
      {
        path: "/addServices",
        element: <AddServicePage></AddServicePage>
      },
      {
        path: "/services/:id/payment",
        element: <PrivateRoute> <ServicePaymentPage></ServicePaymentPage>  </PrivateRoute>,
        loader: ({ params }) => {
          return params.id;
        }
      },
      {
        path: "/add-item",
        element: <AddItemPage />
      },
      // {
      //   path: "/servicePage",
      //   element: 
      // },
      {
        path: "/services/:id",
        element: <ServiceDetailsPage />
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
      },
      {
        path: "/dashboard/feedbacks",
        element: <PrivateRoute> <FeedbackPage></FeedbackPage> </PrivateRoute>
      },
      {
        path: "/dashboard/users",
        element: <PrivateRoute> <UsersPage></UsersPage> </PrivateRoute>
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
