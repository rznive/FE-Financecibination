import { Wallet } from "lucide-react";

export default function NetWorthCard({ totalBalance = 0, balances = [] }) {
  const topAccounts = [...balances]
    .sort((a, b) => Number(b.saldo || 0) - Number(a.saldo || 0))
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-slate-700">
          <Wallet className="w-4 h-4 text-slate-600" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
            TOTAL SALDO
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Jumlah Saldo dari Seluruh Rekening
        </p>
        <div className="mt-4">
          <p className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">
            Rp {Number(totalBalance || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Account Breakdown */}
      <div className="md:border-l md:border-slate-100 md:pl-8 flex flex-col justify-center min-w-[280px]">
        <span className="text-xs font-semibold text-slate-500 mb-2 block">
          Rincian Rekening
        </span>
        <div className="space-y-2 text-xs">
          {topAccounts.length > 0 ? (
            topAccounts.map((acc) => (
              <div
                key={acc.account_id}
                className="flex justify-between items-center text-slate-600 bg-slate-50 px-3 py-2 rounded-xl"
              >
                <span className="font-medium truncate max-w-[150px]">
                  {acc.account_name}
                </span>
                <span className="font-bold text-slate-800 ml-3">
                  Rp {Number(acc.saldo || 0).toLocaleString("id-ID")}
                </span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 italic">Belum ada akun</div>
          )}
        </div>
      </div>
    </div>
  );
}
