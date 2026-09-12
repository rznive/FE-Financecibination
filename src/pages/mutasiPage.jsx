import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  ArrowUpRight,
  TrendingDown,
  Repeat,
  Download,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Calendar,
  Eye,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MutationForm from "../components/TransactionForm";
import { API_BASE_URL } from "../config";

export default function MutasiPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Raw data states
  const [mutations, setMutations] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddMutation, setShowAddMutation] = useState(false);
  const [mutationType, setMutationType] = useState("masuk"); // "masuk" or "keluar"
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Filter states
  const [timeframe, setTimeframe] = useState("7_days"); // "7_days" | "1_month" | "3_months" | "all"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "transfer" | "keluar" | "masuk"
  const [filterAccount, setFilterAccount] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // 1. Fetch all mutations from API
  const fetchMutations = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch(`${API_BASE_URL}/mutasi`, {
        headers: getAuthHeaders(),
      });
      let result = await res.json();

      // Fallback ke recent-transaction jika /mutasi tidak mengembalikan data
      if (!result.status || !result.data || result.data.length === 0) {
        const recentRes = await fetch(`${API_BASE_URL}/mutasi/recent-transaction`, {
          headers: getAuthHeaders(),
        });
        const recentResult = await recentRes.json();
        if (recentResult.status && recentResult.data) {
          result = recentResult;
        }
      }

      if (result.status && Array.isArray(result.data)) {
        setMutations(result.data);
      } else {
        setMutations([]);
      }
    } catch (err) {
      console.error("Error fetching mutations:", err);
      // Fallback try recent
      try {
        const fallbackRes = await fetch(
          `${API_BASE_URL}/mutasi/recent-transaction`,
          { headers: getAuthHeaders() }
        );
        const fallbackResult = await fallbackRes.json();
        if (fallbackResult.status && fallbackResult.data) {
          setMutations(fallbackResult.data);
        }
      } catch (fallbackErr) {
        console.error("Error fallback fetching mutations:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Accounts
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getAccount`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.status && Array.isArray(result.data)) {
        setAccounts(result.data);
      } else {
        // Coba getSaldo jika getAccount gagal
        const saldoRes = await fetch(`${API_BASE_URL}/getSaldo`, {
          headers: getAuthHeaders(),
        });
        const saldoResult = await saldoRes.json();
        if (saldoResult.status && Array.isArray(saldoResult.data)) {
          setAccounts(saldoResult.data);
        }
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  }, []);

  useEffect(() => {
    fetchMutations();
    fetchAccounts();
  }, [fetchMutations, fetchAccounts]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [timeframe, searchQuery, filterType, filterAccount, itemsPerPage]);

  // Helper date parsing and formatting
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: "-", time: "-" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return { date: dateStr, time: "" };
      }
      const months = [
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
      const day = String(d.getDate()).padStart(2, "0");
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      return {
        date: `${day} ${month} ${year}`,
        time: `${hours}:${minutes}:${seconds} WIB`,
      };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  // Helper timeframe date badge text
  const dateRangeBadgeText = useMemo(() => {
    const now = new Date();
    const months = [
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
    const fmt = (d) =>
      `${String(d.getDate()).padStart(2, "0")} ${
        months[d.getMonth()]
      } ${d.getFullYear()}`;

    if (timeframe === "all") return "Semua Periode";

    let past = new Date();
    if (timeframe === "7_days") {
      past.setDate(now.getDate() - 7);
    } else if (timeframe === "1_month") {
      past.setMonth(now.getMonth() - 1);
    } else if (timeframe === "3_months") {
      past.setMonth(now.getMonth() - 3);
    }
    return `${fmt(past)} - ${fmt(now)}`;
  }, [timeframe]);

  // Helper categorize transaction
  const getCategoryMeta = (tx) => {
    const isIncome = tx.mutation_type === "masuk";
    const note = (tx.note || "").toLowerCase();
    const type = (tx.transaction_type || "").toLowerCase();

    if (type === "transfer" || note.includes("transfer") || note.includes("pindah dana")) {
      return {
        label: "Transfer",
        subtitle: isIncome ? "Mutasi Transfer Masuk" : "Mutasi Transfer Keluar",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        typeKey: "transfer",
      };
    }

    if (isIncome) {
      return {
        label: "Pemasukan",
        subtitle: tx.note ? `Pemasukan: ${tx.note}` : "Pemasukan Dana",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        typeKey: "masuk",
      };
    }

    return {
      label: "Pengeluaran",
      subtitle: tx.note ? `Pengeluaran: ${tx.note}` : "Pengeluaran Dana",
      badgeBg: "bg-rose-50 text-red-600 border-slate-200",
      typeKey: "keluar",
    };
  };

  // Filtered mutations
  const filteredMutations = useMemo(() => {
    const now = new Date();

    return mutations.filter((tx) => {
      // 1. Timeframe filter
      if (timeframe !== "all") {
        const txDate = parseDate(tx.created_at || tx.date || tx.date_indonesia);
        let cutoff = new Date();
        if (timeframe === "7_days") {
          cutoff.setDate(now.getDate() - 7);
        } else if (timeframe === "1_month") {
          cutoff.setMonth(now.getMonth() - 1);
        } else if (timeframe === "3_months") {
          cutoff.setMonth(now.getMonth() - 3);
        }
        if (txDate < cutoff) {
          return false;
        }
      }

      // 2. Type filter
      const meta = getCategoryMeta(tx);
      if (filterType !== "all") {
        if (filterType === "transfer" && meta.typeKey !== "transfer") return false;
        if (filterType === "masuk" && tx.mutation_type !== "masuk") return false;
        if (filterType === "keluar" && tx.mutation_type !== "keluar") return false;
      }

      // 3. Account filter
      if (filterAccount !== "all") {
        const accName = (tx.account?.name || tx.account_name || "").toLowerCase();
        if (accName !== filterAccount.toLowerCase()) return false;
      }

      // 4. Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const note = (tx.note || "").toLowerCase();
        const acc = (tx.account?.name || tx.account_name || "").toLowerCase();
        const amt = String(tx.amount || "");
        const cat = meta.label.toLowerCase();
        if (
          !note.includes(q) &&
          !acc.includes(q) &&
          !amt.includes(q) &&
          !cat.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [mutations, timeframe, filterType, filterAccount, searchQuery]);

  // Metrics summary calculated from filtered transactions
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let incomeCount = 0;
    let totalExpense = 0;
    let expenseCount = 0;

    const incomeItems = [];
    const expenseItems = [];

    filteredMutations.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      const isIncome = tx.mutation_type === "masuk";
      if (isIncome) {
        totalIncome += amt;
        incomeCount += 1;
        incomeItems.push({ note: tx.note || "Pemasukan", amount: amt });
      } else {
        totalExpense += amt;
        expenseCount += 1;
        expenseItems.push({ note: tx.note || "Pengeluaran", amount: amt });
      }
    });

    const netAmount = totalIncome - totalExpense;

    // Build breakdown strings
    const makeBreakdown = (items) => {
      if (items.length === 0) return "Belum ada catatan mutasi pada periode ini";
      const topItems = items.slice(0, 2);
      const parts = topItems.map(
        (it) => `${it.note} (Rp${it.amount.toLocaleString("id-ID")})`
      );
      if (items.length > 2) {
        parts.push(`+${items.length - 2} transaksi lainnya`);
      }
      return parts.join(" + ");
    };

    const incomeBreakdown = makeBreakdown(incomeItems);
    const expenseBreakdown = makeBreakdown(expenseItems);

    let periodLabel = "periode ini";
    if (timeframe === "7_days") periodLabel = "7 hari terakhir";
    if (timeframe === "1_month") periodLabel = "1 bulan terakhir";
    if (timeframe === "3_months") periodLabel = "3 bulan terakhir";
    if (timeframe === "all") periodLabel = "seluruh periode";

    return {
      totalIncome,
      incomeCount,
      incomeBreakdown,
      totalExpense,
      expenseCount,
      expenseBreakdown,
      netAmount,
      periodLabel,
    };
  }, [filteredMutations, timeframe]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredMutations.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMutations = filteredMutations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredMutations.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak ada data",
        text: "Tidak ada data mutasi untuk diekspor pada filter saat ini.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const headers = [
      "No",
      "Tanggal",
      "Waktu",
      "Rekening",
      "Catatan",
      "Kategori",
      "Arah",
      "Jumlah (Rp)",
    ];
    const rows = filteredMutations.map((tx, idx) => {
      const { date, time } = formatDateTime(
        tx.created_at || tx.date || tx.date_indonesia
      );
      const isIncome = tx.mutation_type === "masuk";
      const meta = getCategoryMeta(tx);
      const acc = tx.account?.name || tx.account_name || "Akun";
      const amtStr = (isIncome ? "+" : "-") + Number(tx.amount || 0);

      return [
        idx + 1,
        `"${date}"`,
        `"${time}"`,
        `"${acc.replace(/"/g, '""')}"`,
        `"${(tx.note || "").replace(/"/g, '""')}"`,
        `"${meta.label}"`,
        `"${isIncome ? "Masuk" : "Keluar"}"`,
        amtStr,
      ].join(",");
    });

    const csvString = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `mutasi_transaksi_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Add Mutation Success
  const handleMutationSuccess = () => {
    setShowAddMutation(false);
    fetchMutations();
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

        {/* Main Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          <div className="max-w-[1600px] w-full mx-auto space-y-8">
            {/* BEGIN: Page Title & Actions */}
            <section
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              data-purpose="page-title-and-actions"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Transactions
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Lacak riwayat mutasi transaksi keluar dan masuk pada seluruh rekening
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
                  className="inline-flex items-center gap-2 bg-[#00BA88] hover:bg-[#009F74] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all"
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
                  className="inline-flex items-center gap-2 bg-[#C92A2A] hover:bg-[#AF1E1E] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Pengeluaran</span>
                </button>
              </div>
            </section>
            {/* END: Page Title & Actions */}

            {/* BEGIN: SummaryCardsGrid (3 Columns) */}
            <section
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
              data-purpose="metrics-summary-cards"
            >
              {/* Card 1: Total Pemasukan */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      </div>
                      <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                        Total Pemasukan
                      </h2>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {metrics.incomeCount} Mutasi Masuk
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      Rp {metrics.totalIncome.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 truncate" title={metrics.incomeBreakdown}>
                      {metrics.incomeBreakdown}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Total Pengeluaran */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-red-600 flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-4 h-4 text-red-600 stroke-[2.5]" />
                      </div>
                      <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                        Total Pengeluaran
                      </h2>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-red-600 border border-slate-200">
                      {metrics.expenseCount} Mutasi Keluar
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      Rp {metrics.totalExpense.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 truncate" title={metrics.expenseBreakdown}>
                      {metrics.expenseBreakdown}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Net Mutasi Periode */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Layers className="w-4 h-4 text-emerald-600 stroke-[2]" />
                      </div>
                      <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                        Net Mutasi Periode
                      </h2>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        metrics.netAmount >= 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-red-600 border border-rose-100"
                      }`}
                    >
                      {metrics.netAmount >= 0 ? "+" : "-"}Rp{" "}
                      {Math.abs(metrics.netAmount).toLocaleString("id-ID")}{" "}
                      {metrics.netAmount >= 0 ? "surplus" : "defisit"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p
                      className={`text-2xl font-black tracking-tight ${
                        metrics.netAmount >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {metrics.netAmount >= 0 ? "+" : "-"}Rp{" "}
                      {Math.abs(metrics.netAmount).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Total saldo mutasi bersih selama {metrics.periodLabel}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            {/* END: SummaryCardsGrid */}

            {/* BEGIN: LowerDashboardSection (Filters, Table, Pagination) */}
            <div className="space-y-6" data-purpose="transactions-content">
              {/* Filter Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                {/* Row 1: Timeframe buttons & Export */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Rentang:
                    </span>
                    <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                      <button
                        type="button"
                        onClick={() => setTimeframe("7_days")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          timeframe === "7_days"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        7 Hari Terakhir
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeframe("1_month")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          timeframe === "1_month"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        1 Bulan
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeframe("3_months")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          timeframe === "3_months"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        3 Bulan
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeframe("all")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          timeframe === "all"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Semua
                      </button>
                    </div>
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                      {dateRangeBadgeText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Export CSV / Excel</span>
                    </button>
                  </div>
                </div>

                {/* Row 2: Search input & Select filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari catatan transaksi / rekening..."
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-1 sm:flex-none"
                    >
                      <option value="all">Semua Tipe</option>
                      <option value="transfer">Transfer</option>
                      <option value="keluar">Pengeluaran (Expense)</option>
                      <option value="masuk">Pemasukan (Income)</option>
                    </select>

                    <select
                      value={filterAccount}
                      onChange={(e) => setFilterAccount(e.target.value)}
                      className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-1 sm:flex-none"
                    >
                      <option value="all">Semua Akun</option>
                      {accounts.map((acc, index) => {
                        const name = acc.account_name || acc.name || `Akun ${index + 1}`;
                        return (
                          <option key={acc.account_id || acc.id || index} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Transactions Table Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-6">Waktu &amp; Tanggal</th>
                        <th className="py-3.5 px-6">Rekening</th>
                        <th className="py-3.5 px-6">Keterangan / Catatan</th>
                        <th className="py-3.5 px-6">Kategori / Tipe</th>
                        <th className="py-3.5 px-6">Arah Mutasi</th>
                        <th className="py-3.5 px-6 text-right">Jumlah</th>
                        <th className="py-3.5 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                              <p className="text-xs text-slate-500">Memuat data mutasi...</p>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedMutations.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Filter className="w-8 h-8 text-slate-300" />
                              <p className="text-sm font-medium text-slate-600">
                                Tidak ada transaksi yang sesuai
                              </p>
                              <p className="text-xs text-slate-400">
                                Coba ubah kata kunci pencarian atau ganti filter rentang waktu.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedMutations.map((tx) => {
                          const isIncome = tx.mutation_type === "masuk";
                          const meta = getCategoryMeta(tx);
                          const { date, time } = formatDateTime(
                            tx.created_at || tx.date || tx.date_indonesia
                          );
                          const accountName =
                            tx.account?.name || tx.account_name || "Rekening";
                          const amountNum = Number(tx.amount || 0);

                          return (
                            <tr
                              key={tx.id || `${date}-${time}-${amountNum}`}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              {/* Waktu & Tanggal */}
                              <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                                <div className="font-bold text-slate-900">{date}</div>
                                {time && (
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {time}
                                  </div>
                                )}
                              </td>

                              {/* Rekening */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                                    <Layers className="w-4 h-4" />
                                  </div>
                                  <span className="font-semibold text-slate-800 text-xs">
                                    {accountName}
                                  </span>
                                </div>
                              </td>

                              {/* Keterangan / Catatan */}
                              <td className="py-4 px-6 max-w-xs truncate">
                                <div className="font-bold text-slate-900 text-xs truncate">
                                  {tx.note || (isIncome ? "Pemasukan" : "Pengeluaran")}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                                  {meta.subtitle}
                                </div>
                              </td>

                              {/* Kategori / Tipe */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeBg}`}
                                >
                                  {meta.label}
                                </span>
                              </td>

                              {/* Arah Mutasi */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                {isIncome ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <ArrowDownRight className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                                    Masuk
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-red-600 border border-slate-200">
                                    <ArrowUpRight className="w-3 h-3 text-red-600 stroke-[2.5]" />
                                    Keluar
                                  </span>
                                )}
                              </td>

                              {/* Jumlah */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <span
                                  className={`text-sm font-black ${
                                    isIncome ? "text-emerald-600" : "text-red-600"
                                  }`}
                                >
                                  {isIncome ? "+" : "-"}Rp{" "}
                                  {amountNum.toLocaleString("id-ID")}
                                </span>
                              </td>

                              {/* Aksi */}
                              <td className="py-4 px-6 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetail(tx)}
                                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Detail</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer & Pagination */}
                <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    Menampilkan{" "}
                    <span className="font-bold text-slate-800">
                      {filteredMutations.length === 0
                        ? 0
                        : `${startIndex + 1}-${Math.min(
                            startIndex + itemsPerPage,
                            filteredMutations.length
                          )}`}
                    </span>{" "}
                    dari{" "}
                    <span className="font-bold text-slate-800">
                      {filteredMutations.length}
                    </span>{" "}
                    data mutasi
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Sebelumnya
                      </button>

                      {/* Dynamic page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - currentPage) <= 1
                        )
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          return (
                            <div key={p} className="flex items-center gap-1">
                              {prev && p - prev > 1 && (
                                <span className="text-slate-400 px-1 text-xs">...</span>
                              )}
                              <button
                                type="button"
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border transition-colors ${
                                  currentPage === p
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-black shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {p}
                              </button>
                            </div>
                          );
                        })}

                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Selanjutnya
                      </button>
                    </div>

                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    >
                      <option value={10}>10 per halaman</option>
                      <option value={15}>15 per halaman</option>
                      <option value={25}>25 per halaman</option>
                      <option value={50}>50 per halaman</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* END: LowerDashboardSection */}
          </div>
        </main>
      </div>

      {/* Modal Detail Transaksi */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDetail(null)}
          />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedDetail.mutation_type === "masuk"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-red-600"
                }`}
              >
                {selectedDetail.mutation_type === "masuk" ? (
                  <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detail Transaksi
                </h3>
                <p className="text-xs text-slate-400">
                  ID: #{selectedDetail.id || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Arah Mutasi</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    selectedDetail.mutation_type === "masuk"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-red-600"
                  }`}
                >
                  {selectedDetail.mutation_type === "masuk"
                    ? "Dana Masuk (Income)"
                    : "Dana Keluar (Expense)"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nominal</span>
                <span
                  className={`font-black text-sm ${
                    selectedDetail.mutation_type === "masuk"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedDetail.mutation_type === "masuk" ? "+" : "-"}Rp{" "}
                  {Number(selectedDetail.amount || 0).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Rekening</span>
                <span className="font-semibold text-slate-800">
                  {selectedDetail.account?.name ||
                    selectedDetail.account_name ||
                    "Rekening"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Waktu Transaksi</span>
                <span className="font-medium text-slate-700 text-right">
                  {
                    formatDateTime(
                      selectedDetail.created_at ||
                        selectedDetail.date ||
                        selectedDetail.date_indonesia
                    ).date
                  }{" "}
                  {
                    formatDateTime(
                      selectedDetail.created_at ||
                        selectedDetail.date ||
                        selectedDetail.date_indonesia
                    ).time
                  }
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Kategori / Tipe</span>
                <span className="font-semibold text-slate-800">
                  {getCategoryMeta(selectedDetail).label}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 font-medium block mb-1">
                  Catatan / Keterangan
                </span>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium">
                  {selectedDetail.note || "-"}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Mutation (Pemasukan / Pengeluaran) */}
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
              onSubmit={handleMutationSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
