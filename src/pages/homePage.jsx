import { Link } from "react-router-dom";
import {
  BarChart,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              Financecibination
            </span>
          </div>
        </div>
      </nav>
      <section className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Take Control of Your{" "}
              <span className="text-green-600">Financial Life</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Track expenses, manage budgets, and achieve your financial goals
              with our easy-to-use personal finance tracker.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Start for Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-base font-medium text-green-600 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-green-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-teal-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Monthly Overview
                  </h3>
                  <span className="text-sm text-gray-500">May 2025</span>
                </div>
                <div className="h-48 mb-6 bg-gray-50 rounded-lg flex items-center justify-center">
                  <BarChart className="h-32 w-32 text-green-500 opacity-80" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Income</p>
                    <p className="text-xl font-bold text-gray-900">$3,240.00</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="text-xl font-bold text-gray-900">$2,758.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-xl font-bold text-white">
                Financecibination
              </span>
            </div>
            <div className="space-x-6">
              {" "}
              <Link to="/about" className="text-sm hover:text-white">
                About
              </Link>{" "}
              <Link to="/features" className="text-sm hover:text-white">
                Features
              </Link>{" "}
              <Link to="/privacy" className="text-sm hover:text-white">
                Privacy
              </Link>{" "}
              <Link to="/contact" className="text-sm hover:text-white">
                Contact
              </Link>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-6 text-center text-sm text-gray-500">
            {" "}
            &copy; 2025 Financecibination. All Rights Reserved.{" "}
          </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
};
export default HomePage;
