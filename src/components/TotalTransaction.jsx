export default function TotalTransaction({ title, data, total, color }) {
    
  const isIncome = title.toLowerCase().includes("income");

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      
      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.account_id} className="flex justify-between">
            <span className="text-gray-600">{item.nama_rekening}</span>
            <span className={`font-semibold text-${color}-600`}>
              Rp{" "}
              {(isIncome ? item.total_pemasukan : item.total_pengeluaran)
                ?.toLocaleString("id-ID") || 0}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-800">
        <span>Total</span>
        <span className={`text-${color}-700`}>
          Rp {total?.toLocaleString("id-ID") || 0}
        </span>
      </div>
    </div>
  );
}
