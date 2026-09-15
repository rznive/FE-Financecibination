import { FileSpreadsheet, Search, Layers } from "lucide-react";
import { formatDateTime, getCategoryMeta } from "../mutasiPageComponent";

export default function AccountDetailMutasiTable({
  mutations = [],
  paginatedMutations = [],
  totalTableItems = 0,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  currentPage,
  setCurrentPage,
  totalTablePages,
  itemsPerPage,
  startTableIndex,
  loadingMutations = false,
  onExportCSV,
  onViewDetail,
}) {
  return (
    <section
      aria-label="Riwayat Mutasi"
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
    >
      {/* Table Header & Filters */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Riwayat Mutasi Rekening
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {totalTableItems} Mutasi
            </span>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition self-start sm:self-auto shadow-xs cursor-pointer active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Export CSV / Excel</span>
          </button>
        </div>

        {/* Search & Filter Category Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari catatan atau nominal transaksi..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => {
                setFilterType("all");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                filterType === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Semua ({mutations.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterType("masuk");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                filterType === "masuk"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterType("keluar");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                filterType === "keluar"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterType("transfer");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                filterType === "transfer"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Table Responsive Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-6">Waktu &amp; Tanggal</th>
              <th className="py-3 px-6">Keterangan / Catatan</th>
              <th className="py-3 px-6">Kategori / Tipe</th>
              <th className="py-3 px-6">Arah Mutasi</th>
              <th className="py-3 px-6 text-right">Nominal</th>
              <th className="py-3 px-6 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loadingMutations ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                  <p className="mt-2 text-xs">Memuat data mutasi...</p>
                </td>
              </tr>
            ) : paginatedMutations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-600 text-sm">
                    Belum ada data mutasi untuk rekening ini
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Lakukan transaksi atau transfer dana untuk mencatat mutasi.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedMutations.map((tx, idx) => {
                const { date } = formatDateTime(
                  tx.created_at || tx.date || tx.date_indonesia
                );
                const isIncome = tx.mutation_type === "masuk";
                const meta = getCategoryMeta(tx);
                const isTransfer = meta.typeKey === "transfer";

                return (
                  <tr
                    key={tx.id || tx.transaction_id || idx}
                    className="hover:bg-slate-50/80 transition"
                  >
                    {/* Waktu & Tanggal */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-xs">
                        {date}
                      </div>
                    </td>

                    {/* Keterangan / Catatan */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">
                        {tx.note || (isIncome ? "Pemasukan Dana" : "Pengeluaran Dana")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isTransfer
                          ? "Mutasi Transfer Antar Pos Rekening"
                          : meta.label}
                      </div>
                    </td>

                    {/* Kategori / Tipe */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isTransfer
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                            : isIncome
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {isTransfer
                          ? "Transfer"
                          : isIncome
                          ? "Pemasukan"
                          : "Pengeluaran"}
                      </span>
                    </td>

                    {/* Arah Mutasi */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isIncome
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-rose-600 bg-rose-50"
                        }`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          {isIncome ? (
                            <path
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          ) : (
                            <path
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                        {isIncome ? "Masuk" : "Keluar"}
                      </span>
                    </td>

                    {/* Nominal */}
                    <td
                      className={`py-4 px-6 text-right whitespace-nowrap font-bold font-mono ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}Rp{" "}
                      {Number(tx.amount || 0).toLocaleString("id-ID")}
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewDetail(tx)}
                        className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer active:scale-95"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-4 sm:px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="text-slate-500">
          Menampilkan{" "}
          <span className="font-semibold text-slate-800">
            {totalTableItems > 0 ? startTableIndex + 1 : 0}–
            {Math.min(startTableIndex + itemsPerPage, totalTableItems)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-slate-800">
            {totalTableItems}
          </span>{" "}
          data mutasi
        </div>

        {totalTablePages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed font-medium bg-white hover:bg-slate-50 transition cursor-pointer"
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalTablePages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition cursor-pointer ${
                  currentPage === idx + 1
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalTablePages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalTablePages, p + 1))
              }
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition cursor-pointer disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
