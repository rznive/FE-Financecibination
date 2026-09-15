export default function SummaryCard({
  title,
  subtitle,
  icon,
  amountText,
  amountClassName = "text-slate-900",
  comparison,
  type = "income", // 'income' | 'expense' | 'cashflow'
  compact = false,
}) {
  const renderBadge = () => {
    if (!comparison) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
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
        className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${badgeColorClass}`}
      >
        {status !== "tetap" && `${arrowSymbol} `}
        {labelText} {!compact && "dari bulan lalu"}
      </span>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all ${
        compact ? "p-3.5 sm:p-5" : "p-4 sm:p-6"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-700 min-w-0">
            {icon}
            <h2 className="text-[10.5px] sm:text-xs font-bold tracking-wider uppercase text-slate-700 truncate">
              {title}
            </h2>
          </div>
          {!compact && renderBadge()}
        </div>
        <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1 mb-2">
          {subtitle}
        </p>
        {compact && <div className="mb-2">{renderBadge()}</div>}
        <div className="mt-1 sm:mt-2">
          <p
            className={`font-extrabold tracking-tight leading-tight ${
              compact ? "text-base sm:text-xl md:text-2xl" : "text-xl sm:text-2xl md:text-[26px]"
            } ${amountClassName}`}
          >
            {amountText}
          </p>
        </div>
      </div>
    </div>
  );
}
