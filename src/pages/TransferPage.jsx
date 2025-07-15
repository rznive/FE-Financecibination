import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import TransferModal from "../components/transferModal";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function TransferPage() {
  const [riwayat, setRiwayat] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Tambah loading state

  const fetchRiwayat = async () => {
    setLoading(true); // Mulai loading
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/transfer/riwayat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.status) {
        setRiwayat(result.data);
      }
    } catch (err) {
      console.error("Gagal fetch riwayat:", err);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Riwayat Transfer
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              + Transfer
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-800 text-sm font-medium">
                <tr>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-left">Dari</th>
                  <th className="py-3 px-4 text-left">Ke</th>
                  <th className="py-3 px-4 text-left">Jumlah</th>
                  <th className="py-3 px-4 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      <span className="animate-pulse">Memuat data...</span>
                    </td>
                  </tr>
                ) : riwayat.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Tidak ada data transfer.
                    </td>
                  </tr>
                ) : (
                  riwayat.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4">{item.from_account?.name}</td>
                      <td className="py-3 px-4">{item.to_account?.name}</td>
                      <td className="py-3 px-4">
                        Rp{parseInt(item.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4">{item.deskripsi || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        <TransferModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchRiwayat}
        />
      </div>
    </div>
  );
}
