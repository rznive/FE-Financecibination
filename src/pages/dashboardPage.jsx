import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowUpRight,
  TrendingDown,
  CreditCard,
  Wallet,
  X,
  Repeat,
  ArrowLeftRight,
  UtensilsCrossed,
  Car,
  Wifi,
  ShoppingBag,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MutationForm from "../components/TransactionForm";
import DailyMutationChart from "../components/DailyMutationChart";
import { API_BASE_URL } from "../config";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddMutation, setShowAddMutation] = useState(false);
  const [mutationType, setMutationType] = useState(null);

  // Filter timeframe chart
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  // State 1: Net Worth (/getSaldo)
  const [balances, setBalances] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  // State 2: Monthly Income (/finance/total-pemasukan-bulanan)
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [incomeComparison, setIncomeComparison] = useState(null);

  // State 3: Monthly Spending (/finance/total-pengeluaran-bulanan)
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [spendingComparison, setSpendingComparison] = useState(null);

  // State 4: Net Cashflow (/finance/net-cashflow-bulanan)
  const [netCashflow, setNetCashflow] = useState(0);
  const [cashflowStatus, setCashflowStatus] = useState("surplus");
  const [cashflowComparison, setCashflowComparison] = useState(null);

  // State 5: Chart data (/mutasi)
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  // State 6: Recent Transactions (/mutasi/recent-transaction)
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // Global loading
  const [initialLoading, setInitialLoading] = useState(true);

  // Helper auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // 1. Fetch Balances (Net Worth)
  const fetchBalances = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getSaldo`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.status) {
        setBalances(result.data || []);
        setTotalBalance(result.total_balance ?? 0);
      }
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  }, []);

  // 2. Fetch Monthly Income
  const fetchMonthlyIncome = useCallback(async () => {
    try {
      const now = new Date();
      const monthNum = now.getMonth() + 1;
      const monthStr = String(monthNum).padStart(2, "0");
      const year = now.getFullYear();

      // Coba format 2-digit dulu (e.g. month=08&year=2026), lalu fallback jika perlu
      let res = await fetch(
        `${API_BASE_URL}/finance/total-pemasukan-bulanan?month=${monthStr}&year=${year}`,
        { headers: getAuthHeaders() }
      );
      let result = await res.json();

      if (!result.status) {
        res = await fetch(
          `${API_BASE_URL}/finance/total-pemasukan-bulanan?month=${monthNum}&year=${year}`,
          { headers: getAuthHeaders() }
        );
        result = await res.json();
      }

      if (result.status) {
        setMonthlyIncome(result.total_pemasukan_user ?? 0);
        setIncomeComparison(result.perbandingan_bulan_lalu || null);
      }
    } catch (err) {
      console.error("Error fetching monthly income:", err);
    }
  }, []);

  // 3. Fetch Monthly Spending
  const fetchMonthlySpending = useCallback(async () => {
    try {
      const now = new Date();
      const monthNum = now.getMonth() + 1;
      const monthStr = String(monthNum).padStart(2, "0");
      const year = now.getFullYear();

      let res = await fetch(
        `${API_BASE_URL}/finance/total-pengeluaran-bulanan?month=${monthStr}&year=${year}`,
        { headers: getAuthHeaders() }
      );
      let result = await res.json();

      if (!result.status) {
        res = await fetch(
          `${API_BASE_URL}/finance/total-pengeluaran-bulanan?month=${monthNum}&year=${year}`,
          { headers: getAuthHeaders() }
        );
        result = await res.json();
      }

      if (result.status) {
        setMonthlySpending(result.total_pengeluaran_user ?? 0);
        setSpendingComparison(result.perbandingan_bulan_lalu || null);
      }
    } catch (err) {
      console.error("Error fetching monthly spending:", err);
    }
  }, []);

  // 4. Fetch Net Cashflow
  const fetchNetCashflow = useCallback(async () => {
    try {
      const now = new Date();
      const monthNum = now.getMonth() + 1;
      const monthStr = String(monthNum).padStart(2, "0");
      const year = now.getFullYear();

      // Coba format month=9&year=2026
      let res = await fetch(
        `${API_BASE_URL}/finance/net-cashflow-bulanan?month=${monthNum}&year=${year}`,
        { headers: getAuthHeaders() }
      );
      let result = await res.json();

      if (!result.status) {
        res = await fetch(
          `${API_BASE_URL}/finance/net-cashflow-bulanan?month=${monthStr}&year=${year}`,
          { headers: getAuthHeaders() }
        );
        result = await res.json();
      }

      if (result.status) {
        setNetCashflow(result.net_cashflow ?? 0);
        setCashflowStatus(result.status_cashflow || "surplus");
        setCashflowComparison(result.perbandingan_bulan_lalu || null);
      }
    } catch (err) {
      console.error("Error fetching net cashflow:", err);
    }
  }, []);

  // 5. Fetch Activity Chart Data (/mutasi)
  const fetchChartMutations = useCallback(async () => {
    setChartLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mutasi`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();

      if (result.success || result.status) {
        const rawMutations = result.data || [];
        const meta = result.meta || {};

        // Aggregate daily mutations
        const dailyMap = {};

        // Tentukan batas tanggal awal & akhir
        let startDate;
        let endDate = new Date();

        if (meta.period && meta.period.from && meta.period.to) {
          startDate = new Date(meta.period.from);
          endDate = new Date(meta.period.to);
        } else {
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 6);
        }

        // Siapkan range tanggal harian agar kurva kontinu
        const curr = new Date(startDate);
        while (curr <= endDate) {
          const key = curr.toISOString().split("T")[0];
          const label = `${curr.getMonth() + 1}/${curr.getDate()}`;
          dailyMap[key] = {
            date: key,
            label,
            total_pemasukan: 0,
            total_pengeluaran: 0,
            total: 0,
          };
          curr.setDate(curr.getDate() + 1);
        }

        // Isi transaksi ke dailyMap
        rawMutations.forEach((m) => {
          if (!m.created_at) return;
          const d = new Date(m.created_at);
          const key = d.toISOString().split("T")[0];
          const amount = Number(m.amount) || 0;

          if (!dailyMap[key]) {
            dailyMap[key] = {
              date: key,
              label: `${d.getMonth() + 1}/${d.getDate()}`,
              total_pemasukan: 0,
              total_pengeluaran: 0,
              total: 0,
            };
          }

          if (m.mutation_type === "masuk") {
            dailyMap[key].total_pemasukan += amount;
          } else if (m.mutation_type === "keluar") {
            dailyMap[key].total_pengeluaran += amount;
          }
          // Total aktivitas kas (pemasukan harian)
          dailyMap[key].total = dailyMap[key].total_pemasukan;
        });

        // Urutkan berdasarkan tanggal
        const points = Object.values(dailyMap).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setChartData(points);
      }
    } catch (err) {
      console.error("Error fetching chart mutations:", err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  // 6. Fetch Recent Transactions (/mutasi/recent-transaction)
  const fetchRecentTransactions = useCallback(async () => {
    setRecentLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mutasi/recent-transaction`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.success || result.status) {
        setRecentTransactions(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching recent transactions:", err);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchBalances(),
      fetchMonthlyIncome(),
      fetchMonthlySpending(),
      fetchNetCashflow(),
      fetchChartMutations(),
      fetchRecentTransactions(),
    ]);
  }, [
    fetchBalances,
    fetchMonthlyIncome,
    fetchMonthlySpending,
    fetchNetCashflow,
    fetchChartMutations,
    fetchRecentTransactions,
  ]);

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      await refreshAllData();
      setInitialLoading(false);
    };
    init();
  }, [refreshAllData]);

  // Handler setelah submit form modal
  const handleAddMutationSuccess = async () => {
    setShowAddMutation(false);
    await refreshAllData();
  };

  // Helper format tanggal transaksi
  const formatTxDate = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = new Date();

      const timeStr = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isToday) return `Hari ini, ${timeStr}`;
      if (isYesterday) return `Kemarin, ${timeStr}`;

      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 7) return `${diffDays} hari lalu, ${timeStr}`;

      const bulanShort = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      return `${date.getDate()} ${bulanShort[date.getMonth()]}, ${timeStr}`;
    } catch {
      return isoString;
    }
  };

  // Helper badge kategori transaksi
  const getTxBadge = (tx) => {
    const isIncome = tx.mutation_type === "masuk";
    const note = (tx.note || "").toLowerCase();
    const type = (tx.transaction_type || "").toLowerCase();

    if (type === "transfer") {
      return isIncome ? "Pemasukan / Transfer" : "Pengeluaran / Transfer";
    }
    if (note.includes("qris")) {
      return "Pemasukan / QRIS";
    }
    if (
      note.includes("makan") ||
      note.includes("minum") ||
      note.includes("cafe") ||
      note.includes("restoran") ||
      note.includes("food") ||
      note.includes("dining")
    ) {
      return "Pengeluaran / Food & Dining";
    }
    if (
      note.includes("bensin") ||
      note.includes("pertamina") ||
      note.includes("transport") ||
      note.includes("ojek") ||
      note.includes("gojek") ||
      note.includes("grab")
    ) {
      return "Pengeluaran / Transportasi";
    }
    if (
      note.includes("internet") ||
      note.includes("wifi") ||
      note.includes("pln") ||
      note.includes("listrik") ||
      note.includes("pulsa") ||
      note.includes("utilitas")
    ) {
      return "Pengeluaran / Utilitas";
    }
    if (
      note.includes("tokopedia") ||
      note.includes("shopee") ||
      note.includes("belanja") ||
      note.includes("toko")
    ) {
      return "Pengeluaran / Belanja";
    }
    if (isIncome) {
      return "Pemasukan / Income";
    }
    return "Pengeluaran / Expense";
  };

  // Helper icon transaksi
  const renderTxIcon = (tx) => {
    const isIncome = tx.mutation_type === "masuk";
    const note = (tx.note || "").toLowerCase();
    const type = (tx.transaction_type || "").toLowerCase();

    if (type === "transfer") {
      return <Repeat className="w-5 h-5" />;
    }
    if (
      note.includes("makan") ||
      note.includes("minum") ||
      note.includes("cafe") ||
      note.includes("food")
    ) {
      return <UtensilsCrossed className="w-5 h-5" />;
    }
    if (
      note.includes("bensin") ||
      note.includes("transport") ||
      note.includes("pertamina") ||
      note.includes("ojek")
    ) {
      return <Car className="w-5 h-5" />;
    }
    if (
      note.includes("internet") ||
      note.includes("wifi") ||
      note.includes("pln") ||
      note.includes("listrik")
    ) {
      return <Wifi className="w-5 h-5" />;
    }
    if (
      note.includes("tokopedia") ||
      note.includes("shopee") ||
      note.includes("belanja")
    ) {
      return <ShoppingBag className="w-5 h-5" />;
    }
    if (note.includes("gaji") || note.includes("salary") || note.includes("freelance")) {
      return <Briefcase className="w-5 h-5" />;
    }

    return isIncome ? (
      <ArrowUpRight className="w-5 h-5" />
    ) : (
      <CreditCard className="w-5 h-5" />
    );
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 h-screen w-full flex overflow-hidden antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Sidebar Navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Dashboard Container (only this area scrolls) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          <div className="max-w-[1600px] w-full mx-auto space-y-8">
            {/* Dashboard Header: Title & Action Buttons */}
          <section
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            data-purpose="page-title-and-actions"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Finance Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Manage and monitor your financial activity in one dashboard
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMutationType("masuk");
                  setShowAddMutation(true);
                }}
                className="inline-flex items-center gap-2 bg-[#00BA88] hover:bg-[#009F74] text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Pemasukan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMutationType("keluar");
                  setShowAddMutation(true);
                }}
                className="inline-flex items-center gap-2 bg-[#C92A2A] hover:bg-[#AF1E1E] text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Pengeluaran</span>
              </button>
            </div>
          </section>

          {/* Card Net Worth (Full-Width di atas 3 card) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-slate-700">
                <Wallet className="w-4 h-4 text-slate-600" />
                <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                  NET WORTH
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Total balance across all connected accounts
              </p>
              <div className="mt-4">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Total Saldo
                </span>
                <p className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">
                  Rp {totalBalance.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Account Breakdown */}
            <div className="md:border-l md:border-slate-100 md:pl-8 flex flex-col justify-center min-w-[280px]">
              <span className="text-xs font-semibold text-slate-500 mb-2 block">
                Rincian Rekening
              </span>
              <div className="space-y-2 text-xs">
                {balances.length > 0 ? (
                  [...balances]
                    .sort((a, b) => Number(b.saldo || 0) - Number(a.saldo || 0))
                    .slice(0, 3)
                    .map((acc) => (
                      <div
                        key={acc.account_id}
                        className="flex justify-between items-center text-slate-600 bg-slate-50 px-3 py-2 rounded-xl"
                      >
                        <span className="font-medium truncate max-w-[150px]">
                          {acc.account_name}
                        </span>
                        <span className="font-bold text-slate-800 ml-3">
                          Rp {Number(acc.saldo || 0).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="text-slate-400 italic">Belum ada akun</div>
                )}
              </div>
            </div>
          </div>

          {/* 3 Summary Cards Grid (Monthly Income, Monthly Spending, Net Cashflow) */}
          <section
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            data-purpose="metrics-summary-cards"
          >
            {/* Card 1: MONTHLY INCOME */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                    MONTHLY INCOME
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Total income recorded this month
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      incomeComparison?.status === "turun"
                        ? "bg-rose-50 text-rose-700 border border-rose-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {incomeComparison?.status === "turun" ? "↓" : "↑"}{" "}
                    {incomeComparison?.persentase_perubahan != null
                      ? `${incomeComparison.persentase_perubahan}%`
                      : incomeComparison?.status === "naik"
                      ? "Naik"
                      : incomeComparison?.status === "turun"
                      ? "Turun"
                      : "Tetap"}{" "}
                    dari bulan lalu
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    Rp {monthlyIncome.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Recurring Salary</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>

            {/* Card 2: MONTHLY SPENDING */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center gap-2 text-slate-700">
                  <TrendingDown className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                    MONTHLY SPENDING
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Total expenses recorded this month
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      spendingComparison?.status === "naik"
                        ? "bg-rose-50 text-rose-700 border border-rose-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {spendingComparison?.status === "naik" ? "↑" : "↓"}{" "}
                    {spendingComparison?.persentase_perubahan != null
                      ? `${spendingComparison.persentase_perubahan}%`
                      : spendingComparison?.status === "naik"
                      ? "Naik"
                      : spendingComparison?.status === "turun"
                      ? "Turun"
                      : "Tetap"}{" "}
                    dari bulan lalu
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    Rp {monthlySpending.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Budget Utilized</span>
                <span className="font-semibold text-slate-700">
                  {monthlyIncome > 0
                    ? `${Math.round((monthlySpending / monthlyIncome) * 100)}% of Cap`
                    : "0% of Cap"}
                </span>
              </div>
            </div>

            {/* Card 3: NET CASHFLOW */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                    NET CASHFLOW
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Income minus expenses this month
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      cashflowComparison?.status === "turun"
                        ? "bg-rose-50 text-rose-700 border border-rose-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {cashflowComparison?.status === "turun" ? "↓" : "↑"}{" "}
                    {cashflowComparison?.persentase_perubahan != null
                      ? `${cashflowComparison.persentase_perubahan}%`
                      : cashflowComparison?.status === "naik"
                      ? "Naik"
                      : "Tetap"}{" "}
                    dari bulan lalu
                  </span>
                </div>
                <div className="mt-4">
                  <p
                    className={`text-2xl font-black tracking-tight ${
                      netCashflow >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {netCashflow >= 0 ? "+" : "-"}Rp{" "}
                    {Math.abs(netCashflow).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Status Cashflow</span>
                <span className="font-semibold text-emerald-600 capitalize">
                  {cashflowStatus === "surplus"
                    ? "Surplus Positif"
                    : cashflowStatus === "defisit"
                    ? "Defisit"
                    : "Seimbang"}
                </span>
              </div>
            </div>
          </section>

          {/* Lower Dashboard Section: Full-Width Chart & Full-Width Transactions */}
          <div className="space-y-8" data-purpose="charts-and-transactions">
            {/* Full-Width Activity Chart Section */}
            <section
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              data-purpose="cash-flow-section"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Activity Chart
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visualizing your daily cash flow
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Legend Pemasukan & Pengeluaran */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Pemasukan
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Pengeluaran
                    </span>
                  </div>

                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="This Year">This Year</option>
                  </select>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="mt-6 w-full" data-purpose="cash-flow-svg-chart">
                <DailyMutationChart data={chartData} loading={chartLoading} />
              </div>
            </section>

            {/* Full-Width Recent Transactions Section */}
            <section
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col"
              data-purpose="recent-transactions-widget"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Transactions
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your latest financial activity
                  </p>
                </div>
                <Link
                  to="/showMutasi"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 stroke-[2]" />
                </Link>
              </div>

              {/* Transaction Items List */}
              <div className="divide-y divide-slate-100">
                {recentLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs text-slate-400">Memuat transaksi...</p>
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-12">
                    Belum ada transaksi terbaru.
                  </p>
                ) : (
                  recentTransactions.map((tx) => {
                    const isIncome = tx.mutation_type === "masuk";
                    const accountName =
                      tx.account?.name || tx.account_name || "Akun";
                    const amountNum = Number(tx.amount || 0);

                    return (
                      <div
                        key={tx.id}
                        className="py-4 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                      >
                        {/* Left: Icon & Description */}
                        <div className="flex items-center gap-4 min-w-0 mr-2">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isIncome
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-red-600"
                            }`}
                          >
                            {renderTxIcon(tx)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {tx.note || (isIncome ? "Pemasukan" : "Pengeluaran")}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {accountName} • {formatTxDate(tx.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Right: Category Badge & Amount */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span
                            className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isIncome
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {getTxBadge(tx)}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              isIncome ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {isIncome ? "+" : "-"}Rp{" "}
                            {amountNum.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* Modal Add Mutation Form */}
          {showAddMutation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowAddMutation(false)}
              />
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => setShowAddMutation(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-6 w-6" />
                </button>
                <h3 className="text-xl font-bold mb-6 text-slate-900">
                  {mutationType === "masuk"
                    ? "Tambah Pemasukan"
                    : "Tambah Pengeluaran"}
                </h3>
                <MutationForm
                  title={mutationType === "masuk" ? "Pemasukan" : "Pengeluaran"}
                  mutationType={mutationType}
                  onClose={() => setShowAddMutation(false)}
                  onSubmit={handleAddMutationSuccess}
                />
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
