import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  DashboardPageHeader,
  NetWorthCard,
  DashboardSummaryCards,
  FinancialActivityChart,
  RecentTransactionsCard,
} from "../components/dashboardPageComponent";
import AddMutationModal from "../components/modal/AddMutationModal";
import { API_BASE_URL } from "../config";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddMutation, setShowAddMutation] = useState(false);
  const [mutationType, setMutationType] = useState(null);

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

  // 5. Fetch Activity Chart Data (/mutasi/chart-aktivitas)
  const fetchChartMutations = useCallback(async () => {
    setChartLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mutasi/chart-aktivitas`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();

      if (result.success || result.status) {
        const rawData = result.data || [];

        // Map field dari API (income, expense, net) ke format chart component
        const points = rawData.map((item) => ({
          date: item.date,
          label: item.label,
          total_pemasukan: item.income || 0,
          total_pengeluaran: item.expense || 0,
          total: item.net || 0,
        }));

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

  const handleOpenAddMutation = (type) => {
    setMutationType(type);
    setShowAddMutation(true);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 h-screen w-full flex overflow-hidden antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Sidebar Navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile & Tablet Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Dashboard Container (only this area scrolls) */}
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 md:px-8 py-5 md:py-7 space-y-5 sm:space-y-6 md:space-y-7">
          <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-[1600px] w-full mx-auto space-y-5 sm:space-y-6 md:space-y-7">
            {/* Mobile & Tablet Breadcrumb Context */}
            <div className="flex lg:hidden items-center space-x-1.5 text-[10.5px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase px-0.5">
              <span>WORKSPACE</span>
              <span>/</span>
              <span className="text-slate-600">PERSONAL FINANCE</span>
            </div>

            {/* Dashboard Header: Title & Action Buttons */}
            <DashboardPageHeader onAddMutation={handleOpenAddMutation} />

            {/* Card Net Worth (Full-Width di atas 3 card) */}
            <NetWorthCard totalBalance={totalBalance} balances={balances} />

            {/* Summary Cards Grid (Sisa Uang, Monthly Income, Monthly Spending) */}
            <DashboardSummaryCards
              monthlyIncome={monthlyIncome}
              incomeComparison={incomeComparison}
              monthlySpending={monthlySpending}
              spendingComparison={spendingComparison}
              netCashflow={netCashflow}
              cashflowComparison={cashflowComparison}
            />

            {/* Lower Dashboard Section: Full-Width Chart & Full-Width Transactions */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8" data-purpose="charts-and-transactions">
              {/* Full-Width Activity Chart Section */}
              <FinancialActivityChart
                chartData={chartData}
                chartLoading={chartLoading}
              />

              {/* Full-Width Recent Transactions Section */}
              <RecentTransactionsCard
                transactions={recentTransactions}
                loading={recentLoading}
              />
            </div>

            {/* Modal Add Mutation Form */}
            <AddMutationModal
              isOpen={showAddMutation}
              mutationType={mutationType}
              onClose={() => setShowAddMutation(false)}
              onSubmit={handleAddMutationSuccess}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
