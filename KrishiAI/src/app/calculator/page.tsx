"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Coins,
  Calculator,
  Printer,
  RotateCcw,
  TrendingUp,
  Sprout,
  DollarSign,
  Scale,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { convertToAcres, AreaUnit } from "@/lib/fertilizerEngine";

interface CropCostProfile {
  id: string;
  name: { en: string; mr: string; hi: string };
  defaultYieldQtlPerAcre: number;
  mspOrBenchmarkRatePerQtl: number;
  landPrep: number;
  seeds: number;
  fertilizer: number;
  protection: number;
  irrigation: number;
  weeding: number;
  harvesting: number;
  transport: number;
}

const CROP_PROFILES: CropCostProfile[] = [
  {
    id: "cotton",
    name: { en: "Cotton (कापूस)", mr: "कापूस (बीटी कॉटन)", hi: "कपास (बीटी कॉटन)" },
    defaultYieldQtlPerAcre: 10,
    mspOrBenchmarkRatePerQtl: 7521, // 2025-26 MSP
    landPrep: 4500,
    seeds: 2100,
    fertilizer: 5800,
    protection: 4800,
    irrigation: 3000,
    weeding: 4200,
    harvesting: 7000,
    transport: 1600
  },
  {
    id: "soybean",
    name: { en: "Soybean (सोयाबीन)", mr: "सोयाबीन (पिवळे सोने)", hi: "सोयाबीन (पीला सोना)" },
    defaultYieldQtlPerAcre: 9,
    mspOrBenchmarkRatePerQtl: 4892,
    landPrep: 3800,
    seeds: 2800,
    fertilizer: 4200,
    protection: 2500,
    irrigation: 1500,
    weeding: 2800,
    harvesting: 3500,
    transport: 1200
  },
  {
    id: "onion",
    name: { en: "Onion (कांदा)", mr: "कांदा (खरीप / रब्बी)", hi: "प्याज (खरीफ / रबी)" },
    defaultYieldQtlPerAcre: 90,
    mspOrBenchmarkRatePerQtl: 1850,
    landPrep: 5500,
    seeds: 6000,
    fertilizer: 9500,
    protection: 6500,
    irrigation: 4500,
    weeding: 7500,
    harvesting: 11000,
    transport: 4500
  },
  {
    id: "wheat",
    name: { en: "Wheat (गहू)", mr: "गहू (शरबती / लोकवान)", hi: "गेहूं (लोकवान / शरबती)" },
    defaultYieldQtlPerAcre: 16,
    mspOrBenchmarkRatePerQtl: 2425,
    landPrep: 3200,
    seeds: 2200,
    fertilizer: 4100,
    protection: 1400,
    irrigation: 2500,
    weeding: 1800,
    harvesting: 3000,
    transport: 1000
  },
  {
    id: "sugarcane",
    name: { en: "Sugarcane (ऊस)", mr: "ऊस (अडसाली / सुरू)", hi: "गन्ना (अड़साली / शुरू)" },
    defaultYieldQtlPerAcre: 450, // qtl (45 tonnes)
    mspOrBenchmarkRatePerQtl: 340, // FRP ~3400/tonne
    landPrep: 8000,
    seeds: 12000,
    fertilizer: 18000,
    protection: 4000,
    irrigation: 9000,
    weeding: 8000,
    harvesting: 16000,
    transport: 6000
  },
  {
    id: "gram",
    name: { en: "Gram / Chana (हरभरा)", mr: "हरभरा / चना (दिग्विजय)", hi: "चना / ग्राम" },
    defaultYieldQtlPerAcre: 7,
    mspOrBenchmarkRatePerQtl: 5650,
    landPrep: 2800,
    seeds: 2400,
    fertilizer: 2800,
    protection: 1800,
    irrigation: 1200,
    weeding: 1600,
    harvesting: 2500,
    transport: 900
  }
];

