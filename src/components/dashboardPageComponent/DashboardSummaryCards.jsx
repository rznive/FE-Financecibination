import { ArrowUpRight, TrendingDown, ArrowLeftRight } from "lucide-react";

export default function DashboardSummaryCards({
  monthlyIncome = 0,
  incomeComparison = null,
  monthlySpending = 0,
  spendingComparison = null,
  netCashflow = 0,
  cashflowComparison = null,
}) {
  const isCashflowPositive = netCashflow >= 0;

  const renderBadge = (comparison, type = "income", isFull = false) => {
    if (!comparison) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
          Belum ada data
        </span>
      );
    }

    const status = comparison?.status;
    const percentage = comparison?.persentase_perubahan;

    // Untuk expense: naik = merah/rose, turun = hijau/emerald
    // Untuk income & cashflow: naik = hijau/emerald, turun = merah/rose
    const isNegative =
      type === "expense" ? status === "naik" : status === "turun";

    const badgeColorClass = isNegative
      ? "bg-rose-50 text-rose-700 border border-rose-100"
      : "bg-emerald-50 text-emerald-700 border border-emerald-100";

    const arrowSymbol = status === "turun" ? "↓" : "↑";

    const labelText =
      percentage != null
        ? `${percentage}%`
        : status === "naik"
        ? "Naik"
        : status === "turun"
        ? "Turun"
        : "Tetap";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badgeColorClass}`}
      >
        {status !== "tetap" && `${arrowSymbol} `}
        {labelText} {isFull && "dari bulan lalu"}
      </span>
    );
  };

  return (
    <section className="space-y-4" data-purpose="metrics-summary-cards">
      {/* SISA UANG: 1 Full-Width Card (Balanced height & readable headline on Mobile, Tablet & Desktop) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:shadow-md transition-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-xs font-bold tracking-wide uppercase text-slate-600">
              SISA UANG
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Selisih pemasukan dan pengeluaran bulan ini
          </p>
          <div
            className={`text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight pt-1 leading-none ${
              isCashflowPositive ? "text-[#059669]" : "text-rose-600"
            }`}
          >
            {isCashflowPositive ? "+" : "-"}Rp{" "}
            {Math.abs(Number(netCashflow || 0)).toLocaleString("id-ID")}
          </div>
        </div>

        <div className="self-start sm:self-center">
          {renderBadge(cashflowComparison, "cashflow", true)}
        </div>
      </div>

      {/* PEMASUKAN & PENGELUARAN: Proportional 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Card Pemasukan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-xs font-bold tracking-wide uppercase text-slate-600">
                PEMASUKAN
              </span>
            </div>
            {renderBadge(incomeComparison, "income", false)}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-normal">
              Tercatat bulan ini
            </p>
            <div className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-slate-900 tracking-tight mt-0.5">
              Rp {Number(monthlyIncome || 0).toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        {/* Card Pengeluaran */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-xs font-bold tracking-wide uppercase text-slate-600">
                PENGELUARAN
              </span>
            </div>
            {renderBadge(spendingComparison, "expense", false)}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-normal">
              Tercatat bulan ini
            </p>
            <div className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-slate-900 tracking-tight mt-0.5">
              Rp {Number(monthlySpending || 0).toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
