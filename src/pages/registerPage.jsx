import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    wa_number: "",
  });
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    wa_number: "",
  });

  const navigate = useNavigate();
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

    if (!formData.full_name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.wa_number) {
      newErrors.wa_number = "Phone Number is required";
      valid = false;
    }

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
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/register`,
          formData
        );
        console.log("API Response:", response);

        if (response.data.status) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Registration Successful!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Registration failed. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 order-2 md:order-1">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/financecibination.png"
                alt="Financecibination Logo"
                className="h-20 w-auto"
              />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start tracking your finances today
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
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
                    className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                      errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ease-in-out`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.full_name}
                  </p>
                )}
              </div>
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
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ease-in-out`}
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
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ease-in-out`}
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
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
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
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ease-in-out`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.wa_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.wa_number}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-green-300 group-hover:text-green-200" />
                </span>
                Create account
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300"
              >
                Sign in here!
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-500 to-teal-600 justify-center items-center p-12 order-1 md:order-2">
        <div className="max-w-md text-white">
          <img src="/ilustrasi-2.png" alt="Finance Illustration" className="mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Take Control of Your Finances
          </h2>
          <p className="text-lg mb-8">
            Join thousands of users who are successfully managing their personal
            finances with our easy-to-use tracking tools.
          </p>
        </div>
      </div>
    </div>
  );
}