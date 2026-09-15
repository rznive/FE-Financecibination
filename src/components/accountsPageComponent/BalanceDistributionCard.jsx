const COLOR_PALETTE = [
  { bg: "bg-slate-900", dot: "bg-slate-900", hex: "#0f172a" },
  { bg: "bg-blue-600", dot: "bg-blue-600", hex: "#2563eb" },
  { bg: "bg-emerald-500", dot: "bg-emerald-500", hex: "#10b981" },
  { bg: "bg-amber-500", dot: "bg-amber-500", hex: "#f59e0b" },
  { bg: "bg-indigo-500", dot: "bg-indigo-500", hex: "#6366f1" },
  { bg: "bg-purple-500", dot: "bg-purple-500", hex: "#a855f7" },
  { bg: "bg-rose-500", dot: "bg-rose-500", hex: "#f43f5e" },
  { bg: "bg-cyan-500", dot: "bg-cyan-500", hex: "#06b6d4" },
];

export default function BalanceDistributionCard({
  accounts = [],
  totalBalance = 0,
}) {
  const numericTotal = Number(totalBalance || 0);

  // Calculate percentages
  const distribution = accounts.map((acc, index) => {
    const saldo = Number(acc.saldo || 0);
    const percentage = numericTotal > 0 ? (saldo / numericTotal) * 100 : 0;
    const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
    return {
      ...acc,
      saldo,
      percentage: Number(percentage.toFixed(1)),
      color,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4 hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Distribusi Saldo
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Penyebaran aset moneter di setiap rekening aktif
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Total: Rp {numericTotal.toLocaleString("id-ID")}
        </span>
      </div>

      {/* Multi-segment distribution bar */}
      <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
        {numericTotal > 0 && distribution.some((d) => d.percentage > 0) ? (
          distribution.map((item, idx) => {
            if (item.percentage <= 0) return null;
            return (
              <div
                key={item.account_id || idx}
                className={`h-full ${item.color.bg} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.account_name}: ${item.percentage}% (Rp ${item.saldo.toLocaleString("id-ID")})`}
              />
            );
          })
        ) : (
          <div className="h-full w-full bg-slate-200" />
        )}
      </div>

      {/* Legend list */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-xs">
        {distribution.length > 0 ? (
          distribution.map((item, idx) => (
            <div
              key={item.account_id || idx}
              className="flex items-center gap-2"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${item.color.dot} flex-shrink-0`}
              />
              <span className="font-bold text-slate-800">
                {item.account_name}
              </span>
              <span className="text-slate-400">
                {item.percentage}% • Rp {item.saldo.toLocaleString("id-ID")}
              </span>
            </div>
          ))
        ) : (
          <span className="text-slate-400 italic">
            Belum ada rekening untuk dihitung distribusinya
          </span>
        )}
      </div>
    </div>
  );
}
