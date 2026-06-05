import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "../lib/constants";

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user.role !== "ADMIN") return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <Outlet />;
}
