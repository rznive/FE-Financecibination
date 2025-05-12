import { useEffect, useState } from "react";

export default function TransactionList() {
  const [mutations, setMutations] = useState([]);

  useEffect(() => {
    const fetchMutations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/mutasi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (result.status) {
          setMutations(result.data);
        } else {
          console.error("Failed to fetch mutations:", result.message);
        }
      } catch (err) {
        console.error("Error fetching mutations:", err);
      }
    };

    fetchMutations();
  }, []);

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        All Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mutations.map((mutation) => (
              <tr key={mutation.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {mutation.note}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mutation.mutation_type === "masuk"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mutation.mutation_type === "masuk"
                      ? "Income"
                      : "Expense"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {mutation.account_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {mutation.date_indonesia}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-medium text-right ${
                    mutation.mutation_type === "masuk"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mutation.mutation_type === "masuk" ? "+" : "-"}Rp{" "}
                  {mutation.amount.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
