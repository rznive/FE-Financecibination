import { Link } from "react-router-dom";
import {
  ChevronRight,
  Repeat,
  UtensilsCrossed,
  Car,
  Wifi,
  ShoppingBag,
  Briefcase,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";

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
  if (
    note.includes("gaji") ||
    note.includes("salary") ||
    note.includes("freelance")
  ) {
    return <Briefcase className="w-5 h-5" />;
  }

  return isIncome ? (
    <ArrowUpRight className="w-5 h-5" />
  ) : (
    <CreditCard className="w-5 h-5" />
  );
};

export default function RecentTransactionsCard({
  transactions = [],
  loading = false,
}) {
  return (
    <section
      className="bg-white rounded-2xl p-4 sm:p-5 md:p-7 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col space-y-4"
      data-purpose="recent-transactions-widget"
    >
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
            Transaksi Terbaru
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Aktivitas Keuangan Terbaru
          </p>
        </div>
        <Link
          to="/showMutasi"
          className="text-xs md:text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-4 h-4 stroke-[2.2]" />
        </Link>
      </div>

      {/* Transaction Items List */}
      <div className="space-y-2.5 sm:space-y-3 pt-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-slate-400">Memuat transaksi...</p>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-10 sm:py-12">
            Belum ada transaksi terbaru.
          </p>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.mutation_type === "masuk";
            const accountName =
              tx.account?.name || tx.account_name || "Akun";
            const amountNum = Number(tx.amount || 0);

            return (
              <div
                key={tx.id}
                className="p-3 sm:p-3.5 md:p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 transition-all flex items-center justify-between gap-3"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 mr-2">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100/60"
                        : "bg-rose-50 text-rose-500 border border-rose-100/60"
                    }`}
                  >
                    {renderTxIcon(tx)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 truncate leading-snug">
                      {tx.note || (isIncome ? "Pemasukan" : "Pengeluaran")}
                    </p>
                    <p className="text-[10.5px] sm:text-xs text-slate-400 mt-0.5 truncate">
                      {accountName} • {formatTxDate(tx.created_at)}
                    </p>
                  </div>
                </div>

                {/* Right: Category Badge & Amount */}
                <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 text-right">
                  {/* Badge visible side-by-side on sm/md/lg tablet screens */}
                  <span
                    className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100/80"
                        : "bg-slate-100 text-slate-600 border border-slate-200/70"
                    }`}
                  >
                    {getTxBadge(tx)}
                  </span>

                  {/* Mobile stacked badge on < sm */}
                  <div className="flex flex-col items-end sm:hidden">
                    <span
                      className={`inline-block text-[9.5px] font-medium px-1.5 py-0.5 rounded mb-1 leading-tight ${
                        isIncome
                          ? "bg-emerald-50/90 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {getTxBadge(tx)}
                    </span>
                    <span
                      className={`text-xs font-bold leading-none ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}Rp{" "}
                      {amountNum.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Tablet/Desktop amount */}
                  <span
                    className={`hidden sm:inline-block text-sm md:text-base font-bold whitespace-nowrap ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
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
  );
}
