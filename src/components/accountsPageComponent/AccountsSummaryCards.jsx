import { Wallet, Sparkles, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function AccountsSummaryCards({
  accounts = [],
  totalBalance = 0,
  monthlyIncome = 0,
  monthlySpending = 0,
  incomeComparison = null,
  spendingComparison = null,
  loading = false,
}) {
  // Find top account by balance
  const topAccount = accounts.length > 0
    ? [...accounts].sort((a, b) => Number(b.saldo || 0) - Number(a.saldo || 0))[0]
    : null;

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      data-purpose="metrics-summary-cards"
    >
      {/* 1. Total Saldo */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                Total Saldo
              </h2>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {accounts.length} Aktif
            </span>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                Rp {Number(totalBalance || 0).toLocaleString("id-ID")}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {accounts.length} Akun Aktif
            </p>
          </div>
        </div>
      </div>

      {/* 2. Akun Teraktif / Terbesar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                Saldo Tertinggi
              </h2>
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <p className="text-2xl font-black text-slate-900 tracking-tight truncate">
                {topAccount ? topAccount.account_name : "Belum Ada"}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {topAccount
                ? `Saldo: Rp ${Number(topAccount.saldo || 0).toLocaleString("id-ID")}`
                : "Silakan tambah Akun"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dana Masuk (Bulan Ini) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                Dana Masuk (Bulan Ini)
              </h2>
            </div>
            {incomeComparison ? (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  incomeComparison.status === "naik"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-rose-50 text-red-600 border-rose-100"
                }`}
              >
                {incomeComparison.status === "naik" ? "+" : "-"}
                {incomeComparison.persentase || 0}%
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Bulan Ini
              </span>
            )}
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <p className="text-2xl font-black text-emerald-600 tracking-tight">
                Rp {Number(monthlyIncome || 0).toLocaleString("id-ID")}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {incomeComparison?.selisih_nominal !== undefined
                ? `${incomeComparison.status === "naik" ? "+" : "-"}Rp ${Math.abs(incomeComparison.selisih_nominal).toLocaleString("id-ID")} vs bln lalu`
                : "Total pemasukan bulan ini"}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Pengeluaran (Bulan Ini) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-red-600 flex items-center justify-center flex-shrink-0">
                <ArrowDownLeft className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                Pengeluaran (Bulan Ini)
              </h2>
            </div>
            {spendingComparison ? (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  spendingComparison.status === "turun"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-rose-50 text-red-600 border-rose-100"
                }`}
              >
                {spendingComparison.status === "naik" ? "+" : "-"}
                {spendingComparison.persentase || 0}%
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-red-600 border border-slate-200">
                Bulan Ini
              </span>
            )}
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <p className="text-2xl font-black text-red-600 tracking-tight">
                Rp {Number(monthlySpending || 0).toLocaleString("id-ID")}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {spendingComparison?.selisih_nominal !== undefined
                ? `${spendingComparison.status === "naik" ? "+" : "-"}Rp ${Math.abs(spendingComparison.selisih_nominal).toLocaleString("id-ID")} vs bln lalu`
                : "Total pengeluaran bulan ini"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
