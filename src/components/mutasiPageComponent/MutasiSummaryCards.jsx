import {
  ArrowUpRight,
  TrendingDown,
  Layers,
} from "lucide-react";

/**
 * MutasiSummaryCards – Renders the 3 summary metric cards
 * (Total Pemasukan, Total Pengeluaran, Net Mutasi Periode).
 *
 * @param {object}  props
 * @param {object}  props.summary       - Summary data from API
 * @param {boolean} props.isSurplus     - Whether net mutasi is surplus
 * @param {string}  props.netStatus     - "surplus" | "defisit"
 * @param {number}  props.netAmount     - Absolute value of net mutasi
 * @param {string}  props.periodLabel   - Human-readable period text
 */
export default function MutasiSummaryCards({
  summary,
  isSurplus,
  netStatus,
  netAmount,
  periodLabel,
}) {
  return (
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
              {(summary?.total_pemasukan?.count ?? 0)} Mutasi
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              Rp {(summary?.total_pemasukan?.amount ?? 0).toLocaleString("id-ID")}
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
              {(summary?.total_pengeluaran?.count ?? 0)} Mutasi
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              Rp {(summary?.total_pengeluaran?.amount ?? 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Net Mutasi Periode */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSurplus
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-red-600"
                }`}
              >
                <Layers
                  className={`w-4 h-4 stroke-[2] ${
                    isSurplus ? "text-emerald-600" : "text-red-600"
                  }`}
                />
              </div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                Net Mutasi Periode
              </h2>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                isSurplus
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-rose-50 text-red-600 border border-rose-100"
              }`}
            >
              {netStatus}
            </span>
          </div>
          <div className="mt-4">
            <p
              className={`text-2xl font-black tracking-tight ${
                isSurplus ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isSurplus ? "+" : "-"}Rp{" "}
              {netAmount.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Total saldo mutasi bersih selama {periodLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
