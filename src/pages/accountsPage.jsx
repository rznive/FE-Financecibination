import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AccountsForm from "../components/AccountsForm";
import { API_BASE_URL } from "../config";

export default function AccountsPage({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/getAccount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status) {
        setAccounts(result.data);
      } else {
        console.error("Gagal mengambil data rekening:", result.message);
      }
    } catch (err) {
      console.error("Error saat memuat rekening:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = async () => {
    setShowAddAccount(false);
    await fetchAccounts();
  };

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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900"></h1>
              <button
                onClick={() => setShowAddAccount(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-credit-card-icon lucide-credit-card h-4 w-4 mr-2"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Add Account
              </button>
            </div>

            {showAddAccount && (
              <>
                {/* Modal Overlay */}
                <div
                  className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
                  onClick={() => setShowAddAccount(false)}
                />

                {/* Modal Content */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Add Account
                      </h3>
                      <button
                        onClick={() => setShowAddAccount(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <AccountsForm
                      onAccountAdded={handleAccountAdded}
                      onClose={() => setShowAddAccount(false)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Bank Accounts
              </h2>
              {loading ? (
                <div className="text-sm text-gray-500">
                  Loading, Fetching...
                </div>
              ) : accounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accounts.map((account) => (
                        <tr key={account.account_id}>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {account.account_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(account.saldo)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No accounts have been added yet.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
