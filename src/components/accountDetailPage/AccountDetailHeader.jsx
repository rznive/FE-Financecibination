import { Link } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight, Edit3 } from "lucide-react";

export default function AccountDetailHeader({
  account,
  currentUser,
  onEditRekening,
  onOpenTransfer,
}) {
  return (
    <>
      {/* TopBar Header with Breadcrumbs */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase overflow-x-auto whitespace-nowrap">
          <span>Workspace</span>
          <span>/</span>
          <span>Personal Finance</span>
          <span>/</span>
          <Link
            to="/showAccounts"
            className="hover:text-slate-700 transition font-medium"
          >
            Accounts
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">
            {account?.account_name || "Detail Rekening"}
          </span>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer shadow-xs">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold">
              {currentUser?.full_name || "User Testing 1"}
            </span>
          </div>
        </div>
      </header>

      {/* Back Navigation & Action Bar */}
      <div>
        <Link
          to="/showAccounts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-3 group transition"
        >
          <ArrowLeft className="w-4 h-4 transition group-hover:-translate-x-0.5" />
          <span>Kembali ke Daftar Rekening</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Detail Rekening: {account?.account_name || "Memuat..."}
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Informasi detail, statistik saldo, serta riwayat
              mutasi khusus rekening ini.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onEditRekening}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition shadow-xs cursor-pointer active:scale-98"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Edit Rekening</span>
            </button>
            <button
              type="button"
              onClick={onOpenTransfer}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition shadow-xs cursor-pointer active:scale-98"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-500" />
              <span>Transfer Dana</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
