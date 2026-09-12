import { ArrowUpRight, TrendingDown, ArrowLeftRight } from "lucide-react";
import SummaryCard from "./SummaryCard";

export default function DashboardSummaryCards({
  monthlyIncome = 0,
  incomeComparison = null,
  monthlySpending = 0,
  spendingComparison = null,
  netCashflow = 0,
  cashflowComparison = null,
}) {
  const isCashflowPositive = netCashflow >= 0;

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
      data-purpose="metrics-summary-cards"
    >
      {/* Card 1: MONTHLY INCOME */}
      <SummaryCard
        title="PEMASUKAN BULANAN"
        subtitle="Total pemasukan yang tercatat di bulan ini"
        icon={<ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
        amountText={`Rp ${Number(monthlyIncome || 0).toLocaleString("id-ID")}`}
        amountClassName="text-slate-900"
        comparison={incomeComparison}
        type="income"
      />

      {/* Card 2: MONTHLY SPENDING */}
      <SummaryCard
        title="PENGELUARAN BULANAN"
        subtitle="Total pengeluaran yang tercatat di bulan ini"
        icon={<TrendingDown className="w-4 h-4 text-rose-500 stroke-[2.5]" />}
        amountText={`Rp ${Number(monthlySpending || 0).toLocaleString("id-ID")}`}
        amountClassName="text-slate-900"
        comparison={spendingComparison}
        type="expense"
      />

      {/* Card 3: NET CASHFLOW */}
      <SummaryCard
        title="SISA UANG"
        subtitle="Selisih pemasukan dan pengeluaran bulan ini"
        icon={<ArrowLeftRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
        amountText={`${isCashflowPositive ? "+" : "-"}Rp ${Math.abs(
          Number(netCashflow || 0)
        ).toLocaleString("id-ID")}`}
        amountClassName={
          isCashflowPositive ? "text-emerald-600" : "text-rose-600"
        }
        comparison={cashflowComparison}
        type="cashflow"
      />
    </section>
  );
}
