"use client";
import AppShell from "@/components/layout/AppShell";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { healthScore as mockHealthScore, farmerProfile } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/userAuth";
import { HeartPulse, TrendingUp, Download, Zap, ArrowRight, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function getScoreGrade(score: number, lang: string) {
  if (score >= 800) {
    return {
      grade: lang === "mr" ? "उत्कृष्ट" : lang === "hi" ? "उत्कृष्ट" : "Excellent",
      color: "#2ECC71",
      bg: "bg-emerald-50",
    };
  }
  if (score >= 700) {
    return {
      grade: lang === "mr" ? "चांगला" : lang === "hi" ? "अच्छा" : "Good",
      color: "#27AE60",
      bg: "bg-green-50",
    };
  }
  if (score >= 600) {
    return {
      grade: lang === "mr" ? "मध्यम" : lang === "hi" ? "मध्यम" : "Fair",
      color: "#F39C12",
      bg: "bg-amber-50",
    };
  }
  return {
    grade: lang === "mr" ? "सुधारणा आवश्यक" : lang === "hi" ? "सुधार आवश्यक" : "Needs Improvement",
    color: "#E74C3C",
    bg: "bg-red-50",
  };
}

const linkMap: Record<string, string> = {
  "Crop Yield History": "/crops/predict",
  "Loan Repayment": "/loans",
  "Expense Management": "/expenses",
  "Scheme Utilization": "/schemes",
  "Market Timing": "/market",
};

export default function HealthScorePage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const user = getCurrentUser();
  const profile = user || farmerProfile;
  const overall = user?.healthScore || mockHealthScore.overall;
  const { max, breakdown, tips, history } = mockHealthScore;
  const { grade, color, bg } = getScoreGrade(overall, language);
  const scorePct = (overall / max) * 100;

  const gaugeData = [{ value: scorePct, fill: color }];

  const getCategoryLabel = (cat: string) => {
    if (cat === "Crop Yield History") return language === "mr" ? "पीक उत्पादन इतिहास" : language === "hi" ? "फसल उपज इतिहास" : "Crop Yield History";
    if (cat === "Loan Repayment") return language === "mr" ? "कर्ज परतफेड" : language === "hi" ? "ऋण चुकौती" : "Loan Repayment";
    if (cat === "Expense Management") return language === "mr" ? "खर्च व्यवस्थापन" : language === "hi" ? "व्यय प्रबंधन" : "Expense Management";
    if (cat === "Scheme Utilization") return language === "mr" ? "शासकीय योजनांचा लाभ" : language === "hi" ? "सरकारी योजनाओं का लाभ" : "Scheme Utilization";
    if (cat === "Market Timing") return language === "mr" ? "बाजारभाव विक्री वेळ" : language === "hi" ? "मंडी बिक्री समय" : "Market Timing";
    return cat;
  };

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {language === "mr" ? "शेतकरी आरोग्य स्कोअर" : language === "hi" ? "किसान क्रेडिट व स्वास्थ्य स्कोर" : "Farm Health Score"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {language === "mr" ? "तुमचा सर्वसमावेशक कृषी पत व उत्पन्न स्कोअर" : language === "hi" ? "आपका समग्र कृषि क्रेडिट और उत्पादकता स्कोर" : "Your comprehensive agricultural credit score"}
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div variants={item} className="gc p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e8f5e8" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(scorePct / 100) * 440} 440`}
                  className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold" style={{ color }}>{overall}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {language === "mr" ? `${max} पैकी` : language === "hi" ? `${max} में से` : `out of ${max}`}
                </p>
                <p className="text-sm font-bold mt-1" style={{ color }}>{grade}</p>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {profile.name}&apos;s {language === "mr" ? "शेत स्कोअर" : language === "hi" ? "कृषि स्कोर" : "Farm Score"}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{profile.district}, {profile.state} • {profile.acres} {t.common.acres}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${bg}`} style={{ color }}>{grade}</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {language === "mr" ? "+४ गुण या तिमाहीत" : language === "hi" ? "+4 अंक इस तिमाही" : "+4 pts this quarter"}
                </span>
              </div>
              <button className="mt-4 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto sm:mx-0">
                <Download className="w-4 h-4" /> {language === "mr" ? "अहवाल डाउनलोड करा (PDF)" : language === "hi" ? "रिपोर्ट डाउनलोड करें (PDF)" : "Download Report (PDF)"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div variants={item} className="gc p-5">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">
            {language === "mr" ? "स्कोअर तपशील व निकष" : language === "hi" ? "स्कोर विवरण एवं मापदंड" : "Score Breakdown"}
          </h3>
          <div className="space-y-3">
            {breakdown.map((b) => {
              const link = linkMap[b.category] || "/dashboard";
              const barColor = b.score >= 80 ? "#2ECC71" : b.score >= 65 ? "#F39C12" : "#E74C3C";
              return (
                <Link key={b.category} href={link} className="block">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-muted)] transition group">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-emerald-700 transition">
                          {getCategoryLabel(b.category)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: barColor }}>{b.score}/{b.max}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">({b.weight}% {language === "mr" ? "भारांक" : language === "hi" ? "वेटेज" : "weight"})</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${b.score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full" style={{ background: barColor }} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Score History */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">
              {language === "mr" ? "स्कोअर प्रगती कल" : language === "hi" ? "स्कोर प्रगति रुझान" : "Score Trend"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis domain={[650, 800]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8f5e8", fontSize: "13px" }} />
                <Line type="monotone" dataKey="score" stroke="#2ECC71" strokeWidth={3} dot={{ fill: "#2ECC71", r: 4 }} name="Health Score" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Improvement Tips */}
          <motion.div variants={item} className="gc p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-[var(--text-primary)]">
                {language === "mr" ? "AI सुधारणा शिफारसी" : language === "hi" ? "AI सुधार सुझाव" : "AI Improvement Tips"}
              </h3>
            </div>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <Star className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
