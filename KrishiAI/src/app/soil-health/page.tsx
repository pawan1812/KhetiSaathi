"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Printer,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Layers,
  HelpCircle,
  ArrowRight,
  Info
} from "lucide-react";
import { evaluateSoilNutrientRatings, SoilTestValues } from "@/lib/fertilizerEngine";

const SOIL_PRESETS = [
  {
    id: "vidarbha_black",
    name: {
      en: "Medium Black Soil (Vidarbha / Cotton-Soybean)",
      mr: "मध्यम काळी जमीन (विदर्भ / कापूस-सोयाबीन)",
      hi: "मध्यम काली मिट्टी (विदर्भ / कपास-सोयाबीन)"
    },
    values: {
      hasSoilReport: true,
      shcNumber: "MH-AKL-2025-89421",
      testDate: "2025-05-18",
      labName: "Dr. PDKV Soil Testing Lab, Akola",
      ph: 7.9,
      ec: 0.42,
      oc: 0.48,
      n: 210,
      p: 11.5,
      k: 310,
      zinc: 0.45,
      iron: 3.8,
      sulphur: 8.2,
      boron: 0.48
    }
  },
  {
    id: "western_cane",
    name: {
      en: "Deep Clay Loam (Western Maharashtra / Sugarcane)",
      mr: "भारी खोल जमीन (पश्चिम महाराष्ट्र / ऊस पट्टा)",
      hi: "गहरी दोमट मिट्टी (पश्चिम महाराष्ट्र / गन्ना)"
    },
    values: {
      hasSoilReport: true,
      shcNumber: "MH-PUN-2025-44109",
      testDate: "2025-04-12",
      labName: "MPKV Soil & Water Testing Lab, Pune",
      ph: 7.4,
      ec: 0.35,
      oc: 0.72,
      n: 290,
      p: 18.2,
      k: 240,
      zinc: 0.65,
      iron: 5.2,
      sulphur: 12.0,
      boron: 0.6
    }
  },
  {
    id: "marathwada_alkaline",
    name: {
      en: "Calcareous Alkaline Soil (Marathwada / Pulses)",
      mr: "चुनखडीयुक्त विम्ल जमीन (मराठवाडा / डाळी-तेलबिया)",
      hi: "चूनेदार क्षारीय मिट्टी (मराठवाड़ा / दलहन)"
    },
    values: {
      hasSoilReport: true,
      shcNumber: "MH-CSN-2025-10376",
      testDate: "2025-06-02",
      labName: "VNMKV Krishi Vigyan Kendra, Aurangabad",
      ph: 8.4,
      ec: 0.85,
      oc: 0.38,
      n: 175,
      p: 8.4,
      k: 380,
      zinc: 0.32,
      iron: 2.9,
      sulphur: 6.5,
      boron: 0.4
    }
  }
];

