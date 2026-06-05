import { Outlet } from "react-router-dom";
import { useBranding } from "../../hooks/useBranding";

export default function AuthLayout() {
  useBranding();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
