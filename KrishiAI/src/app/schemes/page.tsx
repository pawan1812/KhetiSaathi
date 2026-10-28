"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { schemes } from "@/lib/mockData";
import { FileText, ExternalLink, Clock, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Filter, Search, Shield, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function getDaysRemaining(deadline: string) {
  if (deadline === "Ongoing") return null;
  const targetDate = new Date(deadline);
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return 45; // Fallback active window for ongoing seasonal schemes
  return Math.max(1, Math.ceil(diff / 86400000));
}

export default function SchemesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { language } = useAppStore();
  const t = getTranslation(language);

  const categories = [
    { key: "All", label: language === "mr" ? "सर्व" : language === "hi" ? "सभी" : "All" },
    { key: "Insurance", label: language === "mr" ? "विमा" : language === "hi" ? "बीमा" : "Insurance" },
    { key: "Subsidy", label: language === "mr" ? "अनुदान" : language === "hi" ? "सब्सिडी" : "Subsidy" },
    { key: "Credit", label: language === "mr" ? "कर्ज" : language === "hi" ? "ऋण" : "Credit" },
    { key: "Equipment", label: language === "mr" ? "यंत्रसामग्री" : language === "hi" ? "उपकरण" : "Equipment" },
    { key: "Emergency", label: language === "mr" ? "आपत्कालीन" : language === "hi" ? "आपातकालीन" : "Emergency" },
  ];

  const filtered = schemes.filter((s) => {
    const matchFilter = filter === "All" || s.type.toLowerCase().includes(filter.toLowerCase()) || s.category === filter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t.schemes.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{t.schemes.subtitle}</p>
        </motion.div>

        {/* Emergency Scheme Alert */}
        <motion.div variants={item} className="bg-red-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {language === "mr" ? "आपत्कालीन संकट योजना" : language === "hi" ? "आपातकालीन संकट योजना" : "Emergency Crisis Scheme"}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-1">
            🚨 {language === "mr" ? "आपत्कालीन खत अनुदान पॅकेज" : language === "hi" ? "आपातकालीन उर्वरक राहत पैकेज" : "Emergency Fertilizer Relief Package"}
          </h3>
          <p className="text-white/90 text-sm mb-3">
            {language === "mr"
              ? "हॉर्मुझ सामुद्रधुनी संकटामुळे खतांच्या किमती वाढल्याने शेतकऱ्यांना ₹५,०००/एकर विशेष मदत. ३१ डिसेंबर २०२६ पूर्वी अर्ज करा."
              : language === "hi"
              ? "होर्मुज जलडमरूमध्य संकट से बढ़ी उर्वरक कीमतों के कारण किसानों को ₹5,000/एकड़ विशेष सब्सिडी। 31 दिसंबर 2026 से पहले आवेदन करें।"
              : "₹5,000/acre additional subsidy for farmers affected by Strait of Hormuz fertilizer price surge. Apply before December 31, 2026."}
          </p>
          <a href="https://pib.gov.in" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-red-600 text-xs font-bold shadow hover:bg-gray-100 transition">
            {t.schemes.applyNow} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input type="text" placeholder={t.schemes.searchSchemes} value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-[var(--bg-card)] text-[var(--text-primary)]" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button key={c.key} onClick={() => setFilter(c.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === c.key ? "bg-emerald-500 text-white" : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-green-200"
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Schemes List */}
        <div className="space-y-3">
          {filtered.map((scheme) => {
            const daysLeft = getDaysRemaining(scheme.deadline);
            const isExpanded = expanded === scheme.id;
            const isEmergency = scheme.id === "emergency_fert";

            return (
              <motion.div key={scheme.id} variants={item}
                className={`gc overflow-hidden ${isEmergency ? "border-red-300 ring-1 ring-red-100" : ""}`}>
                <button onClick={() => setExpanded(isExpanded ? null : scheme.id)}
                  className="w-full p-5 flex items-start justify-between text-left hover:bg-[var(--bg-muted)]/50 transition">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isEmergency ? "bg-red-100 text-red-600" :
                      scheme.type === "Insurance" ? "bg-blue-100 text-blue-600" :
                      scheme.type === "Credit" ? "bg-amber-100 text-amber-600" :
                      scheme.type === "Equipment" ? "bg-purple-100 text-purple-600" :
                      "bg-emerald-100 text-emerald-600"
                    }`}>
                      {isEmergency ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--text-primary)] truncate">{scheme.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{scheme.benefit}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`badge ${
                          scheme.eligibility === "High" ? "badge-success" : "badge-warning"
                        }`}>
                          {scheme.eligibility} Match
                        </span>
                        <span className={`badge ${
                          scheme.status.includes("NEW") || scheme.status.includes("Crisis") ? "badge-danger" :
                          scheme.status === "Enrollment Open" ? "badge-info" : "badge-success"
                        }`}>
                          {scheme.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {daysLeft !== null && (
                      <div className={`text-center ${daysLeft <= 30 ? "text-red-600" : "text-[var(--text-secondary)]"}`}>
                        <p className="text-lg font-bold">{daysLeft}</p>
                        <p className="text-[10px] font-medium">{language === "mr" ? "दिवस बाकी" : language === "hi" ? "दिन शेष" : "days left"}</p>
                      </div>
                    )}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />}
                  </div>
                </button>

                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5 border-t border-[var(--border)] space-y-4">
                    <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">{scheme.description}</p>
                    
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                        {language === "mr" ? "आवश्यक कागदपत्रे" : language === "hi" ? "आवश्यक दस्तावेज" : "Required Documents"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scheme.documents.map((doc) => (
                          <span key={doc} className="px-2.5 py-1 bg-[var(--bg-muted)] text-[var(--text-secondary)] rounded-lg text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm text-center flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        {language === "mr" ? "पोर्टलवर अर्ज करा" : language === "hi" ? "पोर्टल पर आवेदन करें" : "Apply on Portal"} <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AppShell>
  );
}
