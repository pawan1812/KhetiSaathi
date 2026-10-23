import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import { diagnoseCropLeaf, DiagnosisResult, OFFLINE_LEAF_KNOWLEDGE } from "../services/aiService";
import { TRANSLATIONS, Language } from "../constants/translations";

interface Props {
  language: Language;
}

export default function ScannerScreen({ language }: Props) {
  const t = TRANSLATIONS[language].scanner;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string>("soybean_rust");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(OFFLINE_LEAF_KNOWLEDGE.soybean_rust);
  const [activeTab, setActiveTab] = useState<"chemical" | "organic" | "cultural" | "prevention" | "fertilizer">("chemical");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Take photo with camera
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required to photograph crop leaves.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64 || null);
        runDiagnosis(asset.base64 || null, undefined);
      }
    } catch (e) {
      console.warn("Camera error:", e);
    }
  };

  // Pick photo from gallery
  const handlePickGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64 || null);
        runDiagnosis(asset.base64 || null, undefined);
      }
    } catch (e) {
      console.warn("Gallery error:", e);
    }
  };

  // Sample leaf selector
  const handleSelectSample = (sampleKey: string) => {
    setSelectedSample(sampleKey);
    setImageUri(null);
    setImageBase64(null);
    runDiagnosis(null, sampleKey);
  };

  const runDiagnosis = async (b64: string | null, sampleKey?: string) => {
    setLoading(true);
    try {
      const result = await diagnoseCropLeaf(b64, sampleKey || selectedSample, language);
      setDiagnosis(result);

      // Auto-read in voice
      const disease = result.conditionName[language] || result.conditionName.mr;
      const remedy = result.methods.chemical[language] || result.methods.chemical.mr;
      speakDiagnosis(`${disease}. उपाय: ${remedy}`);
    } catch (err) {
      console.warn("Diagnosis error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Voice speech synthesis
  const speakDiagnosis = (text: string) => {
    Speech.stop();
    const langCode = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
    setIsSpeaking(true);
    Speech.speak(text, {
      language: langCode,
      rate: 0.92,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.badgeWrap}>
          <Ionicons name="scan" size={13} color="#4ade80" />
          <Text style={styles.badgeText}>AI CROP PATHOLOGY VISION</Text>
        </View>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <Text style={styles.headerSub}>{t.subtitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Viewfinder Preview Box */}
        <View style={styles.viewfinder}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <Image source={require("../../assets/leaf_sample.jpg")} style={styles.previewImage} resizeMode="cover" />
          )}

          {/* Action Overlay Buttons */}
          <View style={styles.viewfinderOverlay}>
            <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={18} color="#ffffff" />
              <Text style={styles.captureBtnText}>{t.cameraBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryBtn} onPress={handlePickGallery}>
              <Ionicons name="images" size={18} color="#064e3b" />
              <Text style={styles.galleryBtnText}>{t.galleryBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sample Leaf Chips */}
        <View style={styles.sampleSection}>
          <Text style={styles.sampleLabel}>किंवा चाचणीसाठी नमुना पान निवडा (Test Samples):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sampleScroll}>
            {[
              { id: "soybean_rust", label: "🌱 सोयाबीन तांबेरा" },
              { id: "cotton_curl", label: "🌾 कापूस चुरडा-मुरडा" },
              { id: "orange_canker", label: "🍊 संत्रा कॅन्कर" },
              { id: "healthy_leaf", label: "✨ निरोगी पीक पान" },
            ].map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.sampleChip, selectedSample === s.id && styles.sampleChipActive]}
                onPress={() => handleSelectSample(s.id)}
              >
                <Text style={[styles.sampleChipText, selectedSample === s.id && styles.sampleChipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Diagnosis Trigger Button */}
        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={() => runDiagnosis(imageBase64, selectedSample)}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.analyzeBtnText}>{t.analyzing}</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#fef08a" style={{ marginRight: 6 }} />
              <Text style={styles.analyzeBtnText}>🔬 AI रोग विश्लेषण करा (Analyze Leaf)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── DIAGNOSIS RESULT CARD ── */}
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <View style={styles.icarBadge}>
                  <Text style={styles.icarBadgeText}>ICAR Protocol</Text>
                </View>
                <View
                  style={[
                    styles.severityBadge,
                    diagnosis.severity === "healthy"
                      ? styles.severityHealthy
                      : diagnosis.severity === "severe"
                      ? styles.severitySevere
                      : styles.severityModerate,
                  ]}
                >
                  <Text style={styles.severityText}>तीव्रता: {diagnosis.severity}</Text>
                </View>
              </View>

              <Text style={styles.diseaseName}>
                {diagnosis.conditionName[language] || diagnosis.conditionName.mr}
              </Text>
              <Text style={styles.cropName}>{diagnosis.cropName}</Text>
            </View>

            <View style={styles.confidenceCircle}>
              <Text style={styles.confidenceVal}>{Math.round(diagnosis.confidence * 100)}%</Text>
              <Text style={styles.confidenceLabel}>{t.confidence}</Text>
            </View>
          </View>

          {/* Symptoms */}
          <View style={styles.symptomsBox}>
            <Text style={styles.symptomsLabel}>{t.symptoms}:</Text>
            <Text style={styles.symptomsText}>
              {diagnosis.symptoms[language] || diagnosis.symptoms.mr}
            </Text>
          </View>

          {/* Treatment Method Tabs */}
          <View style={styles.tabsSection}>
            <View style={styles.tabHeaderRow}>
              <Text style={styles.tabsSectionTitle}>{t.methodsTitle}:</Text>
              {isSpeaking ? (
                <TouchableOpacity style={styles.audioBtn} onPress={stopSpeaking}>
                  <Ionicons name="volume-mute" size={14} color="#dc2626" />
                  <Text style={styles.audioBtnTextRed}>{t.stopAudio}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.audioBtn}
                  onPress={() => {
                    const disease = diagnosis.conditionName[language] || diagnosis.conditionName.mr;
                    const method =
                      activeTab === "chemical"
                        ? diagnosis.methods.chemical[language] || diagnosis.methods.chemical.mr
                        : activeTab === "organic"
                        ? diagnosis.methods.organic[language] || diagnosis.methods.organic.mr
                        : activeTab === "cultural"
                        ? diagnosis.methods.cultural[language] || diagnosis.methods.cultural.mr
                        : activeTab === "prevention"
                        ? diagnosis.methods.prevention[language] || diagnosis.methods.prevention.mr
                        : diagnosis.fertilizerAdjustment[language] || diagnosis.fertilizerAdjustment.mr;
                    speakDiagnosis(`${disease}. उपाय: ${method}`);
                  }}
                >
                  <Ionicons name="volume-high" size={14} color="#059669" />
                  <Text style={styles.audioBtnText}>{t.listenAudio}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tab Selectors */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {[
                { key: "chemical", label: t.tabChemical },
                { key: "organic", label: t.tabOrganic },
                { key: "cultural", label: t.tabCultural },
                { key: "prevention", label: t.tabPrevention },
                { key: "fertilizer", label: t.tabFertilizer },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.key as any)}
                >
                  <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tab Description Box */}
            <View style={styles.tabContentBox}>
              {activeTab === "chemical" && (
                <Text style={styles.methodBodyText}>
                  {diagnosis.methods.chemical[language] || diagnosis.methods.chemical.mr}
                </Text>
              )}
              {activeTab === "organic" && (
                <Text style={styles.methodBodyText}>
                  {diagnosis.methods.organic[language] || diagnosis.methods.organic.mr}
                </Text>
              )}
              {activeTab === "cultural" && (
                <Text style={styles.methodBodyText}>
                  {diagnosis.methods.cultural[language] || diagnosis.methods.cultural.mr}
                </Text>
              )}
              {activeTab === "prevention" && (
                <Text style={styles.methodBodyText}>
                  {diagnosis.methods.prevention[language] || diagnosis.methods.prevention.mr}
                </Text>
              )}
              {activeTab === "fertilizer" && (
                <Text style={styles.methodBodyText}>
                  {diagnosis.fertilizerAdjustment[language] || diagnosis.fertilizerAdjustment.mr}
                </Text>
              )}
            </View>
          </View>

          {/* Footer Call Action */}
          <TouchableOpacity
            style={styles.kvkCallBtn}
            onPress={() => Linking.openURL("tel:18001801551")}
          >
            <Ionicons name="call" size={16} color="#dc2626" />
            <Text style={styles.kvkCallText}>{t.kvkCall}</Text>
          </TouchableOpacity>
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
  viewfinder: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000000",
    marginBottom: 12,
    position: "relative",
    borderWidth: 2,
    borderColor: "#059669",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  viewfinderOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    gap: 10,
  },
  captureBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059669",
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  captureBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  galleryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  galleryBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#064e3b",
  },
  sampleSection: {
    marginBottom: 12,
  },
  sampleLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 6,
  },
  sampleScroll: {
    gap: 8,
  },
  sampleChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sampleChipActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
  },
  sampleChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  sampleChipTextActive: {
    color: "#ffffff",
  },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#064e3b",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeBtnText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#ffffff",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  icarBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  icarBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#065f46",
    textTransform: "uppercase",
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  severityHealthy: { backgroundColor: "#dcfce7" },
  severityModerate: { backgroundColor: "#fef3c7" },
  severitySevere: { backgroundColor: "#fee2e2" },
  severityText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#374151",
    textTransform: "uppercase",
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginTop: 2,
  },
  cropName: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  confidenceCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#10b981",
  },
  confidenceVal: {
    fontSize: 15,
    fontWeight: "900",
    color: "#047857",
  },
  confidenceLabel: {
    fontSize: 8,
    color: "#065f46",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  symptomsBox: {
    marginVertical: 12,
  },
  symptomsLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  symptomsText: {
    fontSize: 12,
    color: "#1f2937",
    lineHeight: 18,
    fontWeight: "500",
  },
  tabsSection: {
    marginTop: 6,
  },
  tabHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tabsSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    textTransform: "uppercase",
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  audioBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#059669",
  },
  audioBtnTextRed: {
    fontSize: 11,
    fontWeight: "800",
    color: "#dc2626",
  },
  tabScroll: {
    gap: 6,
    marginBottom: 10,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tabBtnActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4b5563",
  },
  tabBtnTextActive: {
    color: "#ffffff",
  },
  tabContentBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  methodBodyText: {
    fontSize: 12,
    color: "#064e3b",
    lineHeight: 19,
    fontWeight: "600",
  },
  kvkCallBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  kvkCallText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#dc2626",
  },
});
