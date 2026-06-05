import { NavLink } from "react-router-dom";
import { LayoutDashboard, Key, BarChart3, CreditCard, Settings, BookOpen, ChevronLeft, Shield } from "lucide-react";
import { cn } from "../../lib/utils";
import { useUIStore } from "../../store/ui.store";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../lib/constants";

const nav = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: "Dashboard" },
  { to: ROUTES.KEYS, icon: Key, label: "API Keys" },
  { to: ROUTES.USAGE, icon: BarChart3, label: "Usage" },
  { to: ROUTES.BILLING, icon: CreditCard, label: "Billing" },
  { to: ROUTES.SETTINGS, icon: Settings, label: "Settings" },
  { to: ROUTES.DOCS, icon: BookOpen, label: "Docs" },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-200",
      sidebarCollapsed ? "w-16" : "w-56"
    )}>
      <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
        {!sidebarCollapsed && <span className="font-bold text-foreground truncate">APIaaS</span>}
        <button onClick={toggleSidebar} className="ml-auto text-muted-foreground hover:text-foreground">
          <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>
      <nav className="flex-1 py-3 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
            isActive ? "text-brand bg-brand/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}>
            <Icon className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
        {user?.role === "ADMIN" && (
          <NavLink to={ROUTES.ADMIN} className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-2 text-sm transition-colors mt-4",
            isActive ? "text-brand bg-brand/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}>
            <Shield className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Admin</span>}
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
