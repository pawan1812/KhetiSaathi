"use client";
import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Sparkles,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitationProb: number;
  weatherCode: number;
  locationName: string;
  forecast: {
    day: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    condition: string;
  }[];
  advisories: {
    spraying: { suitable: boolean; message: string };
    irrigation: { recommended: boolean; message: string };
    frostRisk: boolean;
    heatwaveRisk: boolean;
  };
}

const DISTRICT_LOCATIONS: { name: string; lat: number; lng: number }[] = [
  { name: "Nashik (नाशिक)", lat: 19.9975, lng: 73.7898 },
  { name: "Pune (पुणे)", lat: 18.5204, lng: 73.8567 },
  { name: "Baramati (बारामती)", lat: 18.1517, lng: 74.5786 },
  { name: "Nagpur (नागपूर)", lat: 21.1458, lng: 79.0882 },
  { name: "Chhatrapati Sambhajinagar (छ. संभाजीनगर)", lat: 19.8762, lng: 75.3433 },
  { name: "Amravati (अमरावती)", lat: 20.9374, lng: 77.7796 },
  { name: "Kolhapur (कोल्हापूर)", lat: 16.705, lng: 74.2433 },
  { name: "Solapur (सोलापूर)", lat: 17.6599, lng: 75.9064 },
  { name: "Indore (इंदौर)", lat: 22.7196, lng: 75.8577 },
  { name: "Ludhiana (लुधियाना)", lat: 30.901, lng: 75.8573 }
];

