import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AppLayout from "../components/layout/AppLayout";
import AdminLayout from "../components/layout/AdminLayout";
import AuthLayout from "../components/layout/AuthLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPage from "../pages/auth/ForgotPage";
import DashboardPage from "../pages/DashboardPage";
import KeysPage from "../pages/KeysPage";
import UsagePage from "../pages/UsagePage";
import BillingPage from "../pages/BillingPage";
import SettingsPage from "../pages/SettingsPage";
import DocsPage from "../pages/DocsPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminKeysPage from "../pages/admin/AdminKeysPage";
import AdminModelsPage from "../pages/admin/AdminModelsPage";
import AdminBillingPage from "../pages/admin/AdminBillingPage";
import AdminHealthPage from "../pages/admin/AdminHealthPage";
import AdminBrandingPage from "../pages/admin/AdminBrandingPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: "/auth/login", element: <LoginPage /> },
      { path: "/auth/register", element: <RegisterPage /> },
      { path: "/auth/forgot", element: <ForgotPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/keys", element: <KeysPage /> },
          { path: "/usage", element: <UsagePage /> },
          { path: "/billing", element: <BillingPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/docs", element: <DocsPage /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "/admin", element: <AdminDashboardPage /> },
              { path: "/admin/users", element: <AdminUsersPage /> },
              { path: "/admin/keys", element: <AdminKeysPage /> },
              { path: "/admin/models", element: <AdminModelsPage /> },
              { path: "/admin/billing", element: <AdminBillingPage /> },
              { path: "/admin/health", element: <AdminHealthPage /> },
              { path: "/admin/branding", element: <AdminBrandingPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
