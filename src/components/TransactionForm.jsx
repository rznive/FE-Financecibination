import { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

export default function MutationForm({ mutationType, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const url =
        mutationType === "masuk"
          ? `${API_BASE_URL}/finance/pemasukan`
          : `${API_BASE_URL}/finance/pengeluaran`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          note: form.note,
        }),
      });

      const result = await res.json();

      if (result.status) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: "Success",
          position: "top-end",
          text: mutationType === "masuk" ? "Income added!" : "Expense added!",
          timer: 2000,
          showConfirmButton: false,
        });
        onSubmit(result.data);
      } else {
        Swal.fire({
           toast: true,
          icon: "error",
          title: "Error",
          position: "top-end",
          text: result.message || "Failed to submit data",
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Error",
        position: "top-end",
        text: "Something went wrong. Please try again.",
      });
      console.error("Submission error:", err);
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows="2"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
