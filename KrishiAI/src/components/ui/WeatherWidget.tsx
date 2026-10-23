"use client";
import { useState, useEffect, useCallback } from "react";
import { Droplets, Wind, Sun, MapPin, RefreshCw, Zap, Navigation } from "lucide-react";
import { fetchLiveWeather, type LiveWeatherData } from "@/lib/weatherService";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { AGRI_HUBS } from "@/lib/mandiService";

export default function WeatherWidget() {
  const { language, userLocation, setUserLocation } = useAppStore();
  const t = getTranslation(language);

  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  const loadWeather = useCallback(async (lat: number, lon: number, name: string) => {
    setLoading(true);
    try {
      const data = await fetchLiveWeather(lat, lon, name);
      setWeather(data);
    } catch (err) {
      console.warn("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(userLocation.lat, userLocation.lon, userLocation.name);
  }, [userLocation.lat, userLocation.lon, userLocation.name, loadWeather]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedName = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
        
        // Reverse geocoding via Open-Meteo geocoding or closest hub
        const closestHub = [...AGRI_HUBS].sort((a, b) => {
          const dA = Math.hypot(a.lat - latitude, a.lon - longitude);
          const dB = Math.hypot(b.lat - latitude, b.lon - longitude);
          return dA - dB;
        })[0];

        if (closestHub && Math.hypot(closestHub.lat - latitude, closestHub.lon - longitude) < 0.8) {
          detectedName = closestHub.name;
        }

        const newLoc = {
          lat: latitude,
          lon: longitude,
          name: detectedName,
          state: closestHub?.state || "India",
        };
        setUserLocation(newLoc);
        await loadWeather(latitude, longitude, detectedName);
        setDetectingGps(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        setDetectingGps(false);
        alert("Could not detect location. Please select your district from the dropdown.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleHubSelect = (hubId: string) => {
    const hub = AGRI_HUBS.find((h) => h.id === hubId);
    if (!hub) return;
    const newLoc = {
      lat: hub.lat,
      lon: hub.lon,
      name: language === "mr" ? hub.nameMr : language === "hi" ? hub.nameHi : hub.name,
      state: hub.state,
    };
    setUserLocation(newLoc);
    loadWeather(hub.lat, hub.lon, newLoc.name);
  };

  const conditionText = weather
    ? language === "mr"
      ? weather.conditionMr
      : language === "hi"
      ? weather.conditionHi
      : weather.condition
    : "";

  const advisoryText = weather
    ? language === "mr"
      ? weather.advisoryMr
      : language === "hi"
      ? weather.advisoryHi
      : weather.advisoryEn
    : "";

  return (
    <div className="card p-5 h-full flex flex-col justify-between gap-4 border border-emerald-100/60 dark:border-emerald-950/40">
      {/* Header with Location & GPS */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
              {t.dashboard.weatherCardTitle}
            </h3>
          </div>
          <button
            onClick={() => loadWeather(userLocation.lat, userLocation.lon, userLocation.name)}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-emerald-600 transition"
            title="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>

        {/* Location selector strip */}
        <div className="flex items-center gap-1.5 pt-1">
          <select
            value={AGRI_HUBS.find((h) => Math.abs(h.lat - userLocation.lat) < 0.05)?.id || ""}
            onChange={(e) => handleHubSelect(e.target.value)}
            className="text-xs font-semibold py-1 px-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-400 flex-1 truncate cursor-pointer"
          >
            {AGRI_HUBS.map((h) => (
              <option key={h.id} value={h.id}>
                📍 {language === "mr" ? h.nameMr : language === "hi" ? h.nameHi : h.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleDetectGPS}
            disabled={detectingGps}
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 whitespace-nowrap shadow-sm"
            title={t.common.detectLocation}
          >
            <Navigation className={`w-3 h-3 ${detectingGps ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Main Temperature Display */}
      {weather && (
        <div className="text-center py-1 bg-gradient-to-b from-emerald-50/40 to-transparent dark:from-emerald-950/20 rounded-2xl p-3">
          <span className="text-5xl inline-block drop-shadow-sm select-none">{weather.icon}</span>
          <p className="text-3xl font-extrabold mt-1 text-[var(--text-primary)] tracking-tight">
            {weather.temp}°C
          </p>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {conditionText}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center justify-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-emerald-600" />
            {userLocation.name}
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      {weather && (
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
            <div className="flex justify-center mb-0.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t.dashboard.humidity}
            </p>
            <p className="text-xs font-extrabold text-[var(--text-primary)]">{weather.humidity}%</p>
          </div>

          <div className="text-center p-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
            <div className="flex justify-center mb-0.5">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t.dashboard.wind}
            </p>
            <p className="text-xs font-extrabold text-[var(--text-primary)]">{weather.windSpeed} km/h</p>
          </div>

          <div className="text-center p-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
            <div className="flex justify-center mb-0.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t.dashboard.uvIndex}
            </p>
            <p className="text-xs font-extrabold text-[var(--text-primary)]">{weather.uvIndex}</p>
          </div>
        </div>
      )}

      {/* 5-Day Forecast Carousel */}
      {weather?.forecast && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {weather.forecast.slice(0, 5).map((d) => (
            <div
              key={d.day}
              className="flex-1 text-center p-2 rounded-xl min-w-[54px] bg-[var(--bg-muted)] border border-[var(--border)]/60"
            >
              <p className="text-[10px] font-semibold text-[var(--text-muted)]">{d.day}</p>
              <p className="text-base my-0.5 select-none">{d.icon}</p>
              <p className="text-xs font-bold text-[var(--text-primary)]">{d.high}°</p>
              <p className="text-[9px] text-[var(--text-muted)]">{d.low}°</p>
              {d.rainProb > 0 && (
                <p className="text-[8px] font-bold text-blue-600 mt-0.5">💧{d.rainProb}%</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Agronomic Advisory Callout */}
      {weather && (
        <div className="p-3 rounded-xl text-xs leading-relaxed bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-800 dark:text-emerald-300">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "mr" ? "कृषी हवामान सल्ला" : language === "hi" ? "कृषि मौसम सलाह" : "Agri Weather Advisory"}</span>
          </div>
          <p className="text-[11px] leading-snug">{advisoryText}</p>
        </div>
      )}
    </div>
  );
}
