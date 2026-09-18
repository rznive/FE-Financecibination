import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LogOut,
  DollarSign,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { logout } from "../utils/auth";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
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
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between h-full bg-white border-r border-slate-200 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-40 select-none flex-shrink-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        isCollapsed ? "lg:w-20" : "lg:w-[264px]"
      } w-[280px] sm:w-[300px] max-w-[85vw]`}
      data-purpose="sidebar-navigation"
    >
      {/* Edge Collapse Toggle Button (Desktop Only >= 1024px) */}
      <button
        onClick={toggleCollapse}
        type="button"
        className="hidden lg:flex absolute -right-3.5 top-7 w-7 h-7 bg-emerald-50 hover:bg-emerald-600 focus:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 focus:border-emerald-600 focus:outline-none rounded-full items-center justify-center text-emerald-700 hover:text-white focus:text-white shadow-sm hover:shadow-md hover:shadow-emerald-600/20 z-50 cursor-pointer transition-all duration-200"
        title={isCollapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
        aria-label={isCollapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 transition-colors duration-200" />
        ) : (
          <ChevronLeft className="w-4 h-4 transition-colors duration-200" />
        )}
      </button>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo & Brand Header */}
        <div
          className={`h-20 flex items-center justify-between border-b border-slate-100 flex-shrink-0 transition-all ${
            isCollapsed ? "lg:justify-center px-3" : "px-5"
          }`}
        >
          <div
            className="flex items-center gap-3 cursor-pointer select-none min-w-0"
            onClick={() => isCollapsed && toggleCollapse()}
            title={isCollapsed ? "Klik untuk memperluas sidebar" : ""}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
              <img
                src="/financecibination.png"
                alt="Financecibination Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Show on mobile & tablet OR when not collapsed on desktop */}
            <div
              className={`flex flex-col min-w-0 pr-1 ${
                isCollapsed ? "lg:hidden" : "flex"
              }`}
            >
              <span className="font-extrabold text-[17px] tracking-tight text-slate-900 truncate leading-tight">
                Financecibination
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Manajemen Keuangan
              </span>
            </div>
          </div>

          {/* Close button on mobile and tablet */}
          <button
            type="button"
            onClick={() => setSidebarOpen && setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2 cursor-pointer active:scale-95"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className={`p-3 space-y-1.5 flex-1 overflow-y-auto ${
            isCollapsed ? "lg:flex lg:flex-col lg:items-center" : ""
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
                className={`flex items-center rounded-xl transition-all duration-150 group ${
                  isCollapsed
                    ? "lg:w-11 lg:h-11 lg:justify-center gap-3 px-3.5 py-2.5 text-sm w-full"
                    : "gap-3 px-3.5 py-2.5 text-sm w-full"
                } ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100/80 shadow-xs"
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
                <span
                  className={`whitespace-nowrap tracking-tight ${
                    isCollapsed ? "lg:hidden" : "inline"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 flex justify-center">
        <button
          onClick={() => logout()}
          type="button"
          title="Sign Out"
          className={`flex items-center text-rose-600 hover:text-rose-700 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer ${
            isCollapsed
              ? "lg:w-11 lg:h-11 lg:justify-center w-full gap-3 px-3.5 py-2.5 text-sm font-semibold"
              : "w-full gap-3 px-3.5 py-2.5 text-sm font-semibold"
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span
            className={`whitespace-nowrap ${
              isCollapsed ? "lg:hidden" : "inline"
            }`}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
