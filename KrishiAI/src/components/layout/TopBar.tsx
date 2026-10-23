"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, AlertTriangle, X, LogOut, Globe } from "lucide-react";
import { crisisData, notifications } from "@/lib/mockData";
import { getCurrentUser, logoutUser, type DemoUser } from "@/lib/userAuth";
import { useAppStore } from "@/lib/store";
import { getTranslation, type Language } from "@/lib/translations";

export default function TopBar() {
  const [crisisDismissed, setCrisisDismissed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<DemoUser | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;
  const router = useRouter();

  const { language, setLanguage } = useAppStore();
  const t = getTranslation(language);

  useEffect(() => {
    const savedTheme = localStorage.getItem("khetisaathi-theme") ?? "light";
    setIsDark(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);

    const savedLang = (localStorage.getItem("khetisaathi-lang") as Language) || "en";
    if (savedLang === "en" || savedLang === "hi" || savedLang === "mr") {
      setLanguage(savedLang);
    }

    setUser(getCurrentUser());
  }, [setLanguage]);

  const handleLogout = () => {
    logoutUser();
    router.push("/auth");
  };

  // Close panels on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const val = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", val);
    localStorage.setItem("khetisaathi-theme", val);
  };

  const profile = user;

  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.common.greetingMorning;
    if (hour < 17) return t.common.greetingAfternoon;
    return t.common.greetingEvening;
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "mr", label: "Marathi", native: "मराठी" },
  ];

  return (
    <header
      className="sticky top-0 z-30 topbar"
      style={{ minHeight: "var(--topbar-height)" }}
    >
      {/* Crisis Banner */}
      {!crisisDismissed && crisisData.active && (
        <div
          className="crisis-banner flex items-center justify-between px-4 sm:px-6 py-2 text-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse text-amber-300" />
            <span className="truncate font-semibold text-white">
              ⚠️ {language === "mr" ? "हॉर्मुझ संकट — खतांचे दर ३५% वाढले आहेत" : language === "hi" ? "होर्मुज संकट — उर्वरक कीमतें 35% तक बढ़ीं" : `Hormuz Crisis — Fertilizer prices up ${crisisData.ureaSpikePct}%`}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <Link href="/crisis" className="text-white/95 underline text-xs font-bold hover:text-white transition">
              {t.common.details}
            </Link>
            <button
              onClick={() => setCrisisDismissed(true)}
              className="text-white/70 hover:text-white transition p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Greeting */}
        <div className="min-w-0">
          <h2
            className="text-base font-bold truncate flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            {getDynamicGreeting()}, {profile?.name ?? t.common.farmer} 👋
          </h2>
          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {profile?.village ?? ""}, {profile?.district ?? ""} · {profile?.acres ?? ""} {t.common.acres}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              title="Change Language / भाषा बदला / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="uppercase font-extrabold">{language}</span>
            </button>

            {showLangMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                  Select Language / भाषा
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === l.code
                        ? "bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950 dark:text-emerald-300"
                        : "hover:bg-[var(--bg-muted)] text-[var(--text-primary)]"
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] opacity-60 uppercase">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer hover:opacity-80 transition"
            style={{
              background: "var(--bg-muted)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              width: "160px",
            }}
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">{t.common.search}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-track"
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-toggle-knob">
              {isDark ? "🌙" : "☀️"}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl transition-all"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green-500)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {unread}
                </span>
              )}
            </button>

            {showNotif && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div
                  className="px-4 py-3 text-sm font-bold border-b"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                >
                  Notifications
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 cursor-pointer transition-all"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg-muted)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <p className="text-xs font-semibold" style={{ color: !n.read ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {n.title}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar + Logout */}
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ background: "var(--green-500)" }}
              title={profile?.name}
            >
              {profile?.avatar ?? "?"}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                padding: "6px 8px", borderRadius: 8,
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                cursor: "pointer", color: "var(--text-muted)",
                display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
