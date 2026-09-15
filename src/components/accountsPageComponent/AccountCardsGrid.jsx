import {
  CreditCard,
  Wallet,
  Landmark,
  Plus,
  Zap,
  Layers,
  ExternalLink,
} from "lucide-react";

// Helper to deduce account category label and icon
function getAccountCategoryMeta(name = "", index = 0) {
  const lower = name.toLowerCase();
  if (lower.includes("giro") || lower.includes("bca") || lower.includes("mandiri") || lower.includes("bri") || lower.includes("bni") || lower.includes("bank")) {
    return {
      label: "BANK GIRO",
      icon: <Landmark className="w-4 h-4" />,
      colorClass: "text-emerald-400",
      lightColorClass: "text-emerald-600",
    };
  }
  if (lower.includes("gopay") || lower.includes("ovo") || lower.includes("dana") || lower.includes("shopee") || lower.includes("wallet") || lower.includes("dompet")) {
    return {
      label: "E-WALLET",
      icon: <Wallet className="w-4 h-4" />,
      colorClass: "text-blue-400",
      lightColorClass: "text-blue-600",
    };
  }
  if (lower.includes("tabungan") || lower.includes("invest") || lower.includes("deposito") || lower.includes("darurat")) {
    return {
      label: "TABUNGAN KHUSUS",
      icon: <CreditCard className="w-4 h-4" />,
      colorClass: "text-amber-400",
      lightColorClass: "text-amber-600",
    };
  }
  // Default cycled tags
  const defaults = [
    { label: "BANK GIRO", icon: <Zap className="w-4 h-4" />, colorClass: "text-emerald-400", lightColorClass: "text-emerald-600" },
    { label: "E-WALLET", icon: <Wallet className="w-4 h-4" />, colorClass: "text-blue-400", lightColorClass: "text-blue-600" },
    { label: "TABUNGAN KHUSUS", icon: <CreditCard className="w-4 h-4" />, colorClass: "text-slate-400", lightColorClass: "text-slate-500" },
    { label: "POS KAS", icon: <Layers className="w-4 h-4" />, colorClass: "text-purple-400", lightColorClass: "text-purple-600" },
  ];
  return defaults[index % defaults.length];
}

export default function AccountCardsGrid({
  accounts = [],
  onAddAccount,
  onSelectDetail,
  loading = false,
}) {
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
          Array.from({ length: 3 }).map((_, idx) => (
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
          accounts.map((acc, index) => {
            const isHero = index === 0;
            const meta = getAccountCategoryMeta(acc.account_name, index);

            if (isHero) {
              return (
                <div
                  key={acc.account_id || index}
                  className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm flex flex-col justify-between min-h-[200px] relative overflow-hidden group hover:shadow-md transition-all"
                >
                  {/* Decorative background blur */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className={meta.colorClass}>{meta.icon}</span>
                      <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 my-3">
                    <div className="text-2xl font-black text-white tracking-tight">
                      Rp {Number(acc.saldo || 0).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex items-end justify-between relative z-10 pt-2 border-t border-slate-700/60">
                    <div className="flex flex-col">
                      <span className="text-xs tracking-wider font-semibold text-slate-200 truncate max-w-[150px]">
                        {acc.account_name}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectDetail(acc)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1"
                      type="button"
                    >
                      <span>Detail</span>
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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={meta.lightColorClass}>{meta.icon}</span>
                    <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      {meta.label}
                    </span>
                  </div>
                </div>

                <div className="my-3">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    Rp {Number(acc.saldo || 0).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs tracking-wider font-semibold text-slate-800 truncate max-w-[150px]">
                      {acc.account_name}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectDetail(acc)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1"
                    type="button"
                  >
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Add Account Card Button */}
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
      </div>
    </div>
  );
}
