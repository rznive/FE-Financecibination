import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src="/financecibination.png"
            alt="Financecibination Logo"
            className="h-8 w-8 object-contain"
          />
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
              Track Expenses, Manage Budgets, and Achieve your Financial Goals
              with Our Easy-to-Use Personal Finance Tracker.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg"
              >
                Start for Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-base font-medium text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-300 shadow-lg"
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
                    Analytics Overview
                  </h3>
                </div>
                <div className="h-48 mb-6 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="/ilustrasi-3.png"
                    alt="Finance Illustration"
                    className="h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Income</p>
                    <p className="text-xl font-bold text-gray-900">Rp 3.240.000</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="text-xl font-bold text-gray-900">Rp 2.758.000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-xl text-white">
                Financecibination
              </span>
            </div>
            <div className="space-x-6">
              {" "}
              <Link to="/#" className="text-sm hover:text-white">
                About
              </Link>{" "}
              <Link to="/#" className="text-sm hover:text-white">
                Features
              </Link>{" "}
              <Link to="/#" className="text-sm hover:text-white">
                Privacy
              </Link>{" "}
              <Link to="/#" className="text-sm hover:text-white">
                Contact
              </Link>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-6 text-sm text-gray-500">
            {" "}
            &copy; 2025 Financecibination. All Rights Reserved.{" "}
          </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
};
export default HomePage;
