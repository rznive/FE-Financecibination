import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MutasiPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mutations, setMutations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMutations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/mutasi`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMutations();
  }, []);

  const totalPages = Math.ceil(mutations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMutations = mutations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Show Mutasi
              </h2>

              {loading ? (
                <div className="text-sm text-gray-500">
                  Loading, Fetching...
                </div>
              ) : (
                <>
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
                        {currentMutations.map((mutation) => (
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

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(startIndex + itemsPerPage, mutations.length)} of{" "}
                      {mutations.length} transactions
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
