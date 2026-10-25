"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Lock, ChevronRight, Sprout, AlertCircle, ShieldCheck,
  User, MapPin, CheckCircle, Globe, ArrowLeft
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DEMO_USERS, setAuthenticatedUser, type DemoUser } from "@/lib/userAuth";
import { useAppStore } from "@/lib/store";
import { getTranslation, Language } from "@/lib/translations";

const AVAILABLE_CROPS = [
  "Wheat", "Rice", "Cotton", "Soybean", "Sugarcane",
  "Onion", "Grapes", "Mustard", "Chickpea", "Citrus (Orange)", "Maize"
];

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const { language, setLanguage } = useAppStore();
  const t = getTranslation(language);

  const [tab, setTab] = useState<"login" | "register">(initialMode);

  // Login Form State
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAcres, setRegAcres] = useState(10);
  const [regState, setRegState] = useState("Maharashtra");
  const [regDistrict, setRegDistrict] = useState("Nagpur");
  const [regVillage, setRegVillage] = useState("Kalmeshwar");
  const [regCrops, setRegCrops] = useState<string[]>(["Cotton", "Soybean"]);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleToggleCrop = (cropName: string) => {
    if (regCrops.includes(cropName)) {
      if (regCrops.length > 1) {
        setRegCrops(regCrops.filter((c) => c !== cropName));
      }
    } else {
      setRegCrops([...regCrops, cropName]);
    }
  };

  // STRICT DATABASE LOGIN: Must verify encrypted password against database
  const handleLogin = async () => {
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError(
        language === "mr"
          ? "कृपया फोन नंबर आणि पासवर्ड टाका."
          : language === "hi"
          ? "कृपया फोन नंबर और पासवर्ड दर्ज करें।"
          : "Please enter your phone number and password."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setError(data.error || t.auth.invalidCreds);
        setLoading(false);
        return;
      }

      // Valid credentials verified against database!
      setAuthenticatedUser(data.user);
      const destination = searchParams.get("from") || "/dashboard";
      router.push(destination);
    } catch (err: unknown) {
      console.error("Login verification error:", err);
      setError(
        language === "mr"
          ? "डेटाबेस सर्व्हरशी संपर्क साधता आला नाही. कृपया पुन्हा प्रयत्न करा."
          : language === "hi"
          ? "डेटाबेस सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।"
          : "Could not connect to database server. Please try again."
      );
      setLoading(false);
    }
  };

  // STRICT DATABASE REGISTRATION: Password encrypted with bcrypt & full profile stored in DB
  const handleRegister = async () => {
    setError("");
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError(
        language === "mr"
          ? "कृपया नाव, फोन नंबर आणि पासवर्ड प्रविष्ट करा."
          : language === "hi"
          ? "कृपया नाम, फोन नंबर और पासवर्ड दर्ज करें।"
          : "Please enter your name, phone number, and password."
      );
      return;
    }

    if (regPassword.trim().length < 6) {
      setError(
        language === "mr"
          ? "पासवर्ड किमान ६ अक्षरांचा असावा."
          : language === "hi"
          ? "पासवर्ड कम से कम ६ अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          password: regPassword.trim(),
          state: regState.trim(),
          district: regDistrict.trim(),
          village: regVillage.trim(),
          acres: Number(regAcres) || 5,
          crops: regCrops,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Encrypted user successfully saved to database!
      setAuthenticatedUser(data.user);
      setRegSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(
        language === "mr"
          ? "नोंदणी दरम्यान त्रुटी आली. कृपया इंटरनेट तपासा."
          : language === "hi"
          ? "पंजीकरण के दौरान त्रुटि हुई। कृपया इंटरनेट जांचें।"
          : "Network error during registration. Please try again."
      );
      setLoading(false);
    }
  };

  const quickLogin = async (u: (typeof DEMO_USERS)[0]) => {
    setLoading(true);
    setError("");
    setPhone(u.phone);
    setPassword(u.password || "");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: u.phone,
          password: u.password || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setError(data.error || t.auth.invalidCreds);
        setLoading(false);
        return;
      }

      setAuthenticatedUser(data.user);
      const destination = searchParams.get("from") || "/dashboard";
      router.push(destination);
    } catch (err: unknown) {
      console.error("Quick login error:", err);
      setError("Database login error. Please try again.");
      setLoading(false);
    }
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "mr", label: "Marathi", native: "मराठी" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4 sm:p-6 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg space-y-6"
      >
        
        {/* Top Bar with Back to Website & Language Switcher */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === "mr" ? "मुख्य पानावर जा" : language === "hi" ? "वेबसाइट पर जाएं" : "Back to Website"}</span>
          </Link>

          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] p-1 rounded-xl shadow-sm">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase transition ${
                  language === l.code ? "bg-emerald-600 text-white shadow-sm" : "text-[var(--text-secondary)] hover:text-emerald-600"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mx-auto">
            <Sprout className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            {t.appName}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            {t.appTagline}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-[var(--bg-muted)] p-1.5 border border-[var(--border)]">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              tab === "login"
                ? "bg-[var(--bg-card)] text-emerald-600 shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.auth.signInTab}
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              tab === "register"
                ? "bg-[var(--bg-card)] text-emerald-600 shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.auth.registerTab}
          </button>
        </div>

        {/* Main Card */}
        <div className="gc p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-xl">
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 mb-4 text-xs font-semibold text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {regSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 mb-4 shadow-sm"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.auth.registrationSuccess}</span>
            </motion.div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === "login" && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                {t.auth.signInTitle}
              </h2>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  {t.auth.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder={t.auth.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  {t.auth.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    placeholder={t.auth.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading ? t.common.loading : <>{t.auth.signInBtn} <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {tab === "register" && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                {t.auth.registerTitle}
              </h2>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  {t.auth.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t.auth.namePlaceholder}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                    {t.auth.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                    {t.auth.passwordLabel}
                  </label>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Land Acreage Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    {t.auth.acresLabel}: <strong className="text-emerald-600 text-sm">{regAcres} Acres</strong>
                  </label>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={regAcres}
                  onChange={(e) => setRegAcres(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Crops Toggle */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  {t.auth.cropsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_CROPS.map((crp) => {
                    const isSelected = regCrops.includes(crp);
                    return (
                      <button
                        key={crp}
                        type="button"
                        onClick={() => handleToggleCrop(crp)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-300"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {crp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t.auth.stateLabel}</label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border)] text-xs bg-[var(--bg-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t.auth.districtLabel}</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border)] text-xs bg-[var(--bg-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t.auth.villageLabel}</label>
                  <input
                    type="text"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border)] text-xs bg-[var(--bg-muted)]"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading ? t.common.loading : <>{t.auth.registerBtn} <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

        </div>

        {/* Demo Accounts List */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-[var(--text-muted)] text-center uppercase tracking-wider">
            {t.auth.quickDemoTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DEMO_USERS.map((u) => (
              <button
                key={u.uid}
                onClick={() => quickLogin(u)}
                disabled={loading}
                className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-emerald-400 text-left transition shadow-sm group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                    {u.avatar}
                  </div>
                  <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-600 transition">
                    {u.name}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                  {u.district}, {u.state} · {u.acres} ac
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-[11px] text-[var(--text-muted)] pb-6">
          <p>{t.appName} v2.4.0 • Secured with Firebase & 256-bit Cloud Sync</p>
        </div>

      </motion.div>
    </div>
  );
}
