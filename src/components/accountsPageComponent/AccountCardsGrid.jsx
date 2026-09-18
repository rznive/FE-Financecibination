import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Plus,
  ExternalLink,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function AccountCardsGrid({
  accounts: propAccounts,
  onAddAccount,
  onSelectDetail,
  loading: propLoading,
}) {
  const navigate = useNavigate();
  const [internalAccounts, setInternalAccounts] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    // If accounts prop is not passed, fetch data directly from /getSaldo
    if (propAccounts === undefined) {
      const fetchSaldo = async () => {
        setInternalLoading(true);
        try {
          const res = await fetch(`${API_BASE_URL}/getSaldo`, {
            credentials: "include",
          });
          const result = await res.json();
          if (result.status && Array.isArray(result.data)) {
            const mappedData = result.data.map((item) => ({
              account_id: item.account_id,
              account_name: item.account_name,
              saldo: item.saldo,
            }));
            setInternalAccounts(mappedData);
          }
        } catch (err) {
          console.error("Error fetching /getSaldo in AccountCardsGrid:", err);
        } finally {
          setInternalLoading(false);
        }
      };

      fetchSaldo();
    }
  }, [propAccounts]);

  const accounts = propAccounts !== undefined ? propAccounts : internalAccounts;
  const loading = propLoading !== undefined ? propLoading : internalLoading;

  // Urutkan akun dari saldo tertinggi ke terendah
  const sortedAccounts = [...accounts].sort(
    (a, b) => Number(b.saldo || 0) - Number(a.saldo || 0)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Akun
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Akun Keuangan Anda
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[200px] animate-pulse"
            >
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-8 w-36 bg-slate-100 rounded my-3" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
          ))
        ) : (
          sortedAccounts.map((acc, index) => {
            const isHero = index === 0;

            if (isHero) {
              return (
                <div
                  key={acc.account_id || index}
                  className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm flex flex-col justify-between min-h-[200px] relative overflow-hidden group hover:shadow-md transition-all"
                >
                  {/* Decorative background blur */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-white text-sm tracking-wide truncate">
                        {acc.account_name}
                      </h3>
                    </div>
                  </div>

                  <div className="relative z-10 my-3">
                    <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                      Total Saldo
                    </span>
                    <div className="text-2xl font-black text-white tracking-tight">
                      Rp {Number(acc.saldo || 0).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 relative z-10">
                    <button
                      onClick={() =>
                        onSelectDetail
                          ? onSelectDetail(acc)
                          : navigate(`/accounts/${acc.account_id}`)
                      }
                      className="w-full py-2 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                      type="button"
                    >
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={acc.account_id || index}
                className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[200px] hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-wide truncate">
                      {acc.account_name}
                    </h3>
                  </div>
                </div>

                <div className="my-3">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                    Total Saldo
                  </span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    Rp {Number(acc.saldo || 0).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() =>
                      onSelectDetail
                        ? onSelectDetail(acc)
                        : navigate(`/accounts/${acc.account_id}`)
                    }
                    className="w-full py-2 px-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                    type="button"
                  >
                    <span>Lihat Detail</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Add Account Card Button */}
        {onAddAccount && (
          <button
            onClick={onAddAccount}
            className="rounded-2xl p-6 bg-slate-50/80 hover:bg-emerald-50/40 border-2 border-dashed border-slate-200 hover:border-emerald-400 text-slate-600 hover:text-emerald-700 transition-all flex flex-col items-center justify-center gap-3 min-h-[200px] text-center cursor-pointer group"
            id="card-trigger-add"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-50 transition-all shadow-sm">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                Tambah Akun
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Buat pos saldo bank, e-wallet, atau kas baru
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}


