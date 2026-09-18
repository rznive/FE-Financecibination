import { useState, useEffect } from "react";
import { X, CreditCard, Calendar, Check, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../config";

// Helper konversi angka ke terbilang bahasa Indonesia
function angkaTerbilang(angka) {
  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  angka = Math.floor(Math.abs(Number(angka) || 0));
  if (angka === 0) return "";
  if (angka < 12) return bilangan[angka];
  if (angka < 20) return `${bilangan[angka - 10]} Belas`;
  if (angka < 100)
    return `${bilangan[Math.floor(angka / 10)]} Puluh ${bilangan[angka % 10]}`.trim();
  if (angka < 200) return `Seratus ${angkaTerbilang(angka - 100)}`.trim();
  if (angka < 1000)
    return `${bilangan[Math.floor(angka / 100)]} Ratus ${angkaTerbilang(angka % 100)}`.trim();
  if (angka < 2000) return `Seribu ${angkaTerbilang(angka - 1000)}`.trim();
  if (angka < 1000000)
    return `${angkaTerbilang(Math.floor(angka / 1000))} Ribu ${angkaTerbilang(angka % 1000)}`.trim();
  if (angka < 1000000000)
    return `${angkaTerbilang(Math.floor(angka / 1000000))} Juta ${angkaTerbilang(angka % 1000000)}`.trim();
  if (angka < 1000000000000)
    return `${angkaTerbilang(Math.floor(angka / 1000000000))} Miliar ${angkaTerbilang(angka % 1000000000)}`.trim();
  if (angka < 1000000000000000)
    return `${angkaTerbilang(Math.floor(angka / 1000000000000))} Triliun ${angkaTerbilang(angka % 1000000000000)}`.trim();
  return "";
}

// Format pemisah ribuan Rupiah
const formatRupiah = (value) => {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function AddMutationModal({
  isOpen,
  mutationType = "masuk",
  onClose,
  onSubmit,
}) {
  const isIncome = mutationType === "masuk";

  const [form, setForm] = useState({
    name: "",
    amount: "",
    note: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [dateTimeDisplay, setDateTimeDisplay] = useState("");

  // Fetch accounts when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/getSaldo`, {
          credentials: "include",
        });
        const result = await res.json();
        if (result.status) {
          setAccounts(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();

    // Reset form state on open
    setForm({
      name: "",
      amount: "",
      note: "",
    });

    // Generate formatted date time
    const now = new Date();
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formatted = now.toLocaleDateString("id-ID", options);
    setDateTimeDisplay(`Hari ini, ${formatted} WIB`);
  }, [isOpen, mutationType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = raw === "" ? "" : parseInt(raw, 10);

    if (numeric >= 10000000000000) return;

    setForm((prev) => ({ ...prev, amount: numeric }));
  };

  const addQuickAmount = (val) => {
    const current = Number(form.amount || 0);
    const nextVal = current + val;
    if (nextVal >= 10000000000000) return;
    setForm((prev) => ({ ...prev, amount: nextVal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Perhatian",
        position: "top-end",
        text: "Silakan masukkan nominal transaksi yang valid.",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    if (!form.name) {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Perhatian",
        position: "top-end",
        text: "Silakan pilih rekening transaksi.",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    setSubmitting(true);
    try {
      const url = isIncome
        ? `${API_BASE_URL}/finance/pemasukan`
        : `${API_BASE_URL}/finance/pengeluaran`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          note: form.note,
        }),
      });

      const result = await res.json();

      if (result.status) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: "Berhasil!",
          position: "top-end",
          text: isIncome
            ? "Pemasukan berhasil ditambahkan!"
            : "Pengeluaran berhasil dicatat!",
          timer: 2000,
          showConfirmButton: false,
        });
        if (onSubmit) {
          onSubmit(result.data);
        }
      } else {
        Swal.fire({
          toast: true,
          icon: "error",
          title: "Gagal",
          position: "top-end",
          text: result.message || "Gagal menyimpan data transaksi.",
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Error",
        position: "top-end",
        text: "Terjadi kesalahan saat menghubungi server.",
      });
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop Dimmer Layer */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] z-40 transition-opacity"
        onClick={onClose}
        data-purpose="modal-backdrop"
      />

      {/* Modal Container */}
      <div
        aria-labelledby="modal-title"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
      >
        {/* Modal Card Box */}
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.28)] border border-slate-100 flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
          {/* Modal Header */}
          <div className="px-7 pt-6 pb-4 flex items-start justify-between border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                  isIncome
                    ? "bg-emerald-50 border-emerald-100/80 text-emerald-600"
                    : "bg-rose-50 border-rose-100/80 text-rose-600"
                }`}
              >
                {isIncome ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-slate-900 tracking-tight"
                  id="modal-title"
                >
                  {isIncome ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isIncome
                    ? "Catat penerimaan dana baru ke dalam rekening Anda"
                    : "Catat pengeluaran dana baru dari rekening Anda"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Dialog"
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition duration-150 ease-in-out focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Scrollable Form Body */}
            <div className="px-7 py-5 overflow-y-auto space-y-5 flex-1">
              {/* Nominal Amount Section */}
              <div className="space-y-2" data-purpose="nominal-input-group">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
                  htmlFor="nominal-input"
                >
                  {isIncome ? "Nominal Pemasukan" : "Nominal Pengeluaran"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div
                  className={`relative rounded-2xl border-2 transition-all p-3 ${
                    isIncome
                      ? "border-emerald-500/80 bg-emerald-50/20 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10"
                      : "border-rose-500/80 bg-rose-50/20 focus-within:border-rose-600 focus-within:ring-4 focus-within:ring-rose-500/10"
                  }`}
                >
                  <div className="flex items-baseline">
                    <span
                      className={`text-lg font-bold mr-2 tracking-tight ${
                        isIncome ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      Rp
                    </span>
                    <input
                      id="nominal-input"
                      type="text"
                      inputMode="numeric"
                      value={formatRupiah(form.amount)}
                      onChange={handleAmountChange}
                      placeholder="0"
                      required
                      className="w-full bg-transparent border-0 p-0 text-2xl font-bold text-slate-900 focus:ring-0 focus:outline-none placeholder-slate-300 tracking-tight"
                    />
                  </div>
                  {Number(form.amount) > 0 && (
                    <div
                      className={`text-[11px] font-medium mt-0.5 ${
                        isIncome ? "text-emerald-700/80" : "text-rose-700/80"
                      }`}
                      id="amount-helper"
                    >
                      Terbilang: {angkaTerbilang(form.amount)} Rupiah
                    </div>
                  )}
                </div>

                {/* Quick Amount Chips for Fast Addition */}
                <div
                  className="flex flex-wrap gap-1.5 pt-1"
                  data-purpose="quick-amount-chips"
                >
                  {[50000, 100000, 500000, 1000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => addQuickAmount(val)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 transition-colors border border-slate-200/70 active:scale-95 cursor-pointer ${
                        isIncome
                          ? "hover:bg-emerald-50 hover:text-emerald-700"
                          : "hover:bg-rose-50 hover:text-rose-700"
                      }`}
                    >
                      + Rp {val.toLocaleString("id-ID")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Account Field */}
              <div className="space-y-1.5">
                <label
                  className="block text-xs font-semibold text-slate-700"
                  htmlFor="select-account"
                >
                  {isIncome ? "Rekening Tujuan" : "Sumber Rekening"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CreditCard
                      className={`w-4 h-4 ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    />
                  </div>
                  <select
                    id="select-account"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                  >
                    <option value="">-- Pilih Rekening --</option>
                    {accounts.map((acc) => (
                      <option key={acc.account_id} value={acc.account_name}>
                        {acc.account_name}{" "}
                        {acc.saldo != null
                          ? `(Saldo: Rp ${Number(acc.saldo).toLocaleString(
                              "id-ID"
                            )})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date and Time Field */}
              <div className="space-y-1.5">
                <label
                  className="block text-xs font-semibold text-slate-700"
                  htmlFor="transaction-date"
                >
                  Tanggal &amp; Waktu Transaksi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar
                      className={`w-4 h-4 ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    />
                  </div>
                  <input
                    id="transaction-date"
                    type="text"
                    readOnly
                    value={dateTimeDisplay}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Note / Description Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    className="block text-xs font-semibold text-slate-700"
                    htmlFor="transaction-note"
                  >
                    Catatan Transaksi
                  </label>
                  <span className="text-[11px] text-slate-400">Opsional</span>
                </div>
                <textarea
                  id="transaction-note"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows="3"
                  placeholder={
                    isIncome
                      ? "Contoh: Pembayaran termin 1 desain UI/UX mobile app klien Jakarta..."
                      : "Contoh: Makan siang bersama tim, bensin, belanja bulanan..."
                  }
                  className="w-full p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-7 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-white text-xs font-semibold transition duration-150 shadow-xs active:scale-[0.98] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-md transition duration-150 active:scale-[0.98] cursor-pointer ${
                  isIncome
                    ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-rose-600/20"
                } ${submitting ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>
                  {submitting
                    ? "Menyimpan..."
                    : isIncome
                    ? "Simpan Pemasukan"
                    : "Simpan Pengeluaran"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
