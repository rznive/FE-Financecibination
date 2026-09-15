import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Construction,
  Sparkles,
  ArrowLeft,
  Home,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Menu,
  DollarSign,
  FileText,
  ArrowLeftRight
} from "lucide-react";

export default function UnderDevelopment({
  badgeText = "Under Development",
  featureName = "Fitur Transaksi dan Akun",
  title = "Halaman Sedang Dalam Pengembangan",
  subtitle = "Halaman ini sedang kami rancang dan optimalkan untuk mempermudah pengelolaan keuangan anda",
  progress = 25,
  estimatedRelease = "Segera Hadir pada Update Mendatang",
  backPath = "/dashboard",
  backText = "Kembali ke Dashboard",
  secondaryPath = "/showMutasi",
  secondaryText = "Lihat Transaksi",
  highlights = [
    // {
    //   icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
    //   text: "Transaction",
    // },
    {
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      text: "Account",
    },
    {
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      text: "Total Transaction",
    },
    {
      icon: <ArrowLeftRight className="w-4 h-4 text-emerald-600" />,
      text: "Riwayat Transfer",
    },
  ],
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mx-auto my-auto py-4 px-2 sm:px-4">
      {/* Container Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 text-center transition-all">
        {/* Soft Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-emerald-50/80 to-transparent pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {badgeText}
          </div>

          {/* Central Icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/15">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Construction className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-1 rounded-md shadow-sm border border-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature Category */}
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/50 px-2.5 py-0.5 rounded mb-2">
            {featureName}
          </span>

          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 max-w-lg leading-relaxed mb-6">
            {subtitle}
          </p>

          {/* Progress / Status Bar */}
          <div className="w-full max-w-md bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {estimatedRelease}
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full text-[11px]">
                {progress}% Selesai
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Feature Highlights Pills */}
          {highlights && highlights.length > 0 && (
            <div className="w-full max-w-md mb-6">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Fitur yang akan segera aktif
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700"
                  >
                    {h.icon}
                    <span>{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto pt-2 border-t border-slate-100">
            {/* <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button> */}

            <Link
              to={backPath}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <Home className="w-4 h-4" />
              {backText}
            </Link>

            {/* {secondaryPath && (
              <Link
                to={secondaryPath}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <span>{secondaryText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
