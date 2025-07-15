import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function TransferModal({ isOpen, onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [deskripsi, setDeskripsi] = useState(""); // Tambahkan state deskripsi
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/getAccount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.status && Array.isArray(result.data)) {
          setAccounts(result.data);
        } else {
          console.error("Gagal mengambil akun:", result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAccounts();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from_account_id: fromAccount,
          to_account_id: toAccount,
          amount: parseFloat(amount),
          deskripsi, // Kirim deskripsi
        }),
      });
      const result = await res.json();
      if (res.ok && result.status) {
        setStatus({ success: true, message: "Transfer berhasil!" });
        onSuccess();
        setFromAccount("");
        setToAccount("");
        setAmount("");
        setDeskripsi(""); // Reset deskripsi
        onClose();
      } else {
        setStatus({
          success: false,
          message: result.message || "Gagal transfer.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: "Terjadi kesalahan server." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
        <h2 className="text-lg font-bold mb-4">Transfer Antar Akun</h2>

        {status && (
          <div
            className={`mb-2 p-2 rounded ${
              status.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-1 font-medium">Dari Akun</label>
          <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="">-- Pilih Akun --</option>
            {accounts.map((acc) => (
              <option key={acc.account_id} value={acc.account_id}>
                {acc.account_name} - Rp
                {parseInt(acc.saldo).toLocaleString("id-ID")}
              </option>
            ))}
          </select>

          <label className="block mb-1 font-medium">Ke Akun</label>
          <select
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="">-- Pilih Akun --</option>
            {accounts.map((acc) => (
              <option key={acc.account_id} value={acc.account_id}>
                {acc.account_name} - Rp
                {parseInt(acc.saldo).toLocaleString("id-ID")}
              </option>
            ))}
          </select>

          <label className="block mb-1 font-medium">Jumlah</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            className="w-full mb-3 p-2 border rounded"
          />

          <label className="block mb-1 font-medium">Deskripsi</label>
          <input
            type="text"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Contoh: Transfer ke tabungan"
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Memproses..." : "Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
