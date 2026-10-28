"use client";
import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { CROP_MASTER_LIST, CropMaster } from "@/lib/mahavistaarData";
import {
  Sprout,
  Plus,
  Calendar,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";

import { getCurrentUser, type DemoUser } from "@/lib/userAuth";

interface CropRecord {
  id: string;
  cropId: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  plotName: string;
  gatNumber: string;
  area: number;
  areaUnit: "acre" | "hectare" | "guntha";
  status: "active" | "harvested";
  notes?: string;
  createdAt: string;
}

export default function CropManagementPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [user, setUser] = useState<DemoUser | null>(null);
  const [crops, setCrops] = useState<CropRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCropMaster, setSelectedCropMaster] = useState<CropMaster>(CROP_MASTER_LIST[0]);

  // Form state
  const [formData, setFormData] = useState({
    cropId: CROP_MASTER_LIST[0].id,
    cropName: CROP_MASTER_LIST[0].name.en,
    variety: CROP_MASTER_LIST[0].varieties[0].name,
    sowingDate: new Date().toISOString().split("T")[0],
    plotName: "",
    gatNumber: "",
    area: 5,
    areaUnit: "acre" as "acre" | "hectare" | "guntha",
    notes: ""
  });

  useEffect(() => {
    const cur = getCurrentUser();
    setUser(cur);
    const uid = cur?.uid || "user-001";
    fetchCrops(uid);
  }, []);

  const fetchCrops = async (targetUid?: string) => {
    try {
      setLoading(true);
      const uid = targetUid || user?.uid || "user-001";
      const res = await fetch(`/api/crops?uid=${uid}`);
      const data = await res.json();
      if (data.success && data.crops) {
        setCrops(data.crops);
      }
    } catch (err) {
      console.warn("Failed to fetch crops, using defaults", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (cropId: string) => {
    const master = CROP_MASTER_LIST.find((c) => c.id === cropId) || CROP_MASTER_LIST[0];
    setSelectedCropMaster(master);
    setFormData({
      ...formData,
      cropId: master.id,
      cropName: master.name.en,
      variety: master.varieties[0]?.name || "Standard Hybrid"
    });
  };

  const handleSaveCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activeUid = user?.uid || "user-001";
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          uid: activeUid
        })
      });
      const data = await res.json();
      if (data.success && data.crops) {
        setCrops(data.crops);
        setShowAddModal(false);
        setFormData({
          cropId: CROP_MASTER_LIST[0].id,
          cropName: CROP_MASTER_LIST[0].name.en,
          variety: CROP_MASTER_LIST[0].varieties[0].name,
          sowingDate: new Date().toISOString().split("T")[0],
          plotName: "",
          gatNumber: "",
          area: 5,
          areaUnit: "acre",
          notes: ""
        });
      }
    } catch (err) {
      console.error("Save crop error", err);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!confirm(language === "mr" ? "तुम्हाला खात्री आहे की हे पीक हटवायचे आहे?" : "Are you sure you want to delete this crop?")) return;
    try {
      const activeUid = user?.uid || "user-001";
      const res = await fetch(`/api/crops?id=${id}&uid=${activeUid}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success && data.crops) {
        setCrops(data.crops);
      }
    } catch (err) {
      console.error("Delete crop error", err);
    }
  };

  // Helper to calculate days after sowing and determine stage
  const calculateStage = (sowingDate: string, cropId: string) => {
    const start = new Date(sowingDate).getTime();
    const now = new Date().getTime();
    const days = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

    const master = CROP_MASTER_LIST.find((c) => c.id.toLowerCase() === cropId.toLowerCase()) || CROP_MASTER_LIST[0];
    let currentStage = master.stages[0];

    for (const stage of master.stages) {
      if (days >= stage.startDay && days <= stage.endDay) {
        currentStage = stage;
        break;
      }
    }

    const progress = Math.min(100, Math.round((days / master.typicalDurationDays) * 100));

    return { days, currentStage, progress, master };
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">
              <Sprout className="w-3.5 h-3.5" />
              <span>Intelligent Crop Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.cropManagement.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.cropManagement.subtitle}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.cropManagement.addCrop}</span>
          </button>
        </div>

        {/* Crops List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            {t.common.loading}
          </div>
        ) : crops.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {t.cropManagement.noCropsYet}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t.cropManagement.noCropsDesc}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              {t.cropManagement.addCrop}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {crops.map((crop) => {
              const { days, currentStage, progress, master } = calculateStage(crop.sowingDate, crop.cropId);
              const stageName = currentStage.name[language] || currentStage.name.en;
              const stageAdvisory = currentStage.advisory[language] || currentStage.advisory.en;

              return (
                <div
                  key={crop.id}
                  className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all space-y-4"
                >
                  {/* Top: Crop info and delete button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                        🌱
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            {crop.cropName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            {crop.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">
                          {crop.variety} · {crop.area} {crop.areaUnit}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCrop(crop.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Plot & Sowing Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block font-medium">
                        {t.cropManagement.farmPlot}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {crop.plotName || "Main Farm"} (गट: {crop.gatNumber || "N/A"})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        {t.cropManagement.sowingDate}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {crop.sowingDate} ({days} DAS)
                      </span>
                    </div>
                  </div>

                  {/* Growth Stage Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{stageName}</span>
                      </span>
                      <span className="text-slate-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Stage Advisory Alert */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {language === "mr" ? "टप्पा सल्ला" : language === "hi" ? "अवस्था सलाह" : "Stage Advisory"}
                      </span>
                    </div>
                    <p className="text-emerald-800/90 dark:text-emerald-200 leading-relaxed font-medium">
                      {stageAdvisory}
                    </p>
                  </div>

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/advisory?crop=${crop.cropId}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>{t.cropManagement.viewAdvisory}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/fertilizer-calculator?crop=${crop.cropId}&acres=${crop.area}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-700 dark:text-slate-300 hover:text-violet-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>{language === "mr" ? "खत गणक" : language === "hi" ? "खाद गणना" : "Fertilizer"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/scanner?crop=${crop.cropId}&stage=${currentStage.id}`}
                      className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center gap-1 hover:bg-amber-100 transition"
                      title={t.cropManagement.viewPests}
                    >
                      <span>{language === "mr" ? "कीड डॉक्टर" : "Pest Scan"}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ADD CROP MODAL ── */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {t.cropManagement.addCrop}
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveCrop} className="space-y-4">
                  {/* Select Crop Master */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.cropManagement.cropName} *
                    </label>
                    <select
                      value={formData.cropId}
                      onChange={(e) => handleCropSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      {CROP_MASTER_LIST.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name[language] || c.name.en} ({c.season})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variety */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.cropManagement.variety}
                    </label>
                    <select
                      value={formData.variety}
                      onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      {selectedCropMaster.varieties.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.duration}) - {v.yieldQtl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sowing Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.cropManagement.sowingDate} *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.sowingDate}
                      onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  {/* Plot Name & Gat Number */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.cropManagement.farmPlot}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. North Plot"
                        value={formData.plotName}
                        onChange={(e) => setFormData({ ...formData, plotName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.cropManagement.gatNumber}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 142/A"
                        value={formData.gatNumber}
                        onChange={(e) => setFormData({ ...formData, gatNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Area & Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.cropManagement.area} *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="200"
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.cropManagement.areaUnit}
                      </label>
                      <select
                        value={formData.areaUnit}
                        onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="acre">{language === "mr" ? "एकर (Acre)" : "Acre"}</option>
                        <option value="guntha">{language === "mr" ? "गुंठा (Guntha)" : "Guntha"}</option>
                        <option value="hectare">{language === "mr" ? "हेक्टर (Hectare)" : "Hectare"}</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === "mr" ? "टीप / तपशील (पर्यायी)" : "Notes / Remarks (Optional)"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Drip irrigation, organic FYM applied..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
                    >
                      {t.cropManagement.saveCrop}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
