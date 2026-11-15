"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Info,
  Check
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

interface FarmActionData {
  urgency: "high" | "medium" | "low";
  message: string;
  reason: string;
  crop?: string;
  district?: string;
  sowingDate?: string;
  modelUsed?: string;
}

export default function TodayFarmActionCard({ uid }: { uid?: string }) {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionData, setActionData] = useState<FarmActionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Feedback states
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [acted, setActed] = useState<boolean | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchFarmAction();
  }, [uid, language]);

  const fetchFarmAction = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const targetUid = uid || "user-001";
      const res = await fetch(`/api/farm-action?uid=${targetUid}&lang=${language}`);
      const data = await res.json();

      if (data.success && data.action) {
        setActionData({
          ...data.action,
          crop: data.metadata?.crop,
          district: data.metadata?.district,
          sowingDate: data.metadata?.sowingDate,
          modelUsed: data.metadata?.modelUsed
        });
      } else if (data.fallback) {
        setActionData(data.fallback);
      } else {
        throw new Error(data.error || "Failed to load farm action advisory.");
      }
    } catch (err: any) {
      console.warn("Farm action fetch error:", err);
      setError(err?.message || "Failed to load latest advice.");
      // Graceful fallback
      setActionData({
        urgency: "medium",
        message: language === "mr"
          ? "शेतात योग्य ओलावा ठेवा. औषध फवारणी किंवा खताच्या अचूक प्रमाणासाठी स्थानिक कृषी अधिकारी किंवा केव्हीकेशी संपर्क साधा."
          : language === "hi"
          ? "खेत में उचित नमी रखें। किसी भी दवा या उर्वरक की सही मात्रा के लिए स्थानीय कृषि अधिकारी से परामर्श लें।"
          : "Maintain proper soil moisture. Consult your local agriculture officer or KVK for exact chemical dosages.",
        reason: language === "mr"
          ? "हवामान व वाढीच्या टप्प्यावर आधारित प्रमाणित सुरक्षित सल्ला."
          : "Standard verified safety guidance."
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFeedback = async (isHelpful: boolean, hasActed?: boolean) => {
    const newHelpful = isHelpful;
    const newActed = hasActed !== undefined ? hasActed : acted ?? false;

    setHelpful(newHelpful);
    if (hasActed !== undefined) setActed(hasActed);
    setFeedbackSubmitted(true);

    try {
      await fetch("/api/farm-action/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: uid || "user-001",
          helpful: newHelpful,
          acted: newActed,
          crop: actionData?.crop,
          sowingDate: actionData?.sowingDate,
          district: actionData?.district,
          actionMessage: actionData?.message,
          actionReason: actionData?.reason,
          urgency: actionData?.urgency
        })
      });
    } catch (err) {
      console.warn("Failed to record feedback:", err);
    }
  };

  const urgencyConfig = {
    high: {
      badgeText: t.farmAction?.highUrgency || "High Priority",
      bgClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
      borderClass: "border-rose-500/30",
      accentBg: "from-rose-500/10 to-transparent",
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />
    },
    medium: {
      badgeText: t.farmAction?.mediumUrgency || "Moderate Action",
      bgClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      borderClass: "border-amber-500/30",
      accentBg: "from-amber-500/10 to-transparent",
      icon: <Clock className="w-4 h-4 text-amber-600" />
    },
    low: {
      badgeText: t.farmAction?.lowUrgency || "Routine / Normal",
      bgClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      borderClass: "border-emerald-500/30",
      accentBg: "from-emerald-500/10 to-transparent",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    }
  };

  const currentUrgency = actionData?.urgency || "medium";
  const cfg = urgencyConfig[currentUrgency] || urgencyConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-3xl border ${cfg.borderClass} bg-[var(--bg-card)] shadow-sm p-5 md:p-6`}
    >
      {/* Background ambient gradient glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cfg.accentBg} pointer-events-none opacity-60`}
      />

      <div className="relative z-10 space-y-4">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-black text-[var(--text-primary)]">
                  {t.farmAction?.title || "Today's Farm Action"}
                </h3>
                {actionData?.crop && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    🌱 {actionData.crop}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {t.farmAction?.subtitle || "Proactive AI intelligence tailored to your crop, weather & market"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${cfg.bgClass}`}
            >
              {cfg.icon}
              {cfg.badgeText}
            </span>

            <button
              onClick={() => fetchFarmAction(true)}
              disabled={refreshing || loading}
              title={t.farmAction?.refreshAction || "Refresh Advisory"}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Content body */}
        {loading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-lg w-1/2"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Primary message */}
            <p className="text-base md:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
              {actionData?.message}
            </p>

            {/* Reason block */}
            {actionData?.reason && (
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-xs text-[var(--text-muted)]">
                <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] mr-1">
                    {t.farmAction?.whyThisAction || "Agronomic Reason:"}
                  </span>
                  {actionData.reason}
                </div>
              </div>
            )}

            {/* Interactive Feedback Section */}
            <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] font-medium">
                  {t.farmAction?.wasHelpful || "Was this helpful?"}
                </span>
                <button
                  onClick={() => handleFeedback(true)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition border ${
                    helpful === true
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] border-transparent hover:bg-slate-200"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {t.farmAction?.yes || "Yes"}
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition border ${
                    helpful === false
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] border-transparent hover:bg-slate-200"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  {t.farmAction?.no || "No"}
                </button>
              </div>

              {/* Action follow-up */}
              {helpful !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-muted)] font-medium">
                    {t.farmAction?.didYouAct || "Did you act on it?"}
                  </span>
                  <button
                    onClick={() => handleFeedback(helpful, true)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition border ${
                      acted === true
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] border-transparent hover:bg-slate-200"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {t.farmAction?.yes || "Yes"}
                  </button>
                  <button
                    onClick={() => handleFeedback(helpful, false)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition border ${
                      acted === false
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] border-transparent hover:bg-slate-200"
                    }`}
                  >
                    {t.farmAction?.no || "No"}
                  </button>
                </div>
              )}

              {feedbackSubmitted && (
                <span className="text-emerald-600 font-semibold text-[11px] animate-fade-in">
                  ✓ {t.farmAction?.feedbackThanks || "Thank you for your feedback!"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
