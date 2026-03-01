import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* User profile placeholder */}
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
