import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../config";
import {
  MutasiSummaryCards,
  MutasiFilterBar,
  MutasiTable,
  MutasiDetailModal,
  MutasiAddModal,
  formatDateTime,
  getCategoryMeta,
  getDateRangeBadgeText,
} from "../components/mutasiPageComponent";
import AddMutationModal from "../components/modal/AddMutationModal";

export default function MutasiPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial loading — gate seluruh render konten saat pertama kali masuk
  const [initialLoading, setInitialLoading] = useState(true);

  // Raw data states
  const [mutations, setMutations] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Summary states for cards 1 - 3
  const [summary, setSummary] = useState({
    total_pemasukan: { amount: 0, count: 0 },
    total_pengeluaran: { amount: 0, count: 0 },
    net_mutasi: { amount: 0, status: "surplus" },
  });
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Modal states
  const [showAddMutation, setShowAddMutation] = useState(false);
  const [mutationType, setMutationType] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Filter states
  const [timeframe, setTimeframe] = useState("7d"); // "7d" | "1m" | "3m"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "transfer" | "keluar" | "masuk"
  const [filterAccount, setFilterAccount] = useState("all");

  // Pagination states (server-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 15,
    total_items: 0,
    total_pages: 1,
    has_previous: false,
    has_next: false,
  });

  // 1. Fetch mutations from API with server-side pagination & date range
  const fetchMutations = useCallback(async (range, page, limit) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/mutasi?range=${range}&page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setMutations(result.data);
        if (result.meta?.pagination) {
          setPaginationMeta(result.meta.pagination);
        }
      } else {
        setMutations([]);
        setPaginationMeta({
          page: 1,
          limit,
          total_items: 0,
          total_pages: 1,
          has_previous: false,
          has_next: false,
        });
      }
    } catch (err) {
      console.error("Error fetching mutations:", err);
      setMutations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Accounts from /getSaldo
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getSaldo`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.status && Array.isArray(result.data)) {
        setAccounts(result.data);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  }, []);

  // 3. Fetch mutasi summary from /mutasi/summary?range=...
  const fetchSummary = useCallback(async (range) => {
    setLoadingSummary(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mutasi/summary?range=${range}`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.success && result.data) {
        setSummary(result.data);
      }
    } catch (err) {
      console.error("Error fetching mutasi summary:", err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Initial load — jalankan ketiga fetch paralel, gate render sampai selesai
  const isInitialMount = useRef(true);

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          fetchMutations(timeframe, 1, itemsPerPage),
          fetchSummary(timeframe),
          fetchAccounts(),
        ]);
      } finally {
        setInitialLoading(false);
        isInitialMount.current = false;
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subsequent: fetch ulang saat timeframe berubah (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) return;
    setCurrentPage(1);
    fetchMutations(timeframe, 1, itemsPerPage);
    fetchSummary(timeframe);
  }, [timeframe]);

  // Subsequent: fetch ulang saat page atau limit berubah (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) return;
    fetchMutations(timeframe, currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Reset ke page 1 saat filter client-side berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterAccount]);
  // Derived date range badge text
  const dateRangeBadgeText = useMemo(
    () => getDateRangeBadgeText(timeframe),
    [timeframe]
  );

  // Filtered mutations (client-side: type, account, search)
  const filteredMutations = useMemo(() => {
    return mutations.filter((tx) => {
      // 1. Type filter
      const meta = getCategoryMeta(tx);
      if (filterType !== "all") {
        if (filterType === "transfer" && meta.typeKey !== "transfer") return false;
        if (filterType === "masuk" && tx.mutation_type !== "masuk") return false;
        if (filterType === "keluar" && tx.mutation_type !== "keluar") return false;
      }

      // 2. Account filter
      if (filterAccount !== "all") {
        const accName = (tx.account?.name || tx.account_name || "").toLowerCase();
        if (accName !== filterAccount.toLowerCase()) return false;
      }

      // 3. Search query
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
  }, [mutations, filterType, filterAccount, searchQuery]);

  // Period label and status helpers for summary cards
  const periodLabel = useMemo(() => {
    if (timeframe === "7d") return "7 hari terakhir";
    if (timeframe === "1m") return "1 bulan terakhir";
    if (timeframe === "3m") return "3 bulan terakhir";
    return "periode ini";
  }, [timeframe]);

  const isSurplus = useMemo(() => {
    if (summary?.net_mutasi?.status) {
      return summary.net_mutasi.status.toLowerCase() === "surplus";
    }
    return (summary?.net_mutasi?.amount ?? 0) >= 0;
  }, [summary]);

  const netStatus = summary?.net_mutasi?.status || (isSurplus ? "surplus" : "defisit");
  const netAmount = Math.abs(summary?.net_mutasi?.amount ?? 0);

  // Pagination derived values
  const totalPages = Math.max(1, paginationMeta.total_pages);
  const totalItems = paginationMeta.total_items;
  const startIndex = (paginationMeta.page - 1) * paginationMeta.limit;

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
      "No", "Tanggal", "Waktu", "Rekening", "Catatan",
      "Kategori", "Arah", "Jumlah (Rp)",
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

  // Handle Add Mutation Success — refresh mutations & summary tanpa initial loading
  const handleAddMutationSuccess = async () => {
    setShowAddMutation(false);
    await Promise.all([
      fetchMutations(timeframe, currentPage, itemsPerPage),
      fetchSummary(timeframe),
    ]);
  };

  const handleOpenAddMutation = (type) => {
    setMutationType(type);
    setShowAddMutation(true);
  };

  // Timeframe change resets page
  const handleTimeframeChange = (value) => {
    setTimeframe(value);
    setCurrentPage(1);
  };

  // Items per page change resets page
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 h-screen w-full flex overflow-hidden antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Sidebar Navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
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
            {/* Page Title & Actions — selalu tampil */}
            <section
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              data-purpose="page-title-and-actions"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Mutasi
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

            {initialLoading ? (
              /* ── Skeleton: ditampilkan sampai seluruh initial data siap ── */
              <div className="space-y-8 animate-pulse">
                {/* Summary Cards skeleton — 3 kolom */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div className="h-28 rounded-2xl bg-slate-200/70" />
                  <div className="h-28 rounded-2xl bg-slate-200/70" />
                  <div className="h-28 rounded-2xl bg-slate-200/70" />
                </div>

                {/* Filter bar skeleton */}
                <div className="h-12 rounded-xl bg-slate-200/70" />

                {/* Table skeleton */}
                <div className="h-96 rounded-2xl bg-slate-200/70" />
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <MutasiSummaryCards
                  summary={summary}
                  isSurplus={isSurplus}
                  netStatus={netStatus}
                  netAmount={netAmount}
                  periodLabel={periodLabel}
                />

                {/* Filters, Table, Pagination */}
                <div className="space-y-6" data-purpose="transactions-content">
                  <MutasiFilterBar
                    timeframe={timeframe}
                    onTimeframeChange={handleTimeframeChange}
                    dateRangeBadgeText={dateRangeBadgeText}
                    onExportCSV={handleExportCSV}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    filterAccount={filterAccount}
                    onFilterAccountChange={setFilterAccount}
                    accounts={accounts}
                  />

                  <MutasiTable
                    loading={loading}
                    mutations={filteredMutations}
                    onViewDetail={setSelectedDetail}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    startIndex={startIndex}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal Detail Transaksi */}
      {selectedDetail && (
        <MutasiDetailModal
          transaction={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {/* Modal Add Mutation (Pemasukan / Pengeluaran) */}
      {showAddMutation && (
        <AddMutationModal
          isOpen={showAddMutation}
          mutationType={mutationType}
          onClose={() => setShowAddMutation(false)}
          onSubmit={handleAddMutationSuccess}
        />
      )}
    </div>
  );
}
