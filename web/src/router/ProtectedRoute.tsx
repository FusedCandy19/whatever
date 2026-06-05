import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "../lib/constants";

export default function ProtectedRoute() {
  const { user, isHydrated } = useAuthStore();
  if (!isHydrated) return null;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
}
