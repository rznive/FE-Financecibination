// dashboardPage.jsx
import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, X } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TransactionList from "../components/TransactionList";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Financial Dashboard
              </h1>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowAddIncomeModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Income
                </button>
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card
                title="Total Income"
                value={0}
                icon={<TrendingUp className="h-6 w-6 text-green-600" />}
                color="green"
              />
              <Card
                title="Total Expenses"
                value={0}
                icon={<TrendingDown className="h-6 w-6 text-red-600" />}
                color="red"
              />
              <Card
                title="Current Balance"
                value={0}
                icon={<Wallet className="h-6 w-6 text-blue-600" />}
                color="green"
              />
            </div>

            <TransactionList />
          </div>
        </main>
      </div>

      {/* Modal Income */}
      {showAddIncomeModal && (
        <Modal
          title="Add Income"
          onClose={() => setShowAddIncomeModal(false)}
        />
      )}

      {/* Modal Expense */}
      {showAddExpenseModal && (
        <Modal
          title="Add Expense"
          onClose={() => setShowAddExpenseModal(false)}
        />
      )}
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            ${value.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose }) {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form>
            {/* Placeholder for form inputs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g. Salary, Freelance work"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
