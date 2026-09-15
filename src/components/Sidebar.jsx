import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LogOut,
  FileText,
  DollarSign,
  Layers,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      to: "/showMutasi",
      label: "Mutasi",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      to: "/showAccounts",
      label: "Akun Rekening",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      to: "/totalTransaction",
      label: "Total Transactions",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      to: "/riwayatTransfer",
      label: "Riwayat Transfer",
      icon: <ArrowLeftRight className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={`relative ${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 h-screen fixed md:sticky top-0 z-40 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-all duration-300 ease-in-out shadow-lg md:shadow-none`}
      data-purpose="sidebar-navigation"
    >
      {/* Edge Collapse Toggle Button (Desktop) */}
      <button
        onClick={toggleCollapse}
        type="button"
        className="hidden md:flex absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-300 shadow-sm z-50 cursor-pointer transition-transform hover:scale-110"
        title={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        aria-label="Toggle collapse sidebar"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo Area */}
        <div
          className={`h-20 flex items-center border-b border-slate-100 flex-shrink-0 transition-all ${
            isCollapsed ? "justify-center px-2" : "px-6"
          }`}
        >
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => isCollapsed && toggleCollapse()}
            title={isCollapsed ? "Klik untuk memperluas sidebar" : ""}
          >
            <img
              src="/financecibination.png"
              alt="Financecibination Logo"
              className="h-8 w-auto flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="font-bold text-xl tracking-tight text-slate-900 whitespace-nowrap">
                Financecibination
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className={`p-3 space-y-1.5 flex-1 overflow-y-auto ${
            isCollapsed ? "flex flex-col items-center" : ""
          }`}
        >
          {menuItems.map((item) => {
            const isActive = currentPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
                className={`flex items-center rounded-xl transition-colors group ${
                  isCollapsed
                    ? "w-12 h-12 justify-center"
                    : "gap-3.5 px-4 py-3 text-sm w-full"
                } ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 flex justify-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          type="button"
          title="Sign Out"
          className={`flex items-center text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer ${
            isCollapsed
              ? "w-12 h-12 justify-center"
              : "w-full gap-3.5 px-4 py-3 text-sm font-semibold"
          }`}
        >
          <LogOut className="w-5 h-5 text-red-500 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
