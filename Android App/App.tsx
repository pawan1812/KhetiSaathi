import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { Language, TRANSLATIONS } from "./src/constants/translations";
import HomeScreen from "./src/screens/HomeScreen";
import MandiScreen from "./src/screens/MandiScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import CalculatorScreen from "./src/screens/CalculatorScreen";

type TabKey = "home" | "mandi" | "scanner" | "weather" | "calculator";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [language, setLanguage] = useState<Language>("mr");

  const t = TRANSLATIONS[language];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            language={language}
            onLanguageChange={setLanguage}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case "mandi":
        return <MandiScreen language={language} />;
      case "scanner":
        return <ScannerScreen language={language} />;
      case "weather":
        return <WeatherScreen language={language} />;
      case "calculator":
        return <CalculatorScreen language={language} />;
      default:
        return (
          <HomeScreen
            language={language}
            onLanguageChange={setLanguage}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ExpoStatusBar style="light" />
      <View style={styles.container}>
        {/* Screen Content */}
        <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

        {/* Custom Bottom Tab Bar with Elevated Center Camera Button */}
        <View style={styles.tabBar}>
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("home")}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === "home" ? "home" : "home-outline"}
              size={22}
              color={activeTab === "home" ? "#22c55e" : "#94a3b8"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === "home" && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t.tabs.home}
            </Text>
          </TouchableOpacity>

          {/* Mandi Rates Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("mandi")}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === "mandi" ? "trending-up" : "trending-up-outline"}
              size={22}
              color={activeTab === "mandi" ? "#22c55e" : "#94a3b8"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === "mandi" && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t.tabs.mandi}
            </Text>
          </TouchableOpacity>

          {/* Center Elevated AI Scanner Button */}
          <View style={styles.scannerCenterWrapper}>
            <TouchableOpacity
              style={[
                styles.scannerCenterButton,
                activeTab === "scanner" && styles.scannerCenterButtonActive,
              ]}
              onPress={() => setActiveTab("scanner")}
              activeOpacity={0.85}
            >
              <Ionicons name="camera" size={26} color="#ffffff" />
            </TouchableOpacity>
            <Text
              style={[
                styles.scannerCenterLabel,
                activeTab === "scanner" && styles.scannerCenterLabelActive,
              ]}
              numberOfLines={1}
            >
              {t.tabs.scanner}
            </Text>
          </View>

          {/* Weather Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("weather")}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === "weather" ? "cloud" : "cloud-outline"}
              size={22}
              color={activeTab === "weather" ? "#22c55e" : "#94a3b8"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === "weather" && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t.tabs.weather}
            </Text>
          </TouchableOpacity>

          {/* Calculator Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("calculator")}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === "calculator" ? "calculator" : "calculator-outline"}
              size={22}
              color={activeTab === "calculator" ? "#22c55e" : "#94a3b8"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === "calculator" && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t.tabs.calculator}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#06130d",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#06130d",
  },
  screenWrapper: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(10, 24, 18, 0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(34, 197, 94, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "flex-end",
    justifyContent: "space-around",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: "relative",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 3,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  scannerCenterWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
  scannerCenterButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: "#06130d",
  },
  scannerCenterButtonActive: {
    backgroundColor: "#22c55e",
    borderColor: "#15803d",
    transform: [{ scale: 1.05 }],
  },
  scannerCenterLabel: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 4,
    fontWeight: "600",
  },
  scannerCenterLabelActive: {
    color: "#22c55e",
    fontWeight: "bold",
  },
});
