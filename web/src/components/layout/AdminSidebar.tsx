import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Key, Cpu, CreditCard, Activity, Palette, ChevronLeft, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { useUIStore } from "../../store/ui.store";
import { ROUTES } from "../../lib/constants";

const nav = [
  { to: ROUTES.ADMIN, icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: ROUTES.ADMIN_USERS, icon: Users, label: "Users" },
  { to: ROUTES.ADMIN_KEYS, icon: Key, label: "API Keys" },
  { to: ROUTES.ADMIN_MODELS, icon: Cpu, label: "Models" },
  { to: ROUTES.ADMIN_BILLING, icon: CreditCard, label: "Billing" },
  { to: ROUTES.ADMIN_HEALTH, icon: Activity, label: "System Health" },
  { to: ROUTES.ADMIN_BRANDING, icon: Palette, label: "Branding" },
];

export default function AdminSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  return (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-200",
      sidebarCollapsed ? "w-16" : "w-56"
    )}>
      <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
        {!sidebarCollapsed && <span className="font-bold text-foreground text-sm">Admin Panel</span>}
        <button onClick={toggleSidebar} className="ml-auto text-muted-foreground hover:text-foreground">
          <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>
      <nav className="flex-1 py-3 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
            isActive ? "text-brand bg-brand/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}>
            <Icon className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
        <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary mt-4">
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Back to App</span>}
        </NavLink>
      </nav>
    </aside>
  );
}
