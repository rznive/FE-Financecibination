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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
          {/* Logo */}
          <div className="mr-3">
            <img
              src="/financecibination.png"
              alt="Financecibination Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">Financecibination</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline-block">
              {user?.full_name || "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
