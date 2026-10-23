"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Newspaper,
  BookOpen,
  Download,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  Building2,
  FileText,
  X,
  Sparkles
} from "lucide-react";
import { AGRI_MAGAZINES, AgriMagazine } from "@/lib/mahavistaarData";

export default function MagazinesPage() {
  const { language } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMag, setSelectedMag] = useState<AgriMagazine | null>(null);

  const filtered = AGRI_MAGAZINES.filter((mag) => {
    const titleText = (mag.title[language] || mag.title.en).toLowerCase();
    const issueText = mag.issue.toLowerCase();
    const topicsText = mag.topics.join(" ").toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      titleText.includes(searchQuery.toLowerCase()) ||
      issueText.includes(searchQuery.toLowerCase()) ||
      topicsText.includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-green-950 text-white p-8 shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-400/30">
              <Newspaper className="w-4 h-4" />
              {language === "mr"
                ? "महाराष्ट्र शासन कृषी व पशुसंवर्धन विभाग अधिकृत मासिके"
                : language === "hi"
                ? "महाराष्ट्र शासन कृषि एवं पशुपालन आधिकारिक पत्रिकाएं"
                : "Official Maharashtra Agri E-Magazines"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "कृषी मासिके व ई-बुलेटिन (शेतकरी मासिक)"
                : language === "hi"
                ? "कृषि पत्रिकाएं एवं ई-बुलेटिन (शेतकरी मासिक)"
                : "Agri Magazines & Government Bulletins"}
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "शेतकरी मासिक, महापशुधन व कृषी संवादचे अधिकृत अंक वाचा आणि मोफत डाऊनलोड करा. शेती, फलोत्पादन, दुग्ध व्यवसाय व हवामान तंत्रज्ञानावरील संशोधनपर लेख."
                : language === "hi"
                ? "शेतकरी मासिक, महापशुधन एवं कृषि संवाद के डिजिटल अंक पढ़ें एवं डाउनलोड करें। बागवानी, डेयरी और जलवायु अनुकूल खेती के प्रमाणित लेख।"
                : "Read and download official monthly digital editions of Shetkari Magazine, MahaPashudhan, and Krishi Samvad published by the Government of Maharashtra."}
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="text-xs text-emerald-200">
              {language === "mr" ? "डिजिटल आवृत्ती" : "Digital Editions"}
            </span>
            <p className="text-2xl font-black text-emerald-400">PDF Free</p>
            <p className="text-[11px] text-neutral-300">
              {language === "mr" ? "शासनाकडून मोफत उपलब्ध" : "Free Public Access"}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={
              language === "mr"
                ? "मासिकाचे नाव, महिना किंवा विषय शोधा (उदा. शेतकरी, मुरघास, खरीप)..."
                : language === "hi"
                ? "पत्रिका का नाम या विषय खोजें..."
                : "Search magazine issue, topic, or publisher..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Magazines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((mag) => (
          <motion.div
            key={mag.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-emerald-500 transition-all group"
          >
            <div>
              {/* Cover Preview */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-950">
                <img
                  src={mag.coverImage}
                  alt={mag.title.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-[11px] font-bold">
                    {mag.issue}
                  </span>
                  <p className="text-xs text-neutral-300 mt-1">{mag.publisher}</p>
                </div>
              </div>

              {/* Title & Topics */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {mag.title[language] || mag.title.en}
                </h3>

                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {mag.publishDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {mag.pages} {language === "mr" ? "पृष्ठे" : "Pages"}
                  </span>
                </div>

                {/* Topics Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {language === "mr" ? "प्रमुख लेख:" : "Featured Articles:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mag.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Read & Download Actions */}
            <div className="p-6 pt-0 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
              <button
                onClick={() => setSelectedMag(mag)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {language === "mr" ? "अंक वाचा" : language === "hi" ? "अंक पढ़ें" : "Read Online"}
              </button>
              <a
                href={mag.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reading Modal */}
      <AnimatePresence>
        {selectedMag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-6"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {selectedMag.issue}
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-2">
                    {selectedMag.title[language] || selectedMag.title.en}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">{selectedMag.publisher}</p>
                </div>
                <button
                  onClick={() => setSelectedMag(null)}
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {language === "mr" ? "या अंकात समाविष्ट महत्त्वाचे विषय:" : "Key Topics in this Edition:"}
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                  {selectedMag.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="/chat"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === "mr" ? "या अंकातील लेखांवर जेमिनीशी बोला" : "Discuss topics with Gemini AI"}
                </a>

                <a
                  href={selectedMag.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  {language === "mr" ? "संपूर्ण ई-मासिक डाऊनलोड करा (PDF)" : "Download Full PDF"}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
