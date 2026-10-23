"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Building2,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ThermometerSnowflake,
  Wheat,
  Coins,
  ArrowRight,
  Filter,
  FileCheck
} from "lucide-react";

interface WarehouseItem {
  id: string;
  name: { en: string; mr: string; hi: string };
  district: string;
  taluka: string;
  address: { en: string; mr: string; hi: string };
  type: "dry" | "cold";
  capacityMT: number;
  availableMT: number;
  rates: { en: string; mr: string; hi: string };
  cropsSupported: string[];
  contactPerson: string;
  phone: string;
  enwrEligible: boolean;
}

export default function WarehousesPage() {
  const { language } = useAppStore();

  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | "dry" | "cold">("all");

  useEffect(() => {
    async function fetchWarehouses() {
      try {
        setLoading(true);
        const res = await fetch("/api/warehouses");
        if (res.ok) {
          const data = await res.json();
          setWarehouses(data.warehouses || []);
        }
      } catch (err) {
        console.error("Failed to load warehouses", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWarehouses();
  }, []);

  const districts = ["all", ...Array.from(new Set(warehouses.map((w) => w.district)))];

  const filtered = warehouses.filter((w) => {
    const matchesDistrict = selectedDistrict === "all" || w.district === selectedDistrict;
    const matchesType = selectedType === "all" || w.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      w.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.name.mr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.taluka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.cropsSupported.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDistrict && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950 via-teal-900 to-blue-950 text-white p-8 shadow-2xl border border-cyan-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold backdrop-blur-md border border-cyan-400/30">
              <Building2 className="w-4 h-4" />
              {language === "mr"
                ? "महाराष्ट्र राज्य वखार महामंडळ (MSWC) व WDRA मान्यताप्राप्त"
                : language === "hi"
                ? "एमएसडब्ल्यूसी एवं डब्ल्यूडीआरए प्रमाणित गोदाम"
                : "MSWC & WDRA Accredited Warehouses"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "गोदामे व शीतगृह निर्देशिका"
                : language === "hi"
                ? "गोदाम एवं कोल्ड स्टोरेज निर्देशिका"
                : "Agricultural Warehouses & Cold Storage"}
            </h1>
            <p className="text-cyan-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "शेतमाल सुरक्षित साठवण्यासाठी शासकीय गोदामे, शीतगृहे, साठवणूक दर, उपलब्ध जागा शोधा आणि ई-एनडब्ल्यूआर (e-NWR) तारण कर्जाचा लाभ घ्या."
                : language === "hi"
                ? "फसल सुरक्षित रखने हेतु सरकारी गोदाम, शीतगृह, किराया दर, रिक्त स्थान खोजें और ई-एनडब्ल्यूआर बंधक ऋण प्राप्त करें।"
                : "Search certified dry and cold storage facilities, check available capacity, contact managers directly, and pledge electronic warehouse receipts (e-NWR)."}
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="text-xs text-cyan-200">
              {language === "mr" ? "ई-तारण कर्ज सुविधा" : language === "hi" ? "ई-बंधक ऋण सुविधा" : "e-NWR Pledge Loan"}
            </span>
            <p className="text-2xl font-black text-cyan-400">70% Loan</p>
            <p className="text-[11px] text-neutral-300">
              {language === "mr" ? "बाजारभाव वाढेपर्यंत माल सुरक्षित ठेवा" : "Hold crops until peak market prices"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={
                language === "mr"
                  ? "गोदामाचे नाव, तालुका, किंवा पीक शोधा..."
                  : language === "hi"
                  ? "गोदाम का नाम, तहसील या फसल खोजें..."
                  : "Search warehouse name, taluka, or crop..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-cyan-500 outline-none capitalize"
            >
              <option value="all">
                {language === "mr" ? "सर्व जिल्हे (All Districts)" : "All Districts"}
              </option>
              {districts
                .filter((d) => d !== "all")
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedType === "all"
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {language === "mr" ? "सर्व" : "All"}
            </button>
            <button
              onClick={() => setSelectedType("dry")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                selectedType === "dry"
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              {language === "mr" ? "कोरडी गोदामे" : "Dry Storage"}
            </button>
            <button
              onClick={() => setSelectedType("cold")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                selectedType === "cold"
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
              }`}
            >
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              {language === "mr" ? "शीतगृहे (Cold)" : "Cold Storage"}
            </button>
          </div>
        </div>
      </div>

      {/* Warehouse Results Grid */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500">
          <p>{language === "mr" ? "गोदामे लोड होत आहेत..." : "Loading accredited warehouses..."}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center text-neutral-500 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <Building2 className="w-12 h-12 mx-auto text-neutral-400" />
          <p className="text-base font-semibold">
            {language === "mr" ? "कोणतीही गोदामे आढळली नाहीत" : "No warehouses found for this search criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-cyan-500 transition-all group"
            >
              <div className="space-y-4">
                {/* Header Tag & Type */}
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                      w.type === "cold"
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    {w.type === "cold" ? (
                      <>
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        {language === "mr" ? "शीतगृह (Cold Storage)" : "Cold Storage"}
                      </>
                    ) : (
                      <>
                        <Wheat className="w-3.5 h-3.5" />
                        {language === "mr" ? "कोरडे गोदाम (Dry Grain)" : "Dry Grain Storage"}
                      </>
                    )}
                  </span>

                  {w.enwrEligible && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <FileCheck className="w-3 h-3" />
                      e-NWR
                    </span>
                  )}
                </div>

                {/* Warehouse Name */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                    {w.name[language] || w.name.en}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    {w.address[language] || w.address.en}
                  </p>
                </div>

                {/* Capacity & Rates */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs">
                  <div>
                    <span className="text-neutral-500 block mb-0.5">
                      {language === "mr" ? "एकूण क्षमता:" : "Total Capacity:"}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {w.capacityMT.toLocaleString()} MT
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">
                      {language === "mr" ? "उपलब्ध जागा:" : "Available Vacancy:"}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {w.availableMT.toLocaleString()} MT
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500 block mb-0.5">
                      {language === "mr" ? "साठवणूक दर:" : "Storage Rent:"}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {w.rates[language] || w.rates.en}
                    </span>
                  </div>
                </div>

                {/* Supported Crops */}
                <div>
                  <span className="text-[11px] font-semibold text-neutral-500 block mb-1">
                    {language === "mr" ? "मान्य पिके:" : "Supported Crops:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {w.cropsSupported.map((c, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <a
                  href={`tel:${w.phone}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {language === "mr" ? "थेट संपर्क साधा" : language === "hi" ? "संपर्क करें" : "Call Manager"}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
