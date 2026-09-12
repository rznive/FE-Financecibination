import { Download, Search, X } from "lucide-react";

/**
 * MutasiFilterBar – Timeframe selector, search input, type/account filters, and CSV export.
 *
 * @param {object}   props
 * @param {string}   props.timeframe          - Current timeframe ("7d"|"1m"|"3m")
 * @param {function} props.onTimeframeChange  - (value) => void
 * @param {string}   props.dateRangeBadgeText - Human-readable date range string
 * @param {function} props.onExportCSV        - Handler for CSV export
 * @param {string}   props.searchQuery        - Current search query
 * @param {function} props.onSearchChange     - (value) => void
 * @param {string}   props.filterType         - Current type filter
 * @param {function} props.onFilterTypeChange - (value) => void
 * @param {string}   props.filterAccount      - Current account filter
 * @param {function} props.onFilterAccountChange - (value) => void
 * @param {Array}    props.accounts           - List of account objects
 */
export default function MutasiFilterBar({
  timeframe,
  onTimeframeChange,
  dateRangeBadgeText,
  onExportCSV,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterAccount,
  onFilterAccountChange,
  accounts,
}) {
  const timeframes = [
    { value: "7d", label: "7 Hari Terakhir" },
    { value: "1m", label: "1 Bulan" },
    { value: "3m", label: "3 Bulan" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">
      {/* Row 1: Timeframe buttons & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rentang:
          </span>
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                type="button"
                onClick={() => onTimeframeChange(tf.value)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeframe === tf.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
            {dateRangeBadgeText}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search input & Select filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari catatan transaksi / rekening..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="all">Semua Tipe</option>
            <option value="transfer">Transfer</option>
            <option value="keluar">Pengeluaran (Expense)</option>
            <option value="masuk">Pemasukan (Income)</option>
          </select>

          <select
            value={filterAccount}
            onChange={(e) => onFilterAccountChange(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="all">Semua Akun</option>
            {accounts.map((acc, index) => {
              const name = acc.account_name || acc.name || `Akun ${index + 1}`;
              return (
                <option key={acc.account_id || acc.id || index} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
