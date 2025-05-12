import { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

export default function AccountsForm({ onAccountAdded, onClose }) {
  const [form, setForm] = useState({
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Oops!",
        text: "Account name is required",
        position: "top-end",
        timer: 2000,
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
        body: JSON.stringify({ name: form.name }),
      });

      const result = await res.json();

      if (res.ok && result.status) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: "Success",
          text: "Account added successfully",
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        setForm({ name: "" });
        onAccountAdded(result.data);
      } else {
        Swal.fire({
          toast: true,
          icon: "error",
          title: "Error",
          text: result.message || "Failed to add account",
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        />
      </div>
      <div className="flex justify-end space-x-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {submitting ? "Saving..." : "Add"}
        </button>
      </div>
    </form>
  );
}
