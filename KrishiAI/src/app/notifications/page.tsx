"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Bell,
  CloudSun,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  CheckCheck
} from "lucide-react";
import { LIVE_AGRI_NOTIFICATIONS, AgriNotification } from "@/lib/mahavistaarData";

export default function NotificationsPage() {
  const { language } = useAppStore();

  const [notifications, setNotifications] = useState<AgriNotification[]>(LIVE_AGRI_NOTIFICATIONS);
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = ["all", "weather", "pest", "mandi", "scheme"];

  const filtered = notifications.filter(
    (n) => selectedType === "all" || n.type === selectedType
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <CloudSun className="w-5 h-5 text-sky-500" />;
      case "pest":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case "mandi":
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "scheme":
        return <FileCheck2 className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-pink-900 to-rose-900 text-white p-8 shadow-2xl border border-rose-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-md border border-rose-400/30">
              <Bell className="w-4 h-4" />
              {language === "mr"
                ? "थेट कृषी सूचना व इशारा केंद्र"
                : language === "hi"
                ? "लाइव कृषि सूचना एवं चेतावनी केंद्र"
                : "Real-Time Agricultural Radar & Alerts"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "कृषी सूचना व सतर्कता इशारे"
                : language === "hi"
                ? "कृषि सूचनाएं एवं चेतावनी अलर्ट"
                : "Agricultural Notifications & Forewarnings"}
            </h1>
            <p className="text-rose-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "अवकाळी पाऊस, उष्णतेची लाट, गुलाबी बोंडअळी पूर्वसूचना, बाजारभाव तेजी व महाडीबीटी अनुदानाचे थेट संदेश एकाच ठिकाणी."
                : language === "hi"
                ? "बेमौसम बारिश, लू, कीट प्रकोप पूर्वसूचना, मंडी भाव में तेजी व सरकारी योजनाओं के लाइव अलर्ट।"
                : "Stay ahead of climate shocks, pest outbreaks, APMC price surges, and subsidy application deadlines with verified bulletins."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all border border-white/20"
              >
                <CheckCheck className="w-4 h-4" />
                {language === "mr" ? "सर्व वाचल्याचे चिन्हांकित करा" : "Mark All as Read"}
              </button>
            )}
            <div className="bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-xs text-rose-200">
                {language === "mr" ? "नवीन इशारे:" : "Unread Alerts:"}{" "}
                <strong className="text-white text-sm">{unreadCount}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
              selectedType === t
                ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-rose-400"
            }`}
          >
            {t === "all"
              ? language === "mr" ? "सर्व सूचना" : "All Alerts"
              : t === "weather"
              ? language === "mr" ? "हवामान (Weather)" : "Weather"
              : t === "pest"
              ? language === "mr" ? "कीड-रोग (Pests)" : "Pest Outbreak"
              : t === "mandi"
              ? language === "mr" ? "बाजारभाव (Mandi)" : "Market Rates"
              : language === "mr" ? "योजना (Schemes)" : "Schemes"}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center text-neutral-500 border border-neutral-200 dark:border-neutral-800">
            <Bell className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
            <p className="text-base font-semibold">
              {language === "mr" ? "या वर्गवारीत कोणतीही सूचना नाही" : "No alerts in this category"}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl shadow-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                !item.isRead
                  ? "bg-white dark:bg-neutral-900 border-rose-500/50 shadow-rose-500/5"
                  : "bg-white/80 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 opacity-90"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0 mt-0.5">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        item.severity === "alert"
                          ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                          : item.severity === "warning"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                          : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {item.severity.toUpperCase()}
                    </span>

                    <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString(
                        language === "mr" ? "mr-IN" : "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {item.title[language] || item.title.en}
                  </h3>

                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
                    {item.description[language] || item.description.en}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}

                {item.actionUrl && (
                  <a
                    href={item.actionUrl}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                  >
                    <span>{language === "mr" ? "तपशील पहा" : "View Details"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
