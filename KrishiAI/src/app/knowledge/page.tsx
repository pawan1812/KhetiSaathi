"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight,
  X,
  Share2,
  FileText,
  CheckCircle2,
  Bookmark,
  Building2,
  Layers
} from "lucide-react";
import { KNOWLEDGE_ARTICLES, KnowledgeArticle } from "@/lib/mahavistaarData";

export default function KnowledgePage() {
  const { language } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const categories = [
    "All",
    "Crop SOP",
    "Pest Management",
    "Organic Farming",
    "Irrigation",
    "Post-Harvest"
  ];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === "All" || art.category === selectedCategory;
    const titleText = (art.title[language] || art.title.en).toLowerCase();
    const summaryText = (art.summary[language] || art.summary.en).toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      titleText.includes(searchQuery.toLowerCase()) ||
      summaryText.includes(searchQuery.toLowerCase()) ||
      (art.crop && art.crop.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 text-white p-8 shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md border border-indigo-400/30">
              <BookOpen className="w-4 h-4" />
              {language === "mr"
                ? "कृषी विद्यापीठ व पोक्रा शास्त्रोक्त लागवड तंत्रज्ञान"
                : language === "hi"
                ? "कृषि विश्वविद्यालय एवं पोक्रा प्रमाणित पद्धतियां"
                : "MPKV & PDKV Scientific SOP Library"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "कृषी ज्ञान केंद्र व प्रमाणित कार्यपद्धती (SOP)"
                : language === "hi"
                ? "कृषि ज्ञान केंद्र एवं मानक कार्यप्रणाली (SOP)"
                : "Agri Knowledge Centre & Verified SOPs"}
            </h1>
            <p className="text-indigo-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "सोयाबीन, कापूस, कांदा व इतर पिकांच्या पेरणीपासून ते काढणीपर्यंतची अधिकृत शास्त्रोक्त कार्यपद्धती, जैविक कीड नियंत्रण व खतांचे नियोजन."
                : language === "hi"
                ? "सोयाबीन, कपास, प्याज व अन्य फसलों की बुवाई से कटाई तक की मानक वैज्ञानिक कार्यप्रणाली, जैविक कीट नियंत्रण एवं संतुलित उर्वरक प्रबंधन।"
                : "Step-by-step packages of practices (PoP), Integrated Pest Management (IPM), and climate-resilient farming techniques verified by agricultural scientists."}
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="text-xs text-indigo-200">
              {language === "mr" ? "अधिकृत एसओपी" : language === "hi" ? "मानक एसओपी" : "Standard SOPs"}
            </span>
            <p className="text-2xl font-black text-indigo-400">100% Verified</p>
            <p className="text-[11px] text-neutral-300">
              {language === "mr" ? "चारही कृषी विद्यापीठे" : "ICAR & State Agri Universities"}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Tabs */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={
              language === "mr"
                ? "पिकाचे नाव, कीड, किंवा विषय शोधा (उदा. सोयाबीन, गुलाबी बोंडअळी, खते)..."
                : language === "hi"
                ? "फसल, कीट या विषय खोजें (उदा. सोयाबीन, गुलाबी सुंडी, खाद)..."
                : "Search crops, pest control, fertilizer management, or techniques..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-indigo-400"
              }`}
            >
              {cat === "All" ? (language === "mr" ? "सर्व विषय" : "All Categories") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-indigo-500 transition-all group cursor-pointer"
            onClick={() => setSelectedArticle(art)}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {art.category}
                </span>
                <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {art.title[language] || art.title.en}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                  {art.summary[language] || art.summary.en}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                <span>{art.author}</span>
                <span>{art.publishedDate}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <span>{language === "mr" ? "सविस्तर वाचा" : language === "hi" ? "पूरा पढ़ें" : "Read Full SOP"}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {selectedArticle.title[language] || selectedArticle.title.en}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <span>{selectedArticle.author}</span>
                    <span>•</span>
                    <span>{selectedArticle.publishedDate}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs md:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <strong>{language === "mr" ? "थोडक्यात:" : "Summary:"} </strong>
                {selectedArticle.summary[language] || selectedArticle.summary.en}
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                {selectedArticle.contentSections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2"
                  >
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {sec.heading}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <a
                  href="/chat"
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  {language === "mr"
                    ? "या पद्धतीबद्दल जेमिनीला विचारा"
                    : language === "hi"
                    ? "इस पद्धति के बारे में जेमिनी से पूछें"
                    : "Ask Gemini About This Practice"}
                </a>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs"
                >
                  {language === "mr" ? "बंद करा" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
