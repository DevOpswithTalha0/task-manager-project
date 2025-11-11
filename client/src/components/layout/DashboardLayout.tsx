import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar setIsOpen={() => {}} />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
