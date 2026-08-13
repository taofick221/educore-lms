import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardPage from "../pages/dashboard/DashboardPage";
import MyCoursesPage from "../pages/dashboard/MyCoursesPage";

import CoursesPage from "../pages/courses/CoursesPage";
import CourseDetailsPage from "../pages/courses/CourseDetailsPage";

import CheckoutPage from "../pages/orders/CheckoutPage";
import OrdersPage from "../pages/orders/OrdersPage";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";

import LearningPage from "../pages/learning/LearningPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Home
      {
        index: true,
        element: <HomePage />,
      },

      // Public pages
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },

      // Protected pages
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },

          {
            path: "courses",
            element: <CoursesPage />,
          },

          {
            path: "courses/:slug",
            element: <CourseDetailsPage />,
          },

          {
            path: "checkout",
            element: <CheckoutPage />,
          },

          {
            path: "orders",
            element: <OrdersPage />,
          },

          {
            path: "orders/:orderId",
            element: <OrderDetailsPage />,
          },

          {
            path: "my-courses",
            element: <MyCoursesPage />,
          },

          {
            path: "learning/:enrollmentId",
            element: <LearningPage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
        ],
      },
    ],
  },
]);

export default router;