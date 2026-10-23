"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import {
  Sparkles,
  Camera,
  MessageCircle,
  Sprout,
  Calendar,
  CloudSun,
  FlaskConical,
  Calculator,
  TrendingUp,
  Building2,
  Coins,
  FileCheck2,
  Tractor,
  BookOpen,
  HelpCircle,
  Video,
  Newspaper,
  Bell,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface ServiceItem {
  id: string;
  category: "ai" | "crop" | "economics" | "community";
  title: { en: string; mr: string; hi: string };
  desc: { en: string; mr: string; hi: string };
  badge: { en: string; mr: string; hi: string };
  href: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
}

const ALL_SERVICES: ServiceItem[] = [
  // ── AI & Protection ──
  {
    id: "aiChat",
    category: "ai",
    title: {
      en: "AI Agricultural Assistant",
      mr: "एआय कृषी सल्लागार (AI Sahayak)",
      hi: "एआई कृषि सहायक (AI चैटबॉट)"
    },
    desc: {
      en: "Trilingual agro-intelligence powered by Google Gemini with voice & reasoning",
      mr: "गुगल जेमिनी आधारित शेतीसाथी त्रिभाषी व्हॉइस चॅटबॉट व विचार शृंखला",
      hi: "गूगल जेमिनी संचालित त्रिभाषी वॉयस एवं कृषि समस्या निवारण चैटबॉट"
    },
    badge: { en: "Gemini AI", mr: "जेमिनी एआय", hi: "जेमिनी एआई" },
    href: "/chat",
    icon: MessageCircle,
    gradient: "from-emerald-500/15 to-teal-500/10",
    iconColor: "#059669"
  },
  {
    id: "pestScanner",
    category: "ai",
    title: {
      en: "AI Pest & Disease Doctor",
      mr: "कीड व रोग ओळख डॉक्टर",
      hi: "एआई कीट एवं पत्ती रोग डॉक्टर"
    },
    desc: {
      en: "Multimodal leaf diagnosis with camera, symptoms breakdown & verified remedies",
      mr: "पानाचा फोटो स्कॅन करा, वाढीच्या टप्प्यानुसार रोग ओळखा व सेंद्रिय/रासायनिक उपाय मिळवा",
      hi: "पत्ती की फोटो खींचें, अवस्था अनुसार बीमारी पहचानें व जैविक/रासायनिक उपचार पाएं"
    },
    badge: { en: "Vision AI", mr: "व्हिजन एआय", hi: "विज़न एआई" },
    href: "/scanner",
    icon: Camera,
    gradient: "from-amber-500/15 to-orange-500/10",
    iconColor: "#D97706"
  },
  {
    id: "experts",
    category: "ai",
    title: {
      en: "Experts Corner (Q&A)",
      mr: "तज्ञांचा सल्ला (Experts Corner)",
      hi: "विशेषज्ञ परामर्श (तज्ञांचा सल्ला)"
    },
    desc: {
      en: "Ask agronomy questions to MPKV Rahuri & PDKV Akola scientists",
      mr: "कृषी विद्यापीठ शास्त्रज्ञ व विस्तार अधिकाऱ्यांना थेट शेती प्रश्न विचारा",
      hi: "कृषि विश्वविद्यालय वैज्ञानिकों एवं विस्तार अधिकारियों से सीधा मार्गदर्शन पाएं"
    },
    badge: { en: "University Panel", mr: "विद्यापीठ तज्ञ", hi: "कृषि वैज्ञानिक" },
    href: "/experts",
    icon: HelpCircle,
    gradient: "from-blue-500/15 to-indigo-500/10",
    iconColor: "#2563EB"
  },
  {
    id: "notifications",
    category: "ai",
    title: {
      en: "Agricultural Alerts & Radar",
      mr: "कृषी सूचना व हवामान इशारे",
      hi: "कृषि सूचनाएं एवं चेतावनी"
    },
    desc: {
      en: "Real-time agromet warnings, pest outbreak forewarnings & price surge alerts",
      mr: "हवामान इशारा, गुलाबी बोंडअळी पूर्वसूचना, बाजारभाव तेजी व योजना अपडेट",
      hi: "मौसम चेतावनी, कीट प्रकोप अलर्ट, मंडी भाव एवं सरकारी योजना अपडेट"
    },
    badge: { en: "Live Alerts", mr: "थेट सतर्कता", hi: "लाइव अलर्ट" },
    href: "/notifications",
    icon: Bell,
    gradient: "from-rose-500/15 to-pink-500/10",
    iconColor: "#E11D48"
  },

  // ── Crop & Weather ──
  {
    id: "cropManagement",
    category: "crop",
    title: {
      en: "Crop Management & Plots",
      mr: "पीक व्यवस्थापन व शेतजमीन",
      hi: "फसल प्रबंधन एवं खेत प्लॉट"
    },
    desc: {
      en: "Track plots, gat numbers, varieties, sowing dates & growth stages",
      mr: "शेताचे नाव, गट नंबर, वाण, पेरणी दिनांक व वाढीच्या टप्प्यांचा मागोवा",
      hi: "खेत नाम, गट नंबर, किस्म, बुवाई तिथि और फसल अवस्थाओं की ट्रैकिंग"
    },
    badge: { en: "Core Plot", mr: "गट व पीक", hi: "खेत प्लॉट" },
    href: "/crops",
    icon: Sprout,
    gradient: "from-green-500/15 to-emerald-500/10",
    iconColor: "#16A34A"
  },
  {
    id: "cropAdvisory",
    category: "crop",
    title: {
      en: "Crop Advisory & Growth Stages",
      mr: "पीक सल्ला व वाढीचे टप्पे",
      hi: "फसल सलाह एवं विकास अवस्थाएं"
    },
    desc: {
      en: "Stage-wise nutrient dosage, irrigation frequency & pest forewarning",
      mr: "वाढीच्या टप्प्यानुसार खताचे डोस, पाणी देण्याचा सल्ला व किडींचा इशारा",
      hi: "अवस्था अनुसार खाद की मात्रा, सिंचाई समय एवं कीट पूर्वसूचना"
    },
    badge: { en: "Stage Guide", mr: "टप्प्यानुसार सल्ला", hi: "अवस्था गाइड" },
    href: "/advisory",
    icon: Calendar,
    gradient: "from-lime-500/15 to-green-500/10",
    iconColor: "#65A30D"
  },
  {
    id: "weatherAdvisory",
    category: "crop",
    title: {
      en: "Agro-Weather Radar",
      mr: "कृषी हवामान रडार व अंदाज",
      hi: "कृषि मौसम रडार एवं पूर्वानुमान"
    },
    desc: {
      en: "Live 5-day agro-meteorological forecast, spraying suitability & rain alerts",
      mr: "थेट ५ दिवसांचा हवामान अंदाज, फवारणीसाठी योग्य वेळ व तापमान इशारा",
      hi: "5-दिवसीय मौसम पूर्वानुमान, कीटनाशक छिड़काव अनुकूलता व बारिश चेतावनी"
    },
    badge: { en: "Zero-Key Radar", mr: "हवामान रडार", hi: "मौसम रडार" },
    href: "/weather",
    icon: CloudSun,
    gradient: "from-sky-500/15 to-blue-500/10",
    iconColor: "#0284C7"
  },
  {
    id: "soilHealth",
    category: "crop",
    title: {
      en: "Digital Soil Health Card",
      mr: "मृदा आरोग्य पत्रिका (Soil Card)",
      hi: "डिजिटल मृदा स्वास्थ्य कार्ड"
    },
    desc: {
      en: "Digital soil nutrient gauge (pH, N, P, K, micronutrients) & Gemini explanation",
      mr: "सामू (pH), सेंद्रिय कर्ब, नत्र-स्फुरद-पालाश अहवाल व जेमिनी सविस्तर विश्लेषण",
      hi: "मिट्टी जांच रिपोर्ट (पीएच, एनपीके, सूक्ष्म पोषक) एवं जेमिनी विश्लेषण"
    },
    badge: { en: "SHC Report", mr: "माती परीक्षण", hi: "मृदा कार्ड" },
    href: "/soil-health",
    icon: FlaskConical,
    gradient: "from-teal-500/15 to-emerald-500/10",
    iconColor: "#0D9488"
  },

  // ── Economics & Storage ──
  {
    id: "fertilizerCalc",
    category: "economics",
    title: {
      en: "Fertilizer Calculator",
      mr: "खत कॅल्क्युलेटर (खताची मात्रा)",
      hi: "सटीक उर्वरक कैलकुलेटर"
    },
    desc: {
      en: "Deterministic NPK doses, Nano Urea package vs conventional & split schedules",
      mr: "विद्यापीठ शिफारशीनुसार अचूक खताची मात्रा, नॅनो युरिया वापर व खतांचे हप्ते",
      hi: "वैज्ञानिक एनपीके सिफारिश, नैनो यूरिया बचत एवं चरणबद्ध खुराक"
    },
    badge: { en: "NPK Engine", mr: "अचूक मात्रा", hi: "उर्वरक गणना" },
    href: "/fertilizer-calculator",
    icon: Calculator,
    gradient: "from-violet-500/15 to-purple-500/10",
    iconColor: "#7C3AED"
  },
  {
    id: "costCalculator",
    category: "economics",
    title: {
      en: "Crop Cost & Profit Calculator",
      mr: "पीक खर्च व नफा कॅल्क्युलेटर",
      hi: "फसल लागत एवं मुनाफा कैलकुलेटर"
    },
    desc: {
      en: "Itemized inputs (seeds, fertilizer, labor, tractor) & net profit forecast",
      mr: "बियाणे, खते, मजुरी, मशागत, वाहतूक खर्च व निव्वळ नफ्याची अचूक गणना",
      hi: "बीज, खाद, श्रम, मशीनरी खर्च व शुद्ध मुनाफे का सटीक आकलन"
    },
    badge: { en: "Economics", mr: "खर्च गणक", hi: "लागत गणना" },
    href: "/calculator",
    icon: Coins,
    gradient: "from-yellow-500/15 to-amber-500/10",
    iconColor: "#CA8A04"
  },
  {
    id: "marketPrices",
    category: "economics",
    title: {
      en: "Market Prices & Mandis",
      mr: "बाजारभाव व कृषी उत्पन्न बाजार",
      hi: "मंडी भाव एवं एपीएमसी मंडियां"
    },
    desc: {
      en: "Live APMC modal rates, MSP 2025-26 comparison & nearby mandi distance",
      mr: "लासलगाव, पिंपळगाव, पुणे व नागपूर बाजारभाव, हमीभाव व अंतर गणना",
      hi: "लाइव एपीएमसी मंडी भाव, न्यूनतम समर्थन मूल्य (MSP) एवं नजदीकी मंडियां"
    },
    badge: { en: "Agmarknet", mr: "बाजारभाव", hi: "मंडी भाव" },
    href: "/market",
    icon: TrendingUp,
    gradient: "from-emerald-500/15 to-green-500/10",
    iconColor: "#059669"
  },
  {
    id: "warehouses",
    category: "economics",
    title: {
      en: "Warehouse Directory",
      mr: "गोदाम व साठवणूक केंद्र (MSWC)",
      hi: "गोदाम एवं कोल्ड स्टोरेज निर्देशिका"
    },
    desc: {
      en: "Locate certified MSWC & WDRA accredited dry and cold storage by district",
      mr: "महाराष्ट्र वखार महामंडळ (MSWC) गोदामे, उपलब्ध क्षमता व संपर्क क्रमांक",
      hi: "एमएसडब्ल्यूसी और डब्ल्यूडीआरए मान्यता प्राप्त अनाज व कोल्ड स्टोरेज खोजें"
    },
    badge: { en: "WDRA / MSWC", mr: "गोदामे", hi: "गोदाम" },
    href: "/warehouses",
    icon: Building2,
    gradient: "from-cyan-500/15 to-blue-500/10",
    iconColor: "#0891B2"
  },
  {
    id: "chcLocator",
    category: "economics",
    title: {
      en: "Custom Hiring Centres (CHC)",
      mr: "कृषी अवजारे सेवा केंद्र (अवजारे बँक)",
      hi: "कस्टम हायरिंग सेंटर (यंत्र बैंक)"
    },
    desc: {
      en: "Find nearby machinery banks to rent tractors, rotavators, threshers & drones",
      mr: "ट्रॅक्टर, रोटाव्हेटर, मळणी यंत्रे व ड्रोन वाजवी भाडेतत्त्वावर मिळवा",
      hi: "ट्रैक्टर, रोटावेटर, थ्रेशर एवं स्प्रे ड्रोन उचित किराए पर उपलब्ध केंद्र"
    },
    badge: { en: "Machinery Bank", mr: "अवजारे बँक", hi: "यंत्र बैंक" },
    href: "/chc-locator",
    icon: Tractor,
    gradient: "from-orange-500/15 to-amber-500/10",
    iconColor: "#EA580C"
  },

  // ── Schemes & Community ──
  {
    id: "schemes",
    category: "community",
    title: {
      en: "Government Schemes (DBT)",
      mr: "शासकीय कृषी योजना (महाडीबीटी/पोक्रा)",
      hi: "सरकारी कृषि योजनाएं (DBT)"
    },
    desc: {
      en: "Nanaji Deshmukh PoCRA, MahaDBT, Namo Shetkari, PM-KUSUM & farm pond grants",
      mr: "नानाजी देशमुख पोक्रा, महाडीबीटी, नमो शेतकरी, सोलर पंप व मागेल त्याला शेततळे",
      hi: "नानाजी देशमुख पोक्रा, महाडीबीटी, नमो शेतकारी, सोलर पंप एवं खेत तालाब सब्सिडी"
    },
    badge: { en: "Direct Subsidy", mr: "थेट अनुदान", hi: "सब्सिडी" },
    href: "/schemes",
    icon: FileCheck2,
    gradient: "from-purple-500/15 to-violet-500/10",
    iconColor: "#9333EA"
  },
  {
    id: "knowledge",
    category: "community",
    title: {
      en: "Agri Knowledge Centre (SOP)",
      mr: "कृषी ज्ञान केंद्र (लागवड SOP)",
      hi: "कृषि ज्ञान केंद्र (मानक कार्यप्रणाली)"
    },
    desc: {
      en: "Package of practices, scientific SOPs & Integrated Pest Management (IPM)",
      mr: "सुधारित लागवड तंत्रज्ञान, विद्यापीठ एसओपी व एकात्मिक कीड नियंत्रण",
      hi: "वैज्ञानिक फसल पद्धतियां, एसओपी एवं समन्वित कीट नियंत्रण विधियां"
    },
    badge: { en: "Verified SOPs", mr: "शास्त्रोक्त पद्धत", hi: "वैज्ञानिक SOP" },
    href: "/knowledge",
    icon: BookOpen,
    gradient: "from-indigo-500/15 to-blue-500/10",
    iconColor: "#4F46E5"
  },
  {
    id: "videos",
    category: "community",
    title: {
      en: "Digital Shetishala (Videos)",
      mr: "डिजिटल शेतीशाळा (व्हिडिओ प्रशिक्षण)",
      hi: "डिजिटल खेतीशाला (वीडियो प्रशिक्षण)"
    },
    desc: {
      en: "Scientific video lectures, live webinars, schedule & farmer success stories",
      mr: "शेतकरी प्रशिक्षण व्हिडिओ, वेळापत्रक, थेट वेबिनार व प्रयोगशील शेतकरी यशोगाथा",
      hi: "कृषि प्रशिक्षण वीडियो, लाइव वेबिनार, कार्यशालाएं एवं किसान सफलता की कहानियां"
    },
    badge: { en: "Video School", mr: "शेतीशाळा", hi: "खेतीशाला" },
    href: "/videos",
    icon: Video,
    gradient: "from-red-500/15 to-rose-500/10",
    iconColor: "#DC2626"
  },
  {
    id: "magazines",
    category: "community",
    title: {
      en: "Agri Magazines & Bulletins",
      mr: "कृषी मासिके व ई-बुलेटिन",
      hi: "कृषि पत्रिकाएं एवं ई-बुलेटिन"
    },
    desc: {
      en: "Official editions of Shetkari Magazine, MahaPashudhan & Krishi Samvad",
      mr: "शेतकरी मासिक, महापशुधन व कृषी संवाद अधिकृत शासकीय ई-मासिके",
      hi: "शेतकरी मासिक, महापशुधन एवं कृषि संवाद के डिजिटल मासिक अंक"
    },
    badge: { en: "E-Magazines", mr: "ई-मासिक", hi: "ई-पत्रिका" },
    href: "/magazines",
    icon: Newspaper,
    gradient: "from-fuchsia-500/15 to-pink-500/10",
    iconColor: "#C026D3"
  }
];

