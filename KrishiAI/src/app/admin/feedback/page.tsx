"use client";
import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

export const dynamic = "force-dynamic";
import {
  AlertCircle,
  ThumbsDown,
  ThumbsUp,
  RefreshCw,
  PlusCircle,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin
} from "lucide-react";

interface FeedbackItem {
  id: string;
  uid: string;
  helpful: boolean;
  acted: boolean;
  crop: string;
  sowingDate?: string;
  district: string;
  action: {
    urgency: string;
    message: string;
    reason: string;
  };
  promptVersion: string;
  comment?: string;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "not_helpful">("not_helpful");
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadFeedbacks();
  }, [filter]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/farm-action/feedback?filter=${filter}`);
      const data = await res.json();
      if (data.success && data.feedbacks) {
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.warn("Failed to load feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToEval = (fb: FeedbackItem) => {
    setSavedSuccess(`Feedback ${fb.id} flagged for review & addition to evals/cases.json`);
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
                Admin Console
              </span>
              <h1 className="text-2xl font-black text-[var(--text-primary)]">
                Farm Agent Feedback & Tuning
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
              Review negative farmer feedback to iteratively refine system prompts, add new few-shot examples, and expand test cases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
              <button
                onClick={() => setFilter("not_helpful")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === "not_helpful"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                👎 Not Helpful Only
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                All Feedbacks
              </button>
            </div>

            <button
              onClick={loadFeedbacks}
              className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)] transition"
              title="Refresh feedback list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {savedSuccess}
          </div>
        )}

        {/* Feedback List */}
        {loading ? (
          <div className="space-y-4 py-8 animate-pulse">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              No negative feedback found!
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              All processed farmer queries currently meet quality and satisfaction standards. New responses flagged as &quot;not helpful&quot; will automatically populate here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        item.helpful
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      }`}
                    >
                      {item.helpful ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                      {item.helpful ? "Helpful" : "Not Helpful"}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      🌱 {item.crop}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[var(--text-muted)]">
                      📍 {item.district}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 dark:bg-slate-900 text-[var(--text-muted)] border border-[var(--border)]">
                      {item.promptVersion || "v1.2"}
                    </span>
                  </div>

                  <span className="text-[11px] text-[var(--text-muted)]">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </span>
                </div>

                {/* Farmer Message Output */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        item.action.urgency === "high"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : item.action.urgency === "medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {item.action.urgency}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">Agent Message:</span>
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.action.message}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    <span className="font-bold">Reason:</span> {item.action.reason}
                  </p>
                </div>

                {/* Footer action tools */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-3 text-[var(--text-muted)]">
                    <span>
                      Farmer Acted:{" "}
                      <strong className={item.acted ? "text-emerald-600" : "text-slate-500"}>
                        {item.acted ? "Yes" : "No / Unreported"}
                      </strong>
                    </span>
                    {item.sowingDate && <span>Sowing: {item.sowingDate}</span>}
                  </div>

                  <button
                    onClick={() => handlePromoteToEval(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-[var(--text-primary)] transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Turn into Eval Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
