import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import TransferModal from "../components/transferModal";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UnderDevelopment from "../components/UnderDevelopment";

export default function TransferPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar Navigation */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
  
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  
          <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
            <UnderDevelopment
              badgeText = "Under Development"
              featureName = "Fitur Transaksi dan Akun"
              title = "Halaman Sedang Dalam Pengembangan"
              subtitle = "Halaman ini sedang kami rancang dan optimalkan untuk mempermudah pengelolaan keuangan anda"
              progress = "0"
              estimatedRelease = "Segera Hadir pada Update Mendatang"
              backPath = "/dashboard"
              backText = "Kembali ke Dashboard"
            />
          </main>
        </div>
      </div>
    );
}
