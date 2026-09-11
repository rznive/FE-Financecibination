import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Helper format tanggal ke Indonesia
function formatTanggalIndo(dateStr) {
  if (!dateStr) return "";
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
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${parseInt(day, 10)} ${bulanIndo[parseInt(month, 10) - 1]} ${year}`;
    }
    const d = new Date(dateStr);
    return `${d.getDate()} ${bulanIndo[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export default function DailyMutationChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs text-slate-400 font-medium">Memuat data grafik...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center text-slate-400">
        <svg
          className="w-10 h-10 text-slate-300 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
        <p className="text-xs font-medium">Belum ada data mutasi untuk periode ini</p>
      </div>
    );
  }

  // Format currency
  const formatYAxis = (val) => {
    if (val === 0) return "0";
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)} jt`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            {/* Gradien Hijau Emerald untuk Pemasukan */}
            <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>

            {/* Gradien Merah Rose untuk Pengeluaran */}
            <linearGradient id="gradientRose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal dashed grid lines matching Stitch */}
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#F1F5F9"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={false}
            dy={8}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            dx={-5}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const pemasukan = item.total_pemasukan || 0;
                const pengeluaran = item.total_pengeluaran || 0;
                const net = pemasukan - pengeluaran;

                return (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 min-w-[170px]">
                    <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">
                      {formatTanggalIndo(item.date || item.tanggal)}
                    </p>

                    <div className="flex items-center justify-between gap-4 text-emerald-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Pemasukan:
                      </span>
                      <span className="font-bold">
                        Rp {pemasukan.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-rose-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Pengeluaran:
                      </span>
                      <span className="font-bold">
                        Rp {pengeluaran.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-slate-700 pt-1 border-t border-slate-100 font-semibold">
                      <span>Net Cashflow:</span>
                      <span
                        className={
                          net >= 0
                            ? "text-emerald-600 font-bold"
                            : "text-rose-600 font-bold"
                        }
                      >
                        {net >= 0 ? "+" : "-"}Rp{" "}
                        {Math.abs(net).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Line 1: Pemasukan (Hijau / Emerald) */}
          <Area
            type="monotone"
            dataKey="total_pemasukan"
            name="Pemasukan"
            stroke="#00BA88"
            strokeWidth={2.5}
            fill="url(#gradientEmerald)"
            dot={{
              r: 4,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#00BA88",
            }}
            activeDot={{
              r: 6,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#009F74",
            }}
          />

          {/* Line 2: Pengeluaran (Merah / Rose) */}
          <Area
            type="monotone"
            dataKey="total_pengeluaran"
            name="Pengeluaran"
            stroke="#EF4444"
            strokeWidth={2.5}
            fill="url(#gradientRose)"
            dot={{
              r: 4,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#EF4444",
            }}
            activeDot={{
              r: 6,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#DC2626",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
