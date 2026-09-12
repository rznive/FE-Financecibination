import { X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getCategoryMeta, formatDateTime } from "./mutasiHelpers";

/**
 * MutasiDetailModal – Shows detailed information about a single transaction.
 *
 * @param {object}   props
 * @param {object}   props.transaction - The selected transaction object
 * @param {function} props.onClose     - Handler to close the modal
 */
export default function MutasiDetailModal({ transaction, onClose }) {
  if (!transaction) return null;

  const isIncome = transaction.mutation_type === "masuk";
  const { date, time } = formatDateTime(
    transaction.created_at || transaction.date || transaction.date_indonesia
  );
  const meta = getCategoryMeta(transaction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isIncome
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-red-600"
            }`}
          >
            {isIncome ? (
              <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Detail Transaksi
            </h3>
            <p className="text-xs text-slate-400">
              ID: #{transaction.id || "N/A"}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Arah Mutasi</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full ${
                isIncome
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-red-600"
              }`}
            >
              {isIncome ? "Dana Masuk (Income)" : "Dana Keluar (Expense)"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Nominal</span>
            <span
              className={`font-black text-sm ${
                isIncome ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isIncome ? "+" : "-"}Rp{" "}
              {Number(transaction.amount || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Rekening</span>
            <span className="font-semibold text-slate-800">
              {transaction.account?.name ||
                transaction.account_name ||
                "Rekening"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Waktu Transaksi</span>
            <span className="font-medium text-slate-700 text-right">
              {date} {time}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Kategori / Tipe</span>
            <span className="font-semibold text-slate-800">
              {meta.label}
            </span>
          </div>

          <div className="pt-2">
            <span className="text-slate-500 font-medium block mb-1">
              Catatan / Keterangan
            </span>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium">
              {transaction.note || "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
