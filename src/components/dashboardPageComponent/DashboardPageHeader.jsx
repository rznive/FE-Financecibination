import { Plus } from "lucide-react";

export default function DashboardPageHeader({ onAddMutation }) {
  return (
    <section
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
      data-purpose="page-title-and-actions"
    >
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Ringkasan Keuangan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 font-medium">
          Kelola dan pantau aktivitas keuangan anda dalam satu dashboard
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onAddMutation("masuk")}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#00BA88] hover:bg-[#009F74] text-white px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Pemasukan</span>
        </button>

        <button
          type="button"
          onClick={() => onAddMutation("keluar")}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#C92A2A] hover:bg-[#AF1E1E] text-white px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Pengeluaran</span>
        </button>
      </div>
    </section>
  );
}
