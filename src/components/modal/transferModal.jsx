import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  ArrowUpDown,
  ArrowDown,
  Landmark,
  Wallet,
  ChevronDown,
  X,
  SendHorizontal,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function TransferModal({
  isOpen,
  onClose,
  onSuccess,
  initialFromAccountId = "",
}) {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Fetch accounts whenever modal is opened
  useEffect(() => {
    if (!isOpen) {
      setStatus(null);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/getSaldo`, {
          credentials: "include",
        });
        const result = await res.json();
        if (result.status && Array.isArray(result.data)) {
          setAccounts(result.data);
          if (initialFromAccountId) {
            setFromAccount(String(initialFromAccountId));
          } else if (result.data.length > 0 && !fromAccount) {
            setFromAccount(String(result.data[0].account_id));
          }
        } else {
          console.error("Gagal mengambil akun:", result.message);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [isOpen, initialFromAccountId]);

  // Selected source account object for balance lookup
  const selectedSourceAccount = accounts.find(
    (acc) => String(acc.account_id) === String(fromAccount)
  );

  // Handle formatted currency input
  const handleAmountChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (!rawVal) {
      setAmount("");
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmount(num.toLocaleString("id-ID"));
  };

  // Quick preset chips (+50rb, +100rb, +500rb)
  const handleAddAmount = (addVal) => {
    const currentNum = parseInt(String(amount).replace(/\D/g, "") || "0", 10);
    const newTotal = currentNum + addVal;
    setAmount(newTotal.toLocaleString("id-ID"));
  };

  // Quick preset: transfer all available balance
  const handleSetAllBalance = () => {
    if (selectedSourceAccount) {
      const saldo = parseInt(selectedSourceAccount.saldo || 0, 10);
      if (saldo > 0) {
        setAmount(saldo.toLocaleString("id-ID"));
      } else {
        setAmount("0");
      }
    }
  };

  // Swap source and destination accounts
  const handleSwap = () => {
    setFromAccount(toAccount);
    setToAccount(fromAccount);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const rawAmount = parseFloat(String(amount).replace(/\D/g, ""));

    if (!fromAccount) {
      setStatus({ success: false, message: "Silakan pilih rekening sumber." });
      return;
    }

    if (!toAccount) {
      setStatus({ success: false, message: "Silakan pilih rekening tujuan." });
      return;
    }

    if (String(fromAccount) === String(toAccount)) {
      setStatus({
        success: false,
        message: "Rekening sumber dan rekening tujuan tidak boleh sama.",
      });
      return;
    }

    if (!rawAmount || rawAmount <= 0) {
      setStatus({
        success: false,
        message: "Masukkan jumlah nominal transfer yang valid.",
      });
      return;
    }

    const availableBalance = parseFloat(selectedSourceAccount?.saldo || 0);
    if (rawAmount > availableBalance) {
      setStatus({
        success: false,
        message: `Saldo tidak mencukupi. Saldo tersedia: Rp ${parseInt(
          availableBalance,
          10
        ).toLocaleString("id-ID")}`,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          from_account_id: fromAccount,
          to_account_id: toAccount,
          amount: rawAmount,
          deskripsi: deskripsi.trim(),
        }),
      });

      const result = await res.json();
      if (res.ok && result.status) {
        setStatus({ success: true, message: "Transfer berhasil dilakukan!" });
        if (onSuccess) onSuccess();
        setFromAccount("");
        setToAccount("");
        setAmount("");
        setDeskripsi("");
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setStatus({
          success: false,
          message: result.message || "Gagal melakukan transfer.",
        });
      }
    } catch (err) {
      console.error("Transfer Error:", err);
      setStatus({
        success: false,
        message: "Terjadi kesalahan server saat memproses transfer.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/50 backdrop-blur-sm overflow-y-auto"
      data-purpose="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Transfer Modal Card */}
      <div
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200"
        data-purpose="transfer-modal-card"
      >
        {/* Modal Header (Fixed at top) */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            </div>
            <div>
              <h2
                className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-snug"
                id="modal-title"
              >
                Transfer Antar Rekening
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Pindahkan saldo antar rekening atau dompet secara instan.
              </p>
            </div>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            type="button"
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 outline-none cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-4.5 space-y-3.5 sm:space-y-4">
            {/* Feedback Status Banner */}
            {status && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                  status.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {/* Visual Flow: Source & Destination Container */}
            <div className="relative bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-3 sm:space-y-3.5">
              {/* Swap Floating Icon Button */}
              <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center transition-all duration-200 hover:rotate-180 group cursor-pointer"
                  title="Tukar posisi akun"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* DARI REKENING (Source Account) */}
              <div className="space-y-1" data-purpose="source-account-field">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5"
                    htmlFor="source-account"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                    Dari Rekening
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Saldo:{" "}
                    <strong
                      className="text-slate-700 font-semibold"
                      id="available-balance"
                    >
                      {fromAccount && selectedSourceAccount
                        ? `Rp ${parseInt(
                            selectedSourceAccount.saldo || 0,
                            10
                          ).toLocaleString("id-ID")}`
                        : "Rp 0"}
                    </strong>
                  </span>
                </div>
                <div className="relative">
                  <select
                    id="source-account"
                    name="source-account"
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    required
                    className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm font-medium text-slate-800 transition-all cursor-pointer shadow-xs outline-none"
                  >
                    <option value="" disabled>
                      -- Pilih Akun Sumber --
                    </option>
                    {accounts.map((acc) => (
                      <option key={acc.account_id} value={acc.account_id}>
                        {acc.account_name} - Rp{" "}
                        {parseInt(acc.saldo || 0, 10).toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                  {/* Icon Prefix */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                    <Landmark className="w-4 h-4" />
                  </div>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Divider with Connector */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-dashed border-slate-200"></div>
                <div className="absolute bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  <ArrowDown className="w-3 h-3 text-blue-600" />
                </div>
              </div>

              {/* KE REKENING (Destination Account) */}
              <div
                className="space-y-1"
                data-purpose="destination-account-field"
              >
                <label
                  className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5"
                  htmlFor="destination-account"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Ke
                  Rekening Tujuan
                </label>
                <div className="relative">
                  <select
                    id="destination-account"
                    name="destination-account"
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    required
                    className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm font-medium text-slate-800 transition-all cursor-pointer shadow-xs outline-none"
                  >
                    <option value="" disabled>
                      -- Pilih Akun Tujuan --
                    </option>
                    {accounts.map((acc) => (
                      <option
                        key={acc.account_id}
                        value={acc.account_id}
                        disabled={String(acc.account_id) === String(fromAccount)}
                      >
                        {acc.account_name} - Rp{" "}
                        {parseInt(acc.saldo || 0, 10).toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                  {/* Icon Prefix */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none">
                    <Wallet className="w-4 h-4" />
                  </div>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* JUMLAH NOMINAL (RP) */}
            <div className="space-y-1.5" data-purpose="amount-input-group">
              <label
                className="text-[11px] font-bold tracking-wider text-slate-600 uppercase"
                htmlFor="amount"
              >
                Jumlah Nominal (Rp) <span className="text-rose-500">*</span>
              </label>
              {/* Currency Input with Styled Rp Adornment */}
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-bold text-xs tracking-tight bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Rp
                  </span>
                </div>
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                  placeholder="Contoh: 100.000"
                  className="w-full pl-14 pr-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-xl text-sm sm:text-base font-semibold text-slate-800 placeholder:text-slate-300 transition-all outline-none"
                />
              </div>
              {/* Quick Nominal Chip Buttons */}
              <div
                className="flex flex-wrap items-center gap-1.5 pt-0.5"
                data-purpose="quick-amount-chips"
              >
                <button
                  type="button"
                  onClick={() => handleAddAmount(50000)}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer active:scale-95"
                >
                  + 50 rb
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAmount(100000)}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer active:scale-95"
                >
                  + 100 rb
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAmount(500000)}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer active:scale-95"
                >
                  + 500 rb
                </button>
                <button
                  type="button"
                  onClick={handleSetAllBalance}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-colors ml-auto cursor-pointer active:scale-95"
                >
                  Semua Saldo
                </button>
              </div>
            </div>

            {/* DESKRIPSI / CATATAN */}
            <div className="space-y-1" data-purpose="description-field">
              <label
                className="text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center justify-between"
                htmlFor="transfer-notes"
              >
                <span>Deskripsi / Catatan</span>
                <span className="text-[10px] font-normal text-slate-400 capitalize">
                  Opsional
                </span>
              </label>
              <div className="relative">
                <input
                  id="transfer-notes"
                  name="transfer-notes"
                  type="text"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Contoh: Alokasi tabungan bulanan"
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-700 placeholder:text-slate-300 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons (Fixed Footer) */}
          <div className="px-5 py-3 sm:px-6 sm:py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2.5 flex-shrink-0 rounded-b-2xl sm:rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all duration-150 flex items-center gap-2 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{loading ? "Memproses..." : "Transfer Sekarang"}</span>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizontal className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
