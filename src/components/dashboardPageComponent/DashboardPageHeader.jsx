import { Plus } from "lucide-react";

export default function DashboardPageHeader({ onAddMutation }) {
  return (
    <section
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      data-purpose="page-title-and-actions"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ringkasan Keuangan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Kelola dan pantau aktivitas keuangan anda dalam satu dashboard
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onAddMutation("masuk")}
          className="inline-flex items-center gap-2 bg-[#00BA88] hover:bg-[#009F74] text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Pemasukan</span>
        </button>

        <button
          type="button"
          onClick={() => onAddMutation("keluar")}
          className="inline-flex items-center gap-2 bg-[#C92A2A] hover:bg-[#AF1E1E] text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Pengeluaran</span>
        </button>
      </div>
    </section>
  );
}
