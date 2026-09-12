import DailyMutationChart from "../DailyMutationChart";

export default function FinancialActivityChart({
  chartData = [],
  chartLoading = false,
}) {
  return (
    <section
      className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      data-purpose="cash-flow-section"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Aktivitas Keuangan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualisasi Pemasukan dan Pengeluaran
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Legend Pemasukan & Pengeluaran */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Pemasukan
            </span>
            <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Pengeluaran
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 w-full" data-purpose="cash-flow-svg-chart">
        <DailyMutationChart data={chartData} loading={chartLoading} />
      </div>
    </section>
  );
}
