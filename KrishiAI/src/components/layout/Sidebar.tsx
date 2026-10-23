"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  Landmark,
  FileText,
  Wallet,
  MessageCircle,
  HeartPulse,
  AlertTriangle,
  Settings,
  Leaf,
  Camera,
  CloudSun,
  Calendar,
  Calculator,
  FlaskConical,
  Coins,
  Building2,
  Tractor,
  BookOpen,
  HelpCircle,
  Video,
  Newspaper,
  Bell
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

export default function Sidebar() {
  const pathname = usePathname();
  const { language } = useAppStore();
  const t = getTranslation(language);

  const sections = [
    {
      title: language === "mr" ? "मुख्य सेवा" : language === "hi" ? "मुख्य सेवाएं" : "Core Hub",
      items: [
        { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
        { href: "/chat", label: language === "mr" ? "एआय कृषी सल्लागार" : language === "hi" ? "एआई सहायक" : "AI Assistant", icon: MessageCircle, badge: "Gemini" },
        { href: "/scanner", label: language === "mr" ? "कीड-रोग डॉक्टर" : language === "hi" ? "रोग डॉक्टर" : "Pest Doctor", icon: Camera },
        { href: "/notifications", label: language === "mr" ? "कृषी इशारे व रडार" : language === "hi" ? "सूचना एवं अलर्ट" : "Agri Alerts", icon: Bell },
      ]
    },
    {
      title: language === "mr" ? "पीक व हवामान" : language === "hi" ? "फसल व मौसम" : "Crop & Climate",
      items: [
        { href: "/crops", label: language === "mr" ? "पीक व्यवस्थापन" : language === "hi" ? "फसल प्रबंधन" : "My Crops & Plots", icon: Sprout },
        { href: "/advisory", label: language === "mr" ? "पीक सल्ला व टप्पे" : language === "hi" ? "फसल सलाह" : "Crop Advisory", icon: Calendar },
        { href: "/weather", label: language === "mr" ? "हवामान रडार" : language === "hi" ? "मौसम रडार" : "Weather Radar", icon: CloudSun },
        { href: "/soil-health", label: language === "mr" ? "मृदा आरोग्य पत्रिका" : language === "hi" ? "मृदा स्वास्थ्य कार्ड" : "Soil Health Card", icon: FlaskConical },
      ]
    },
    {
      title: language === "mr" ? "अर्थशास्त्र व अवजारे" : language === "hi" ? "अर्थशास्त्र व यंत्र" : "Economics & Storage",
      items: [
        { href: "/fertilizer-calculator", label: language === "mr" ? "खत कॅल्क्युलेटर" : language === "hi" ? "उर्वरक कैलकुलेटर" : "Fertilizer Calc", icon: Calculator },
        { href: "/calculator", label: language === "mr" ? "खर्च व नफा गणक" : language === "hi" ? "लागत-मुनाफा" : "Cost & Profit", icon: Coins },
        { href: "/market", label: t.nav.marketPrices, icon: TrendingUp },
        { href: "/warehouses", label: language === "mr" ? "गोदामे व साठवणूक" : language === "hi" ? "गोदाम निर्देशिका" : "Warehouses", icon: Building2 },
        { href: "/chc-locator", label: language === "mr" ? "अवजारे सेवा केंद्र" : language === "hi" ? "कस्टम हायरिंग" : "Machinery CHC", icon: Tractor },
        { href: "/schemes", label: t.nav.schemes, icon: FileText },
        { href: "/loans", label: t.nav.loans, icon: Landmark },
        { href: "/expenses", label: t.nav.expenses, icon: Wallet },
      ]
    },
    {
      title: language === "mr" ? "ज्ञान व शेतीशाळा" : language === "hi" ? "ज्ञान व प्रशिक्षण" : "Knowledge & Training",
      items: [
        { href: "/knowledge", label: language === "mr" ? "कृषी ज्ञान केंद्र (SOP)" : language === "hi" ? "ज्ञान केंद्र" : "Knowledge SOPs", icon: BookOpen },
        { href: "/experts", label: language === "mr" ? "तज्ञांचा सल्ला (Q&A)" : language === "hi" ? "विशेषज्ञ परामर्श" : "Experts Corner", icon: HelpCircle },
        { href: "/videos", label: language === "mr" ? "डिजिटल शेतीशाळा" : language === "hi" ? "खेतीशाला वीडियो" : "Digital Shetishala", icon: Video },
        { href: "/magazines", label: language === "mr" ? "शेतकरी मासिक" : language === "hi" ? "शेतकरी पत्रिका" : "Agri Magazines", icon: Newspaper },
      ]
    },
    {
      title: language === "mr" ? "सुरक्षा व खाती" : language === "hi" ? "सुरक्षा व सेटिंग्स" : "Account & Safety",
      items: [
        { href: "/health-score", label: t.nav.healthScore, icon: HeartPulse },
        { href: "/crisis", label: t.nav.crisisHub, icon: AlertTriangle, isCrisis: true },
        { href: "/settings", label: t.nav.settings, icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 py-4 px-3"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        transition: "background 150ms ease, border-color 150ms ease",
      }}
    >
      {/* Brand Header */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 bg-emerald-600">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-tight text-emerald-800 dark:text-emerald-400">
            {t.appName}
          </h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-500">
            {language === "mr" ? "शेतकरी मित्र" : language === "hi" ? "किसान साथी" : "Smart Farm Partner"}
          </p>
        </div>
      </Link>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {section.title}
            </h2>
            <div className="space-y-0.5">
              {section.items.map((item: any) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-150 group relative"
                    style={{
                      background: isActive ? "var(--green-50)" : "transparent",
                      color: isActive ? "var(--green-600)" : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <item.icon
                      className="flex-shrink-0"
                      style={{
                        width: 16,
                        height: 16,
                        color: isActive ? "var(--green-600)" : "var(--text-muted)",
                      }}
                    />
                    <span className="truncate">{item.label}</span>

                    {item.badge && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {item.badge}
                      </span>
                    )}

                    {item.isCrisis && (
                      <span
                        className="ml-auto w-2 h-2 rounded-full pulse-dot shrink-0"
                        style={{ background: "#EF4444" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Pro Badge */}
      <div className="mt-3 mx-1 p-3 rounded-xl border border-emerald-200/50 bg-emerald-50/60 dark:bg-emerald-950/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {language === "mr" ? "महाविस्तार-एआय सुसज्ज" : language === "hi" ? "महाविस्तार-एआई सुसज्जित" : "MahaVISTAAR Powered"}
          </p>
        </div>
        <p className="text-[10px] mt-0.5 leading-snug text-emerald-700/80 dark:text-emerald-400/80">
          {language === "mr" ? "१७ आधुनिक कृषी सेवा सक्रिय" : language === "hi" ? "17 आधुनिक कृषि सेवाएं सक्रिय" : "17 Smart Agri Features"}
        </p>
      </div>
    </aside>
  );
}