export default function AgriServicesHub() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<"all" | "ai" | "crop" | "economics" | "community">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    {
      id: "all",
      label: language === "mr" ? "सर्व सेवा (१७)" : language === "hi" ? "सभी सेवाएं (17)" : "All Services (17)"
    },
    {
      id: "ai",
      label: language === "mr" ? "एआय व पीक संरक्षण" : language === "hi" ? "एआई एवं फसल सुरक्षा" : "AI & Crop Protection"
    },
    {
      id: "crop",
      label: language === "mr" ? "पीक व्यवस्थापन व हवामान" : language === "hi" ? "फसल प्रबंधन व मौसम" : "Crop & Weather"
    },
    {
      id: "economics",
      label: language === "mr" ? "अर्थशास्त्र व साठवणूक" : language === "hi" ? "अर्थशास्त्र एवं भंडारण" : "Economics & Storage"
    },
    {
      id: "community",
      label: language === "mr" ? "शासकीय योजना व ज्ञान" : language === "hi" ? "योजनाएं एवं ज्ञान" : "Schemes & Knowledge"
    }
  ];

  const filteredServices = ALL_SERVICES.filter((svc) => {
    const matchesTab = activeTab === "all" || svc.category === activeTab;
    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const title = svc.title[language] || svc.title.en;
    const desc = svc.desc[language] || svc.desc.en;
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MahaVISTAAR Agricultural Capabilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === "mr"
              ? "कृषी सेवा केंद्र व महाविस्तार डॅशबोर्ड"
              : language === "hi"
              ? "कृषि सेवाएं एवं महाविस्तार डैशबोर्ड"
              : "Agricultural Services Dashboard"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {language === "mr"
              ? "१७ आधुनिक कृषी साधने — पिके, खते, हवामान, बाजारभाव, योजना व जेमिनी एआय"
              : language === "hi"
              ? "17 आधुनिक कृषि उपकरण — फसलें, उर्वरक, मौसम, मंडी भाव, योजनाएं व जेमिनी एआई"
              : "17 specialized agricultural tools — crops, fertilizers, weather, mandis, schemes & Gemini AI"}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "mr"
                ? "सेवा किंवा साधन शोधा..."
                : language === "hi"
                ? "सेवा या टूल खोजें..."
                : "Search agricultural service..."
            }
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Feature Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((svc) => {
          const IconComponent = svc.icon;
          const title = svc.title[language] || svc.title.en;
          const desc = svc.desc[language] || svc.desc.en;
          const badge = svc.badge[language] || svc.badge.en;

          return (
            <Link
              key={svc.id}
              href={svc.href}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${svc.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div>
                {/* Card Top: Icon + Badge */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `${svc.iconColor}18`,
                      color: svc.iconColor
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1.5 line-clamp-2">
                  {desc}
                </p>
              </div>

              {/* Bottom CTA Link */}
              <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>{language === "mr" ? "उघडा" : language === "hi" ? "खोलें" : "Open Tool"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {language === "mr"
              ? "या शोधानुसार कोणतीही कृषी सेवा आढळली नाही."
              : language === "hi"
              ? "इस खोज के अनुसार कोई सेवा नहीं मिली।"
              : "No agricultural services found matching your search."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
            className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          >
            {language === "mr" ? "सर्व १७ सेवा पहा" : language === "hi" ? "सभी 17 सेवाएं देखें" : "View All 17 Services"}
          </button>
        </div>
      )}
    </div>
  );
}
