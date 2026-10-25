"use client";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { crisisData, marketPrices, kpiData, recentActivities } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/userAuth";
import { formatCurrency } from "@/lib/utils";
import { StatCard, AlertCard, ActionCard, ChartCard } from "@/components/ui/Cards";
import WeatherWidget from "@/components/ui/WeatherWidget";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import {
  TrendingUp, Sprout, Landmark, FileText, MessageCircle,
  AlertTriangle, ArrowRight, ArrowUpRight, Camera, Mic, Sparkles
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const up = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 }} };

import { useState, useEffect } from "react";
import AgriServicesHub from "@/components/dashboard/AgriServicesHub";

export default function Dashboard() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);

    fetch(`/api/user/profile?uid=${current?.uid || "user-001"}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.profile) {
          setUser(data.profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("khetisaathi-current-user", JSON.stringify(data.profile));
          }
        }
      })
      .catch((err) => console.warn("Firebase sync error on dashboard:", err));
  }, []);

  const kpi = user?.kpi ?? kpiData;
  const activities = user?.recentActivities ?? recentActivities;

  return (
    <AppShell>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* ── KPI STRIP ── */}
        <motion.div variants={up} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title={t.dashboard.kpiProfitForecast}
            value={formatCurrency(kpi.netProfitForecast)}
            change={kpi.netProfitChange}
            icon={<TrendingUp className="w-5 h-5" />}
            iconBg="rgba(34,197,94,0.12)" iconColor="var(--green-600)"
          />
          <StatCard
            title={t.dashboard.kpiLandCoverage}
            value={`${kpi.landCoverage} ${t.common.acres}`}
            subtitle={`${kpi.landUtilization}% ${t.dashboard.kpiUtilized}`}
            icon={<Sprout className="w-5 h-5" />}
            iconBg="rgba(59,130,246,0.12)" iconColor="#2563EB"
          />
          <StatCard
            title={t.dashboard.kpiActiveLoans}
            value={String(kpi.activeLoans)}
            subtitle={formatCurrency(kpi.totalLoanAmount)}
            icon={<Landmark className="w-5 h-5" />}
            iconBg="rgba(245,158,11,0.12)" iconColor="#D97706"
          />
          <StatCard
            title={t.dashboard.kpiSchemeBenefits}
            value={formatCurrency(kpi.schemeBenefits)}
            subtitle={`${kpi.schemesApplied} ${t.dashboard.kpiActive}`}
            icon={<FileText className="w-5 h-5" />}
            iconBg="rgba(139,92,246,0.12)" iconColor="#7C3AED"
          />
        </motion.div>

        {/* ── USER'S LIVE FARM PROFILE & CROPS BANNER ── */}
        <motion.div variants={up} className="gc p-5 rounded-3xl border border-[var(--border)] shadow-sm bg-[var(--bg-card)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/30 flex-shrink-0">
                {user?.avatar || "🌱"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-[var(--text-primary)]">
                    {user?.name || "Farmer Partner"}&apos;s Farm
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/20">
                    🌾 {user?.acres || 5} {t.common.acres}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    📍 {user?.village || "Farm"}, {user?.district || "District"}, {user?.state || "State"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    {language === "mr" ? "नोंदणीकृत पिके:" : language === "hi" ? "पंजीकृत फसलें:" : "Cultivated Crops:"}
                  </span>
                  {(user?.crops && user.crops.length > 0 ? user.crops : ["Cotton", "Soybean"]).map((c) => (
                    <Link
                      key={c}
                      href={`/crops`}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-100 transition"
                    >
                      🌱 {c}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <Link
                href="/crops"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>{language === "mr" ? "पीक व्यवस्थापन" : language === "hi" ? "फसल प्रबंधन" : "My Crops"}</span>
              </Link>
              <Link
                href="/loans"
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-primary)] font-bold text-xs border border-[var(--border)] flex items-center gap-1.5 transition"
              >
                <Landmark className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === "mr" ? "कर्ज मंजुरी" : language === "hi" ? "ऋण सीमा" : "Loan Offers"}</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── APNA KISAN AI — VOICE & LEAF SCANNER STUDIO BANNER ── */}
        <motion.div variants={up} className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-emerald-900/90 via-green-800/85 to-emerald-950/90 text-white shadow-xl border border-emerald-500/35 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg shadow-emerald-950/50 flex-shrink-0">
                <img
                  src="/kisan_mascot.jpg"
                  alt="Kisan Mitra"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80";
                  }}
                />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 text-[11px] font-black border border-white/20">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  <span>KhetiSaathi AI · Smart Crop Doctor</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  {language === "mr"
                    ? "शेतीसाथी AI — व्हॉइस व पान रोग निदान स्टुडिओ"
                    : language === "hi"
                    ? "खेतीसाथी AI — वॉयस एवं पत्ती रोग निदान स्टूडियो"
                    : "KhetiSaathi AI — Voice & Leaf Pathology Studio"}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-medium">
                  {language === "mr"
                    ? "👨‍🌾 \" रासायनिक युरियाऐवजी नॅनो युरिया वापरून एकरी ₹४,५०० वाचवा! रोगाचे पान स्कॅन करा. \""
                    : language === "hi"
                    ? "👨‍🌾 \" रासायनिक यूरिया के स्थान पर नैनो यूरिया अपनाएं और ₹४,५०० बचाएं! पत्ती स्कैन करें। \""
                    : "👨‍🌾 \" Substitute urea sacks with Nano Urea to save ₹4,500/acre! Scan leaf to diagnose disease. \""}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
              <Link
                href="/scanner"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white text-emerald-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-50 transition"
              >
                <Mic className="w-4 h-4 text-emerald-700" />
                <span>{language === "mr" ? "बोलून विचारा" : language === "hi" ? "बोलकर पूछें" : "Voice Query"}</span>
              </Link>
              <Link
                href="/scanner"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 border border-emerald-400/30 transition"
              >
                <Camera className="w-4 h-4" />
                <span>{language === "mr" ? "पान स्कॅन करा" : language === "hi" ? "पत्ती स्कैन करें" : "Scan Leaf"}</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── CRISIS ALERT ── */}
        {crisisData.active && (
          <motion.div variants={up}>
            <AlertCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label={t.dashboard.crisisAlertBadge}
              title={t.dashboard.crisisAlertTitle}
              variant="danger"
            >
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {language === "mr" ? "युरिया खताचे दर " : language === "hi" ? "यूरिया दर " : "Urea "}
                <strong style={{ color: "#DC2626" }}>+{crisisData.ureaSpikePct}%</strong> ·
                DAP <strong style={{ color: "#DC2626" }}>+{crisisData.dapSpikePct}%</strong> ·
                MOP <strong style={{ color: "#D97706" }}>+{crisisData.mopSpikePct}%</strong>
              </p>
              <div className="flex flex-wrap gap-5 mt-3">
                {[
                  { label: "Urea (45kg)", value: `₹${crisisData.currentUreaPrice}`, color: "#DC2626" },
                  { label: "DAP (50kg)",  value: `₹${crisisData.currentDAPPrice}`,  color: "#DC2626" },
                  { label: language === "mr" ? "शासकीय पॅकेज" : language === "hi" ? "सरकारी राहत" : "Relief", value: "₹12,000 Cr", color: "#2563EB" },
                ].map(d => (
                  <div key={d.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{d.label}</p>
                    <p className="text-xl font-bold" style={{ color: d.color }}>{d.value}</p>
                  </div>
                ))}
              </div>
              <Link href="/crisis" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold transition hover:opacity-70" style={{ color: "#DC2626" }}>
                {language === "mr" ? "सविस्तर अहवाल पहा" : language === "hi" ? "पूर्ण संकट डैशबोर्ड देखें" : "View Crisis Monitor"} <ArrowRight className="w-4 h-4" />
              </Link>
            </AlertCard>
          </motion.div>
        )}

        {/* ── QUICK ACTIONS ── */}
        <motion.div variants={up} className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <ActionCard href="/crops/predict" icon={<Sprout className="w-6 h-6" />} label={t.dashboard.predictProfit} iconBg="rgba(34,197,94,0.12)" iconColor="var(--green-600)" />
          <ActionCard href="/loans"         icon={<Landmark className="w-6 h-6" />} label={t.dashboard.checkLoans}   iconBg="rgba(59,130,246,0.12)" iconColor="#2563EB" />
          <ActionCard href="/schemes"       icon={<FileText className="w-6 h-6" />} label={t.dashboard.findSchemes}  iconBg="rgba(139,92,246,0.12)" iconColor="#7C3AED" />
          <ActionCard href="/chat"          icon={<MessageCircle className="w-6 h-6" />} label={t.dashboard.askAi}   iconBg="rgba(245,158,11,0.12)" iconColor="#D97706" />
        </motion.div>

        {/* ── MAHAVISTAAR AGRICULTURAL SERVICES DASHBOARD (17 SERVICES) ── */}
        <motion.div variants={up}>
          <AgriServicesHub />
        </motion.div>

        {/* ── MARKET + WEATHER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Market Chart — 7 cols */}
          <motion.div variants={up} className="lg:col-span-7">
            <ChartCard
              title={t.dashboard.marketPulse}
              subtitle={language === "mr" ? "गहू व प्रमुख शेतमाल भाव कल — Agmarknet थेट दर" : language === "hi" ? "गेहूं व प्रमुख जिंस भाव रुझान — एगमार्कनेट आंकड़े" : "Wheat & major commodities trend — Agmarknet live"}
              action={
                <Link href="/market" className="text-sm font-semibold flex items-center gap-1 transition hover:opacity-70" style={{ color: "var(--green-600)" }}>
                  {t.common.viewAll} <ArrowUpRight className="w-4 h-4" />
                </Link>
              }
            >
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={marketPrices.wheat.chartData}>
                  <defs>
                    <linearGradient id="gWheat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    domain={["dataMin - 50", "dataMax + 50"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      fontSize: "13px",
                      boxShadow: "var(--shadow-lg)",
                      color: "var(--text-primary)",
                    }}
                    formatter={(v) => [`₹${v}`, language === "mr" ? "गहू" : language === "hi" ? "गेहूं" : "Wheat"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={2.5} fill="url(#gWheat)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { name: language === "mr" ? "गहू" : language === "hi" ? "गेहूं" : "Wheat", emoji: "🌾", price: "₹2,275", change: 2.3 },
                  { name: language === "mr" ? "कांदा" : language === "hi" ? "प्याज" : "Onion", emoji: "🧅", price: "₹1,850", change: 4.8 },
                  { name: language === "mr" ? "सोयाबीन" : language === "hi" ? "सोयाबीन" : "Soybean", emoji: "🌱", price: "₹4,680", change: 1.2 },
                  { name: language === "mr" ? "कापूस" : language === "hi" ? "कपास" : "Cotton", emoji: "⚪", price: "₹7,280", change: 2.8 },
                  { name: language === "mr" ? "द्राक्षे" : language === "hi" ? "अंगूर" : "Grapes", emoji: "🍇", price: "₹6,800", change: 6.4 },
                ].map((crop) => (
                  <div key={crop.name} className="flex items-center gap-2 text-xs sm:text-sm">
                    <span>{crop.emoji}</span>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{crop.name}</span>
                    <span className="font-bold text-[var(--text-primary)]">{crop.price}</span>
                    <span className="font-bold text-emerald-600">
                      +{crop.change}%
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </motion.div>

          {/* Real-time Weather Widget — 5 cols */}
          <motion.div variants={up} className="lg:col-span-5">
            <WeatherWidget />
          </motion.div>
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <motion.div variants={up}>
          <div className="card p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t.dashboard.recentActivity}
            </h3>
            <div className="space-y-1">
              {activities.map((a: { id: string; icon: string; text: string; time: string }) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg-muted)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.text}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </AppShell>
  );
}