export default function SoilHealthPage() {
  const { language } = useAppStore();
  const [soil, setSoil] = useState<SoilTestValues>(SOIL_PRESETS[0].values);
  const [selectedPreset, setSelectedPreset] = useState("vidarbha_black");
  const [farmerName, setFarmerName] = useState("Rameshwar Patil");
  const [gatNumber, setGatNumber] = useState("142/A");
  const [village, setVillage] = useState("Barshitakli, Akola");

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const ratings = evaluateSoilNutrientRatings(soil);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const found = SOIL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSoil(found.values);
      setAiAnalysis(null);
    }
  };

  const handleNumberChange = (key: keyof SoilTestValues, val: number) => {
    setSoil((prev) => ({ ...prev, [key]: val }));
    setAiAnalysis(null);
  };

  // Calculate composite soil vitality index (0 - 100)
  const calculateVitalityScore = () => {
    let score = 70;
    // pH penalty/bonus
    if (soil.ph >= 6.5 && soil.ph <= 7.5) score += 10;
    else if (soil.ph > 8.0 || soil.ph < 6.0) score -= 12;

    // OC
    if (soil.oc >= 0.75) score += 10;
    else if (soil.oc < 0.5) score -= 10;

    // N, P, K balance
    if (ratings.nRating === "Medium") score += 5;
    if (ratings.pRating === "Medium") score += 5;
    if (ratings.kRating === "Medium" || ratings.kRating === "High") score += 5;

    // Micronutrients
    if ((soil.zinc || 0) < 0.6) score -= 5;
    if ((soil.sulphur || 0) < 10) score -= 5;

    return Math.max(30, Math.min(98, score));
  };

  const vitalityScore = calculateVitalityScore();

  const handleAskGemini = async () => {
    setIsAiLoading(true);
    setAiAnalysis(null);

    const promptText = `
You are an expert Agronomist and Soil Scientist from Maharashtra Agricultural Universities (MPKV Rahuri / PDKV Akola).
Analyze the following Soil Health Card test values for farmer ${farmerName} (Gat No: ${gatNumber}, Location: ${village}):
- Soil Health Card No: ${soil.shcNumber}
- pH: ${soil.ph} (${ratings.phStatus})
- Electrical Conductivity (EC): ${soil.ec} dS/m
- Organic Carbon (OC): ${soil.oc}% (${ratings.ocRating})
- Available Nitrogen (N): ${soil.n} kg/ha (${ratings.nRating})
- Available Phosphorus (P): ${soil.p} kg/ha (${ratings.pRating})
- Available Potassium (K): ${soil.k} kg/ha (${ratings.kRating})
- Zinc: ${soil.zinc} ppm
- Iron: ${soil.iron} ppm
- Sulphur: ${soil.sulphur} ppm
- Boron: ${soil.boron} ppm

Please provide:
1. An overall soil condition diagnosis in friendly, encouraging words.
2. Specific soil amendment recommendations (e.g. Gypsum, Lime, FYM, Green Manuring).
3. Micronutrient correction steps (dosage of Zinc Sulphate, Ferrous Sulphate, etc.).
4. Suitable crops for this soil type.

Respond directly in ${language === "mr" ? "Marathi (मराठी)" : language === "hi" ? "Hindi (हिंदी)" : "English"}.
Use clean bullet points with bold headings.
`;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptText }],
          language
        })
      });

      if (!res.ok) throw new Error("Failed to consult Gemini");
      const data = await res.json();
      setAiAnalysis(data.reply || data.text || "Analysis generated successfully.");
    } catch {
      setAiAnalysis(
        language === "mr"
          ? "माती परीक्षण विश्लेषण: जमिनीत सेंद्रिय कर्ब (OC) वाढवण्यासाठी प्रति एकरी ३ ते ४ ट्रॉली चांगले कुजलेले शेणखत किंवा गांडूळखत द्या. सामू (pH) जास्त असल्यास जिप्समचा वापर करा आणि झिंकच्या कमतरतेसाठी चिलेटेड झिंक किंवा झिंक सल्फेट ५ किलो/एकर टाका."
          : language === "hi"
          ? "मृदा स्वास्थ्य विश्लेषण: मिट्टी में जैविक कार्बन बढ़ाने के लिए 3-4 ट्रॉली गोबर की खाद या केंचुआ खाद डालें। पीएच स्तर अधिक होने पर जिप्सम का उपयोग करें और जिंक की कमी के लिए 5 किग्रा/एकड़ जिंक सल्फेट डालें।"
          : "Soil Health Analysis: To improve Organic Carbon, apply 3-4 trolleys of well-decomposed FYM or vermicompost per acre. For alkaline pH, incorporate gypsum, and amend zinc deficiency with 5kg/acre Zinc Sulphate."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-emerald-800 to-green-900 text-white p-8 shadow-2xl border border-teal-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold backdrop-blur-md border border-teal-400/30">
              <FlaskConical className="w-4 h-4" />
              {language === "mr"
                ? "राष्ट्रीय मृदा आरोग्य पत्रिका अभियान"
                : language === "hi"
                ? "राष्ट्रीय मृदा स्वास्थ्य कार्ड योजना"
                : "National Soil Health Card Scheme (PoCRA / ICAR)"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "डिजिटल मृदा आरोग्य पत्रिका"
                : language === "hi"
                ? "डिजिटल मृदा स्वास्थ्य कार्ड"
                : "Digital Soil Health Card"}
            </h1>
            <p className="text-teal-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "तुमच्या शेताच्या मातीचा सामू (pH), सेंद्रिय कर्ब, नत्र-स्फुरद-पालाश व सूक्ष्म अन्नद्रव्यांचे अचूक विश्लेषण व कृषी विद्यापीठ उपाय."
                : language === "hi"
                ? "अपने खेत की मिट्टी का पीएच, जैविक कार्बन, एनपीके व सूक्ष्म पोषक तत्वों का वैज्ञानिक विश्लेषण और समाधान प्राप्त करें।"
                : "Scientific evaluation of soil pH, organic carbon, major nutrients (NPK), micronutrients, and automated university soil amendments."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-2 backdrop-blur-md transition-all border border-white/20"
            >
              <Printer className="w-4 h-4" />
              {language === "mr" ? "प्रिंट / सेव्ह" : language === "hi" ? "प्रिंट करें" : "Print / PDF"}
            </button>
            <button
              onClick={() => handlePresetChange("vidarbha_black")}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {language === "mr" ? "रीसेट" : language === "hi" ? "रीसेट करें" : "Reset"}
            </button>
          </div>
        </div>

        {/* Vitality Score Bar */}
        <div className="mt-8 pt-6 border-t border-teal-700/50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-extrabold text-2xl">
              {vitalityScore}
            </div>
            <div>
              <p className="text-xs text-teal-200">
                {language === "mr" ? "मृदा सुपीकता निर्देशांक" : language === "hi" ? "मृदा उर्वरता सूचकांक" : "Soil Vitality Score"}
              </p>
              <p className="text-sm font-bold text-white">
                {vitalityScore >= 80
                  ? language === "mr" ? "अतिउत्कृष्ट सुपीकता" : language === "hi" ? "उत्कृष्ट उर्वरता" : "Excellent Fertility"
                  : vitalityScore >= 60
                  ? language === "mr" ? "मध्यम सुपीक (सुधारणा आवश्यक)" : language === "hi" ? "मध्यम उर्वर (सुधार की आवश्यकता)" : "Moderate (Needs Amendment)"
                  : language === "mr" ? "कमी सुपीक (तातडीने लक्ष द्या)" : language === "hi" ? "कमजोर (त्वरित सुधार आवश्यक)" : "Poor (Urgent Action)"}
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-teal-200">{language === "mr" ? "जमिनीचा सामू (pH)" : language === "hi" ? "पीएच मान (pH)" : "Soil Reaction (pH)"}</p>
            <p className="text-lg font-bold text-white flex items-center gap-2 mt-1">
              {soil.ph}
              <span className={`text-xs px-2 py-0.5 rounded-md ${soil.ph >= 6.5 && soil.ph <= 7.8 ? "bg-emerald-500/30 text-emerald-300" : "bg-amber-500/30 text-amber-300"}`}>
                {ratings.phStatus}
              </span>
            </p>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-teal-200">{language === "mr" ? "सेंद्रिय कर्ब (OC)" : language === "hi" ? "जैविक कार्बन (OC)" : "Organic Carbon (OC)"}</p>
            <p className="text-lg font-bold text-white flex items-center gap-2 mt-1">
              {soil.oc} %
              <span className={`text-xs px-2 py-0.5 rounded-md ${ratings.ocRating === "High" ? "bg-emerald-500/30 text-emerald-300" : ratings.ocRating === "Medium" ? "bg-amber-500/30 text-amber-300" : "bg-red-500/30 text-red-300"}`}>
                {ratings.ocRating}
              </span>
            </p>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-teal-200">{language === "mr" ? "विद्युत वाहकता (EC)" : language === "hi" ? "विद्युत चालकता (EC)" : "Electrical Conductivity"}</p>
            <p className="text-lg font-bold text-white flex items-center gap-2 mt-1">
              {soil.ec} dS/m
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300">
                {soil.ec < 1.0 ? "Normal" : "Saline"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selector & Farm Meta */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              {language === "mr" ? "मातीचे नमुने व शेतकरी तपशील" : language === "hi" ? "मृदा नमूना एवं किसान विवरण" : "Soil Sample & Farm Metadata"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === "mr"
                ? "प्रातिनिधिक नमुना निवडा किंवा तुमच्या माती परीक्षण पत्रिकेतील आकडे भरा"
                : language === "hi"
                ? "प्रतिनिधि नमूना चुनें या अपनी मृदा रिपोर्ट के अनुसार मान बदलें"
                : "Select a regional soil preset or enter values directly from your physical SHC card"}
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {SOIL_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedPreset === p.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-teal-500"
                }`}
              >
                {p.name[language] || p.name.en}
              </button>
            ))}
          </div>
        </div>

        {/* Farm Meta Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "शेतकऱ्याचे नाव" : language === "hi" ? "किसान का नाम" : "Farmer Name"}
            </label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "गट नंबर / सर्व्हे क्र." : language === "hi" ? "गट नंबर / सर्वे नं." : "Gat / Survey No."}
            </label>
            <input
              type="text"
              value={gatNumber}
              onChange={(e) => setGatNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "गाव / तालुका / जिल्हा" : language === "hi" ? "गाँव / तहसील / जिला" : "Village & District"}
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "पत्रिका क्रमांक (SHC No.)" : language === "hi" ? "कार्ड संख्या (SHC No.)" : "SHC Card Number"}
            </label>
            <input
              type="text"
              value={soil.shcNumber || ""}
              onChange={(e) => setSoil((prev) => ({ ...prev, shcNumber: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Primary & Micronutrients Tuning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Macronutrients Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                {language === "mr" ? "मुख्य अन्नद्रव्ये (Macro-Nutrients)" : language === "hi" ? "मुख्य पोषक तत्व (NPK)" : "Primary Nutrients (NPK)"}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                kg / hectare
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nitrogen */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {language === "mr" ? "उपलब्ध नत्र (N)" : language === "hi" ? "उपलब्ध नाइट्रोजन (N)" : "Available Nitrogen (N)"}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${ratings.nRating === "Low" ? "bg-red-500/20 text-red-600 dark:text-red-400" : ratings.nRating === "High" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"}`}>
                    {ratings.nRating}
                  </span>
                </div>
                <div className="text-2xl font-black text-neutral-900 dark:text-white">
                  {soil.n} <span className="text-xs font-normal text-neutral-500">kg/ha</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="700"
                  step="5"
                  value={soil.n}
                  onChange={(e) => handleNumberChange("n", Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {language === "mr" ? "प्रमाण: <२८० कमी, २८०-५६० मध्यम, >५६० जास्त" : language === "hi" ? "मानक: <280 कम, 280-560 मध्यम, >560 अधिक" : "Benchmark: <280 Low, 280-560 Med, >560 High"}
                </p>
              </div>

              {/* Phosphorus */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {language === "mr" ? "उपलब्ध स्फुरद (P)" : language === "hi" ? "उपलब्ध फास्फोरस (P)" : "Available Phosphorus (P)"}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${ratings.pRating === "Low" ? "bg-red-500/20 text-red-600 dark:text-red-400" : ratings.pRating === "High" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"}`}>
                    {ratings.pRating}
                  </span>
                </div>
                <div className="text-2xl font-black text-neutral-900 dark:text-white">
                  {soil.p} <span className="text-xs font-normal text-neutral-500">kg/ha</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  step="0.5"
                  value={soil.p}
                  onChange={(e) => handleNumberChange("p", Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {language === "mr" ? "प्रमाण: <१४ कमी, १४-२८ मध्यम, >२८ जास्त" : language === "hi" ? "मानक: <14 कम, 14-28 मध्यम, >28 अधिक" : "Benchmark: <14 Low, 14-28 Med, >28 High"}
                </p>
              </div>

              {/* Potassium */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {language === "mr" ? "उपलब्ध पालाश (K)" : language === "hi" ? "उपलब्ध पोटाश (K)" : "Available Potassium (K)"}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${ratings.kRating === "Low" ? "bg-red-500/20 text-red-600 dark:text-red-400" : ratings.kRating === "High" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"}`}>
                    {ratings.kRating}
                  </span>
                </div>
                <div className="text-2xl font-black text-neutral-900 dark:text-white">
                  {soil.k} <span className="text-xs font-normal text-neutral-500">kg/ha</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="5"
                  value={soil.k}
                  onChange={(e) => handleNumberChange("k", Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {language === "mr" ? "प्रमाण: <१४० कमी, १४०-२८० मध्यम, >२८० जास्त" : language === "hi" ? "मानक: <140 कम, 140-280 मध्यम, >280 अधिक" : "Benchmark: <140 Low, 140-280 Med, >280 High"}
                </p>
              </div>
            </div>
          </div>

          {/* Physical & Secondary / Micronutrients Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-600" />
                {language === "mr" ? "सूक्ष्म अन्नद्रव्ये व भौतिक गुणधर्म" : language === "hi" ? "सूक्ष्म पोषक तत्व एवं भौतिक गुण" : "Micronutrients & Physical Traits (ppm)"}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Zinc */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
                  {language === "mr" ? "जस्त (Zinc Zn)" : language === "hi" ? "जिंक (Zinc Zn)" : "Zinc (Zn)"}
                </span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{soil.zinc} ppm</span>
                <span className={`block text-[10px] font-bold mt-1 ${(soil.zinc || 0) < 0.6 ? "text-red-500" : "text-emerald-500"}`}>
                  {(soil.zinc || 0) < 0.6 ? (language === "mr" ? "कमतरता (<०.६)" : "Deficient (<0.6)") : (language === "mr" ? "पुरेसे" : "Sufficient")}
                </span>
              </div>

              {/* Iron */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
                  {language === "mr" ? "लोह (Iron Fe)" : language === "hi" ? "आयरन (Iron Fe)" : "Iron (Fe)"}
                </span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{soil.iron} ppm</span>
                <span className={`block text-[10px] font-bold mt-1 ${(soil.iron || 0) < 4.5 ? "text-amber-500" : "text-emerald-500"}`}>
                  {(soil.iron || 0) < 4.5 ? (language === "mr" ? "कमी (<४.५)" : "Low (<4.5)") : (language === "mr" ? "पुरेसे" : "Sufficient")}
                </span>
              </div>

              {/* Sulphur */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
                  {language === "mr" ? "गंधक (Sulphur S)" : language === "hi" ? "सल्फर (Sulphur S)" : "Sulphur (S)"}
                </span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{soil.sulphur} ppm</span>
                <span className={`block text-[10px] font-bold mt-1 ${(soil.sulphur || 0) < 10.0 ? "text-red-500" : "text-emerald-500"}`}>
                  {(soil.sulphur || 0) < 10.0 ? (language === "mr" ? "कमतरता (<१०)" : "Deficient (<10)") : (language === "mr" ? "पुरेसे" : "Sufficient")}
                </span>
              </div>

              {/* Boron */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
                  {language === "mr" ? "बोरॉन (Boron B)" : language === "hi" ? "बोरॉन (Boron B)" : "Boron (B)"}
                </span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{soil.boron} ppm</span>
                <span className={`block text-[10px] font-bold mt-1 ${(soil.boron || 0) < 0.5 ? "text-amber-500" : "text-emerald-500"}`}>
                  {(soil.boron || 0) < 0.5 ? (language === "mr" ? "कमी (<०.५)" : "Low (<0.5)") : (language === "mr" ? "पुरेसे" : "Sufficient")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: University Recommendations & Gemini AI Interpretation */}
        <div className="space-y-6">
          {/* Actionable Amendments Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              {language === "mr" ? "विद्यापीठ शिफारस व सुधारणा" : language === "hi" ? "विश्वविद्यालय सिफारिशें" : "Recommended Amendments"}
            </h3>

            <div className="space-y-3">
              {soil.ph > 8.0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {language === "mr" ? "विम्ल जमीन सुधारणा (Gypsum)" : language === "hi" ? "क्षारीय मिट्टी सुधार" : "Alkaline Soil Amendment"}
                    </p>
                    <p className="mt-1">
                      {language === "mr"
                        ? "सामू ८.० पेक्षा जास्त असल्यामुळे प्रति एकरी २.५ क्विंटल जिप्सम मिसळा व ताग/धैंचाचे हिरवळीचे खत जमिनीत गाडा."
                        : language === "hi"
                        ? "पीएच 8.0 से अधिक होने पर 2.5 क्विंटल/एकड़ जिप्सम डालें और ढैंचा जैसी हरी खाद का प्रयोग करें।"
                        : "Apply 2.5 quintals of Agricultural Gypsum per acre and incorporate green manure (Dhaincha/Sunnhemp)."}
                    </p>
                  </div>
                </div>
              )}

              {soil.oc < 0.6 && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 text-xs text-red-900 dark:text-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {language === "mr" ? "सेंद्रिय कर्ब घट (Low Organic Carbon)" : language === "hi" ? "कम जैविक कार्बन" : "Low Organic Carbon Alert"}
                    </p>
                    <p className="mt-1">
                      {language === "mr"
                        ? "जमिनीत सेंद्रिय कर्ब ०.५% पेक्षा कमी आहे. प्रति एकरी किमान ३ ते ४ ट्रॉली कुजलेले शेणखत किंवा २ टन गांडूळखत द्या."
                        : language === "hi"
                        ? "जैविक कार्बन 0.5% से कम है। कम से कम 3-4 ट्रॉली सड़ी गोबर खाद या 2 टन वर्मीकम्पोस्ट डालें।"
                        : "Organic carbon is critically low (<0.5%). Incorporate 3-4 trolleys of FYM or 2 tonnes of vermicompost."}
                    </p>
                  </div>
                </div>
              )}

              {(soil.zinc || 0) < 0.6 && (
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex gap-3 text-xs text-teal-900 dark:text-teal-200">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {language === "mr" ? "जस्त (Zinc) मात्रा" : language === "hi" ? "जिंक सल्फेट खुराक" : "Zinc Sulphate Dosage"}
                    </p>
                    <p className="mt-1">
                      {language === "mr"
                        ? "पेरणीवेळी जमिनीत चिलेटेड झिंक किंवा झिंक सल्फेट (२१%) ८ ते १० किलो प्रति एकरी शेणखतात मिसळून द्या."
                        : language === "hi"
                        ? "बुवाई के समय 8-10 किग्रा जिंक सल्फेट (21%) गोबर खाद में मिलाकर खेत में डालें।"
                        : "Broadcast 8-10 kg Zinc Sulphate (21%) mixed in FYM at basal sowing."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gemini AI Soil Explanation */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-neutral-900 rounded-3xl p-6 shadow-xl border border-teal-200 dark:border-teal-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                {language === "mr" ? "जेमिनी एआय माती सल्ला" : language === "hi" ? "जेमिनी एआई मृदा सलाह" : "Gemini AI Soil Intelligence"}
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {language === "mr"
                ? "या माती परीक्षण अहवालावर आधारित गुगल जेमिनी एआय कडून सविस्तर विश्लेषण व पिकांसाठी मार्गदर्शन मिळवा."
                : language === "hi"
                ? "इस मिट्टी जांच के आधार पर गूगल जेमिनी एआई से विस्तृत विश्लेषण और फसल चयन सलाह प्राप्त करें।"
                : "Ask Google Gemini to interpret these values, diagnose nutrient locks, and propose optimal seasonal crops."}
            </p>

            <button
              onClick={handleAskGemini}
              disabled={isAiLoading}
              className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {isAiLoading
                ? language === "mr" ? "विश्लेषण चालू आहे..." : language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing with Gemini..."
                : language === "mr" ? "जेमिनी कडून विश्लेषण मिळवा" : language === "hi" ? "जेमिनी से विश्लेषण कराएं" : "Analyze Card with Gemini AI"}
            </button>

            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-teal-200 dark:border-teal-800 text-xs text-neutral-800 dark:text-neutral-200 space-y-2 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto"
              >
                {aiAnalysis}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
