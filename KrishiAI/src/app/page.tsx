"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sprout, TrendingUp, CloudSun, ShieldCheck, MapPin, Zap,
  ArrowRight, CheckCircle2, ChevronRight, Globe, Bell, FileText,
  DollarSign, Users, Award, HelpCircle, PhoneCall
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation, Language } from "@/lib/translations";
import { REAL_APMC_MANDIS } from "@/lib/mandiService";

const LIVE_TICKER = [
  { mandi: "Nagpur Kalamna", crop: "Raw Cotton", cropMr: "कापूस", price: "₹7,350", change: "+2.8%" },
  { mandi: "Nagpur Kalamna", crop: "Santra (Orange)", cropMr: "संत्रा", price: "₹4,600", change: "+5.4%" },
  { mandi: "Lasalgaon APMC", crop: "Red Onion", cropMr: "कांदा", price: "₹1,850", change: "+4.8%" },
  { mandi: "Nagpur Kalamna", crop: "Yellow Soybean", cropMr: "सोयाबीन", price: "₹4,790", change: "+1.6%" },
  { mandi: "Pimpalgaon Baswant", crop: "Grapes", cropMr: "द्राक्षे", price: "₹6,800", change: "+6.4%" },
  { mandi: "Pune Gultekdi", crop: "Lokwan Wheat", cropMr: "गहू", price: "₹2,480", change: "+1.8%" },
  { mandi: "Katol APMC", crop: "Sweet Orange", cropMr: "संत्रा", price: "₹5,100", change: "+7.1%" },
  { mandi: "Khanna Mandi", crop: "Wheat Grade-A", cropMr: "गहू", price: "₹2,320", change: "+1.9%" },
];

