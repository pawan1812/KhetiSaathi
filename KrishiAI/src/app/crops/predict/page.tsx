"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cropPredictionDefaults, predictionResult, crisisData } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { Card, SectionHeader, AlertCard } from "@/components/ui/Cards";
import { Sprout, MapPin, Droplets, Sun, ChevronRight, ChevronLeft, AlertTriangle, TrendingUp, Download, Zap, Loader2 } from "lucide-react";

import { getCurrentUser } from "@/lib/userAuth";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6", "#06B6D4"];

export default function CropPredictPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const currentUser = getCurrentUser();
  const [step, setStep] = useState(0);
  const [crop, setCrop] = useState(currentUser?.crops?.[0] || "Wheat");
  const [land, setLand] = useState(currentUser?.acres || 12);
  const [soil, setSoil] = useState("Alluvial");
  const [season, setSeason] = useState("Rabi (Winter)");
  const [state, setState] = useState(currentUser?.state || "Maharashtra");
  const [costs, setCosts] = useState({
    seeds: 8000, fertilizer: 15000, irrigation: 6000,
    labor: 12000, machinery: 10000, pesticide: 3000,
  });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(predictionResult);

  const crisisMultiplier = 1 + crisisData.ureaSpikePct / 100;
  const adjustedFertCost = Math.round(costs.fertilizer * crisisMultiplier);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          land,
          location: state,
          soil,
          season,
          costs,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);

        // Persist prediction to Firebase
        try {
          await fetch("/api/user/predictions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: currentUser?.uid || "user-001",
              crop,
              acres: land,
              season,
              soil,
              projectedYieldQtl: data.totalYield,
              projectedRevenue: data.estimatedRevenue,
              projectedCost: data.totalCost,
              netProfit: data.netProfit,
              roi: data.profitabilityPct,
              recommendation: data.aiAdvice,
            }),
          });
        } catch (fbErr) {
          console.warn("Failed to save prediction to Firebase:", fbErr);
        }
      }
    } catch (err) {
      console.warn("Prediction fetch error, keeping current result", err);
    } finally {
      setShowResult(true);
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const totalCost = costs.seeds + adjustedFertCost + costs.irrigation + costs.labor + costs.machinery + costs.pesticide;

  const steps = [
    { title: t.crops.stepCropLocation, icon: <Sprout className="w-5 h-5" /> },
    { title: t.crops.stepSoilSeason, icon: <Droplets className="w-5 h-5" /> },
    { title: t.crops.stepInputCosts, icon: <Sun className="w-5 h-5" /> },
    { title: t.crops.stepResults, icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionHeader title={t.crops.title} subtitle={t.crops.subtitle} />

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 mt-2 px-2 overflow-x-auto pb-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  i <= step ? "bg-green-500 text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                } ${i === step ? "ring-2 ring-green-200 ring-offset-2" : ""}`}>
                  {s.icon}
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-1 ${i < step ? "bg-green-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && !showResult && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card padding="lg" className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Select Crop</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {cropPredictionDefaults.crops.map((c) => (
                        <button key={c} onClick={() => setCrop(c)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                            crop === c ? "bg-green-50 border-green-400 text-green-700 ring-1 ring-green-200" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-green-200"
                          }`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />State
                    </label>
                    <select value={state} onChange={(e) => setState(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-green-200 bg-[var(--bg-card)]">
                      {cropPredictionDefaults.states.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Land Size: {land} acres</label>
                    <input type="range" min={1} max={100} value={land} onChange={(e) => setLand(Number(e.target.value))} className="w-full accent-green-500" />
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1"><span>1 acre</span><span>100 acres</span></div>
                  </div>
                  <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </Card>
              </motion.div>
            )}

            {step === 1 && !showResult && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card padding="lg" className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Soil Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cropPredictionDefaults.soilTypes.map((s) => (
                        <button key={s} onClick={() => setSoil(s)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                            soil === s ? "bg-green-50 border-green-400 text-green-700" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-green-200"
                          }`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Season</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {cropPredictionDefaults.seasons.map((s) => (
                        <button key={s} onClick={() => setSeason(s)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                            season === s ? "bg-green-50 border-green-400 text-green-700" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-green-200"
                          }`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 2 && !showResult && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card padding="lg" className="space-y-6">
                  <AlertCard icon={<AlertTriangle className="w-5 h-5" />} label="Active Crisis" title="Fertilizer Crisis Adjustment Active" variant="danger">
                    <p className="text-xs text-red-500 mt-1">Costs auto-inflated by +{crisisData.ureaSpikePct}% due to Strait of Hormuz disruption</p>
                  </AlertCard>
                  <div className="space-y-4">
                    {Object.entries(cropPredictionDefaults.costBreakdown).map(([key, info]) => {
                      const isFert = key === "fertilizer";
                      const val = costs[key as keyof typeof costs];
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-[var(--text-primary)]">{info.label}</label>
                            <span className={`text-sm font-bold ${isFert ? "text-red-600" : "text-[var(--text-primary)]"}`}>
                              {formatCurrency(isFert ? adjustedFertCost : val)}
                              {isFert && <span className="text-xs text-red-400 ml-1">(+{crisisData.ureaSpikePct}%)</span>}
                            </span>
                          </div>
                          <input type="range" min={info.range[0]} max={info.range[1]} value={val}
                            onChange={(e) => setCosts({ ...costs, [key]: Number(e.target.value) })}
                            className={`w-full ${isFert ? "accent-red-500" : "accent-green-500"}`} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-[var(--bg-muted)] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Total Estimated Cost</span>
                    <span className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(totalCost)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => { setStep(3); handlePredict(); }} disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</> : <><Zap className="w-4 h-4" /> Predict Profit</>}
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {loading ? (
                  <Card padding="lg" className="text-center py-16">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-semibold text-[var(--text-primary)]">KhetiSaathi AI is calculating farm profitability...</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Simulating yield, MSP 2025-26, and crisis-adjusted inputs with KhetiSaathi AI Engine</p>
                  </Card>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="text-center border-l-4 border-red-400"><p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Total Cost</p><p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(result.totalCost)}</p></Card>
                      <Card className="text-center border-l-4 border-blue-400"><p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Est. Revenue</p><p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(result.estimatedRevenue)}</p></Card>
                      <Card className="text-center border-l-4 border-green-400"><p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Net Profit</p><p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(result.netProfit)}</p><p className="text-xs text-green-500 mt-0.5">ROI: {result.profitabilityPct}%</p></Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <Card padding="lg">
                        <h3 className="font-bold text-[var(--text-primary)] mb-3">Cost Breakdown</h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart><Pie data={result.costBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                            {result.costBreakdown.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                          </Pie><Tooltip formatter={(v) => formatCurrency(v as number)} /></PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-2">{result.costBreakdown.map((c, i) => (
                          <div key={c.name} className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} /><span className="text-[var(--text-secondary)]">{c.name}</span><span className="ml-auto font-semibold text-[var(--text-primary)]">{c.pct}%</span></div>
                        ))}</div>
                      </Card>
                      <Card padding="lg" className="space-y-4">
                        <h3 className="font-bold text-[var(--text-primary)]">Yield Analysis</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Yield/Acre", value: `${result.yieldPerAcre} qtl`, bg: "bg-green-50", color: "text-green-700" },
                            { label: "Total Yield", value: `${result.totalYield} qtl`, bg: "bg-blue-50", color: "text-blue-700" },
                            { label: "Price/Quintal", value: `₹${result.pricePerQuintal}`, bg: "bg-amber-50", color: "text-amber-700" },
                            { label: "Land", value: `${result.land} acres`, bg: "bg-purple-50", color: "text-purple-700" },
                          ].map(d => (
                            <div key={d.label} className={`${d.bg} rounded-xl p-3 text-center`}><p className="text-xs text-[var(--text-secondary)]">{d.label}</p><p className={`text-xl font-bold ${d.color}`}>{d.value}</p></div>
                          ))}
                        </div>
                        <AlertCard icon={<AlertTriangle className="w-4 h-4" />} label="Crisis Impact" title={`+${formatCurrency(result.crisisImpact.increase)} fertilizer cost`} variant="danger">
                          <p className="text-xs text-red-500 mt-0.5">{result.crisisImpact.reason}</p>
                        </AlertCard>
                      </Card>
                    </div>
                    <AlertCard icon={<Zap className="w-5 h-5" />} label="AI Advisory" title="Recommendation" variant="success">
                      <p className="text-sm text-green-700 mt-1 leading-relaxed">{result.aiAdvice}</p>
                    </AlertCard>
                    <div className="flex gap-3">
                      <button onClick={() => { setStep(0); setShowResult(false); }} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> New Prediction</button>
                      <button onClick={handleDownloadPDF} className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download Report / PDF</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppShell>
  );
}
