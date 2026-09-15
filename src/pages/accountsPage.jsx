import { useState, useEffect, useCallback } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TransferModal from "../components/transferModal";
import {
  AccountsSummaryCards,
  AccountCardsGrid,
  BalanceDistributionCard,
  AccountsTable,
  AddAccountModal,
  AccountDetailModal,
} from "../components/accountsPageComponent";
import { API_BASE_URL } from "../config";

export default function AccountsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Account & financial data state
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Monthly income & spending for summary cards
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [incomeComparison, setIncomeComparison] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [spendingComparison, setSpendingComparison] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedAccountDetail, setSelectedAccountDetail] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // 1. Fetch Balances & Accounts from /getSaldo
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/getSaldo`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.status) {
        setAccounts(result.data || []);
        setTotalBalance(result.total_balance ?? 0);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Monthly Income
  const fetchMonthlyIncome = useCallback(async () => {
    try {
      const now = new Date();
      const monthNum = now.getMonth() + 1;
      const monthStr = String(monthNum).padStart(2, "0");
      const year = now.getFullYear();

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

  useEffect(() => {
    fetchAccounts();
    fetchMonthlyIncome();
    fetchMonthlySpending();
  }, [fetchAccounts, fetchMonthlyIncome, fetchMonthlySpending]);

  const handleAccountAdded = () => {
    fetchAccounts();
  };

  const handleTransferSuccess = () => {
    fetchAccounts();
  };

  const handleOpenTransferWithAccount = (acc) => {
    setIsTransferModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1600px] w-full mx-auto space-y-8">
          {/* Page Title and Actions */}
          <section
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            data-purpose="page-title-and-actions"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Daftar Rekening &amp; Akun
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Kelola pos rekening bank, dompet digital, dan pos kas pribadi Anda secara manual dan mandiri.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                id="btn-transfer"
                type="button"
                onClick={() => setIsTransferModalOpen(true)}
                className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-all bg-white cursor-pointer active:scale-98"
              >
                <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                <span>Transfer Antar Rekening</span>
              </button>

              <button
                id="btn-add-account"
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#00BA88] hover:bg-[#009F74] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Rekening</span>
              </button>
            </div>
          </section>

          {/* 1. Metrics Summary Cards */}
          <AccountsSummaryCards
            accounts={accounts}
            totalBalance={totalBalance}
            monthlyIncome={monthlyIncome}
            monthlySpending={monthlySpending}
            incomeComparison={incomeComparison}
            spendingComparison={spendingComparison}
            loading={loading}
          />

          {/* 2. Account Cards Grid (Cards + Add Account trigger) */}
          <AccountCardsGrid
            accounts={accounts}
            loading={loading}
            onAddAccount={() => setIsAddModalOpen(true)}
            onSelectDetail={(acc) => setSelectedAccountDetail(acc)}
          />

          {/* 3. Balance Distribution Card */}
          <BalanceDistributionCard
            accounts={accounts}
            totalBalance={totalBalance}
          />

          {/* 4. Accounts Table */}
          <AccountsTable
            accounts={accounts}
            loading={loading}
            onSelectDetail={(acc) => setSelectedAccountDetail(acc)}
            onOpenTransfer={(acc) => handleOpenTransferWithAccount(acc)}
          />
        </main>
      </div>

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAccountAdded}
      />

      <AccountDetailModal
        isOpen={!!selectedAccountDetail}
        account={selectedAccountDetail}
        totalBalance={totalBalance}
        onClose={() => setSelectedAccountDetail(null)}
        onOpenTransfer={(acc) => {
          setSelectedAccountDetail(null);
          handleOpenTransferWithAccount(acc);
        }}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
}
