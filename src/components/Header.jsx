import { useState, useEffect } from "react";
import { User, Menu } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.data || data);
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 md:px-8 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex-shrink-0 w-full"
      data-purpose="top-header"
    >
      <div className="flex items-center justify-between gap-3 max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-none mx-auto w-full">
        {/* Left: Mobile & Tablet Hamburger & Brand / Desktop Breadcrumb */}
        <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 active:scale-95 transition-all shrink-0 cursor-pointer lg:hidden focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Mobile & Tablet branding */}
          <div className="flex lg:hidden items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
              <img
                src="/financecibination.png"
                alt="Financecibination Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight truncate">
              <h1 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-slate-900 truncate">
                Financecibination
              </h1>
              <p className="text-[9px] sm:text-[10.5px] font-semibold text-slate-400 tracking-wider uppercase">
                MANAJEMEN KEUANGAN
              </p>
            </div>
          </div>

          {/* Desktop breadcrumb (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace / Personal Finance
            </h2>
          </div>
        </div>

        {/* Right: User Profile Badge */}
        <div
          className="flex items-center space-x-2 sm:space-x-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-full py-1.5 px-3 sm:px-3.5 shrink-0 cursor-pointer transition-colors"
          data-purpose="user-badge"
        >
          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-semibold text-xs">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-xs font-semibold text-slate-700 max-w-[100px] sm:max-w-[150px] truncate select-none">
            {user?.full_name || "User Testing 1"}
          </span>
        </div>
      </div>
    </header>
  );
}
