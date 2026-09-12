import { X } from "lucide-react";
import MutationForm from "../TransactionForm";

export default function AddMutationModal({
  isOpen,
  mutationType,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-xl font-bold mb-6 text-slate-900">
          {mutationType === "masuk"
            ? "Tambah Pemasukan"
            : "Tambah Pengeluaran"}
        </h3>
        <MutationForm
          title={mutationType === "masuk" ? "Pemasukan" : "Pengeluaran"}
          mutationType={mutationType}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
