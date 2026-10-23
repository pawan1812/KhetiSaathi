import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  WeatherData,
  CrisisAlert,
  fetchLiveWeather,
  getFallbackWeather,
  ACTIVE_CRISIS_ALERTS,
} from "../services/weatherService";
import { TRANSLATIONS, Language } from "../constants/translations";

interface Props {
  language: Language;
}

export default function WeatherScreen({ language }: Props) {
  const t = TRANSLATIONS[language].weather;

  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData>(getFallbackWeather());
  const [expandedCrisisId, setExpandedCrisisId] = useState<string>("hormuz_fertilizer_crisis");

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 21.1458;
      let lon = 79.0882;
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      }
      const data = await fetchLiveWeather(lat, lon);
      setWeather(data);
    } catch (e) {
      console.warn("Weather load error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeWrap}>
              <Ionicons name="cloudy-night" size={13} color="#38bdf8" />
              <Text style={styles.badgeText}>OPEN-METEO SATELLITE RADAR</Text>
            </View>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <Text style={styles.headerSub}>{t.subtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={loadWeatherData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="refresh" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Weather Card */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.currentTopRow}>
            <View>
              <Text style={styles.cityText}>📍 {weather.city}</Text>
              <Text style={styles.currentTempText}>{weather.currentTemp}°C</Text>
              <Text style={styles.weatherConditionText}>
                {weather.weatherDescription[language] || weather.weatherDescription.mr}
              </Text>
            </View>
            <View style={styles.weatherIconWrap}>
              <Ionicons
                name={weather.rainProbability > 40 ? "rainy" : weather.weatherCode >= 3 ? "partly-sunny" : "sunny"}
                size={54}
                color="#facc15"
              />
            </View>
          </View>

          {/* KPI Strip */}
          <View style={styles.kpiStrip}>
            <View style={styles.kpiItem}>
              <Ionicons name="water-outline" size={16} color="#38bdf8" />
              <Text style={styles.kpiLabel}>{t.humidity}</Text>
              <Text style={styles.kpiVal}>{weather.humidity}%</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Ionicons name="speedometer-outline" size={16} color="#4ade80" />
              <Text style={styles.kpiLabel}>{t.wind}</Text>
              <Text style={styles.kpiVal}>{weather.windSpeed} km/h</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Ionicons name="umbrella-outline" size={16} color="#fb7185" />
              <Text style={styles.kpiLabel}>{t.rainProb}</Text>
              <Text style={styles.kpiVal}>{weather.rainProbability}%</Text>
            </View>
          </View>
        </View>

        {/* 7-Day Forecast Carousel */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>📅 {t.forecast7Days}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forecastScroll}>
            {weather.dailyForecast.map((day, idx) => (
              <View key={idx} style={[styles.forecastCard, idx === 0 && styles.forecastCardActive]}>
                <Text style={[styles.forecastDayText, idx === 0 && styles.forecastDayTextActive]}>
                  {day.dayName[language] || day.dayName.mr}
                </Text>
                <Ionicons
                  name={day.rainProb > 40 ? "rainy" : day.weatherCode >= 3 ? "partly-sunny" : "sunny"}
                  size={26}
                  color={idx === 0 ? "#10b981" : "#059669"}
                  style={{ marginVertical: 6 }}
                />
                <Text style={styles.forecastMaxTemp}>{day.maxTemp}°C</Text>
                <Text style={styles.forecastMinTemp}>{day.minTemp}°C</Text>
                <View style={styles.rainBadge}>
                  <Text style={styles.rainBadgeText}>{day.rainProb}% पाऊस</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── CRISIS MONITOR & AGRICULTURAL DEFENSE CENTER ── */}
        <View style={styles.crisisSection}>
          <View style={styles.crisisHeaderRow}>
            <View style={styles.crisisIconCircle}>
              <Ionicons name="warning" size={22} color="#dc2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.crisisMainTitle}>{t.crisisMonitorTitle}</Text>
              <Text style={styles.crisisMainSub}>
                {language === "mr"
                  ? "खत टंचाई, अवकाळी पाऊस व कीड-रोग संकटावर तातडीने उपाययोजना"
                  : language === "hi"
                  ? "उर्वरक संकट, बेमौसम बारिश व कीट प्रकोप पर तत्काल निवारण"
                  : "Immediate mitigation against fertilizer surges, hailstorms & pest stress"}
              </Text>
            </View>
          </View>

          {/* Active Crisis Cards */}
          {ACTIVE_CRISIS_ALERTS.map((alert) => {
            const isExpanded = expandedCrisisId === alert.id;
            const isHigh = alert.severity === "high";

            return (
              <View
                key={alert.id}
                style={[
                  styles.crisisCard,
                  isHigh ? styles.crisisCardHigh : styles.crisisCardMedium,
                ]}
              >
                <TouchableOpacity
                  style={styles.crisisCardTouch}
                  onPress={() => setExpandedCrisisId(isExpanded ? "" : alert.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.crisisCardHeaderTop}>
                    <View style={styles.crisisBadge}>
                      <Text style={styles.crisisBadgeText}>
                        {alert.badge[language] || alert.badge.mr}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#4b5563"
                    />
                  </View>

                  <Text style={styles.crisisTitle}>
                    {alert.title[language] || alert.title.mr}
                  </Text>
                </TouchableOpacity>

                {/* Collapsible Content */}
                {isExpanded && (
                  <View style={styles.crisisExpandedBody}>
                    <View style={styles.impactBox}>
                      <Text style={styles.bodySectionLabel}>
                        {language === "mr" ? "संभाव्य नुकसान / प्रभाव:" : language === "hi" ? "संभावित नुकसान / प्रभाव:" : "Projected Impact:"}
                      </Text>
                      <Text style={styles.bodyText}>
                        {alert.impact[language] || alert.impact.mr}
                      </Text>
                    </View>

                    <View style={styles.mitigationBox}>
                      <Text style={styles.mitigationLabel}>
                        🛡️ {language === "mr" ? "तात्काळ उपाययोजना (Action Required):" : language === "hi" ? "तत्काल निवारक उपाय:" : "Action Required:"}
                      </Text>
                      <Text style={styles.mitigationText}>
                        {alert.mitigation[language] || alert.mitigation.mr}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fbf7",
  },
  headerBanner: {
    backgroundColor: "#064e3b",
    paddingTop: Platform.OS === "android" ? 44 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  badgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.4)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#7dd3fc",
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 12,
    color: "#a7f3d0",
    lineHeight: 16,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  currentWeatherCard: {
    backgroundColor: "#047857",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  currentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityText: {
    fontSize: 12,
    color: "#a7f3d0",
    fontWeight: "700",
  },
  currentTempText: {
    fontSize: 44,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: 2,
  },
  weatherConditionText: {
    fontSize: 14,
    color: "#d1fae5",
    fontWeight: "700",
  },
  weatherIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiStrip: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 18,
  },
  kpiItem: {
    alignItems: "center",
  },
  kpiLabel: {
    fontSize: 10,
    color: "#d1fae5",
    fontWeight: "700",
    marginTop: 2,
  },
  kpiVal: {
    fontSize: 14,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: 1,
  },
  kpiDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 10,
  },
  forecastScroll: {
    gap: 10,
  },
  forecastCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    width: 90,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  forecastCardActive: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  forecastDayText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
  },
  forecastDayTextActive: {
    color: "#047857",
    fontWeight: "900",
  },
  forecastMaxTemp: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  forecastMinTemp: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
  },
  rainBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  rainBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#0369a1",
  },
  crisisSection: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  crisisHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fee2e2",
  },
  crisisIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  crisisMainTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#991b1b",
  },
  crisisMainSub: {
    fontSize: 11,
    color: "#7f1d1d",
    marginTop: 2,
  },
  crisisCard: {
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  crisisCardHigh: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
  crisisCardMedium: {
    backgroundColor: "#fefce8",
    borderColor: "#fef08a",
  },
  crisisCardTouch: {
    padding: 14,
  },
  crisisCardHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  crisisBadge: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  crisisBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  crisisTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1f2937",
    lineHeight: 18,
  },
  crisisExpandedBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingTop: 10,
  },
  impactBox: {
    marginBottom: 10,
  },
  bodySectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6b7280",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  bodyText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 17,
  },
  mitigationBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  mitigationLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#065f46",
    marginBottom: 4,
  },
  mitigationText: {
    fontSize: 12,
    color: "#047857",
    lineHeight: 18,
    fontWeight: "600",
  },
});
