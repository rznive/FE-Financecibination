import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

export default function MutationForm({ mutationType, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    note: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/getAccount`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.status) {
          setAccounts(result.data);
        } else {
          console.error("Failed to fetch accounts:", result.message);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Format tampilan
  const formatRupiah = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // fungsi handle input nominal
  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ""); // hanya angka
    const numeric = parseInt(raw || "0", 10);

    if (numeric >= 10000000000000) return;

    setForm((prev) => ({ ...prev, amount: numeric }));
    setFormattedAmount(formatRupiah(numeric));
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
          title: "Success!",
          position: "top-end",
          text: mutationType === "masuk" ? "Income Added!" : "Expense Added!",
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
          Amount
        </label>
        <input
          type="text"
          name="amount"
          value={formattedAmount}
          onChange={handleAmountChange}
          required
          inputMode="numeric"
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Name
        </label>
        <select
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        >
          <option value="" style={{ fontStyle: "italic" }}>
            -- Select Account --
          </option>
          {accounts.map((acc) => (
            <option
              key={acc.account_id}
              value={acc.account_name}
              style={{ fontStyle: "italic" }}
            >
              {acc.account_name}
            </option>
          ))}
        </select>
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
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {submitting ? "Saving..." : "Add"}
        </button>
      </div>
    </form>
  );
}
