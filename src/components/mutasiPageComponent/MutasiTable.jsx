import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
} from "lucide-react";
import { getCategoryMeta, formatDateTime } from "./mutasiHelpers";

/**
 * MutasiTable – Renders the transactions data table with loading/empty states
 * and server-side pagination controls.
 *
 * @param {object}   props
 * @param {boolean}  props.loading           - Whether data is being fetched
 * @param {Array}    props.mutations         - The current page's mutation data (already filtered)
 * @param {function} props.onViewDetail      - (tx) => void — open detail modal
 * @param {number}   props.currentPage       - Current active page
 * @param {function} props.onPageChange      - (page) => void
 * @param {number}   props.totalPages        - Total number of pages
 * @param {number}   props.totalItems        - Total number of items across all pages
 * @param {number}   props.itemsPerPage      - Items per page
 * @param {function} props.onItemsPerPageChange - (value) => void
 * @param {number}   props.startIndex        - Starting index for display text
 */
export default function MutasiTable({
  loading,
  mutations,
  onViewDetail,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  startIndex,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-6">Waktu &amp; Tanggal</th>
              <th className="py-3.5 px-6">Rekening</th>
              <th className="py-3.5 px-6">Keterangan / Catatan</th>
              <th className="py-3.5 px-6">Kategori / Tipe</th>
              <th className="py-3.5 px-6">Arah Mutasi</th>
              <th className="py-3.5 px-6 text-right">Jumlah</th>
              <th className="py-3.5 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs text-slate-500">Memuat data mutasi...</p>
                  </div>
                </td>
              </tr>
            ) : mutations.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Filter className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">
                      Tidak ada transaksi yang sesuai
                    </p>
                    <p className="text-xs text-slate-400">
                      Coba ubah kata kunci pencarian atau ganti filter rentang waktu.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              mutations.map((tx) => {
                const isIncome = tx.mutation_type === "masuk";
                const meta = getCategoryMeta(tx);
                const { date, time } = formatDateTime(
                  tx.created_at || tx.date || tx.date_indonesia
                );
                const accountName =
                  tx.account?.name || tx.account_name || "Rekening";
                const amountNum = Number(tx.amount || 0);

                return (
                  <tr
                    key={tx.id || `${date}-${time}-${amountNum}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Waktu & Tanggal */}
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                      <div className="font-bold text-slate-900">{date}</div>
                      {time && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {time}
                        </div>
                      )}
                    </td>

                    {/* Rekening */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-800 text-xs">
                          {accountName}
                        </span>
                      </div>
                    </td>

                    {/* Keterangan / Catatan */}
                    <td className="py-4 px-6 max-w-xs truncate">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {tx.note || (isIncome ? "Pemasukan" : "Pengeluaran")}
                      </div>
                    </td>

                    {/* Kategori / Tipe */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeBg}`}
                      >
                        {meta.label}
                      </span>
                    </td>

                    {/* Arah Mutasi */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {isIncome ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <ArrowDownRight className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                          Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-red-600 border border-slate-200">
                          <ArrowUpRight className="w-3 h-3 text-red-600 stroke-[2.5]" />
                          Keluar
                        </span>
                      )}
                    </td>

                    {/* Jumlah */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span
                        className={`text-sm font-black ${
                          isIncome ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"}Rp{" "}
                        {amountNum.toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewDetail(tx)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer & Pagination */}
      <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          Menampilkan{" "}
          <span className="font-bold text-slate-800">
            {totalItems === 0
              ? 0
              : `${startIndex + 1}-${Math.min(
                  startIndex + itemsPerPage,
                  totalItems
                )}`}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-slate-800">
            {totalItems}
          </span>{" "}
          data mutasi
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            >
              Sebelumnya
            </button>

            {/* Dynamic page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 1
              )
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <div key={p} className="flex items-center gap-1">
                    {prev && p - prev > 1 && (
                      <span className="text-slate-400 px-1 text-xs">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border transition-colors ${
                        currentPage === p
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-black shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                );
              })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            >
              Selanjutnya
            </button>
          </div>

          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            <option value={5}>5 per halaman</option>
            <option value={10}>10 per halaman</option>
            <option value={25}>25 per halaman</option>
            <option value={50}>50 per halaman</option>
            <option value={100}>100 per halaman</option>
          </select>
        </div>
      </div>
    </div>
  );
}
