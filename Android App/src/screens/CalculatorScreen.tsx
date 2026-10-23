import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GOVT_SCHEMES_DATA, GovtScheme } from "../constants/schemesData";
import { TRANSLATIONS, Language } from "../constants/translations";

interface Props {
  language: Language;
}

interface CropEconomics {
  id: string;
  name: { mr: string; hi: string; en: string };
  msp: number; // ₹ per quintal MSP 2025-26
  yieldPerAcre: number; // quintals
  costPerAcre: number; // ₹
}

const CROPS: CropEconomics[] = [
  {
    id: "soybean",
    name: { mr: "सोयाबीन (पिवळा)", hi: "सोयाबीन (पीला)", en: "Soybean" },
    msp: 4892,
    yieldPerAcre: 11,
    costPerAcre: 16500,
  },
  {
    id: "cotton",
    name: { mr: "कापूस (मध्यम धागा)", hi: "कपास", en: "Cotton" },
    msp: 7121,
    yieldPerAcre: 9,
    costPerAcre: 24000,
  },
  {
    id: "orange",
    name: { mr: "नागपूर संत्रा", hi: "नागपुर संतरा", en: "Nagpur Orange" },
    msp: 4200,
    yieldPerAcre: 40,
    costPerAcre: 55000,
  },
  {
    id: "onion",
    name: { mr: "उन्हाळी कांदा", hi: "गर्मी का प्याज", en: "Summer Onion" },
    msp: 2450,
    yieldPerAcre: 75,
    costPerAcre: 48000,
  },
  {
    id: "wheat",
    name: { mr: "गहू (लोकवन/शरबती)", hi: "गेहूं", en: "Wheat" },
    msp: 2425,
    yieldPerAcre: 18,
    costPerAcre: 14000,
  },
];

