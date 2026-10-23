"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Tractor,
  Search,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Sparkles,
  Filter,
  UserCheck
} from "lucide-react";

interface ChcMachineryItem {
  id: string;
  name: { en: string; mr: string; hi: string };
  centerName: { en: string; mr: string; hi: string };
  district: string;
  taluka: string;
  address: { en: string; mr: string; hi: string };
  operatorName: string;
  phone: string;
  machineryList: {
    equipment: { en: string; mr: string; hi: string };
    hourlyRate: number;
    unit: string;
  }[];
}

export default function ChcLocatorPage() {
  const { language } = useAppStore();

  const [chcList, setChcList] = useState<ChcMachineryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  useEffect(() => {
    async function fetchChc() {
      try {
        setLoading(true);
        const res = await fetch("/api/chc");
        if (res.ok) {
          const data = await res.json();
          setChcList(data.chc || []);
        }
      } catch (err) {
        console.error("Failed to load CHC data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChc();
  }, []);

  const districts = ["all", ...Array.from(new Set(chcList.map((c) => c.district)))];

  const filtered = chcList.filter((c) => {
    const matchesDistrict = selectedDistrict === "all" || c.district === selectedDistrict;
    const matchesSearch =
      searchQuery === "" ||
      c.centerName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.centerName.mr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taluka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.machineryList.some(
        (m) =>
          m.equipment.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.equipment.mr.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-950 via-amber-900 to-orange-900 text-white p-8 shadow-2xl border border-orange-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold backdrop-blur-md border border-orange-400/30">
              <Tractor className="w-4 h-4" />
              {language === "mr"
                ? "कृषी यांत्रिकीकरण उप-अभियान (SMAM / PoCRA)"
                : language === "hi"
                ? "कृषि यंत्रीकरण उप-मिशन (SMAM / PoCRA)"
                : "Sub-Mission on Agricultural Mechanization (SMAM)"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "कृषी अवजारे सेवा केंद्र (अवजारे बँक)"
                : language === "hi"
                ? "कस्टम हायरिंग सेंटर (यंत्र बैंक)"
                : "Custom Hiring Centres (CHC Machinery Bank)"}
            </h1>
            <p className="text-orange-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "ट्रॅक्टर, रोटाव्हेटर, नांगर, मळणी यंत्रे व अत्याधुनिक फवारणी ड्रोन वाजवी शासकीय भाडेतत्त्वावर मिळवण्यासाठी तुमच्या तालुक्यातील अवजारे केंद्र शोधा."
                : language === "hi"
                ? "ट्रैक्टर, रोटावेटर, थ्रेशर एवं कृषि स्प्रे ड्रोन उचित किराए पर प्राप्त करने हेतु अपने नजदीकी कस्टम हायरिंग सेंटर खोजें।"
                : "Rent high-cost farm machinery including tractors, rotavators, combine harvesters, and spray drones at subsidized hourly and per-acre rates."}
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="text-xs text-orange-200">
              {language === "mr" ? "वाजवी शासकीय भाडे दर" : language === "hi" ? "किफायती किराया दर" : "Fair Rental Rates"}
            </span>
            <p className="text-2xl font-black text-orange-400">₹400 - ₹800</p>
            <p className="text-[11px] text-neutral-300">
              {language === "mr" ? "प्रति तास / प्रति एकर" : "Per Hour / Per Acre"}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={
                language === "mr"
                  ? "केंद्राचे नाव, तालुका किंवा अवजार शोधा (उदा. रोटाव्हेटर, ड्रोन)..."
                  : language === "hi"
                  ? "केंद्र का नाम, तहसील या यंत्र खोजें (उदा. रोटावेटर, ड्रोन)..."
                  : "Search CHC name, taluka, or machine (e.g. drone, tractor)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none capitalize"
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
        </div>
      </div>

      {/* CHC Listings Grid */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500">
          <p>{language === "mr" ? "अवजारे केंद्रे लोड होत आहेत..." : "Loading Custom Hiring Centres..."}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center text-neutral-500 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <Tractor className="w-12 h-12 mx-auto text-neutral-400" />
          <p className="text-base font-semibold">
            {language === "mr" ? "कोणतीही अवजारे केंद्रे आढळली नाहीत" : "No Custom Hiring Centres found matching criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((chc) => (
            <motion.div
              key={chc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-orange-500 transition-all group"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex justify-between items-start gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    <Tractor className="w-3.5 h-3.5" />
                    {language === "mr" ? "महाडीबीटी मान्यताप्राप्त" : "PoCRA / SMAM Approved"}
                  </span>
                  <span className="text-xs text-neutral-500 font-semibold">{chc.district}</span>
                </div>

                {/* Center Title */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    {chc.centerName[language] || chc.centerName.en}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    {chc.address[language] || chc.address.en}
                  </p>
                </div>

                {/* Operator Meta */}
                <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === "mr" ? "संचालक:" : "Operator:"}{" "}
                    <strong className="text-neutral-900 dark:text-white">{chc.operatorName}</strong>
                  </span>
                </div>

                {/* Machinery List & Rental Rates */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {language === "mr" ? "उपलब्ध यंत्रे व भाडे दर:" : "Available Machinery & Rates:"}
                  </span>
                  <div className="space-y-1.5">
                    {chc.machineryList.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80"
                      >
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {m.equipment[language] || m.equipment.en}
                        </span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          ₹{m.hourlyRate} / {m.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call Operator Button */}
              <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
                <a
                  href={`tel:${chc.phone}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {language === "mr" ? "अवजारे बुकिंगसाठी फोन करा" : language === "hi" ? "किराए पर लेने हेतु कॉल करें" : "Call to Book Machinery"}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
