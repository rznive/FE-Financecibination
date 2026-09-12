export default function SummaryCard({
  title,
  subtitle,
  icon,
  amountText,
  amountClassName = "text-slate-900",
  comparison,
  type = "income", // 'income' | 'expense' | 'cashflow'
}) {
  const renderBadge = () => {
    if (!comparison) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
          Belum ada data bulan lalu
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
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeColorClass}`}
      >
        {status !== "tetap" && `${arrowSymbol} `}
        {labelText} dari bulan lalu
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-center gap-2 text-slate-700">
          {icon}
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
            {title}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        <div className="mt-3">{renderBadge()}</div>
        <div className="mt-4">
          <p
            className={`text-2xl font-black tracking-tight ${amountClassName}`}
          >
            {amountText}
          </p>
        </div>
      </div>
    </div>
  );
}
