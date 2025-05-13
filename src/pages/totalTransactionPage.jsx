import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TotalTransaction from "../components/TotalTransaction";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";

export default function TotalTransactionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showManualFilter, setShowManualFilter] = useState(false);
  const [showManualResult, setShowManualResult] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [weeklyIncomeAuto, setWeeklyIncomeAuto] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });
  const [weeklyExpenseAuto, setWeeklyExpenseAuto] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });
  const [monthlyIncomeAuto, setMonthlyIncomeAuto] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });
  const [monthlyExpenseAuto, setMonthlyExpenseAuto] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });

  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [week, setWeek] = useState();

  const [weeklyIncomeManual, setWeeklyIncomeManual] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });
  const [weeklyExpenseManual, setWeeklyExpenseManual] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });
  const [monthlyIncomeManual, setMonthlyIncomeManual] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });
  const [monthlyExpenseManual, setMonthlyExpenseManual] = useState({
    data: [],
    total: 0,
    dateRange: null,
  });

  useEffect(() => {
    fetchAutoTotals();
  }, []);

  const fetchAutoTotals = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoints = [
      {
        url: `${API_BASE_URL}/finance/autototal-pemasukan-mingguan`,
        setter: setWeeklyIncomeAuto,
        totalField: "total_pemasukan_user",
      },
      {
        url: `${API_BASE_URL}/finance/autototal-pengeluaran-mingguan`,
        setter: setWeeklyExpenseAuto,
        totalField: "total_pengeluaran_user",
      },
      {
        url: `${API_BASE_URL}/finance/autototal-pemasukan-bulanan`,
        setter: setMonthlyIncomeAuto,
        totalField: "total_pemasukan_user",
      },
      {
        url: `${API_BASE_URL}/finance/autototal-pengeluaran-bulanan`,
        setter: setMonthlyExpenseAuto,
        totalField: "total_pengeluaran_user",
      },
    ];

    await Promise.all(
      endpoints.map(async ({ url, setter, totalField }) => {
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (result.status) {
            setter({
              data: result.data || [],
              total: result[totalField] || 0,
              dateRange: result.rentang_tanggal || null,
            });
          } else {
            console.error(`Gagal fetch dari ${url}:`, result.message);
          }
        } catch (err) {
          console.error(`Error fetch dari ${url}:`, err);
        }
      })
    );
  };

  const fetchManualWeeklyTotals = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoints = [
      {
        url: `${API_BASE_URL}/finance/total-pemasukan-mingguan?month=${month}&year=${year}&week=${week}`,
        setter: setWeeklyIncomeManual,
        totalField: "total_pemasukan_user",
      },
      {
        url: `${API_BASE_URL}/finance/total-pengeluaran-mingguan?month=${month}&year=${year}&week=${week}`,
        setter: setWeeklyExpenseManual,
        totalField: "total_pengeluaran_user",
      },
    ];

    await Promise.all(
      endpoints.map(async ({ url, setter, totalField }) => {
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (result.status) {
            setter({
              data: result.data || [],
              total: result[totalField] || 0,
              dateRange: result.rentang_tanggal || null,
            });
            console.log(result.rentang_tanggal);
          } else {
            console.error(`Gagal fetch dari ${url}:`, result.message);
          }
        } catch (err) {
          console.error(`Error fetch dari ${url}:`, err);
        }
      })
    );
  };

  const fetchManualMonthlyTotals = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoints = [
      {
        url: `${API_BASE_URL}/finance/total-pemasukan-bulanan?month=${month}&year=${year}`,
        setter: setMonthlyIncomeManual,
        totalField: "total_pemasukan_user",
      },
      {
        url: `${API_BASE_URL}/finance/total-pengeluaran-bulanan?month=${month}&year=${year}`,
        setter: setMonthlyExpenseManual,
        totalField: "total_pengeluaran_user",
      },
    ];

    await Promise.all(
      endpoints.map(async ({ url, setter, totalField }) => {
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (result.status) {
            setter({
              data: result.data || [],
              total: result[totalField] || 0,
              dateRange: result.rentang_tanggal || null,
            });
          } else {
            console.error(`Gagal fetch dari ${url}:`, result.message);
          }
        } catch (err) {
          console.error(`Error fetch dari ${url}:`, err);
        }
      })
    );
  };

  const handleFilterSubmit = async () => {
    if (week < 1 || week > 4) {
      alert("Minggu harus antara 1 dan 4");
      return;
    }

    setLoading(true);
    await fetchManualWeeklyTotals();
    await fetchManualMonthlyTotals();
    setLoading(false);
    setShowManualResult(true);
    setShowManualFilter(false);

    Swal.fire({
      icon: "success",
      toast: true,
      title: "Success",
      position: "top-end",
      text: "Transaction Data Loaded!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleModeSwitch = (mode) => {
    if (mode === "auto") {
      setIsAutoMode(true);
      setShowManualFilter(false);
      setShowManualResult(false);
      fetchAutoTotals();
    } else {
      setIsAutoMode(false);
      setShowManualFilter(true);
      setShowManualResult(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">
                Transactions Overview [
                {isAutoMode
                  ? `${weeklyIncomeAuto.dateRange?.start || ""} - ${
                      weeklyIncomeAuto.dateRange?.end || ""
                    }`
                  : `${weeklyIncomeManual.dateRange?.start || ""} - ${
                      weeklyIncomeManual.dateRange?.end || ""
                    }`}
                ]
              </h1>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => handleModeSwitch("auto")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Auto Mode
                </button>
                <button
                  onClick={() => handleModeSwitch("manual")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                  </svg>
                  Filter Mode
                </button>
              </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* AUTO MODE */}
            {isAutoMode && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TotalTransaction
                  title="Weekly Income"
                  data={weeklyIncomeAuto.data}
                  total={weeklyIncomeAuto.total}
                  color="green"
                  dateRange={weeklyIncomeAuto.dateRange}
                />
                <TotalTransaction
                  title="Weekly Expense"
                  data={weeklyExpenseAuto.data}
                  total={weeklyExpenseAuto.total}
                  color="red"
                  dateRange={weeklyExpenseAuto.dateRange}
                />
                <TotalTransaction
                  title="Monthly Income"
                  data={monthlyIncomeAuto.data}
                  total={monthlyIncomeAuto.total}
                  color="green"
                  dateRange={monthlyIncomeAuto.dateRange}
                />
                <TotalTransaction
                  title="Monthly Expense"
                  data={monthlyExpenseAuto.data}
                  total={monthlyExpenseAuto.total}
                  color="red"
                  dateRange={monthlyExpenseAuto.dateRange}
                />
              </div>
            )}

            {/* MANUAL FILTER FORM */}
            {showManualFilter && !loading && (
              <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Year</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Month</label>
                    <input
                      type="text"
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      min={1}
                      max={12}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Month"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Week</label>
                    <input
                      type="text"
                      value={week}
                      onChange={(e) => setWeek(Number(e.target.value))}
                      min={1}
                      max={4}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Week"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleFilterSubmit}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    {/* Ikon SVG funnel plus */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348" />
                      <path d="M16 6h6" />
                      <path d="M19 3v6" />
                    </svg>
                    Submit
                  </button>
                  <button
                    onClick={() => setShowManualFilter(false)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600"
                  >
                    {/* Ikon SVG funnel-x */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" />
                      <path d="m16.5 3.5 5 5" />
                      <path d="m21.5 3.5-5 5" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* MANUAL RESULTS */}
            {showManualResult && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TotalTransaction
                  title="Weekly Income"
                  data={weeklyIncomeManual.data}
                  total={weeklyIncomeManual.total}
                  color="green"
                  dateRange={weeklyIncomeManual.dateRange}
                />
                <TotalTransaction
                  title="Weekly Expense"
                  data={weeklyExpenseManual.data}
                  total={weeklyExpenseManual.total}
                  color="red"
                  dateRange={weeklyExpenseManual.dateRange}
                />
                <TotalTransaction
                  title="Monthly Income"
                  data={monthlyIncomeManual.data}
                  total={monthlyIncomeManual.total}
                  color="green"
                  dateRange={monthlyIncomeManual.dateRange}
                />
                <TotalTransaction
                  title="Monthly Expense"
                  data={monthlyExpenseManual.data}
                  total={monthlyExpenseManual.total}
                  color="red"
                  dateRange={monthlyExpenseManual.dateRange}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