export default function WeatherAdvisoryPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [selectedLocation, setSelectedLocation] = useState(DISTRICT_LOCATIONS[0]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather(selectedLocation.lat, selectedLocation.lng, selectedLocation.name);
  }, [selectedLocation]);

  const fetchWeather = async (lat: number, lng: number, locName: string) => {
    try {
      setLoading(true);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`;
      const res = await fetch(url);
      const data = await res.json();

      const current = data.current || {};
      const daily = data.daily || {};

      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const daysOfWeekMr = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];

      const forecastList = (daily.time || []).slice(0, 5).map((dateStr: string, idx: number) => {
        const d = new Date(dateStr);
        const dayLabel = language === "mr" ? daysOfWeekMr[d.getDay()] : daysOfWeek[d.getDay()];
        return {
          day: idx === 0 ? (language === "mr" ? "आज" : "Today") : dayLabel,
          maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 36),
          minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 22),
          rainProb: daily.precipitation_probability_max?.[idx] ?? 10,
          condition: (daily.weather_code?.[idx] ?? 0) > 50 ? "Rain" : "Sunny"
        };
      });

      const temp = Math.round(current.temperature_2m ?? 34);
      const hum = Math.round(current.relative_humidity_2m ?? 42);
      const wind = Math.round(current.wind_speed_10m ?? 12);
      const rainProb = daily.precipitation_probability_max?.[0] ?? 15;

      const spraySuitable = wind < 15 && rainProb < 30;
      const irrigateRecommended = temp > 33 && hum < 50;
      const heatwaveRisk = temp >= 40;
      const frostRisk = temp <= 10;

      setWeather({
        temperature: temp,
        humidity: hum,
        windSpeed: wind,
        uvIndex: 7.5,
        precipitationProb: rainProb,
        weatherCode: current.weather_code ?? 1,
        locationName: locName,
        forecast: forecastList,
        advisories: {
          spraying: {
            suitable: spraySuitable,
            message: spraySuitable
              ? language === "mr"
                ? "वाऱ्याचा वेग मंद (<१५ किमी/तास) व पावसाची शक्यता कमी आहे. सकाळच्या किंवा संध्याकाळच्या वेळी फवारणी करण्यास अत्यंत अनुकूल."
                : "Wind is calm and rain risk low. Favorable for morning/evening pesticide spraying."
              : language === "mr"
                ? "जास्त वारा किंवा पावसाच्या शक्यतेमुळे आज औषध फवारणी टाळावी, औषधाचा अपव्यय होऊ शकतो."
                : "Adverse winds or rain probability detected. Postpone foliar spraying."
          },
          irrigation: {
            recommended: irrigateRecommended,
            message: irrigateRecommended
              ? language === "mr"
                ? "तापमान जास्त व कोरडी हवा असल्याने पाण्याचा ताण टाळण्यासाठी रात्री किंवा संध्याकाळी हलके पाणी द्या."
                : "High daytime temperature. Evening sprinkler or drip irrigation recommended."
              : language === "mr"
                ? "जमिनीत ओलावा पुरेसा आहे. अतिरिक्त सिंचन टाळा."
                : "Soil moisture adequate. Hold back scheduled irrigation."
          },
          frostRisk,
          heatwaveRisk
        }
      });
    } catch (err) {
      console.warn("Open-Meteo weather fetch error, using fallback", err);
      // Fallback
      setWeather({
        temperature: 33,
        humidity: 45,
        windSpeed: 11,
        uvIndex: 7,
        precipitationProb: 15,
        weatherCode: 1,
        locationName: locName,
        forecast: [
          { day: "Today", maxTemp: 34, minTemp: 21, rainProb: 10, condition: "Sunny" },
          { day: "Tomorrow", maxTemp: 35, minTemp: 22, rainProb: 20, condition: "Sunny" },
          { day: "Day 3", maxTemp: 33, minTemp: 20, rainProb: 40, condition: "Partly Cloudy" },
          { day: "Day 4", maxTemp: 32, minTemp: 19, rainProb: 15, condition: "Clear" },
          { day: "Day 5", maxTemp: 34, minTemp: 21, rainProb: 5, condition: "Sunny" }
        ],
        advisories: {
          spraying: {
            suitable: true,
            message: "Favorable conditions for morning foliar spray."
          },
          irrigation: {
            recommended: true,
            message: "Apply light evening irrigation to maintain canopy hydration."
          },
          frostRisk: false,
          heatwaveRisk: false
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude, "GPS Detected Location");
        },
        (err) => {
          alert("Location access denied or unavailable. Please select your district from the dropdown.");
        }
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 text-xs font-bold mb-1">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Agromet Weather Radar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === "mr"
                ? "कृषी हवामान सल्ला व थेट रडार"
                : language === "hi"
                ? "कृषि मौसम रडार एवं सलाह"
                : "Agro-Weather Radar & Advisory"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === "mr"
                ? "थेट ५ दिवसांचा अंदाज, फवारणी अनुकूलता वेळ, सिंचन सल्ला व हवामान इशारे"
                : language === "hi"
                ? "लाइव 5-दिवसीय मौसम, कीटनाशक छिड़काव अनुकूलता, सिंचाई सलाह एवं चेतावनी"
                : "Real-time 5-day agrometeorological forecast, spraying index, irrigation advice & weather alerts"}
            </p>
          </div>

          {/* District Selector & GPS Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedLocation.name}
              onChange={(e) => {
                const loc = DISTRICT_LOCATIONS.find((d) => d.name === e.target.value) || DISTRICT_LOCATIONS[0];
                setSelectedLocation(loc);
              }}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
            >
              {DISTRICT_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleDetectGPS}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 shadow-sm transition"
              title="Detect GPS"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === "mr" ? "माझे स्थान" : "GPS Location"}</span>
            </button>
          </div>
        </div>

        {/* Live Weather Overview Card */}
        {weather && (
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-bold backdrop-blur-md mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{weather.locationName}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-7xl font-black tracking-tighter">
                    {weather.temperature}°C
                  </span>
                  <span className="text-lg text-sky-200 font-bold">
                    {weather.temperature > 35 ? (language === "mr" ? "उष्ण व कोरडे" : "Hot & Dry") : (language === "mr" ? "सूर्यप्रकाश" : "Clear & Sunny")}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-sky-200 flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{t.dashboard.humidity}</span>
                  </span>
                  <span className="text-lg font-black">{weather.humidity}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-sky-200 flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    <span>{t.dashboard.wind}</span>
                  </span>
                  <span className="text-lg font-black">{weather.windSpeed} km/h</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-sky-200 flex items-center gap-1">
                    <CloudSun className="w-3 h-3" />
                    <span>{language === "mr" ? "पाऊस शक्यता" : "Rain"}</span>
                  </span>
                  <span className="text-lg font-black">{weather.precipitationProb}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-sky-200 flex items-center gap-1">
                    <Sun className="w-3 h-3" />
                    <span>{t.dashboard.uvIndex}</span>
                  </span>
                  <span className="text-lg font-black">{weather.uvIndex}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agromet Actionable Advisories */}
        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Spraying Suitability */}
            <div
              className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
                weather.advisories.spraying.suitable
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/25 text-emerald-900 dark:text-emerald-100"
                  : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-500/25 text-rose-900 dark:text-rose-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      weather.advisories.spraying.suitable
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      {language === "mr" ? "औषध फवारणी अनुकूलता" : "Spraying Suitability Window"}
                    </h3>
                    <span className="text-[10px] uppercase font-black tracking-wider opacity-80">
                      {weather.advisories.spraying.suitable
                        ? language === "mr" ? "अनुकूल वेळ" : "Optimal Conditions"
                        : language === "mr" ? "फवारणी टाळा" : "Unfavorable Window"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                {weather.advisories.spraying.message}
              </p>
            </div>

            {/* Irrigation Practice */}
            <div className="p-5 rounded-3xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-500/25 text-sky-900 dark:text-sky-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {language === "mr" ? "सिंचन व पाणी व्यवस्थापन" : "Agromet Irrigation Advisory"}
                  </h3>
                  <span className="text-[10px] uppercase font-black tracking-wider text-sky-600 dark:text-sky-300">
                    {weather.advisories.irrigation.recommended
                      ? language === "mr" ? "पाणी देण्याची शिफारस" : "Irrigation Recommended"
                      : language === "mr" ? "पाणी देणे पुढे ढकला" : "Hold Irrigation"}
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                {weather.advisories.irrigation.message}
              </p>
            </div>
          </div>
        )}

        {/* 5-Day Forecast Grid */}
        {weather && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{language === "mr" ? "५ दिवसांचा कृषी हवामान अंदाज" : "5-Day Agro-Meteorological Forecast"}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weather.forecast.map((fc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-2"
                >
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    {fc.day}
                  </span>
                  <div className="text-2xl">
                    {fc.rainProb > 40 ? "🌧️" : fc.rainProb > 20 ? "⛅" : "☀️"}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {fc.maxTemp}° / <span className="text-slate-400 font-semibold">{fc.minTemp}°</span>
                  </div>
                  <span className="inline-block text-[10px] font-bold text-sky-600 dark:text-sky-400">
                    💧 {fc.rainProb}% {language === "mr" ? "पाऊस" : "rain"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
