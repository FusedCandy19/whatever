import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import TopBar from "./TopBar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
