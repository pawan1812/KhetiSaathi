"use client";
import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { CROP_MASTER_LIST, PEST_DISEASE_DB, CropMaster, CropStage } from "@/lib/mahavistaarData";
import {
  Calendar,
  Clock,
  Droplets,
  FlaskConical,
  Bug,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function CropAdvisoryPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [selectedCrop, setSelectedCrop] = useState<CropMaster>(CROP_MASTER_LIST[0]);
  const [selectedStageId, setSelectedStageId] = useState<string>(CROP_MASTER_LIST[0].stages[0].id);
  const [sowingDate, setSowingDate] = useState("2026-01-15");

  // Calculate days after sowing and determine matching stage
  const calculateDays = () => {
    const start = new Date(sowingDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  };

  const daysAfterSowing = calculateDays();

  // Find active stage based on tab or auto-calculate
  const activeStage =
    selectedCrop.stages.find((s) => s.id === selectedStageId) || selectedCrop.stages[0];

  // Stage-wise potential pests from pest DB
  const stagePests = PEST_DISEASE_DB.filter(
    (p) => p.cropId === selectedCrop.id && p.stageIds.includes(activeStage.id)
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>MahaVISTAAR Verified Growth Stages</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === "mr"
                ? "पीक सल्ला व वाढीचे टप्पे"
                : language === "hi"
                ? "फसल सलाह एवं विकास अवस्थाएं"
                : "Crop Advisory & Growth Stages"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === "mr"
                ? "पेरणी तारखेनुसार टप्प्याचा मागोवा, खताचे वेळापत्रक, पाणी देण्याचा सल्ला व किडींचा इशारा"
                : language === "hi"
                ? "बुवाई तिथि अनुसार अवस्था की ट्रैकिंग, उर्वरक खुराक, सिंचाई सलाह एवं कीट पूर्वसूचना"
                : "Stage-by-stage agronomic advisories, split fertilization, irrigation guidelines & pest forewarning"}
            </p>
          </div>

          {/* Crop Selector */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCrop.id}
              onChange={(e) => {
                const master = CROP_MASTER_LIST.find((c) => c.id === e.target.value) || CROP_MASTER_LIST[0];
                setSelectedCrop(master);
                setSelectedStageId(master.stages[0].id);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs sm:text-sm text-slate-900 dark:text-white shadow-sm"
            >
              {CROP_MASTER_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[language] || c.name.en} ({c.season})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Sowing Date Calculator Banner */}
        <div className="rounded-3xl p-5 bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 text-white shadow-lg border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
              {language === "mr" ? "पेरणी दिनांक कॅल्क्युलेटर" : "Sowing Date Stage Detection"}
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              {language === "mr"
                ? `पेरणी तारखेवरून सध्याचा टप्पा ओळखा (${daysAfterSowing} दिवस पूर्ण)`
                : `Current Growth Stage from Sowing Date (${daysAfterSowing} Days Elapsed)`}
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              {language === "mr"
                ? "पेरणीची तारीख बदलून आपल्या पिकाची खरी अवस्था व त्या टप्प्यावरील धोके पहा."
                : "Change your sowing date to instantly view calibrated agronomic guidance for your crop."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl border border-white/20 self-start md:self-auto">
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="bg-transparent text-white font-bold text-xs sm:text-sm focus:outline-none px-2"
            />
            <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white text-xs font-black">
              {daysAfterSowing} DAS
            </span>
          </div>
        </div>

        {/* Growth Stages Timeline Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {selectedCrop.stages.map((stage, idx) => {
            const isSelected = stage.id === activeStage.id;
            const isCurrentFromDate =
              daysAfterSowing >= stage.startDay && daysAfterSowing <= stage.endDay;
            const name = stage.name[language] || stage.name.en;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 text-slate-800 dark:text-slate-200"
                }`}
              >
                {isCurrentFromDate && (
                  <span
                    className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      isSelected
                        ? "bg-white text-emerald-800"
                        : "bg-emerald-500 text-white animate-pulse"
                    }`}
                  >
                    {language === "mr" ? "सध्याचा" : "Active"}
                  </span>
                )}
                <span
                  className={`text-[10px] font-black tracking-wider uppercase mb-1 ${
                    isSelected ? "text-emerald-200" : "text-slate-400"
                  }`}
                >
                  {language === "mr" ? `टप्पा ${idx + 1}` : `Stage ${idx + 1}`} ({stage.startDay}-{stage.endDay}d)
                </span>
                <span className="font-extrabold text-xs sm:text-sm line-clamp-1">{name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Cols: Agronomic Guidance */}
          <div className="lg:col-span-2 space-y-5">
            {/* Overview Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-extrabold text-xl">
                  🌾
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    {selectedCrop.name[language] || selectedCrop.name.en} · {selectedCrop.season}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeStage.name[language] || activeStage.name.en} ({activeStage.startDay} - {activeStage.endDay} Days)
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {activeStage.description[language] || activeStage.description.en}
              </p>

              {/* Actionable Points */}
              <div className="space-y-3 pt-2">
                {/* Agronomy Action */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{language === "mr" ? "महत्त्वाची कृषी कामे" : "Key Agronomic Tasks"}</span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                    {activeStage.advisory[language] || activeStage.advisory.en}
                  </p>
                </div>

                {/* Irrigation Guidance */}
                <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-500/20 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-800 dark:text-sky-300">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>{language === "mr" ? "पाणी व्यवस्थापन" : "Irrigation Practice"}</span>
                  </div>
                  <p className="text-xs text-sky-900 dark:text-sky-200 font-medium leading-relaxed">
                    {activeStage.irrigation[language] || activeStage.irrigation.en}
                  </p>
                </div>

                {/* Nutrition Guidance */}
                <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-500/20 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-violet-800 dark:text-violet-300">
                    <FlaskConical className="w-4 h-4 text-violet-600" />
                    <span>{language === "mr" ? "खत व पोषण शिफारस" : "Fertilizer & Nutrition Dosing"}</span>
                  </div>
                  <p className="text-xs text-violet-900 dark:text-violet-200 font-medium leading-relaxed">
                    {activeStage.nutrition[language] || activeStage.nutrition.en}
                  </p>
                </div>
              </div>
            </div>

            {/* Link to Fertilizer Calculator */}
            <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === "mr"
                    ? "या टप्प्यासाठी खताचे अचूक प्रमाण हवे आहे?"
                    : "Need exact commercial fertilizer quantities for this stage?"}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === "mr"
                    ? "खत कॅल्क्युलेटरद्वारे एकरी युरिया, नॅनो युरिया, डीएपी व पालाशच्या पोत्यांची अचूक संख्या काढा."
                    : "Calculate exact bags and bottles using our deterministic fertilizer engine."}
                </p>
              </div>
              <Link
                href={`/fertilizer-calculator?crop=${selectedCrop.id}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition flex-shrink-0"
              >
                <span>{language === "mr" ? "खत गणक उघडा" : "Open Calculator"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right 1 Col: Stage-wise Pest Forewarnings */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === "mr" ? "या टप्प्यावरील किडींचा इशारा" : "Pests & Diseases by Stage"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === "mr" ? "संभाव्य प्रादुर्भाव व उपाय" : "Forewarned outbreaks"}
                  </p>
                </div>
              </div>

              {stagePests.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">
                  {language === "mr"
                    ? "या टप्प्यावर कोणताही तीव्र कीड धोका नाही. सामान्य निरीक्षण ठेवा."
                    : "No high-risk pests identified for this stage. Maintain regular scouting."}
                </div>
              ) : (
                <div className="space-y-3">
                  {stagePests.map((pest) => (
                    <div
                      key={pest.id}
                      className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500/20 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-rose-900 dark:text-rose-200">
                          {pest.name[language] || pest.name.en}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-rose-500 text-white">
                          {pest.severity}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        {pest.symptoms[language] || pest.symptoms.en}
                      </p>

                      <div className="pt-1.5 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] space-y-1">
                        <span className="font-bold text-rose-800 dark:text-rose-300 block">
                          {language === "mr" ? "प्रतिबंधात्मक उपाय:" : "Prevention:"}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {pest.preventiveMeasures[language] || pest.preventiveMeasures.en}
                        </span>
                      </div>

                      <Link
                        href={`/scanner?crop=${selectedCrop.id}&pest=${pest.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 hover:underline pt-1"
                      >
                        <span>{language === "mr" ? "रोग स्कॅनरने तपासणी करा" : "Scan Symptoms"}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* University Citation Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                {language === "mr" ? "माहिती संदर्भ व सत्यापन:" : "Verified Agronomic Reference:"}
              </span>
              <p>
                {language === "mr"
                  ? "महात्मा फुले कृषी विद्यापीठ राहुरी, डॉ. पंजाबराव देशमुख कृषी विद्यापीठ अकोला व ICAR-IASRI मार्गदर्शक तत्त्वे."
                  : "Based on official package of practices from MPKV Rahuri, Dr. PDKV Akola & ICAR."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
