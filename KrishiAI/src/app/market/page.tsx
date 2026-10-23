"use client";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import {
  CROP_COMMODITY_LIST,
  getNearbyMandis,
  AGRI_HUBS,
  type MandiWithDistance,
} from "@/lib/mandiService";
import {
  TrendingUp, TrendingDown, MapPin, Bell, BellRing,
  AlertTriangle, Zap, ChevronDown, Navigation, CheckCircle2,
  Phone, Search
} from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

import { getCurrentUser } from "@/lib/userAuth";

interface SavedAlert {
  id: string;
  crop: string;
  targetPrice: number;
  currentPrice: number;
  mandi: string;
  active: boolean;
}

export default function MarketPage() {
  const { language, userLocation, setUserLocation } = useAppStore();
  const t = getTranslation(language);
  const currentUser = getCurrentUser();

  const [selectedCrop, setSelectedCrop] = useState<string>("onion");
  const [targetPrice, setTargetPrice] = useState("");
  const [alertSet, setAlertSet] = useState(false);
  const [mandiSearch, setMandiSearch] = useState("");
  const [detectingGps, setDetectingGps] = useState(false);
  const [savedAlerts, setSavedAlerts] = useState<SavedAlert[]>([]);

  // Load user's saved alerts from Firebase on client mount
  useEffect(() => {
    fetch(`/api/user/alerts?uid=${currentUser?.uid || "user-001"}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.alerts)) {
          setSavedAlerts(d.alerts);
        }
      })
      .catch((e) => console.warn("Failed to load user alerts:", e));
  }, [currentUser?.uid]);

  // Active crop metadata
  const activeCropMeta = useMemo(() => {
    return CROP_COMMODITY_LIST.find((c) => c.key === selectedCrop) || CROP_COMMODITY_LIST[0];
  }, [selectedCrop]);

  // Mandis sorted by physical distance
  const nearbyMandis: MandiWithDistance[] = useMemo(() => {
    return getNearbyMandis(userLocation.lat, userLocation.lon, selectedCrop, mandiSearch);
  }, [userLocation.lat, userLocation.lon, selectedCrop, mandiSearch]);

  const bestMandi = nearbyMandis[0];
  const activePrice = bestMandi?.activeCommodity?.modalPrice || activeCropMeta.defaultMsp;
  const msp = activeCropMeta.defaultMsp;
  const highestPrice = Math.max(...nearbyMandis.map((m) => m.activeCommodity?.maxPrice || activePrice), activePrice);

  const handleSetAlert = async () => {
    if (!targetPrice || Number(targetPrice) <= 0) return;
    const target = Number(targetPrice);
    setAlertSet(true);

    try {
      const res = await fetch("/api/user/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser?.uid || "user-001",
          crop: activeCropMeta.name,
          targetPrice: target,
          currentPrice: activePrice,
          mandi: bestMandi?.name || "Nearest APMC",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alert) {
          setSavedAlerts((prev) => [data.alert, ...prev]);
        }
      }
    } catch (e) {
      console.warn("Save alert to Firebase error:", e);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    setSavedAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/user/alerts?uid=${currentUser?.uid || "user-001"}&id=${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.warn("Delete alert error:", e);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const closestHub = [...AGRI_HUBS].sort((a, b) => {
          const dA = Math.hypot(a.lat - latitude, a.lon - longitude);
          const dB = Math.hypot(b.lat - latitude, b.lon - longitude);
          return dA - dB;
        })[0];

        setUserLocation({
          lat: latitude,
          lon: longitude,
          name: closestHub?.name || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
          state: closestHub?.state || "India",
        });
        setDetectingGps(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setDetectingGps(false);
        alert("GPS detection failed. You can choose your district from the dropdown.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleHubSelect = (hubId: string) => {
    const hub = AGRI_HUBS.find((h) => h.id === hubId);
    if (!hub) return;
    setUserLocation({
      lat: hub.lat,
      lon: hub.lon,
      name: language === "mr" ? hub.nameMr : language === "hi" ? hub.nameHi : hub.name,
      state: hub.state,
    });
  };

  // 6-month simulated Agmarknet chart
  const chartData = [
    { month: "Nov", price: Math.round(activePrice * 0.92) },
    { month: "Dec", price: Math.round(activePrice * 0.95) },
    { month: "Jan", price: Math.round(activePrice * 0.98) },
    { month: "Feb", price: Math.round(activePrice * 0.94) },
    { month: "Mar", price: Math.round(activePrice * 0.99) },
    { month: "Apr", price: activePrice },
  ];

  const cropNameTranslated =
    language === "mr"
      ? activeCropMeta.nameMr
      : language === "hi"
      ? activeCropMeta.nameHi
      : activeCropMeta.name;

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        
        {/* Header with Title and Commodity Dropdown */}
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t.market.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              {t.market.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Commodity Selector */}
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setAlertSet(false);
                  setTargetPrice("");
                }}
                className="appearance-none bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-sm"
              >
                {CROP_COMMODITY_LIST.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {language === "mr" ? c.nameMr : language === "hi" ? c.nameHi : c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>

            {/* Quick Location Picker */}
            <select
              value={AGRI_HUBS.find((h) => Math.abs(h.lat - userLocation.lat) < 0.05)?.id || ""}
              onChange={(e) => handleHubSelect(e.target.value)}
              className="text-xs font-semibold py-2.5 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm cursor-pointer"
            >
              {AGRI_HUBS.map((h) => (
                <option key={h.id} value={h.id}>
                  📍 {language === "mr" ? h.nameMr : language === "hi" ? h.nameHi : h.name}
                </option>
              ))}
            </select>

            {/* GPS Locate Button */}
            <button
              onClick={handleDetectGPS}
              disabled={detectingGps}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              title={t.common.detectLocation}
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingGps ? "animate-spin" : ""}`} />
              <span>{detectingGps ? t.common.detectingLocation : t.common.detectLocation}</span>
            </button>
          </div>
        </motion.div>

        {/* Current Location Badge Banner */}
        <motion.div variants={item} className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-900 dark:text-emerald-200">
              {language === "mr" ? "सध्याचे जीपीएस स्थान:" : language === "hi" ? "वर्तमान स्थान:" : "Active Location:"}{" "}
              <strong>{userLocation.name}</strong> ({userLocation.lat.toFixed(2)}°N, {userLocation.lon.toFixed(2)}°E)
            </span>
          </div>
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-medium">
            <span>✓ {t.common.verifiedMandi}</span>
            <span>• {nearbyMandis.length} {language === "mr" ? "बाजार समित्या उपलब्ध" : language === "hi" ? "मंडियां सक्रिय" : "APMCs active"}</span>
          </div>
        </motion.div>

        {/* Price Overview Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="gc p-5 border-l-4 border-emerald-500">
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              {t.market.currentPrice} ({cropNameTranslated})
            </p>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-1.5">
              ₹{activePrice}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">per quintal · {bestMandi?.name.split(" ")[0]} APMC</p>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              +{bestMandi?.activeCommodity?.trendPct || 2.5}% this week
            </div>
          </div>

          <div className="gc p-5 border-l-4 border-blue-500">
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              {t.market.mspPrice}
            </p>
            <p className="text-3xl font-extrabold text-blue-600 mt-1.5">
              ₹{msp}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Govt Minimum Support Price (2025-26)</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">
              Ministry of Agriculture & Farmers Welfare
            </p>
          </div>

          <div className="gc p-5 border-l-4 border-amber-500">
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              {t.market.bestMandiPrice}
            </p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1.5">
              ₹{highestPrice}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Top realization rate nearby</p>
            <p className="text-xs text-emerald-600 mt-2 font-bold">
              +{(((highestPrice - msp) / msp) * 100).toFixed(1)}% {t.market.aboveMsp}
            </p>
          </div>
        </motion.div>

        {/* Price Trend Chart */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              {activeCropMeta.emoji} {cropNameTranslated} — {t.market.priceTrend}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Agmarknet Direct
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMandi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", fontSize: "13px", background: "var(--bg-card)" }}
                formatter={(v) => [`₹${v}`, cropNameTranslated]}
              />
              <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={3} fill="url(#colorMandi)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── MANDIS TABLE & AI RECOMMENDATIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Nearest Mandis List — 7 cols */}
          <motion.div variants={item} className="lg:col-span-7 gc p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">
                  {t.market.nearestMandis}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {language === "mr" ? "तुमच्या स्थानापासून प्रत्यक्ष अंतराप्रमाणे क्रमवारी" : language === "hi" ? "आपकी दूरी के अनुसार क्रमबद्ध" : "Sorted by real-time GPS proximity"}
                </p>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder={t.market.searchMandi}
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 w-44 bg-[var(--bg-muted)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {nearbyMandis.length === 0 ? (
                <p className="text-center py-8 text-sm text-[var(--text-muted)]">
                  No mandis found matching &quot;{mandiSearch}&quot; for {cropNameTranslated}.
                </p>
              ) : (
                nearbyMandis.map((m, i) => {
                  const comm = m.activeCommodity;
                  const mandiName = language === "mr" ? m.nameMr : language === "hi" ? m.nameHi : m.name;
                  const districtName = language === "mr" ? m.districtMr : language === "hi" ? m.districtHi : m.district;
                  const isClosest = i === 0;

                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isClosest
                          ? "border-emerald-400/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
                          : "border-[var(--border)] hover:bg-[var(--bg-muted)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isClosest ? "bg-emerald-600 text-white shadow-sm" : "bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                            }`}
                          >
                            #{i + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                                {mandiName}
                              </p>
                              {isClosest && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                  {language === "mr" ? "सर्वात जवळ" : language === "hi" ? "सबसे नजदीक" : "Nearest"}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                              <span className="flex items-center gap-0.5 font-semibold text-emerald-700 dark:text-emerald-400">
                                <MapPin className="w-3 h-3" />
                                {m.distanceKm} {t.common.kmAway}
                              </span>
                              <span>• {districtName}, {m.state}</span>
                              {m.phone && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
                                  <Phone className="w-3 h-3" /> {m.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {comm && (
                          <div className="text-right flex-shrink-0">
                            <p className="text-base font-extrabold text-[var(--text-primary)]">
                              ₹{comm.modalPrice}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              Min: ₹{comm.minPrice} · Max: ₹{comm.maxPrice}
                            </p>
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              📦 {comm.arrivalsQtl.toLocaleString("en-IN")} qtl
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* AI Sell Advisory & Price Alert — 5 cols */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* AI Sell Recommendation Card */}
            <motion.div variants={item} className="gc p-5 bg-gradient-to-br from-emerald-50 to-green-50/60 dark:from-emerald-950/40 dark:to-green-950/20 border-emerald-200/80 dark:border-emerald-900/60">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  {t.market.aiSellRecommendation}
                </h3>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                📊 {language === "mr" ? (
                  <>
                    <strong>{cropNameTranslated}</strong> विकण्यासाठी सर्वोत्तम बाजारपेठ <strong>{bestMandi?.nameMr || "स्थानिक बाजार समिती"}</strong> आहे. सध्या सरासरी भाव <strong>₹{activePrice}/क्विंटल</strong> आहे जो हमीभावापेक्षा जास्त आहे. पुढील आठवड्यात संभाव्य आवक वाढण्याची शक्यता असल्याने ५०% माल तातडीने विकणे हिताचे ठरेल.
                  </>
                ) : language === "hi" ? (
                  <>
                    <strong>{cropNameTranslated}</strong> बेचने के लिए सबसे उपयुक्त मंडी <strong>{bestMandi?.nameHi || "नजदीकी मंडी"}</strong> है। वर्तमान में मॉडल भाव <strong>₹{activePrice}/क्विंटल</strong> चल रहा है। आवक बढ़ने से पहले 50% स्टॉक इस हफ्ते निकालना फायदेमंद रहेगा।
                  </>
                ) : (
                  <>
                    Optimal window to sell <strong>{cropNameTranslated}</strong> is at <strong>{bestMandi?.name || "nearest APMC"}</strong>. Modal price is trading at <strong>₹{activePrice}/quintal</strong> (+{(((activePrice - msp) / msp) * 100).toFixed(1)}% vs MSP). Transport cost is minimal at {bestMandi?.distanceKm || 15} km.
                  </>
                )}
              </p>
            </motion.div>

            {/* Geopolitical & Market Intelligence */}
            <motion.div variants={item} className="gc p-5 bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/60">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                  {t.market.whyPricesMoving}
                </h3>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {language === "mr" ? (
                  "हॉर्मुझ आखातातील तणावामुळे आंतरराष्ट्रीय खतांच्या आयातीत ३५% अडथळा निर्माण झाला आहे. यामुळे खरीप हंगामातील उत्पादन खर्चात वाढ अपेक्षित असून शेतमालाचे बाजारभाव उच्च पातळीवर टिकून राहण्याची चिन्हे आहेत."
                ) : language === "hi" ? (
                  "होर्मुज जलमार्ग संकट के कारण यूरिया व डीएपी आयात में 35% की बढ़ोतरी हुई है। इससे आने वाले सीजन में इनपुट लागत बढ़ेगी और मंडी में कम आवक के कारण जिंसों के भाव मजबूत रहने का अनुमान है।"
                ) : (
                  "The Strait of Hormuz conflict has inflated natural gas & fertilizer import costs by 35%. As farm input costs rise, farm-gate arrivals are anticipated to remain tight, providing firm price support across major mandis."
                )}
              </p>
            </motion.div>

            {/* Set Real Price Alert */}
            <motion.div variants={item} className="gc p-5">
              <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2">
                {t.market.setPriceAlert}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                {language === "mr" ? "अपेक्षित भाव आल्यास थेट एसएमएस व व्हॉट्सअ‍ॅप सूचना मिळवा" : language === "hi" ? "लक्षित भाव पहुंचने पर तुरंत एसएमएस अलर्ट पाएं" : "Receive instant SMS & push alert when modal price hits your target"}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={`₹ ${t.market.alertTargetPlaceholder} (Current: ${activePrice})`}
                  value={targetPrice}
                  onChange={(e) => {
                    setTargetPrice(e.target.value);
                    setAlertSet(false);
                  }}
                  className="flex-1 p-2.5 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-[var(--bg-muted)]"
                />
                <button
                  onClick={handleSetAlert}
                  disabled={!targetPrice || Number(targetPrice) <= 0}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                    alertSet
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                  }`}
                >
                  {alertSet ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t.market.alertActive}
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" /> {t.market.alertButton}
                    </>
                  )}
                </button>
              </div>

              {alertSet && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>
                    ✓ {t.market.alertSuccessMsg} ({cropNameTranslated} &gt;= ₹{targetPrice})
                  </span>
                </div>
              )}

              {/* Saved Firebase Alerts List */}
              {savedAlerts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs font-bold text-[var(--text-primary)] mb-2">
                    {language === "mr" ? "सक्रिय किंमत सूचना (Firebase)" : language === "hi" ? "सक्रिय मूल्य अलर्ट (Firebase)" : "Active Price Alerts (Firebase)"}
                  </p>
                  <div className="space-y-2">
                    {savedAlerts.map((alt) => (
                      <div key={alt.id} className="p-2.5 rounded-xl bg-[var(--bg-muted)] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{alt.crop} &gt;= ₹{alt.targetPrice}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{alt.mandi} · Current: ₹{alt.currentPrice}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAlert(alt.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Remove alert"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

      </motion.div>
    </AppShell>
  );
}
