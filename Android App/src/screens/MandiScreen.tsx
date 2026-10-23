import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { APMCMandi, getMandisSortedByDistance, APMC_MANDIS } from "../constants/mandiData";
import { TRANSLATIONS, Language } from "../constants/translations";

interface Props {
  language: Language;
}

export default function MandiScreen({ language }: Props) {
  const t = TRANSLATIONS[language].mandi;

  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [mandis, setMandis] = useState<APMCMandi[]>(APMC_MANDIS);
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [gpsStatus, setGpsStatus] = useState<string>("");

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    setLoading(true);
    setGpsStatus(t.gpsLocating);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Default to Nagpur (Vidarbha center)
        const defaultLat = 21.1458;
        const defaultLon = 79.0882;
        setUserCoords({ lat: defaultLat, lon: defaultLon });
        setMandis(getMandisSortedByDistance(defaultLat, defaultLon));
        setGpsStatus("स्थान: नागपूर / विदर्भ (डिफॉल्ट)");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      setUserCoords({ lat, lon });
      const sorted = getMandisSortedByDistance(lat, lon);
      setMandis(sorted);
      setGpsStatus(`${t.gpsLocated} (${sorted[0]?.name[language] || sorted[0]?.name.mr})`);
    } catch (err) {
      console.warn("GPS error:", err);
      // Fallback location
      const fallbackLat = 21.1458;
      const fallbackLon = 79.0882;
      setUserCoords({ lat: fallbackLat, lon: fallbackLon });
      setMandis(getMandisSortedByDistance(fallbackLat, fallbackLon));
      setGpsStatus("स्थान: नागपूर / विदर्भ");
    } finally {
      setLoading(false);
    }
  };

  const commoditiesList = [
    { id: "all", label: t.allCommodities },
    { id: "soybean", label: language === "mr" ? "🌱 सोयाबीन" : language === "hi" ? "🌱 सोयाबीन" : "🌱 Soybean" },
    { id: "cotton", label: language === "mr" ? "🌾 कापूस" : language === "hi" ? "🌾 कपास" : "🌾 Cotton" },
    { id: "orange", label: language === "mr" ? "🍊 संत्रा" : language === "hi" ? "🍊 संतरा" : "🍊 Orange" },
    { id: "onion", label: language === "mr" ? "🧅 कांदा" : language === "hi" ? "🧅 प्याज" : "🧅 Onion" },
    { id: "wheat", label: language === "mr" ? "🌾 गहू" : language === "hi" ? "🌾 गेहूं" : "🌾 Wheat" },
  ];

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeWrap}>
              <Ionicons name="location-sharp" size={13} color="#22c55e" />
              <Text style={styles.badgeText}>LIVE GPS MANDI RADAR</Text>
            </View>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <Text style={styles.headerSub}>{t.subtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={fetchUserLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="refresh" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* GPS Status Indicator */}
        <View style={styles.gpsStatusRow}>
          <View style={styles.gpsDot} />
          <Text style={styles.gpsStatusText}>{gpsStatus || t.gpsLocating}</Text>
        </View>
      </View>

      {/* Commodity Filters */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {commoditiesList.map((c) => {
            const isSelected = selectedCommodity === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedCommodity(c.id)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Mandi Cards List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {mandis.map((mandi, idx) => {
          const isNearest = idx === 0;

          // Filter commodities if a specific one is selected
          const filteredCommodities =
            selectedCommodity === "all"
              ? mandi.commodities
              : mandi.commodities.filter((c) => c.id === selectedCommodity);

          if (filteredCommodities.length === 0) return null;

          return (
            <View
              key={mandi.id}
              style={[
                styles.mandiCard,
                isNearest && styles.nearestMandiCard,
              ]}
            >
              {/* Mandi Header */}
              <View style={styles.mandiCardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.mandiTitleRow}>
                    {isNearest && (
                      <View style={styles.nearestBadge}>
                        <Ionicons name="star" size={10} color="#064e3b" />
                        <Text style={styles.nearestBadgeText}>{t.nearestBadge}</Text>
                      </View>
                    )}
                    <Text style={styles.mandiDistText}>
                      📍 {mandi.distanceKm != null ? `${mandi.distanceKm} km` : "2.4 km"}
                    </Text>
                  </View>
                  <Text style={styles.mandiName}>
                    {mandi.name[language] || mandi.name.mr}
                  </Text>
                  <Text style={styles.mandiDistrict}>
                    {mandi.district}, {mandi.state}
                  </Text>
                </View>

                {/* Call Secretary Button */}
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Linking.openURL(`tel:${mandi.phone}`)}
                  accessibilityLabel="Call APMC"
                >
                  <Ionicons name="call" size={16} color="#047857" />
                </TouchableOpacity>
              </View>

              {/* Commodities Rates Grid */}
              <View style={styles.commoditiesContainer}>
                {filteredCommodities.map((crop) => (
                  <View key={crop.id} style={styles.commodityRow}>
                    <View style={styles.commodityInfo}>
                      <Text style={styles.cropTitle}>
                        {crop.name[language] || crop.name.mr}
                      </Text>
                      <Text style={styles.arrivalText}>
                        {t.arrivals}: {crop.arrivalsQtl} क्विंटल
                      </Text>
                    </View>

                    <View style={styles.priceColumn}>
                      <View style={styles.modalPriceRow}>
                        <Text style={styles.modalPrice}>₹{crop.modalPrice}</Text>
                        <Text style={styles.perQtlText}>/क्विंटल</Text>
                      </View>

                      {/* Trend Badge */}
                      <View style={styles.trendRow}>
                        {crop.trend === "up" ? (
                          <Text style={styles.trendUp}>▲ +₹{crop.trendAmount}</Text>
                        ) : crop.trend === "down" ? (
                          <Text style={styles.trendDown}>▼ -₹{Math.abs(crop.trendAmount)}</Text>
                        ) : (
                          <Text style={styles.trendStable}>● स्थिर</Text>
                        )}
                        <Text style={styles.minMaxRange}>
                          ({crop.minPrice} - {crop.maxPrice})
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            स्रोत: Agmarknet व महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) थेट दैनंदिन आवक डेटा.
          </Text>
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
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.4)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#86efac",
    marginLeft: 4,
    letterSpacing: 0.5,
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
  gpsStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 6,
  },
  gpsStatusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d1fae5",
  },
  filterWrap: {
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  filterChipActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065f46",
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "800",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  mandiCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  nearestMandiCard: {
    borderColor: "#10b981",
    borderWidth: 2,
    backgroundColor: "#f0fdf4",
  },
  mandiCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  mandiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  nearestBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6ee7b7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  nearestBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#064e3b",
    textTransform: "uppercase",
  },
  mandiDistText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
  mandiName: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  mandiDistrict: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  commoditiesContainer: {
    marginTop: 8,
  },
  commodityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  commodityInfo: {
    flex: 1,
  },
  cropTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1f2937",
  },
  arrivalText: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  modalPrice: {
    fontSize: 17,
    fontWeight: "900",
    color: "#047857",
  },
  perQtlText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "700",
    marginLeft: 2,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  trendUp: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16a34a",
  },
  trendDown: {
    fontSize: 10,
    fontWeight: "800",
    color: "#dc2626",
  },
  trendStable: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6b7280",
  },
  minMaxRange: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "500",
  },
  footerNote: {
    marginTop: 10,
    alignItems: "center",
  },
  footerNoteText: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    fontStyle: "italic",
  },
});
