import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function AccountDetailHeroMetrics({
  account,
  metrics,
  masukRatio,
  keluarRatio,
}) {
  const saldoNumber = Number(account?.saldo || 0);

  return (
    <section
      aria-label="Ringkasan Finansial Rekening"
      className="gap-5 flex flex-col"
    >
      {/* Dark Hero Banner */}
      <div className="bg-[#131b26] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-slate-800">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />

        <div className="relative z-20">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Saldo Tersedia
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            Rp {saldoNumber.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-6 border-t border-slate-800/80 pt-4 md:pt-0 md:border-t-0">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>{account?.account_name || "Rekening"}</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Dana Masuk */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between shadow-xs hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              +{masukRatio}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Total Dana Masuk
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              Rp {metrics.totalMasuk.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Akumulasi pemasukan rekening ini
            </p>
          </div>
        </div>

        {/* Metric 2: Total Pengeluaran */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between shadow-xs hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              {keluarRatio}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Total Pengeluaran
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              Rp {metrics.totalKeluar.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total transfer keluar
            </p>
          </div>
        </div>

        {/* Metric 3: Arus Kas Bersih */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between shadow-xs hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                metrics.isSurplus
                  ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                  : "text-rose-700 bg-rose-50 border-rose-100"
              }`}
            >
              {metrics.isSurplus ? "Surplus" : "Defisit"}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Selisih Mutasi
            </span>
            <div
              className={`text-2xl font-bold mt-1 ${
                metrics.isSurplus ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {metrics.isSurplus ? "+" : "-"}Rp{" "}
              {Math.abs(metrics.netCashflow).toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {metrics.isSurplus
                ? "Saldo positif periode ini"
                : "Pengeluaran melampaui pemasukan"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
