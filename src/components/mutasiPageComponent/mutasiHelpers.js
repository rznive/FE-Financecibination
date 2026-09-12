/**
 * Shared helper utilities for the MutasiPage and its sub-components.
 */

/**
 * Parse a date string safely, returning a valid Date or fallback to now.
 */
export const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

/**
 * Format a date string into { date, time } with Indonesian month names.
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return { date: "-", time: "-" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { date: dateStr, time: "" };
    }
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return {
      date: `${day} ${month} ${year}`,
      time: `${hours}:${minutes} WIB`,
    };
  } catch {
    return { date: dateStr, time: "" };
  }
};

/**
 * Categorise a transaction and return visual metadata.
 * @param {object} tx - The mutation/transaction object.
 * @returns {{ label: string, subtitle: string, badgeBg: string, typeKey: string }}
 */
export const getCategoryMeta = (tx) => {
  const isIncome = tx.mutation_type === "masuk";
  const note = (tx.note || "").toLowerCase();
  const type = (tx.transaction_type || "").toLowerCase();

  if (
    type === "transfer" ||
    note.includes("transfer") ||
    note.includes("pindah dana")
  ) {
    return {
      label: "Transfer",
      subtitle: isIncome ? "Mutasi Transfer Masuk" : "Mutasi Transfer Keluar",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      typeKey: "transfer",
    };
  }

  if (isIncome) {
    return {
      label: "Pemasukan",
      subtitle: tx.note ? `Pemasukan: ${tx.note}` : "Pemasukan Dana",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      typeKey: "masuk",
    };
  }

  return {
    label: "Pengeluaran",
    subtitle: tx.note ? `Pengeluaran: ${tx.note}` : "Pengeluaran Dana",
    badgeBg: "bg-rose-50 text-red-600 border-slate-200",
    typeKey: "keluar",
  };
};

/**
 * Build a human-readable date-range badge string for the given timeframe.
 * @param {"7d"|"1m"|"3m"} timeframe
 */
export const getDateRangeBadgeText = (timeframe) => {
  const now = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const fmt = (d) =>
    `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;

  let past = new Date();
  if (timeframe === "7d") {
    past.setDate(now.getDate() - 7);
  } else if (timeframe === "1m") {
    past.setMonth(now.getMonth() - 1);
  } else if (timeframe === "3m") {
    past.setMonth(now.getMonth() - 3);
  }
  return `${fmt(past)} - ${fmt(now)}`;
};
