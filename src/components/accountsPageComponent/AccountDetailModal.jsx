import { X, Wallet, ArrowLeftRight, FileText, CheckCircle2, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function AccountDetailModal({
  isOpen,
  onClose,
  account,
  totalBalance = 0,
  onOpenTransfer,
}) {
  if (!isOpen || !account) return null;

  const saldo = Number(account.saldo || 0);
  const numericTotal = Number(totalBalance || 0);
  const percentage = numericTotal > 0 ? ((saldo / numericTotal) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Detail Rekening
              </h3>
              <p className="text-xs text-slate-400">
                Informasi saldo dan instrumen rekening
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Card representation */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                  POS REKENING
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Aktif
              </span>
            </div>

            <div className="my-4">
              <span className="text-xs text-slate-400 block mb-1">
                Saldo Terkini
              </span>
              <div className="text-3xl font-black text-white tracking-tight">
                Rp {saldo.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-slate-100">
                {account.account_name}
              </span>
              <span className="text-slate-400">
                ID: {account.account_id || "-"}
              </span>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">
                Porsi dari Total Saldo
              </span>
              <p className="text-xl font-bold text-slate-800 mt-1">
                {percentage}%
              </p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">
                Status Akun
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 text-sm">
                  Siap Transaksi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dapat digunakan di mutasi
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 pt-2">
            <Link
              to={`/accounts/${account.account_id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Buka Halaman Detail Lengkap</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenTransfer) onOpenTransfer(account);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-xs"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transfer dari / ke Rekening Ini</span>
            </button>

            <Link
              to="/showMutasi"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm transition-all shadow-xs"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Lihat Riwayat Mutasi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
