export default function AccountDetailTrendChart({
  chartData = [],
  chartTimeframe,
  setChartTimeframe,
  maxChartVal,
  masukRatio,
  keluarRatio,
  metrics,
}) {
  return (
    <section
      aria-label="Visualisasi Tren Saldo"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Tren Arus Saldo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi perbandingan dana pemasukan dan pengeluaran per periode
          </p>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          {/* 2-Variable Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-600 inline-block" />
              <span className="text-slate-700">Pengeluaran</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2170e4] inline-block" />
              <span className="text-slate-700">Dana Masuk</span>
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChartTimeframe("7d")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                chartTimeframe === "7d"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe("30d")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                chartTimeframe === "30d"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 Hari
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe("month")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                chartTimeframe === "month"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart with Y-Axis and Gridlines */}
      <div className="relative pt-2 pb-2">
        <div className="flex">
          {/* Y-Axis labels */}
          <div className="flex flex-col justify-between items-end pr-3 pb-7 text-[11px] font-medium text-slate-400 select-none h-52 shrink-0 w-12">
            <span>
              {maxChartVal >= 1000000
                ? `${(maxChartVal / 1000000).toFixed(0)}jt`
                : maxChartVal >= 1000
                ? `${(maxChartVal / 1000).toFixed(0)}rb`
                : maxChartVal}
            </span>
            <span>
              {maxChartVal >= 1000000
                ? `${((maxChartVal * 0.75) / 1000000).toFixed(0)}jt`
                : `${((maxChartVal * 0.75) / 1000).toFixed(0)}rb`}
            </span>
            <span>
              {maxChartVal >= 1000000
                ? `${((maxChartVal * 0.5) / 1000000).toFixed(0)}jt`
                : `${((maxChartVal * 0.5) / 1000).toFixed(0)}rb`}
            </span>
            <span>
              {maxChartVal >= 1000000
                ? `${((maxChartVal * 0.25) / 1000000).toFixed(0)}jt`
                : `${((maxChartVal * 0.25) / 1000).toFixed(0)}rb`}
            </span>
            <span>0</span>
          </div>

          {/* Chart plotting area with horizontal grid lines */}
          <div className="flex-1 relative flex flex-col justify-between h-52 pb-7">
            {/* Gridlines */}
            <div className="absolute inset-x-0 top-0 border-b border-slate-100" />
            <div className="absolute inset-x-0 top-1/4 border-b border-slate-100" />
            <div className="absolute inset-x-0 top-2/4 border-b border-slate-100" />
            <div className="absolute inset-x-0 top-3/4 border-b border-slate-100" />
            <div className="absolute inset-x-0 bottom-7 border-b border-slate-200" />

            {/* Stacked Bars Container */}
            <div className="relative z-10 h-full flex items-end justify-around px-2 sm:px-6">
              {chartData.map((bar, idx) => {
                const totalAmt = bar.masuk + bar.keluar;
                const maxH = 140; // max bar height in px
                const barHeight =
                  totalAmt > 0
                    ? Math.max(12, Math.round((totalAmt / maxChartVal) * maxH))
                    : 6;

                const masukPct =
                  totalAmt > 0 ? (bar.masuk / totalAmt) * barHeight : 0;
                const keluarPct =
                  totalAmt > 0 ? (bar.keluar / totalAmt) * barHeight : 0;

                return (
                  <div
                    key={idx}
                    className="flex-1 max-w-[48px] flex flex-col items-center group relative cursor-pointer"
                  >
                    <div className="w-full flex flex-col rounded-t-sm overflow-hidden shadow-xs">
                      {/* Top: Pengeluaran (Rose) */}
                      <div
                        className="w-full bg-rose-600 hover:bg-rose-700 transition"
                        style={{
                          height: `${keluarPct || (totalAmt === 0 ? 3 : 2)}px`,
                        }}
                      />
                      {/* Bottom: Dana Masuk (Blue) */}
                      <div
                        className="w-full bg-[#2170e4] hover:bg-blue-600 transition"
                        style={{
                          height: `${masukPct || (totalAmt === 0 ? 3 : 2)}px`,
                        }}
                      />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1 px-2.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-30">
                      <div>
                        Masuk: Rp {bar.masuk.toLocaleString("id-ID")} | Keluar:
                        Rp {bar.keluar.toLocaleString("id-ID")}
                      </div>
                      <div className="text-slate-300 font-bold text-center">
                        Total: Rp {totalAmt.toLocaleString("id-ID")}
                      </div>
                    </div>

                    {/* X-Axis Label */}
                    <span className="absolute -bottom-6 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Stats */}
      <div className="mt-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          Rasio Dana Masuk vs Keluar:{" "}
          <strong className="text-slate-700">
            {masukRatio}% / {keluarRatio}%
          </strong>
        </span>

        <span
          className={`font-semibold ${
            metrics.isSurplus ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          Surplus Akumulatif: {metrics.isSurplus ? "+" : "-"}Rp{" "}
          {Math.abs(metrics.netCashflow).toLocaleString("id-ID")}
        </span>
      </div>
    </section>
  );
}