export default function LandingPage() {
  const { language, setLanguage } = useAppStore();
  const t = getTranslation(language);
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const savedLang = (localStorage.getItem("khetisaathi-lang") as Language) || "en";
    if (savedLang === "en" || savedLang === "hi" || savedLang === "mr") {
      setLanguage(savedLang);
    }
  }, [setLanguage]);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "mr", label: "Marathi", native: "मराठी" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
      
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white text-xs py-2 px-4 text-center font-medium shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="hidden sm:inline-block font-bold">🌾 {t.landing.heroBadge}</span>
          <span className="truncate">
            {language === "mr"
              ? "हॉर्मुझ खत संकट विशेष मदत: नॅनो युरिया वापरून एकरी ₹४,५०० ची बचत करा!"
              : language === "hi"
              ? "होर्मुज उर्वरक संकट विशेष: नैनो यूरिया अपनाएं और प्रति एकड़ ₹4,500 बचाएं!"
              : "Hormuz Fertilizer Crisis Relief: Save ₹4,500/acre with Liquid Nano Urea substitution!"}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition uppercase ${
                  language === l.code ? "bg-white text-emerald-800 shadow-sm" : "hover:bg-white/20 text-white"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {t.appName}
              </span>
              <p className="text-[10px] text-[var(--text-muted)] font-medium -mt-1 hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-emerald-600 transition">
              {language === "mr" ? "वैशिष्ट्ये" : language === "hi" ? "विशेषताएं" : "Features"}
            </a>
            <a href="#mandis" className="hover:text-emerald-600 transition">
              {language === "mr" ? "थेट बाजारभाव" : language === "hi" ? "मंडी भाव" : "Live Mandis"}
            </a>
            <a href="#ai-assistant" className="hover:text-emerald-600 transition">
              {language === "mr" ? "शेतीसाथी AI कृषी सहाय्यक" : language === "hi" ? "खेतीसाथी AI सहायक" : "KhetiSaathi AI"}
            </a>
            <a href="#schemes" className="hover:text-emerald-600 transition">
              {language === "mr" ? "शासकीय योजना" : language === "hi" ? "सरकारी योजनाएं" : "Govt Schemes"}
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-muted)] border border-[var(--border)] transition"
            >
              {t.landing.loginBtn}
            </Link>
            <Link
              href="/auth?mode=register"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition"
            >
              {t.landing.registerBtn}
            </Link>
          </div>
        </div>
      </header>

      {/* ── LIVE MANDI RATES TICKER ── */}
      <div className="bg-[var(--bg-muted)] border-b border-[var(--border)] py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {t.landing.liveTickerTitle}
          </span>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-semibold">
            {LIVE_TICKER.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[var(--text-muted)] font-medium">{item.mandi}:</span>
                <span className="text-[var(--text-primary)] font-bold">{language === "mr" ? item.cropMr : item.crop}</span>
                <span className="text-emerald-600 font-extrabold">{item.price}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded font-bold">
                  {item.change}
                </span>
                <span className="text-[var(--border)] ml-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{t.landing.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
                {t.landing.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.landing.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/auth?mode=register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition"
                >
                  <span>{t.landing.registerBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] border-2 border-[var(--border)] font-bold text-base flex items-center justify-center gap-2 transition"
                >
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <span>{t.landing.launchBtn}</span>
                </Link>
              </div>

              {/* Verification bullets */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[var(--text-muted)] font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Agmarknet Mandi Rates
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Open-Meteo Radar
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> KhetiSaathi AI
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free & Open-Source
                </span>
              </div>
            </div>

            {/* Right Column: Interactive App Snapshot Mockup */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-green-400 rounded-3xl blur-2xl opacity-20 pointer-events-none" />

                <div className="relative gc p-6 rounded-3xl border border-emerald-300/40 dark:border-emerald-800/40 shadow-2xl space-y-4">
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        RK
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">Rajesh Kumar (राजेश कुमार)</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Nagpur / Vidarbha · 12 Acres</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Live Dashboard
                    </span>
                  </div>

                  {/* Profit Snapshot */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50">
                      <p className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">
                        {t.dashboard.kpiProfitForecast}
                      </p>
                      <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                        ₹4,85,000
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">+12.5% vs Last Year</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50">
                      <p className="text-[10px] font-bold uppercase text-blue-800 dark:text-blue-300">
                        {t.dashboard.kpiLandCoverage}
                      </p>
                      <p className="text-xl font-black text-blue-700 dark:text-blue-400 mt-0.5">
                        12 Acres
                      </p>
                      <p className="text-[10px] text-blue-600 font-semibold mt-0.5">92% Land Utilized</p>
                    </div>
                  </div>

                  {/* Nearest Mandi Card */}
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold flex items-center gap-1 text-[var(--text-primary)]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Nagpur Kalamna Market Yard
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">4.2 km away</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">Cotton (कापूस) Modal Rate:</span>
                      <span className="font-black text-emerald-600 text-sm">₹7,350/qtl</span>
                    </div>
                  </div>

                  {/* Gemini AI Advice Snippet */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 text-xs">
                    <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      KhetiSaathi AI Agronomist:
                    </p>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                      &quot;Substitute 40% conventional urea with liquid Nano Urea (₹225/bottle) to save ₹4,800 across your Vidarbha acreage and protect soil nitrogen balance.&quot;
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition"
                  >
                    <span>{t.landing.exploreDemoBtn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black">50,000+</p>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">{t.landing.statsFarmers}</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black">80+</p>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">{t.landing.statsMandis}</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black">₹4,800/ac</p>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">{t.landing.statsSavings}</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black">94.2%</p>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">{t.landing.statsAccuracy}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES ── */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            {t.landing.featuresTitle}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {t.landing.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="gc p-6 space-y-3 hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === "mr" ? "शेतीसाथी AI कृषी तज्ज्ञ" : language === "hi" ? "खेतीसाथी AI कृषि विशेषज्ञ" : "KhetiSaathi AI Agronomist"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "mr"
                ? "मराठी, हिंदी आणि इंग्रजीत पिकांचे रोग, खत नियोजन, गुलाबी बोंडअळी नियंत्रण आणि योग्य विक्री वेळेचा अचूक सल्ला मिळवा."
                : language === "hi"
                ? "हिंदी, मराठी और अंग्रेजी में फसल रोग, उर्वरक नियोजन और कीट प्रबंधन पर विशेषज्ञ सलाह प्राप्त करें।"
                : "Hyper-local agronomic advisory in Marathi, Hindi & English covering disease detection, pest management, and split fertigation."}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="gc p-6 space-y-3 hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === "mr" ? "जीपीएस थेट बाजारभाव व बाजार समित्या" : language === "hi" ? "GPS नजदीकी मंडी व असली भाव" : "GPS Proximity APMC Mandis"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "mr"
                ? "नागपूर, लासलगाव, पुणे, काटोलासह तुमच्या गावापासून सर्वात जवळच्या बाजार समित्यांचे आजचे मूळ भाव व थेट अंतर पहा."
                : language === "hi"
                ? "नागपुर, लासलगांव, इंदौर, खन्ना सहित आपकी दूरी के अनुसार नजदीकी मंडियों के आज के वास्तविक मॉडल भाव।"
                : "Real Agmarknet rates and distance calculations using Haversine GPS formula for 80+ APMC mandis including Nagpur & Vidarbha."}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="gc p-6 space-y-3 hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === "mr" ? "ओपन-मेटिओ थेट हवामान रडार" : language === "hi" ? "ओपन-मेटियो लाइव मौसम रडार" : "Open-Meteo Weather Radar"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "mr"
                ? "अतिवृष्टी, गारपीट, पाऊस आणि वाऱ्याच्या वेगाचा ७ दिवसांचा कृषी-विशिष्ट अंदाज थेट तुमच्या शेताच्या स्थानावर."
                : language === "hi"
                ? "बारिश, ओलावृष्टि और पाले का 7-दिवसीय सटीक कृषि पूर्वानुमान बिना किसी रुकावट के।"
                : "Hyper-local weather radar with 7-day agricultural forecast, precipitation probability, humidity, and frost warnings."}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="gc p-6 space-y-3 hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === "mr" ? "हॉर्मुझ खत संकट व्यवस्थापक" : language === "hi" ? "उर्वरक संकट व लागत प्रबंधन" : "Fertilizer Crisis Optimizer"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "mr"
                ? "युरिया व डीएपी खतांचे दर ३५% वाढलेले असताना द्रवरूप नॅनो युरिया (₹२२५) वापरून एकरी ₹४,५०० ची बचत करा."
                : language === "hi"
                ? "35% बढ़े उर्वरक मूल्यों से निपटने के लिए नैनो यूरिया व डीएपी के प्रयोग से लागत घटाने की संपूर्ण योजना।"
                : "Real-time geopolitical impact tracking with alternative nano fertilizer prescriptions to protect profit margins."}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="gc p-6 space-y-3 hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === "mr" ? "शासकीय योजना व थेट अनुदान" : language === "hi" ? "सरकारी योजनाएं एवं सब्सिडी" : "Govt Schemes & Subsidies"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "mr"
                ? "पीएम-किसान (₹६,०००), नमो शेतकरी महासन्मान (₹६,०००), कुसुम सौर पंप (९०% अनुदान) योजनांची तात्काळ पडताळणी."
                : language === "hi"
                ? "पीएम-किसान, नमो शेतकारी और सोलर पंप सब्सिडी के लिए पात्रता जांच और आवेदन की पूरी प्रक्रिया।"
                : "Central & State welfare eligibility engine for PM-Kisan, Namo Shetkari, PMFBY, and PM-KUSUM solar pumps."}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="gc p-6 space-y-3 hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === "mr" ? "शेती खर्च वही व PDF अहवाल" : language === "hi" ? "फार्म खर्च खाता व PDF रिपोर्ट" : "Farm Expenses & PDF Export"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "mr"
                ? "बियाणे, खते, मजुरी व ट्रॅक्टर भाडे नोंदवा. एका क्लिकवर CSV किंवा PDF स्वरूपात प्रिंट व निर्यात करा."
                : language === "hi"
                ? "बीज, उर्वरक, मजदूरी खर्च का डिजिटल हिसाब रखें और कभी भी CSV/PDF रिपोर्ट डाउनलोड करें।"
                : "Track seasonal input expenses with dynamic category breakdowns, CSV export, and printable farm audits."}
            </p>
          </div>

        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-800 via-green-700 to-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            {language === "mr"
              ? "आजच शेतीसाथी कुटुंबात सामील व्हा आणि शेती अधिक फायदेशीर बनवा!"
              : language === "hi"
              ? "आज ही खेतीसाथी से जुड़ें और अपनी खेती को बनाएं अधिक मुनाफेदार!"
              : "Join 50,000+ Indian Farmers Transforming Their Harvest Profits"}
          </h2>
          <p className="text-base text-emerald-100 max-w-2xl mx-auto">
            {language === "mr"
              ? "नोंदणी पूर्णपणे मोफत आहे. कोणत्याही कागदपत्रांशिवाय २ मिनिटांत आपले शेतकरी खाते सुरू करा."
              : language === "hi"
              ? "पंजीकरण पूरी तरह निःशुल्क है। केवल 2 मिनट में अपना किसान खाता शुरू करें।"
              : "100% free registration. Connect your acres, select your crops, and unlock KhetiSaathi AI agronomy insights instantly."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/auth?mode=register"
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-base shadow-xl hover:bg-emerald-50 transition"
            >
              {t.landing.registerBtn}
            </Link>
            <Link
              href="/auth"
              className="px-8 py-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-400/40 text-white font-bold text-base transition"
            >
              {t.landing.loginBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--bg-card)] border-t border-[var(--border)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {t.appName}
              </span>
            </div>
            
            <p className="text-xs text-[var(--text-muted)] text-center md:text-right">
              {t.landing.footerTagline}
            </p>
          </div>

          <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
            <p>© 2026 KhetiSaathi (खेतीसाथी / शेतीसाथी). Built with Open-Source Agri APIs.</p>
            <div className="flex items-center gap-4">
              <span>Agmarknet Verified</span>
              <span>•</span>
              <span>Open-Meteo Powered</span>
              <span>•</span>
              <span>KhetiSaathi AI</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