export default function CostCalculatorPage() {
  const { language } = useAppStore();

  const [selectedCropId, setSelectedCropId] = useState("cotton");
  const [area, setArea] = useState<number>(2.0);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acre");

  const currentCrop = CROP_PROFILES.find((c) => c.id === selectedCropId) || CROP_PROFILES[0];

  // Customizable inputs per acre
  const [landPrep, setLandPrep] = useState(currentCrop.landPrep);
  const [seeds, setSeeds] = useState(currentCrop.seeds);
  const [fertilizer, setFertilizer] = useState(currentCrop.fertilizer);
  const [protection, setProtection] = useState(currentCrop.protection);
  const [irrigation, setIrrigation] = useState(currentCrop.irrigation);
  const [weeding, setWeeding] = useState(currentCrop.weeding);
  const [harvesting, setHarvesting] = useState(currentCrop.harvesting);
  const [transport, setTransport] = useState(currentCrop.transport);

  // Revenue parameters
  const [yieldPerAcre, setYieldPerAcre] = useState(currentCrop.defaultYieldQtlPerAcre);
  const [marketRate, setMarketRate] = useState(currentCrop.mspOrBenchmarkRatePerQtl);

  // On crop change, reset to defaults
  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const c = CROP_PROFILES.find((p) => p.id === cropId);
    if (c) {
      setLandPrep(c.landPrep);
      setSeeds(c.seeds);
      setFertilizer(c.fertilizer);
      setProtection(c.protection);
      setIrrigation(c.irrigation);
      setWeeding(c.weeding);
      setHarvesting(c.harvesting);
      setTransport(c.transport);
      setYieldPerAcre(c.defaultYieldQtlPerAcre);
      setMarketRate(c.mspOrBenchmarkRatePerQtl);
    }
  };

  const acres = convertToAcres(area, areaUnit);

  // Calculations
  const costPerAcre =
    landPrep + seeds + fertilizer + protection + irrigation + weeding + harvesting + transport;
  const totalCost = Math.round(costPerAcre * acres);

  const totalYield = Math.round(yieldPerAcre * acres);
  const grossRevenue = Math.round(totalYield * marketRate);
  const netProfit = grossRevenue - totalCost;

  const costPerQuintal = totalYield > 0 ? Math.round(totalCost / totalYield) : 0;
  const bcRatio = totalCost > 0 ? (grossRevenue / totalCost).toFixed(2) : "0.00";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-yellow-900 to-amber-900 text-white p-8 shadow-2xl border border-amber-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold backdrop-blur-md border border-yellow-400/30">
              <Coins className="w-4 h-4" />
              {language === "mr"
                ? "कृषी अर्थशास्त्र व नफा नियोजन"
                : language === "hi"
                ? "कृषि अर्थशास्त्र एवं मुनाफा नियोजन"
                : "Farm Economics & Profit Modeling"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "पीक उत्पादन खर्च व निव्वळ नफा गणक"
                : language === "hi"
                ? "फसल उत्पादन लागत एवं शुद्ध मुनाफा कैलकुलेटर"
                : "Crop Production Cost & Net Profit Calculator"}
            </h1>
            <p className="text-amber-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "मशागत, बियाणे, खते, मजुरी व काढणी खर्चाची अचूक वर्गवारी करा आणि अपेक्षित उत्पादन व बाजारभावानुसार निव्वळ नफा जाणून घ्या."
                : language === "hi"
                ? "जुताई, बीज, खाद, श्रम एवं कटाई खर्च का सटीक वर्गीकरण कर अपेक्षित पैदावार व बाजार भाव के अनुसार शुद्ध लाभ प्राप्त करें।"
                : "Itemize inputs, labor, and machinery. Calculate cost per quintal, total production cost, gross revenue, and Benefit-Cost (B:C) ratio."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-2 backdrop-blur-md transition-all border border-white/20"
            >
              <Printer className="w-4 h-4" />
              {language === "mr" ? "प्रिंट / सेव्ह" : language === "hi" ? "प्रिंट करें" : "Print Report"}
            </button>
            <button
              onClick={() => handleCropChange(selectedCropId)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {language === "mr" ? "डीफॉल्ट आकडे" : language === "hi" ? "डिफ़ॉल्ट मान" : "Default Values"}
            </button>
          </div>
        </div>

        {/* Financial KPI Dashboard Bar */}
        <div className="mt-8 pt-6 border-t border-amber-700/50 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/25 rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-amber-200">
              {language === "mr" ? "एकूण लागवड खर्च" : language === "hi" ? "कुल उत्पादन लागत" : "Total Cultivation Cost"}
            </span>
            <p className="text-2xl font-black text-white mt-1">₹ {totalCost.toLocaleString()}</p>
            <p className="text-[11px] text-amber-200/80">
              ₹ {Math.round(costPerAcre).toLocaleString()} / {language === "mr" ? "एकर" : "acre"}
            </p>
          </div>

          <div className="bg-black/25 rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-amber-200">
              {language === "mr" ? "अपेक्षित एकूण उत्पन्न" : language === "hi" ? "अनुमानित कुल आय" : "Gross Revenue"}
            </span>
            <p className="text-2xl font-black text-white mt-1">₹ {grossRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-amber-200/80">
              {totalYield} {language === "mr" ? "क्विंटल" : "Quintals"} @ ₹{marketRate}/qtl
            </p>
          </div>

          <div className="bg-black/25 rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-amber-200">
              {language === "mr" ? "निव्वळ नफा (Net Profit)" : language === "hi" ? "शुद्ध मुनाफा (Net Profit)" : "Net Profit"}
            </span>
            <p
              className={`text-2xl font-black mt-1 ${
                netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {netProfit >= 0 ? "+ " : "- "}₹ {Math.abs(netProfit).toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-200/80">
              ₹ {Math.round(netProfit / Math.max(0.1, acres)).toLocaleString()} / {language === "mr" ? "एकर" : "acre"}
            </p>
          </div>

          <div className="bg-black/25 rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-amber-200">
              {language === "mr" ? "फायदा-तोटा गुणोत्तर (B:C)" : language === "hi" ? "लाभ-लागत अनुपात (B:C)" : "Benefit-Cost (B:C Ratio)"}
            </span>
            <p className="text-2xl font-black text-white mt-1">{bcRatio} : 1</p>
            <p className="text-[11px] text-amber-200/80">
              {language === "mr" ? "प्रति क्विंटल खर्च:" : "Cost/Qtl:"} ₹{costPerQuintal}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Bar: Crop & Land */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Sprout className="w-5 h-5 text-amber-600" />
          {language === "mr" ? "पीक निवड व शेतजमीन क्षेत्र" : language === "hi" ? "फसल चयन एवं खेत क्षेत्रफल" : "Crop Selection & Land Area"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "पिकाचे नाव" : language === "hi" ? "फसल का नाम" : "Crop Name"}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {CROP_PROFILES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[language] || c.name.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "क्षेत्रफळ" : language === "hi" ? "क्षेत्रफल" : "Land Area"}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={area}
              onChange={(e) => setArea(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              {language === "mr" ? "एकक (Unit)" : language === "hi" ? "इकाई (Unit)" : "Area Unit"}
            </label>
            <select
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="acre">{language === "mr" ? "एकर (Acre)" : "Acre"}</option>
              <option value="hectare">{language === "mr" ? "हेक्टर (Hectare)" : "Hectare"}</option>
              <option value="guntha">{language === "mr" ? "गुंठा (Guntha)" : "Guntha"}</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>{language === "mr" ? "प्रमाणित एकर:" : "Standardized Acres:"}</span>
              <span className="font-bold text-sm">{acres.toFixed(2)} Acres</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Cost Itemization & Revenue Estimation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Itemized Expense Breakdown per Acre */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-600" />
              {language === "mr" ? "प्रति एकर खर्च वर्गवारी (₹)" : language === "hi" ? "प्रति एकड़ व्यय विवरण (₹)" : "Itemized Cost Breakdown (₹ / Acre)"}
            </h3>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === "mr" ? "किमती बदलण्यासाठी टाईप करा" : "Edit values to customize"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Land Preparation */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "१. जमीन मशागत (नांगरणी/रोटाव्हेटर)" : language === "hi" ? "1. जुताई एवं खेत तैयारी" : "1. Land Preparation & Tillage"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={landPrep}
                  onChange={(e) => setLandPrep(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Seeds & Seed Treatment */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "२. बियाणे व बीजप्रक्रिया" : language === "hi" ? "2. बीज एवं बीजोपचार" : "2. Seeds & Seed Treatment"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={seeds}
                  onChange={(e) => setSeeds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Fertilizers & Manure */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "३. रासायनिक व सेंद्रिय खते (NPK/शेणखत)" : language === "hi" ? "3. रासायनिक व जैविक खाद" : "3. Fertilizers & Manures"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={fertilizer}
                  onChange={(e) => setFertilizer(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Plant Protection */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "४. कीटकनाशके व बुरशीनाशके (फवारणी)" : language === "hi" ? "4. कीटनाशक एवं कवकनाशी छिड़काव" : "4. Crop Protection & Pesticides"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={protection}
                  onChange={(e) => setProtection(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Irrigation */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "५. पाणी व्यवस्थापन (वीज/डिझेल/ठिबक)" : language === "hi" ? "5. सिंचाई एवं ड्रिप रख-रखाव" : "5. Irrigation & Fuel"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={irrigation}
                  onChange={(e) => setIrrigation(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Intercultural & Weeding */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "६. खुरपणी व कोळपणी मजुरी" : language === "hi" ? "6. निराई-गुड़ाई मजदूरी" : "6. Weeding & Intercultural Labor"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={weeding}
                  onChange={(e) => setWeeding(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Harvesting & Threshing */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "७. काढणी, तोडणी व मळणी खर्च" : language === "hi" ? "7. कटाई, चुनाई एवं थ्रेशिंग" : "7. Harvesting & Threshing"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={harvesting}
                  onChange={(e) => setHarvesting(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Post-Harvest & Transport */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{language === "mr" ? "८. पोते भरणे व कृषी उत्पन्न बाजार वाहतूक" : language === "hi" ? "8. बारदाना एवं मंडी ढुलाई" : "8. Bagging & APMC Mandi Transport"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">₹</span>
                <input
                  type="number"
                  value={transport}
                  onChange={(e) => setTransport(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Yield & Price Realization */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              {language === "mr" ? "उत्पादन व बाजारभाव अंदाज" : language === "hi" ? "पैदावार व बाजार भाव" : "Yield & Market Realization"}
            </h3>

            {/* Yield per Acre */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex justify-between">
                <span>{language === "mr" ? "प्रति एकर अपेक्षित उत्पादन" : language === "hi" ? "प्रति एकड़ अपेक्षित पैदावार" : "Expected Yield per Acre"}</span>
                <span className="font-bold text-amber-600">{yieldPerAcre} Qtl/Acre</span>
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={yieldPerAcre}
                onChange={(e) => setYieldPerAcre(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <p className="text-[11px] text-neutral-500">
                {language === "mr" ? "एकूण शेताचे उत्पादन:" : "Total Farm Production:"}{" "}
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{totalYield} Qtl</span>
              </p>
            </div>

            {/* Selling Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex justify-between">
                <span>{language === "mr" ? "अपेक्षित विक्री भाव (₹/क्विंटल)" : language === "hi" ? "अपेक्षित बिक्री दर (₹/क्विंटल)" : "Selling Price (₹ / Qtl)"}</span>
                <span className="font-bold text-amber-600">₹ {marketRate}</span>
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={marketRate}
                onChange={(e) => setMarketRate(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <p className="text-[11px] text-neutral-500">
                {language === "mr" ? "हमीभाव (MSP 2025-26):" : "Govt MSP Rate:"}{" "}
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  ₹ {currentCrop.mspOrBenchmarkRatePerQtl} / Qtl
                </span>
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{language === "mr" ? "उत्पादन खर्च / क्विंटल:" : "Cost of Production / Qtl:"}</span>
                <span className="font-bold text-neutral-900 dark:text-white">₹ {costPerQuintal}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{language === "mr" ? "नफा प्रति क्विंटल:" : "Profit margin / Qtl:"}</span>
                <span
                  className={`font-bold ${
                    marketRate - costPerQuintal >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  ₹ {marketRate - costPerQuintal}
                </span>
              </div>
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800/60 flex justify-between font-bold text-sm text-neutral-900 dark:text-white">
                <span>{language === "mr" ? "निव्वळ नफा (Net Profit):" : "Total Net Profit:"}</span>
                <span className={netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}>
                  ₹ {netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
