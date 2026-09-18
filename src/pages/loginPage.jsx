// LoginPage.jsx
import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../config";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    // Check if already authenticated via cookie
    fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
      .then((res) => {
        if (res.ok) navigate("/dashboard");
      })
      .catch(() => {});
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/login`,
          formData,
          { withCredentials: true }
        );
        console.log("API Response:", response);

        if (response.data.status) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Login Successful!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

          setTimeout(() => navigate("/dashboard"), 2000);
        }
      } catch (error) {
        console.error("Error during login:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Login failed. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        id_token: credentialResponse.credential,
      }, { withCredentials: true });

      const { is_profile_complete } = response.data;

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login dengan Google berhasil!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setTimeout(() => {
        if (!is_profile_complete) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Login Google gagal. Silakan coba lagi.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Login Google dibatalkan atau gagal.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#eff6ff] via-[#e8f0fe] to-[#f0f9ff]">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#3B82F6] to-[#1e3a8a] justify-center items-center p-12">
        <div className="max-w-md text-white">
          <img src="/ilustrasi-1.png" alt="Finance Illustration" className="mb-6" />
          <h2 className="text-4xl font-bold mb-6">Manage Your Finances</h2>
          <p className="text-lg mb-8">
            Track your expenses, monitor your budget, and take control of your
            financial future with our easy-to-use finance tracking tools.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img
                  src="/financecibination.png"
                  alt="Financecibination Logo"
                  className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                />
              </Link>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your financial dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300 ease-in-out`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300 ease-in-out`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] transform transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 text-[#93c5fd] animate-spin" />
                  ) : (
                    <LogIn className="h-5 w-5 text-[#93c5fd] group-hover:text-[#bfdbfe]" />
                  )}
                </span>
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau masuk dengan</span>
              </div>
            </div>

            <div className="relative">
              {isGoogleLoading ? (
                <div className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin text-[#3B82F6] flex-shrink-0" />
                  <span className="font-medium">Memproses...</span>
                </div>
              ) : (
                <div className="relative w-full">
                  {/* Tombol custom (visual) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Sign in with Google
                    </span>
                  </div>
                  {/* GoogleLogin asli — transparan di atas tombol custom */}
                  <div className="absolute inset-0 opacity-0 overflow-hidden rounded-lg">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      width="9999"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors duration-300"
              >
                Sign up here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
