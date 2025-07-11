import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, X } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TransactionList from "../components/MutationForm";
import MutationForm from "../components/TransactionForm";
import { API_BASE_URL } from "../config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddMutation, setShowAddMutation] = useState(false);
  const [mutationType, setMutationType] = useState(null);
  const [mutations, setMutations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState([]);
  const [dailyIncomeData, setDailyIncomeData] = useState([]);

  useEffect(() => {
    fetchMutations();
    fetchBalances();
    fetchDailyMutation();
  }, []);

  async function fetchBalances() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/getSaldo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status) {
        setBalances(result.data);
      } else {
        console.error("Failed to fetch balances:", result.message);
      }
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  }

  async function fetchMutations() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/mutasi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status) {
        setMutations(result.data);
      } else {
        console.error("Failed to fetch mutations:", result.message);
      }
    } catch (err) {
      console.error("Error fetching mutations:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDailyMutation() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/finance/total-transaksi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status) {
        setDailyIncomeData(result.data); // asumsi: [{ tanggal: "2025-05-01", total_pemasukan: 100000 }]
      } else {
        console.error("Gagal fetch pemasukan harian:", result.message);
      }
    } catch (err) {
      console.error("Error fetching daily income:", err);
    }
  }

  const handleAddMutation = async (newMutation) => {
    setShowAddMutation(false);
    await fetchMutations();
    await fetchBalances();
  };

  const totalIncome = mutations
    .filter((m) => m.mutation_type === "masuk")
    .reduce((sum, m) => sum + m.amount, 0);

  const totalExpenses = mutations
    .filter((m) => m.mutation_type === "keluar")
    .reduce((sum, m) => sum + m.amount, 0);

  const currentBalance = balances.reduce((sum, acc) => sum + acc.saldo, 0);

  const currentMutations = mutations.slice(0, 5);

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
              <h1 className="text-2xl font-bold text-gray-900"></h1>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => {
                    setMutationType("masuk");
                    setShowAddMutation(true);
                  }}
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
                    className="lucide lucide-trending-up-icon lucide-trending-up h-4 w-4 mr-2"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  Pemasukan
                </button>
                <button
                  onClick={() => {
                    setMutationType("keluar");
                    setShowAddMutation(true);
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
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
                    className="lucide lucide-trending-down-icon lucide-trending-down h-4 w-4 mr-2"
                  >
                    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                    <polyline points="16 17 22 17 22 11" />
                  </svg>
                  Pengeluaran
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card
                title="Total Income"
                value={totalIncome}
                icon={<TrendingUp className="h-6 w-6 text-green-600" />}
                color="green"
              />
              <Card
                title="Total Expenses"
                value={totalExpenses}
                icon={<TrendingDown className="h-6 w-6 text-red-600" />}
                color="red"
              />
              <Card
                title="Current Balance"
                value={currentBalance}
                icon={<Wallet className="h-6 w-6 text-blue-600" />}
                color={currentBalance >= 0 ? "green" : "red"}
              />
            </div>

            {/* Inline Add Form */}
            {showAddMutation && (
              <div className="bg-white border rounded-lg shadow-md max-w-3xl w-full mx-auto mb-6 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {mutationType === "masuk" ? "Pemasukan" : "Pengeluaran"}
                  </h3>
                  <button
                    onClick={() => setShowAddMutation(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <MutationForm
                  title={mutationType === "masuk" ? "Pemasukan" : "Pengeluaran"}
                  mutationType={mutationType}
                  onClose={() => setShowAddMutation(false)}
                  onSubmit={handleAddMutation}
                />
              </div>
            )}

            {/* Transaction Table */}
            <div className="mt-8">
              <TransactionList mutations={currentMutations} loading={loading} />
            </div>
            {/* Daily Income Chart */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Total Mutasi</h2>
              <div className="bg-white p-4 rounded-lg shadow-md w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tanggal" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        `Rp ${value.toLocaleString("id-ID")}`,
                        name === "total_pemasukan"
                          ? "Pemasukan"
                          : "Pengeluaran",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_pemasukan"
                      name="Pemasukan"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_pengeluaran"
                      name="Pengeluaran"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
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
            Rp {value.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>
    </div>
  );
}
