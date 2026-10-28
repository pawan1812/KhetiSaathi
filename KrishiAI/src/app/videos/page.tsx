"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Video,
  Play,
  Search,
  Clock,
  Eye,
  User,
  Calendar,
  X,
  Share2,
  Tv,
  Radio,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { SHETISHALA_VIDEOS, VideoTutorial } from "@/lib/agriServicesData";

export default function VideosPage() {
  const { language } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<VideoTutorial | null>(null);

  const categories = [
    "All",
    "Digital Shetishala",
    "Fertilizer Management",
    "Pest Control",
    "Farmer Story"
  ];

  const filteredVideos = SHETISHALA_VIDEOS.filter((v) => {
    const matchesCat = selectedCategory === "All" || v.category === selectedCategory;
    const titleText = (v.title[language] || v.title.en).toLowerCase();
    const speakerText = v.speaker.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      titleText.includes(searchQuery.toLowerCase()) ||
      speakerText.includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950 via-rose-900 to-red-900 text-white p-8 shadow-2xl border border-red-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold backdrop-blur-md border border-red-400/30">
              <Video className="w-4 h-4" />
              {language === "mr"
                ? "महाराष्ट्र शासन कृषी विभाग व नानाजी देशमुख पोक्रा"
                : language === "hi"
                ? "महाराष्ट्र शासन कृषि विभाग एवं पोक्रा"
                : "MahaPoCRA & Dept of Agriculture Farmer School"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === "mr"
                ? "डिजिटल शेतीशाळा (व्हिडिओ प्रशिक्षण)"
                : language === "hi"
                ? "डिजिटल खेतीशाला (वीडियो प्रशिक्षण)"
                : "Digital Shetishala (Agri Video Academy)"}
            </h1>
            <p className="text-red-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
              {language === "mr"
                ? "शेतातील आधुनिक तंत्रज्ञान, नॅनो खतांचा वापर, ठिबक सिंचन, कीड नियंत्रण व प्रयोगशील शेतकऱ्यांच्या यशोगाथांचे प्रत्यक्ष व्हिडिओ व्याख्याने."
                : language === "hi"
                ? "खेती की आधुनिक तकनीक, नैनो उर्वरक उपयोग, ड्रिप सिंचाई, कीट नियंत्रण व प्रगतिशील किसानों की सफलता के वीडियो देखें।"
                : "Watch verified video masterclasses on nano-fertilizer foliar sprays, pink bollworm trapping, climate resilience, and successful farmer interviews."}
            </p>
          </div>

          {/* Live Webinar Broadcast Badge */}
          <div className="bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {language === "mr" ? "आगामी थेट शेतीशाळा" : "Upcoming Live Webinar"}
            </div>
            <p className="text-sm font-bold text-white">
              {language === "mr" ? "गुलाबी बोंडअळी नियंत्रण मास्टरक्लास" : "Kharif Pest Masterclass"}
            </p>
            <p className="text-[11px] text-neutral-300">
              {language === "mr" ? "या शनिवारी दुपारी ४:०० वाजता" : "This Saturday 4:00 PM (YouTube Live)"}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={
              language === "mr"
                ? "व्हिडिओ शीर्षक, शास्त्रज्ञ किंवा विषय शोधा (उदा. नॅनो युरिया, ठिबक)..."
                : language === "hi"
                ? "वीडियो शीर्षक, वैज्ञानिक या विषय खोजें..."
                : "Search video title, scientist, or practice..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-red-400"
              }`}
            >
              {cat === "All" ? (language === "mr" ? "सर्व व्हिडिओ" : "All Videos") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-red-500 transition-all group cursor-pointer"
            onClick={() => setActiveVideo(video)}
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                <img
                  src={video.thumbnail}
                  alt={video.title.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>

                {/* Views Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-red-400" />
                  {video.views}
                </div>
              </div>

              {/* Video Content Meta */}
              <div className="p-5 space-y-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                  {video.category}
                </span>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2">
                  {video.title[language] || video.title.en}
                </h3>

                <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  {video.speaker}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
              <span>{language === "mr" ? "व्हिडिओ पहा" : language === "hi" ? "वीडियो देखें" : "Watch Video"}</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-800 space-y-4 p-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {activeVideo.category}
                </span>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mock / Embedded Player Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-neutral-800">
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title.en}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {activeVideo.title[language] || activeVideo.title.en}
                    </p>
                    <p className="text-xs text-neutral-300 mt-1">{activeVideo.speaker}</p>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      activeVideo.title.mr + " Shetishala"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === "mr" ? "अधिकृत युट्यूबवर उघडा" : "Open in YouTube"}
                  </a>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <span>
                  {language === "mr" ? "कालावधी:" : "Duration:"} {activeVideo.duration} • {activeVideo.views} views
                </span>
                <a
                  href="/chat"
                  className="text-red-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === "mr" ? "या व्याख्यानावर प्रश्न विचारा" : "Ask AI about this video"}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
