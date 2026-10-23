"use client";
import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import {
  calculateFertilizerRequirements,
  FertilizerCalculationInput,
  FertilizerCalculationResult,
  AreaUnit
} from "@/lib/fertilizerEngine";
import { CROP_MASTER_LIST } from "@/lib/mahavistaarData";
import {
  Calculator,
  FlaskConical,
  Sparkles,
  TrendingDown,
  Calendar,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Package
} from "lucide-react";

export default function FertilizerCalculatorPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [cropId, setCropId] = useState("cotton");
  const [area, setArea] = useState<number>(5);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acre");
  const [productOption, setProductOption] = useState<"nano_package" | "conventional" | "ssp_package">("nano_package");
  const [hasSoilReport, setHasSoilReport] = useState(false);
  const [fymTonnes, setFymTonnes] = useState<number>(0);

  // Soil test values
  const [soilTest, setSoilTest] = useState({
    hasSoilReport: false,
    ph: 7.6,
    ec: 0.45,
    oc: 0.58,
    n: 240,
    p: 16,
    k: 220
  });

  const [result, setResult] = useState<FertilizerCalculationResult>(() =>
    calculateFertilizerRequirements({
      cropId: "cotton",
      area: 5,
      areaUnit: "acre",
      soilTest: {
        hasSoilReport: false,
        ph: 7.6,
        ec: 0.45,
        oc: 0.58,
        n: 240,
        p: 16,
        k: 220
      },
      fymAppliedTonnes: 0,
      productOption: "nano_package"
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateFertilizerRequirements({
      cropId,
      area,
      areaUnit,
      soilTest: {
        ...soilTest,
        hasSoilReport
      },
      fymAppliedTonnes: fymTonnes,
      productOption
    });
    setResult(res);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-bold mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>MahaVISTAAR Precision Nutrition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.fertilizerCalc.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.fertilizerCalc.subtitle}
            </p>
          </div>
        </div>

        {/* Hormuz Crisis Nano Solution Highlight Banner */}
        <div className="rounded-3xl p-5 bg-gradient-to-r from-violet-900 via-indigo-900 to-emerald-950 text-white shadow-lg border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
              ⚡ Hormuz Crisis Fertilizer Mitigation
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              {language === "mr"
                ? "इफको नॅनो युरिया व नॅनो डीएपी द्वारे खत खर्चात ५०% बचत करा"
                : "Save up to 50% Fertilizer Costs with IFFCO Nano Urea & Nano DAP"}
            </h3>
            <p className="text-xs text-indigo-200 max-w-xl">
              {language === "mr"
                ? "रासायनिक युरियाच्या वाढत्या दरांवर (३५% वाढ) मात करण्यासाठी एकरी २ बाटल्या नॅनो युरिया फवारा (१ बाटली = १ पोते युरिया)."
                : "Counter high conventional urea prices (+35%) by replacing top-dress sacks with foliar Nano Urea @ ₹225/bottle."}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 self-start md:self-auto text-center">
            <span className="text-[10px] text-slate-200 block uppercase font-bold">
              {language === "mr" ? "अंदाजित बचत" : "Potential Savings"}
            </span>
            <span className="text-xl font-black text-emerald-400">
              ₹{result.nanoSavingsVsConventional.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Input Form & Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form: 5 cols */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCalculate}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>{language === "mr" ? "शेताची माहिती व खताचे पर्याय" : "Farm & Fertilizer Inputs"}</span>
              </h3>

              {/* Crop Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fertilizerCalc.selectCrop}
                </label>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {CROP_MASTER_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[language] || c.name.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fertilizerCalc.farmArea}
                  </label>
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    required
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fertilizerCalc.areaUnit}
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="acre">{language === "mr" ? "एकर (Acre)" : "Acre"}</option>
                    <option value="guntha">{language === "mr" ? "गुंठा (Guntha)" : "Guntha"}</option>
                    <option value="hectare">{language === "mr" ? "हेक्टर (Hectare)" : "Hectare"}</option>
                  </select>
                </div>
              </div>

              {/* Product Option Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fertilizerCalc.productOption}
                </label>
                <div className="space-y-2">
                  {[
                    { id: "nano_package", title: t.fertilizerCalc.nanoPackage, desc: "Basal soil starter + foliar Nano Urea/DAP (Eco & economical)" },
                    { id: "conventional", title: t.fertilizerCalc.conventional, desc: "Standard 45kg Urea + 50kg DAP + 50kg MOP sacks" }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition ${
                        productOption === opt.id
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="productOption"
                        value={opt.id}
                        checked={productOption === opt.id}
                        onChange={() => setProductOption(opt.id as any)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white block">
                          {opt.title}
                        </span>
                        <span className="text-slate-500">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* FYM Organic Manure Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fertilizerCalc.fymManure}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={fymTonnes}
                  onChange={(e) => setFymTonnes(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Soil Test Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSoilReport}
                    onChange={(e) => setHasSoilReport(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.fertilizerCalc.haveSoilReport}
                  </span>
                </label>

                {hasSoilReport && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500">pH (सामू)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={soilTest.ph}
                        onChange={(e) => setSoilTest({ ...soilTest, ph: Number(e.target.value) })}
                        className="w-full p-1.5 text-xs rounded-lg border bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500">N (kg/ha)</span>
                      <input
                        type="number"
                        value={soilTest.n}
                        onChange={(e) => setSoilTest({ ...soilTest, n: Number(e.target.value) })}
                        className="w-full p-1.5 text-xs rounded-lg border bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500">P (kg/ha)</span>
                      <input
                        type="number"
                        value={soilTest.p}
                        onChange={(e) => setSoilTest({ ...soilTest, p: Number(e.target.value) })}
                        className="w-full p-1.5 text-xs rounded-lg border bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>{t.fertilizerCalc.calculateBtn}</span>
              </button>
            </form>
          </div>

          {/* Results: 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            {/* Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Area (Acres)</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{result.convertedAcres}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Req. Nitrogen</span>
                <span className="text-xl font-black text-emerald-600">{result.adjustedNPKTotal.n} kg</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Req. Phosphorus</span>
                <span className="text-xl font-black text-sky-600">{result.adjustedNPKTotal.p} kg</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Req. Potash</span>
                <span className="text-xl font-black text-violet-600">{result.adjustedNPKTotal.k} kg</span>
              </div>
            </div>

            {/* Commercial Products Breakdown */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{t.fertilizerCalc.productsBreakdown}</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  Est. Cost: <strong className="text-emerald-600 text-sm">₹{result.totalEstimatedCost.toLocaleString()}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {result.productsRequired.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white block">
                        {prod.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {prod.description}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400 block">
                        {prod.bagsOrBottles} {prod.name.includes("Nano") ? "Bottles" : "Bags"} ({prod.quantity} {prod.unit})
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        ₹{prod.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Schedule */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{t.fertilizerCalc.splitDosingTitle}</span>
              </h3>

              <div className="space-y-3">
                {result.splitSchedule.map((split, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {split.stageName[language] || split.stageName.en}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {split.timing[language] || split.timing.en}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {split.instructions[language] || split.instructions.en}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {split.products.map((p, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border">
                          {p.name}: {p.quantity} {p.unit}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula Explanations */}
            <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-800 dark:text-white block">
                {t.fertilizerCalc.formulasTitle}
              </span>
              <ul className="space-y-1 font-mono text-[11px]">
                {result.formulaSteps.map((step, idx) => (
                  <li key={idx}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
