import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { User, Menu } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <header
      className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 flex-shrink-0 w-full"
      data-purpose="top-header"
    >
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile branding */}
        <div className="flex md:hidden items-center gap-2">
          <img
            src="/financecibination.png"
            alt="Financecibination Logo"
            className="h-7 w-auto"
          />
          <span className="font-bold text-base text-slate-900">
            Financecibination
          </span>
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden md:flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace / Personal Finance
          </h2>
        </div>
      </div>

      {/* User Profile Badge */}
      <div
        className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-slate-100 transition-colors"
        data-purpose="user-badge"
      >
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
          <User className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-slate-800">
          {user?.full_name || "User Testing 1"}
        </span>
      </div>
    </header>
  );
}
