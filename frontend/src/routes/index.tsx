import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

// ==========================================================
// Public pages
// ==========================================================

import HomePage from "../pages/home/HomePage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// ==========================================================
// Dashboard
// ==========================================================

import DashboardPage from "../pages/dashboard/DashboardPage";
import MyCoursesPage from "../pages/dashboard/MyCoursesPage";
import ProfilePage from "../pages/dashboard/ProfilePage";

// ==========================================================
// Courses
// ==========================================================

import CoursesPage from "../pages/courses/CoursesPage";
import CourseDetailsPage from "../pages/courses/CourseDetailsPage";

// ==========================================================
// Orders
// ==========================================================

import CheckoutPage from "../pages/orders/CheckoutPage";
import OrdersPage from "../pages/orders/OrdersPage";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";

// ==========================================================
// Learning
// ==========================================================

import LearningPage from "../pages/learning/LearningPage";
import QuizPage from "../pages/learning/QuizPage";
import QuizResultPage from "../pages/learning/QuizResultPage";

// ==========================================================
// Other
// ==========================================================

import NotificationsPage from "../pages/notifications/NotificationsPage";
import InstructorDashboardPage from "../pages/instructor/InstructorDashboardPage";
import CertificatesPage from "../pages/certificates/CertificatesPage";
import AssignmentPage from "../pages/learning/AssignmentPage";
// ==========================================================
// Router
// ==========================================================

const router = createBrowserRouter([
  {
    path: "/",

    element: <MainLayout />,

    children: [
      // ========================================================
      // HOME
      // ========================================================

      {
        index: true,
        element: <HomePage />,
      },

      // ========================================================
      // AUTH
      // ========================================================

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },

      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },

      {
        path: "reset-password/:userId",
        element: <ResetPasswordPage />,
      },

      // ========================================================
      // PROTECTED ROUTES
      // ========================================================

      {
        element: <ProtectedRoute />,

        children: [
          // ======================================================
          // DASHBOARD
          // ======================================================

          {
            path: "dashboard",
            element: <DashboardPage />,
          },

          {
            path: "my-courses",
            element: <MyCoursesPage />,
          },

          {
            path: "profile",
            element: <ProfilePage />,
          },

          // ======================================================
          // COURSES
          // ======================================================

          {
            path: "courses",
            element: <CoursesPage />,
          },

          {
            path: "courses/:slug",
            element: <CourseDetailsPage />,
          },

          // ======================================================
          // ORDERS
          // ======================================================

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

          // ======================================================
          // LEARNING
          // ======================================================

          {
            path: "learning/:enrollmentId",
            element: <LearningPage />,
          },

          // ======================================================
          // QUIZ
          //
          // IMPORTANT:
          // Quiz uses ENROLLMENT ID.
          // ======================================================

          {
            path:
              "learning/:enrollmentId/quiz/:quizId",
            element: <QuizPage />,
          },
          

          {
            path:
              "learning/:enrollmentId/quiz/:quizId/result",
            element: <QuizResultPage />,
          },
          {
            path:
              "learning/:enrollmentId/assignment/:assignmentId",
            element: <AssignmentPage />,
          },
          // ======================================================
          // NOTIFICATIONS
          // ======================================================

          {
            path: "notifications",
            element: <NotificationsPage />,
          },

          // ======================================================
          // CERTIFICATES
          // ======================================================

          {
            path: "certificates",
            element: <CertificatesPage />,
          },

          // ======================================================
          // INSTRUCTOR
          // ======================================================

          {
            path: "instructor",
            element: <InstructorDashboardPage />,
          },
        ],
      },
    ],
  },
]);

export default router;