export default function CalculatorScreen({ language }: Props) {
  const t = TRANSLATIONS[language].calculator;

  const [selectedCrop, setSelectedCrop] = useState<CropEconomics>(CROPS[0]);
  const [acres, setAcres] = useState<number>(5);
  const [expandedSchemeId, setExpandedSchemeId] = useState<string>("kcc_zero_percent");

  // Economic calculations
  const totalYield = selectedCrop.yieldPerAcre * acres;
  const grossRevenue = totalYield * selectedCrop.msp;
  const standardCost = selectedCrop.costPerAcre * acres;
  const crisisCost = Math.round(standardCost * 1.15); // +15% due to 35% fertilizer inflation
  const netProfit = grossRevenue - crisisCost;
  const nanoSavings = Math.round(acres * 1250); // saving ₹1250 per acre with Nano Urea

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.badgeWrap}>
          <Ionicons name="calculator" size={13} color="#4ade80" />
          <Text style={styles.badgeText}>AGRO-ECONOMICS & SCHEMES</Text>
        </View>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <Text style={styles.headerSub}>{t.subtitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Crop Selection Chips */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>{t.cropSelect}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropScroll}>
            {CROPS.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  style={[styles.cropChip, isSelected && styles.cropChipActive]}
                  onPress={() => setSelectedCrop(crop)}
                >
                  <Text style={[styles.cropChipText, isSelected && styles.cropChipTextActive]}>
                    {crop.name[language] || crop.name.mr}
                  </Text>
                  <Text style={[styles.cropMspTag, isSelected && styles.cropMspTagActive]}>
                    MSP: ₹{crop.msp}/qtl
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Acre Adjuster */}
          <View style={styles.acreRow}>
            <Text style={styles.acreLabel}>{t.acresLabel}:</Text>
            <View style={styles.acreSelector}>
              {[2, 5, 10, 15, 20].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.acreNumBtn, acres === num && styles.acreNumBtnActive]}
                  onPress={() => setAcres(num)}
                >
                  <Text style={[styles.acreNumText, acres === num && styles.acreNumTextActive]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Simulation Output Card */}
        <View style={styles.resultCard}>
          <View style={styles.resultTopRow}>
            <View>
              <Text style={styles.resultLabel}>{t.netProfit}</Text>
              <Text style={styles.resultNetProfit}>₹{netProfit.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.yieldTag}>
              <Text style={styles.yieldTagLabel}>अपेक्षित उत्पादन:</Text>
              <Text style={styles.yieldTagVal}>{totalYield} क्विंटल</Text>
            </View>
          </View>

          {/* Cost Breakdown Strip */}
          <View style={styles.breakdownStrip}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>{t.grossRev}</Text>
              <Text style={styles.breakdownGross}>₹{grossRevenue.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>{t.totalCost}</Text>
              <Text style={styles.breakdownCost}>₹{crisisCost.toLocaleString("en-IN")}</Text>
            </View>
          </View>

          {/* Nano Urea Savings Badge */}
          <View style={styles.savingsBox}>
            <Ionicons name="sparkles" size={16} color="#059669" />
            <Text style={styles.savingsText}>
              💡 नॅनो युरिया वापरल्यास ₹{nanoSavings.toLocaleString("en-IN")} ची अतिरिक्त रोख बचत!
            </Text>
          </View>
        </View>

        {/* ── GOVERNMENT SCHEMES & KCC LOANS SECTION ── */}
        <View style={styles.schemesSection}>
          <View style={styles.schemesHeader}>
            <View style={styles.schemesIconBox}>
              <Ionicons name="shield-checkmark" size={20} color="#047857" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.schemesMainTitle}>{t.schemesTitle}</Text>
              <Text style={styles.schemesMainSub}>{t.schemesSub}</Text>
            </View>
          </View>

          {/* Scheme Cards */}
          {GOVT_SCHEMES_DATA.map((scheme) => {
            const isExpanded = expandedSchemeId === scheme.id;
            return (
              <View key={scheme.id} style={styles.schemeCard}>
                <TouchableOpacity
                  style={styles.schemeTouchHeader}
                  onPress={() => setExpandedSchemeId(isExpanded ? "" : scheme.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.schemeHeaderTop}>
                    <View style={styles.schemeBadge}>
                      <Text style={styles.schemeBadgeText}>
                        {scheme.badge[language] || scheme.badge.mr}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#6b7280"
                    />
                  </View>

                  <Text style={styles.schemeName}>
                    {scheme.name[language] || scheme.name.mr}
                  </Text>
                  <Text style={styles.schemeBenefit}>
                    {scheme.benefit[language] || scheme.benefit.mr}
                  </Text>
                </TouchableOpacity>

                {/* Expandable Scheme Details */}
                {isExpanded && (
                  <View style={styles.schemeBody}>
                    <Text style={styles.schemeSummary}>
                      {scheme.summary[language] || scheme.summary.mr}
                    </Text>

                    {/* Eligibility List */}
                    <View style={styles.detailBox}>
                      <Text style={styles.detailHeading}>{t.eligibilityTitle}</Text>
                      {(scheme.eligibility[language] || scheme.eligibility.mr).map((item, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Ionicons name="checkmark-circle" size={13} color="#10b981" style={{ marginTop: 2 }} />
                          <Text style={styles.bulletText}>{item}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Required Documents */}
                    <View style={styles.detailBox}>
                      <Text style={styles.detailHeading}>आवश्यक कागदपत्रे (Documents):</Text>
                      {(scheme.documents[language] || scheme.documents.mr).map((doc, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Ionicons name="document-text" size={13} color="#0284c7" style={{ marginTop: 2 }} />
                          <Text style={styles.bulletText}>{doc}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Apply Online Button */}
                    <TouchableOpacity
                      style={styles.applyBtn}
                      onPress={() => Linking.openURL(scheme.applyUrl)}
                    >
                      <Ionicons name="open-outline" size={16} color="#ffffff" />
                      <Text style={styles.applyBtnText}>{t.applyBtn}</Text>
                    </TouchableOpacity>
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
  badgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 222, 128, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.4)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#86efac",
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardSectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 8,
  },
  cropScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  cropChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cropChipActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
  },
  cropChipText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1f2937",
  },
  cropChipTextActive: {
    color: "#ffffff",
  },
  cropMspTag: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 2,
  },
  cropMspTagActive: {
    color: "#a7f3d0",
  },
  acreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  acreLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
  },
  acreSelector: {
    flexDirection: "row",
    gap: 6,
  },
  acreNumBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  acreNumBtnActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  acreNumText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
  },
  acreNumTextActive: {
    color: "#ffffff",
  },
  resultCard: {
    backgroundColor: "#064e3b",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  resultTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#86efac",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultNetProfit: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: 2,
  },
  yieldTag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "flex-end",
  },
  yieldTagLabel: {
    fontSize: 10,
    color: "#a7f3d0",
    fontWeight: "600",
  },
  yieldTagVal: {
    fontSize: 13,
    fontWeight: "900",
    color: "#ffffff",
  },
  breakdownStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },
  breakdownCol: {
    flex: 1,
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 10,
    color: "#a7f3d0",
    fontWeight: "700",
  },
  breakdownGross: {
    fontSize: 15,
    fontWeight: "900",
    color: "#38bdf8",
    marginTop: 2,
  },
  breakdownCost: {
    fontSize: 15,
    fontWeight: "900",
    color: "#f87171",
    marginTop: 2,
  },
  breakdownDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
  },
  savingsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 10,
    marginTop: 14,
    gap: 8,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#065f46",
    flex: 1,
  },
  schemesSection: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  schemesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  schemesIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  schemesMainTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  schemesMainSub: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  schemeCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  schemeTouchHeader: {
    padding: 14,
  },
  schemeHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  schemeBadge: {
    backgroundColor: "#059669",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  schemeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
  },
  schemeName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 2,
  },
  schemeBenefit: {
    fontSize: 12,
    fontWeight: "700",
    color: "#047857",
  },
  schemeBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    backgroundColor: "#ffffff",
  },
  schemeSummary: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 18,
    marginBottom: 10,
  },
  detailBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  detailHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 3,
  },
  bulletText: {
    fontSize: 11,
    color: "#334155",
    flex: 1,
    lineHeight: 16,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#047857",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginTop: 6,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
});
