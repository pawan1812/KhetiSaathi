"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { farmerProfile } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { getTranslation, Language } from "@/lib/translations";
import { Globe, Bell, Wifi, WifiOff, Shield, LogOut, ChevronRight, Smartphone, Moon, Sun, Eye, Lock, Check } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function Toggle({ enabled, onToggle, label, desc, icon }: { enabled: boolean; onToggle: () => void; label: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-muted)] transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
          <p className="text-xs text-[var(--text-muted)]">{desc}</p>
        </div>
      </div>
      <button onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--bg-card)] shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

const SUPPORTED_LANGS = [
  { code: "en" as Language, name: "English", native: "English", region: "All India" },
  { code: "hi" as Language, name: "Hindi", native: "हिन्दी", region: "उत्तर एवं मध्य भारत" },
  { code: "mr" as Language, name: "Marathi", native: "मराठी", region: "महाराष्ट्र" },
];

import { getCurrentUser, type DemoUser } from "@/lib/userAuth";
import { formatCurrency } from "@/lib/utils";
import { UserCheck, Edit3, Save, CheckCircle, RefreshCw, Sprout } from "lucide-react";

const AVAILABLE_CROPS = [
  "Wheat", "Rice", "Cotton", "Soybean", "Sugarcane",
  "Onion", "Grapes", "Mustard", "Chickpea", "Citrus (Orange)", "Maize", "Tomato"
];

const SOIL_TYPES = [
  "Alluvial", "Black Cotton", "Red", "Laterite", "Sandy Loam", "Clay"
];

