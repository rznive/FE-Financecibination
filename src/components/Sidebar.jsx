import { Link, useLocation } from "react-router-dom";
import { Home, LogOut, FileText, DollarSign, Layers } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <Home className="mr-3 h-5 w-5" />,
    },
    {
      to: "/showMutasi",
      label: "Transactions",
      icon: <DollarSign className="mr-3 h-5 w-5" />,
    },
    {
      to: "/showAccounts",
      label: "Accounts",
      icon: <Layers className="mr-3 h-5 w-5" />,
    },
    {
      to: "/total-transactions",
      label: "Total Transactions",
      icon: <FileText className="mr-3 h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={`bg-white w-64 z-40 border-r border-gray-200 flex-shrink-0 flex flex-col fixed md:static inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
    >
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
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