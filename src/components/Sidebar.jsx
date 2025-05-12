// Sidebar.jsx
import { Link } from "react-router-dom";
import { Home, LogOut } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`bg-white w-64 z-40 border-r border-gray-200 flex-shrink-0 flex flex-col fixed md:static inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
    >
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-green-50 text-green-700"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
