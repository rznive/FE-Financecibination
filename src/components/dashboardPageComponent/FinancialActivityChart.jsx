import DailyMutationChart from "./DailyMutationChart";

export default function FinancialActivityChart({
  chartData = [],
  chartLoading = false,
}) {
  return (
    <section
      className="bg-white rounded-2xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      data-purpose="cash-flow-section"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Aktivitas Keuangan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualisasi Pemasukan dan Pengeluaran
          </p>
        </div>
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          {/* Legend Pemasukan & Pengeluaran */}
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50/90 border border-emerald-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-semibold text-emerald-800">Pemasukan</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 bg-rose-50/90 border border-rose-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-[11px] font-semibold text-rose-700">Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-3 sm:mt-6 w-full overflow-hidden" data-purpose="cash-flow-svg-chart">
        <DailyMutationChart data={chartData} loading={chartLoading} />
      </div>
    </section>
  );
}
