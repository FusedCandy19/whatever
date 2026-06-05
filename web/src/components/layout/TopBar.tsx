import { LogOut, User, X } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useUIStore } from "../../store/ui.store";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/constants";

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const { impersonatingUserName, clearImpersonation } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      {impersonatingUserName ? (
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <User className="w-4 h-4" />
          Viewing as {impersonatingUserName}
          <button onClick={clearImpersonation} className="ml-1 hover:text-foreground">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : <div />}
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm text-muted-foreground">{user?.email}</span>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
