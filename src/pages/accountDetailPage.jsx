import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import TransferModal from "../components/modal/transferModal";
import { MutasiDetailModal, formatDateTime, getCategoryMeta } from "../components/mutasiPageComponent";
import {
  AccountDetailHeader,
  AccountDetailHeroMetrics,
  AccountDetailTrendChart,
  AccountDetailMutasiTable,
} from "../components/accountDetailPage";
import { API_BASE_URL } from "../config";

export default function AccountDetailPage() {
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Accounts & active account state
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  // Mutations state specifically for this account
  const [mutations, setMutations] = useState([]);
  const [loadingMutations, setLoadingMutations] = useState(true);

  // Timeframe for chart and stats ("7d" | "30d" | "month")
  const [chartTimeframe, setChartTimeframe] = useState("30d");

  // Table filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "masuk" | "keluar" | "transfer"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedMutationDetail, setSelectedMutationDetail] = useState(null);

  // Fetch current user from /auth/me
  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUser(data.data || data);
      })
      .catch(() => {});
  }, []);

  // 1. Fetch all accounts from /getSaldo and locate current account
  const fetchAccountsAndCurrent = useCallback(async () => {
    setLoadingAccount(true);
    try {
      const res = await fetch(`${API_BASE_URL}/getSaldo`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.status && Array.isArray(result.data)) {
        setAccounts(result.data);
        const found = result.data.find(
          (acc) =>
            String(acc.account_id) === String(id) ||
            encodeURIComponent(acc.account_name) === id
        );
        if (found) {
          setAccount(found);
        } else if (result.data.length > 0) {
          setAccount(result.data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoadingAccount(false);
    }
  }, [id]);

  // 2. Fetch all mutations to filter for this account
  const fetchMutations = useCallback(async () => {
    setLoadingMutations(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mutasi?range=3m&limit=200`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setMutations(result.data);
      } else {
        setMutations([]);
      }
    } catch (err) {
      console.error("Error fetching mutations:", err);
      setMutations([]);
    } finally {
      setLoadingMutations(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountsAndCurrent();
    fetchMutations();
  }, [fetchAccountsAndCurrent, fetchMutations]);

  // Filter mutations solely for this account
  const accountMutations = useMemo(() => {
    if (!account) return [];
    const accIdStr = String(account.account_id || "");
    const accNameLower = (account.account_name || "").toLowerCase();

    return mutations.filter((tx) => {
      const txAccId = String(tx.account_id || tx.account?.id || "");
      const txAccName = (tx.account?.name || tx.account_name || "").toLowerCase();
      const txFromId = String(tx.from_account_id || "");
      const txToId = String(tx.to_account_id || "");

      return (
        (accIdStr && txAccId === accIdStr) ||
        (accNameLower && txAccName === accNameLower) ||
        (accIdStr && (txFromId === accIdStr || txToId === accIdStr))
      );
    });
  }, [mutations, account]);

  // Metrics calculation for this account
  const metrics = useMemo(() => {
    let totalMasuk = 0;
    let totalKeluar = 0;

    accountMutations.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.mutation_type === "masuk") {
        totalMasuk += amt;
      } else if (tx.mutation_type === "keluar") {
        totalKeluar += amt;
      }
    });

    const netCashflow = totalMasuk - totalKeluar;
    const isSurplus = netCashflow >= 0;

    return {
      totalMasuk,
      totalKeluar,
      netCashflow,
      isSurplus,
    };
  }, [accountMutations]);

  // Chart data aggregated by date intervals
  const chartData = useMemo(() => {
    const daysCount = chartTimeframe === "7d" ? 7 : chartTimeframe === "30d" ? 30 : 15;
    const groups = {};

    const now = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      groups[key] = {
        date: key,
        label,
        masuk: 0,
        keluar: 0,
      };
    }

    accountMutations.forEach((tx) => {
      const dateStr = (tx.created_at || tx.date || "").slice(0, 10);
      if (groups[dateStr]) {
        const amt = Number(tx.amount || 0);
        if (tx.mutation_type === "masuk") {
          groups[dateStr].masuk += amt;
        } else if (tx.mutation_type === "keluar") {
          groups[dateStr].keluar += amt;
        }
      }
    });

    if (chartTimeframe === "30d") {
      const entries = Object.values(groups);
      const chunkSize = Math.ceil(entries.length / 6);
      const aggregatedBars = [];

      for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = entries.slice(i, i + chunkSize);
        const lastItem = chunk[chunk.length - 1] || chunk[0];
        const sumMasuk = chunk.reduce((acc, curr) => acc + curr.masuk, 0);
        const sumKeluar = chunk.reduce((acc, curr) => acc + curr.keluar, 0);

        aggregatedBars.push({
          label: lastItem.label,
          masuk: sumMasuk,
          keluar: sumKeluar,
          total: sumMasuk + sumKeluar,
        });
      }
      return aggregatedBars;
    }

    return Object.values(groups).map((item) => ({
      ...item,
      total: item.masuk + item.keluar,
    }));
  }, [accountMutations, chartTimeframe]);

  // Max value for chart normalization
  const maxChartVal = useMemo(() => {
    let m = 0;
    chartData.forEach((d) => {
      const total = d.masuk + d.keluar;
      if (total > m) m = total;
    });
    return m > 0 ? m : 100000;
  }, [chartData]);

  // Filtered mutations for the table
  const filteredTableMutations = useMemo(() => {
    return accountMutations.filter((tx) => {
      const meta = getCategoryMeta(tx);

      if (filterType !== "all") {
        if (filterType === "transfer" && meta.typeKey !== "transfer") return false;
        if (filterType === "masuk" && tx.mutation_type !== "masuk") return false;
        if (filterType === "keluar" && tx.mutation_type !== "keluar") return false;
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const note = (tx.note || "").toLowerCase();
        const amt = String(tx.amount || "");
        const cat = meta.label.toLowerCase();
        if (!note.includes(q) && !amt.includes(q) && !cat.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [accountMutations, filterType, searchQuery]);

  // Table pagination
  const totalTableItems = filteredTableMutations.length;
  const totalTablePages = Math.ceil(totalTableItems / itemsPerPage) || 1;
  const startTableIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMutations = filteredTableMutations.slice(
    startTableIndex,
    startTableIndex + itemsPerPage
  );

  // Export CSV specifically for this account
  const handleExportCSV = () => {
    if (filteredTableMutations.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak ada data",
        text: "Tidak ada data mutasi untuk rekening ini.",
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
      "Keterangan",
      "Kategori",
      "Arah Mutasi",
      "Nominal (Rp)",
    ];
    const rows = filteredTableMutations.map((tx, idx) => {
      const { date, time } = formatDateTime(
        tx.created_at || tx.date || tx.date_indonesia
      );
      const isIncome = tx.mutation_type === "masuk";
      const meta = getCategoryMeta(tx);
      const accName = account?.account_name || tx.account_name || "Rekening";
      const amtStr = (isIncome ? "+" : "-") + Number(tx.amount || 0);

      return [
        idx + 1,
        `"${date}"`,
        `"${time}"`,
        `"${accName.replace(/"/g, '""')}"`,
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
      `mutasi_${account?.account_name || "rekening"}_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Edit Rekening handler
  const handleEditRekening = async () => {
    const { value: newName } = await Swal.fire({
      title: "Edit Nama Rekening",
      input: "text",
      inputLabel: "Nama Rekening / Pos Akun",
      inputValue: account?.account_name || "",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#059669",
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return "Nama rekening tidak boleh kosong!";
        }
      },
    });

    if (newName && newName !== account?.account_name) {
      Swal.fire({
        toast: true,
        icon: "success",
        title: "Perubahan Disimpan",
        text: `Nama rekening diperbarui menjadi "${newName}"`,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
      setAccount((prev) => (prev ? { ...prev, account_name: newName } : prev));
    }
  };

  // Ratio calculation
  const totalVolume = metrics.totalMasuk + metrics.totalKeluar;
  const masukRatio =
    totalVolume > 0 ? ((metrics.totalMasuk / totalVolume) * 100).toFixed(1) : "50.0";
  const keluarRatio =
    totalVolume > 0 ? ((metrics.totalKeluar / totalVolume) * 100).toFixed(1) : "50.0";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex antialiased">
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
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Component */}
        <AccountDetailHeader
          account={account}
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onEditRekening={handleEditRekening}
          onOpenTransfer={() => setIsTransferModalOpen(true)}
        />

        {/* Content Container */}
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Hero Card & Key Metrics Component */}
          <AccountDetailHeroMetrics
            account={account}
            metrics={metrics}
            masukRatio={masukRatio}
            keluarRatio={keluarRatio}
          />

          {/* Trend Chart Component */}
          <AccountDetailTrendChart
            chartData={chartData}
            chartTimeframe={chartTimeframe}
            setChartTimeframe={setChartTimeframe}
            maxChartVal={maxChartVal}
            masukRatio={masukRatio}
            keluarRatio={keluarRatio}
            metrics={metrics}
          />

          {/* Table Component */}
          <AccountDetailMutasiTable
            mutations={accountMutations}
            paginatedMutations={paginatedMutations}
            totalTableItems={totalTableItems}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalTablePages={totalTablePages}
            itemsPerPage={itemsPerPage}
            startTableIndex={startTableIndex}
            loadingMutations={loadingMutations}
            onExportCSV={handleExportCSV}
            onViewDetail={(tx) => setSelectedMutationDetail(tx)}
          />
        </div>
      </main>

      {/* Detail Mutation Modal */}
      {selectedMutationDetail && (
        <MutasiDetailModal
          transaction={selectedMutationDetail}
          onClose={() => setSelectedMutationDetail(null)}
        />
      )}

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        initialFromAccountId={account?.account_id}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={() => {
          fetchAccountsAndCurrent();
          fetchMutations();
        }}
      />
    </div>
  );
}
