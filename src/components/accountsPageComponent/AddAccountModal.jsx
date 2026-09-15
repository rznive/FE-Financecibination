import { useState } from "react";
import { X, Landmark, Plus, Check } from "lucide-react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../config";

export default function AddAccountModal({ isOpen, onClose, onSuccess }) {
  const [accountName, setAccountName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickSuggestions = [
    "BCA Giro Operasional",
    "Mandiri Tabungan",
    "GoPay Dompet Digital",
    "OVO Saldo Belanja",
    "Kas Dompet Fisik",
    "Dana Darurat",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = accountName.trim();
    if (!trimmed) {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Perhatian",
        text: "Nama rekening wajib diisi!",
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/tambahRekening`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmed }),
      });

      const result = await res.json();

      if (res.ok && (result.status || result.success)) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: "Berhasil",
          text: "Rekening baru berhasil ditambahkan!",
          position: "top-end",
          timer: 2500,
          showConfirmButton: false,
        });
        setAccountName("");
        onSuccess(result.data);
        onClose();
      } else {
        Swal.fire({
          toast: true,
          icon: "error",
          title: "Gagal",
          text: result.message || "Gagal menambahkan rekening.",
          position: "top-end",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error adding account:", err);
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Kesalahan",
        text: "Terjadi kesalahan jaringan atau server.",
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tambah Rekening Baru
              </h3>
              <p className="text-xs text-slate-400">
                Buat pos akun bank, e-wallet, atau tabungan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Nama Rekening / Akun <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Contoh: BCA Payroll, Gopay, Dompet Utama"
              required
              autoFocus
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 mb-2">
              Rekomendasi Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAccountName(item)}
                  className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !accountName.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#00BA88] hover:bg-[#009F74] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Rekening</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
