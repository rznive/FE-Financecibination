import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import TransferModal from "../components/transferModal";

export default function TransferPage() {
  const [riwayat, setRiwayat] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRiwayat = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/transfer/riwayat`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (result.status) setRiwayat(result.data);
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Riwayat Transfer</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Transfer
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4">Tanggal</th>
              <th className="py-2 px-4">Dari</th>
              <th className="py-2 px-4">Ke</th>
              <th className="py-2 px-4">Jumlah</th>
              <th className="py-2 px-4">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">
                  {new Date(item.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="py-2 px-4">{item.from_account?.name}</td>
                <td className="py-2 px-4">{item.to_account?.name}</td>
                <td className="py-2 px-4">
                  Rp{parseInt(item.amount).toLocaleString("id-ID")}
                </td>
                <td className="py-2 px-4">{item.deskripsi || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRiwayat}
      />
    </div>
  );
}
