import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Fungsi util untuk ubah format tanggal ke Indonesia
function formatTanggalIndo(dateStr) {
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)} ${bulanIndo[parseInt(month) - 1]} ${year}`;
}

export default function DailyMutationChart({ data }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Total Mutasi</h2>
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tanggal"
              tick={{ fontSize: 11 }}
              tickFormatter={(tanggal) => {
                const [year, month, day] = tanggal.split("-");
                return `${parseInt(month)} / ${parseInt(day)}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#4B5563" }}
              tickFormatter={(value) =>
                `${value.toLocaleString("id-ID")}`
              }
            />
            <Tooltip
              labelFormatter={(label) => formatTanggalIndo(label)}
              formatter={(value, name) => [
                `Rp ${value.toLocaleString("id-ID")}`,
                name === "total_pemasukan" ? "Pemasukan" : "Pengeluaran",
              ]}
            />
            <Line
              type="monotone"
              dataKey="total_pemasukan"
              name="Pemasukan"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="total_pengeluaran"
              name="Pengeluaran"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
