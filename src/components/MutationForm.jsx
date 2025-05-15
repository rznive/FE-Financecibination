export default function TransactionList({ mutations = [], loading = false }) {
  if (loading) return <p className="text-gray-500"> Loading, Fetching...</p>;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Last Transactions
      </h2>
      {mutations.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mutations.map((mutation) => (
                <tr key={mutation.id}>
                  <td className="px-6 py-4 text-sm">{mutation.note}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mutation.mutation_type === "masuk"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mutation.mutation_type === "masuk"
                        ? "Pemasukan"
                        : "Pengeluaran"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{mutation.account_name}</td>
                  <td className="px-6 py-4 text-sm">
                    {mutation.date_indonesia}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-right ${
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
      )}
    </div>
  );
}