export default function SettingsPage() {
  const { language, setLanguage, theme, toggleTheme } = useAppStore();
  const t = getTranslation(language);

  const [user, setUser] = useState<DemoUser>(() => getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Profile fields
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAcres, setEditAcres] = useState(user.acres);
  const [editCrops, setEditCrops] = useState<string[]>(user.crops || ["Wheat"]);
  const [editState, setEditState] = useState(user.state);
  const [editDistrict, setEditDistrict] = useState(user.district);
  const [editVillage, setEditVillage] = useState(user.village);

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    schemeDeadlines: true,
    aiAdvisories: true,
    crisisAlerts: true,
    weather: true,
  });
  const [offlineMode, setOfflineMode] = useState(false);

  // Toggle crop selection
  const handleToggleCrop = (cropName: string) => {
    if (editCrops.includes(cropName)) {
      if (editCrops.length > 1) {
        setEditCrops(editCrops.filter((c) => c !== cropName));
      }
    } else {
      setEditCrops([...editCrops, cropName]);
    }
  };

  // Save changes to Firebase Firestore & RTDB
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        uid: user.uid,
        name: editName,
        phone: editPhone,
        acres: Number(editAcres) || 1,
        crops: editCrops,
        state: editState,
        district: editDistrict,
        village: editVillage,
      };

      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setUser(data.profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("khetisaathi-current-user", JSON.stringify(data.profile));
          }
          setSaveSuccess(true);
          setIsEditing(false);
          setTimeout(() => setSaveSuccess(false), 4000);
        }
      }
    } catch (err) {
      console.warn("Save profile failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl mx-auto">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t.nav.settings}</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage your farm holdings, crops, Firebase cloud sync & preferences</p>
        </motion.div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>
                <strong>Profile & Farm Holdings Synced!</strong> Cloud data updated in Firebase Firestore & Realtime DB.
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Live in Dashboard</span>
          </motion.div>
        )}

        {/* Profile Card & Field Editor */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">Farmer Identity & Land Holdings</h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel" : "Edit Fields"}</span>
            </button>
          </div>

          {!isEditing ? (
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/20">
                  {user.avatar || user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{user.phone}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {user.village ? `${user.village}, ` : ""}{user.district}, {user.state}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {user.acres} {t.common.acres}
                  </span>
                </div>
              </div>

              {/* Dynamic KPI Snapshot from Firebase */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-center">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Net Profit</p>
                  <p className="text-sm font-extrabold text-emerald-600">{formatCurrency(user.kpi?.netProfitForecast || 0)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-center">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Land Covered</p>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">{user.acres} Acres</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-center">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Utilization</p>
                  <p className="text-sm font-extrabold text-blue-600">{user.kpi?.landUtilization || 90}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-center">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Active Loans</p>
                  <p className="text-sm font-extrabold text-amber-600">{user.kpi?.activeLoans || 1}</p>
                </div>
              </div>

              {/* Current Crops Badge List */}
              <div className="pt-1">
                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Registered Crops:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(user.crops || ["Wheat"]).map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                      🌿 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Editing Form Mode */
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)]"
                  />
                </div>
              </div>

              {/* Land Acreage Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Total Cultivated Land Size: <strong className="text-emerald-600 text-sm">{editAcres} Acres</strong>
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)]">(Recalculates profit forecast)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={editAcres}
                  onChange={(e) => setEditAcres(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-0.5">
                  <span>1 Acre</span>
                  <span>50 Acres</span>
                  <span>100 Acres</span>
                </div>
              </div>

              {/* Crop Selection (Multi-select) */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                  Select Cultivated Crops (Click to toggle):
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CROPS.map((crp) => {
                    const isSelected = editCrops.includes(crp);
                    return (
                      <button
                        key={crp}
                        type="button"
                        onClick={() => handleToggleCrop(crp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-[var(--bg-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">District</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-[var(--bg-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Village</label>
                  <input
                    type="text"
                    value={editVillage}
                    onChange={(e) => setEditVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-[var(--bg-muted)]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Sync to Firebase</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Language Selection - Restricted to Marathi, English, Hindi as per requirements */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-[var(--text-primary)]">Language / भाषा / भाषा निवडा</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              3 Languages Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUPPORTED_LANGS.map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`p-4 rounded-xl text-left transition-all border relative ${
                    isSelected
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400/30"
                      : "bg-[var(--bg-card)] border-[var(--border)] hover:border-emerald-300"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <p className={`text-base font-bold ${isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-[var(--text-primary)]"}`}>
                    {l.native}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{l.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{l.region}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="gc overflow-hidden">
          <div className="flex items-center gap-2 p-5 pb-3">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">Notifications & Alerts</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            <Toggle
              enabled={notifications.priceAlerts}
              onToggle={() => setNotifications({ ...notifications, priceAlerts: !notifications.priceAlerts })}
              label="APMC Mandi Price Alerts"
              desc="SMS and push alerts when crop prices breach target levels"
              icon={<Bell className="w-4 h-4" />}
            />
            <Toggle
              enabled={notifications.weather}
              onToggle={() => setNotifications({ ...notifications, weather: !notifications.weather })}
              label="Agro-Weather Radar Warnings"
              desc="Rainfall, high wind, and frost alerts from Open-Meteo"
              icon={<Bell className="w-4 h-4" />}
            />
            <Toggle
              enabled={notifications.schemeDeadlines}
              onToggle={() => setNotifications({ ...notifications, schemeDeadlines: !notifications.schemeDeadlines })}
              label="Government Scheme Deadlines"
              desc="Reminders for PM-Kisan e-KYC and Namo Shetkari verification"
              icon={<Bell className="w-4 h-4" />}
            />
            <Toggle
              enabled={notifications.crisisAlerts}
              onToggle={() => setNotifications({ ...notifications, crisisAlerts: !notifications.crisisAlerts })}
              label="Fertilizer Crisis Monitor"
              desc="Urgent notifications regarding Hormuz supply shocks and urea allocations"
              icon={<Bell className="w-4 h-4" />}
            />
          </div>
        </motion.div>

        {/* App Settings */}
        <motion.div variants={item} className="gc overflow-hidden">
          <div className="flex items-center gap-2 p-5 pb-3">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">Appearance & Connectivity</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            <Toggle
              enabled={theme === "dark"}
              onToggle={toggleTheme}
              label="Dark Theme"
              desc="Easy-on-eyes high contrast theme for field and night use"
              icon={theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            />
            <Toggle
              enabled={offlineMode}
              onToggle={() => setOfflineMode(!offlineMode)}
              label="Offline Mandi Cache"
              desc="Store last-synced mandi rates and weather data locally"
              icon={offlineMode ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            />
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">Farmer Identity & Aadhaar Verification</h3>
          </div>
          <div className="space-y-2">
            <div className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-muted)]">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Aadhaar Linked Bank Account</span>
              </div>
              <span className="text-sm font-mono text-[var(--text-muted)]">XXXX-XXXX-{farmerProfile.aadhaar_last4}</span>
            </div>
            <div className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-muted)] transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Data Encryption & Privacy</span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold">256-bit Encrypted</span>
            </div>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={item}>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("khetisaathi-current-user");
                localStorage.removeItem("krishiai-current-user");
                window.location.href = "/auth";
              }
            }}
            className="w-full py-3 rounded-xl border-2 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out from {t.appName}
          </button>
        </motion.div>

        <div className="text-center pb-8">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            {t.appName} v2.4.0 (Production Build) • Industry Ready Platform for Indian Agriculture
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Open-Source Agri APIs · Agmarknet · Open-Meteo · DeepSeek / LLaMA</p>
        </div>
      </motion.div>
    </AppShell>
  );
}
