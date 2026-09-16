// CompleteProfilePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, User } from "lucide-react";
import Swal from "sweetalert2";
import apiClient from "../utils/apiClient";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wa_number: "",
    full_name: "",
  });
  const [errors, setErrors] = useState({
    wa_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.wa_number.trim()) {
      newErrors.wa_number = "Nomor WhatsApp wajib diisi";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const body = { wa_number: formData.wa_number };
      if (formData.full_name.trim()) {
        body.full_name = formData.full_name.trim();
      }

      const response = await apiClient("/auth/complete-profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("user", JSON.stringify(data.data));

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Profil berhasil dilengkapi!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        throw new Error(data.message || "Gagal melengkapi profil");
      }
    } catch (error) {
      console.error("Complete profile error:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.message || "Gagal melengkapi profil. Coba lagi.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#eff6ff] via-[#e8f0fe] to-[#f0f9ff]">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#3B82F6] to-[#1e3a8a] justify-center items-center p-12">
        <div className="max-w-md text-white">
          <img src="/ilustrasi-1.png" alt="Finance Illustration" className="mb-6" />
          <h2 className="text-4xl font-bold mb-6">Satu langkah lagi!</h2>
          <p className="text-lg mb-8">
            Lengkapi profil kamu agar bisa menggunakan semua fitur
            Financecibination dengan optimal.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/financecibination.png"
                alt="Financecibination Logo"
                className="h-20 w-auto"
              />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Lengkapi Profil
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tambahkan nomor WhatsApp untuk melanjutkan
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* wa_number (required) */}
              <div>
                <label
                  htmlFor="wa_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="wa_number"
                    name="wa_number"
                    type="text"
                    value={formData.wa_number}
                    onChange={handleChange}
                    className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                      errors.wa_number
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300 ease-in-out`}
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                {errors.wa_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.wa_number}</p>
                )}
              </div>

              {/* full_name (optional) */}
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap{" "}
                  <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300 ease-in-out"
                    placeholder="Nama lengkap kamu"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] transform transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Simpan & Lanjutkan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
