import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  ArrowLeftRight,
  Landmark,
  Wallet,
  CreditCard,
  Layers,
} from "lucide-react";

function getAccountIcon(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("giro") || lower.includes("bca") || lower.includes("mandiri") || lower.includes("bank")) {
    return {
      icon: <Landmark className="w-4 h-4 text-emerald-600" />,
      bg: "bg-emerald-50",
      desc: "Rekening Bank & Giro",
    };
  }
  if (lower.includes("gopay") || lower.includes("ovo") || lower.includes("dana") || lower.includes("wallet") || lower.includes("dompet")) {
    return {
      icon: <Wallet className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50",
      desc: "Dompet Transaksi Digital",
    };
  }
  if (lower.includes("tabungan") || lower.includes("darurat") || lower.includes("invest")) {
    return {
      icon: <CreditCard className="w-4 h-4 text-amber-600" />,
      bg: "bg-amber-50",
      desc: "Pos Simpanan & Tabungan",
    };
  }
  return {
    icon: <Layers className="w-4 h-4 text-slate-600" />,
    bg: "bg-slate-100",
    desc: "Pos Keuangan Pribadi",
  };
}

export default function AccountsTable({
  accounts = [],
  onSelectDetail,
  onOpenTransfer,
  loading = false,
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = accounts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const currentAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-6">Nama Rekening</th>
              <th className="py-3.5 px-6">Tipe & Status</th>
              <th className="py-3.5 px-6 text-right">Saldo Terkini</th>
              <th className="py-3.5 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                  <p className="mt-2 text-xs">Memuat data rekening...</p>
                </td>
              </tr>
            ) : currentAccounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-600 text-sm">
                    Belum ada rekening tercatat
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik tombol "Tambah Rekening" di atas untuk membuat pos rekening baru.
                  </p>
                </td>
              </tr>
            ) : (
              currentAccounts.map((acc, index) => {
                const meta = getAccountIcon(acc.account_name);
                const saldo = Number(acc.saldo || 0);

                return (
                  <tr
                    key={acc.account_id || index}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Account Name */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0 shadow-xs`}
                        >
                          {meta.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {acc.account_name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {meta.desc}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status / Category */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        Aktif
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span
                        className={`text-sm font-black ${
                          saldo > 0 ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        Rp {saldo.toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            onSelectDetail
                              ? onSelectDetail(acc)
                              : navigate(`/accounts/${acc.account_id}`)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-500/30 transition-colors shadow-xs cursor-pointer active:scale-95"
                          type="button"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => onOpenTransfer(acc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-500/30 transition-colors shadow-xs"
                          type="button"
                          title="Transfer dari/ke rekening ini"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
                          <span>Transfer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          Menampilkan{" "}
          <span className="font-bold text-slate-800">
            {totalItems > 0 ? startIndex + 1 : 0}-
            {Math.min(startIndex + itemsPerPage, totalItems)}
          </span>{" "}
          dari <span className="font-bold text-slate-800">{totalItems}</span>{" "}
          data rekening
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                type="button"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-colors ${
                    page === idx + 1
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                  type="button"
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                type="button"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
