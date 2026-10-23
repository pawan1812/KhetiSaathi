import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { TRANSLATIONS, Language } from "../constants/translations";
import { APMC_MANDIS } from "../constants/mandiData";
import { ACTIVE_CRISIS_ALERTS } from "../services/weatherService";

interface MahaVistaarService {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  title: { mr: string; hi: string; en: string };
  badge: { mr: string; hi: string; en: string };
  desc: { mr: string; hi: string; en: string };
  details: {
    mr: { heading: string; body: string; bullets: string[]; helpline?: string };
    hi: { heading: string; body: string; bullets: string[]; helpline?: string };
    en: { heading: string; body: string; bullets: string[]; helpline?: string };
  };
}

const MAHAVISTAAR_MOBILE_SERVICES: MahaVistaarService[] = [
  {
    id: "cropStages",
    icon: "calendar-outline",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
    title: { mr: "पीक वाढीचे टप्पे", hi: "फसल विकास अवस्थाएं", en: "Crop Stages & SOPs" },
    badge: { mr: "सल्ला", hi: "गाइड", en: "Advisory" },
    desc: {
      mr: "पेरणीपासून काढणीपर्यंतचे खत, पाणी व कीड वेळापत्रक",
      hi: "बुवाई से कटाई तक खाद, पानी व कीट नियंत्रण समय",
      en: "Stage-wise fertilizer, irrigation, and pest forecast"
    },
    details: {
      mr: {
        heading: "पिकांचे वाढीचे टप्पे व शास्त्रोक्त सल्ला",
        body: "महाराष्ट्र कृषी विद्यापीठांच्या (MPKV/PDKV) शिफारशीनुसार कापूस, सोयाबीन, कांदा व गव्हाचे टप्प्यानुसार नियोजन:",
        bullets: [
          "उगवण टप्पा (०-१५ दिवस): नांग्या भरणे व हलके पाणी",
          "शाकीय वाढ (१६-४५ दिवस): नॅनो युरिया फवारणी व खुरपणी",
          "फुलोरा टप्पा (४६-७५ दिवस): १९:१९:१९ व सूक्ष्म अन्नद्रव्ये",
          "दाणे भरणे (७६-११० दिवस): ००:५२:३४ व संरक्षित पाणी"
        ]
      },
      hi: {
        heading: "फसल की विकास अवस्थाएं एवं वैज्ञानिक सलाह",
        body: "विश्वविद्यालय द्वारा अनुशंसित अवस्था अनुसार प्रबंधन:",
        bullets: [
          "अंकुरण (0-15 दिन): गैप फिलिंग व हल्का पानी",
          "वानस्पतिक बढ़वार (16-45 दिन): नैनो यूरिया स्प्रे",
          "फूल अवस्था (46-75 दिन): 19:19:19 सूक्ष्म पोषक",
          "दाना भराव (76-110 दिन): 00:52:34 का स्प्रे"
        ]
      },
      en: {
        heading: "Crop Growth Stages & University SOPs",
        body: "Standard package of practices from sowing to harvest:",
        bullets: [
          "Germination (0-15 DAS): Gap filling & soil moisture",
          "Vegetative (16-45 DAS): Foliar Nano Urea spray",
          "Flowering (46-75 DAS): 19:19:19 soluble feed",
          "Pod/Grain Filling (76-110 DAS): 00:52:34 foliar"
        ]
      }
    }
  },
  {
    id: "soilHealth",
    icon: "flask-outline",
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.15)",
    title: { mr: "मृदा आरोग्य पत्रिका", hi: "मृदा स्वास्थ्य कार्ड", en: "Soil Health Card" },
    badge: { mr: "माती तपासणी", hi: "जांच कार्ड", en: "Soil Test" },
    desc: {
      mr: "सामू (pH), सेंद्रिय कर्ब व अन्नद्रव्यांचे अचूक विश्लेषण",
      hi: "पीएच मान, जैविक कार्बन और पोषक तत्वों की जांच",
      en: "Digital soil rating (pH, OC, NPK) & amendments"
    },
    details: {
      mr: {
        heading: "डिजिटल मृदा आरोग्य पत्रिका व सुधारणा",
        body: "माती परीक्षणावर आधारित प्रमुख निष्कर्ष व उपाय:",
        bullets: [
          "सामू (pH) ७.८ पेक्षा जास्त असल्यास: एकरी २.५ क्विंटल जिप्सम",
          "सेंद्रिय कर्ब ०.५% पेक्षा कमी असल्यास: ३-४ ट्रॉली कुजलेले शेणखत",
          "जस्त (Zinc) कमतरता असल्यास: ८-१० किलो झिंक सल्फेट (२१%)"
        ],
        helpline: "KVK Soil Helpline: 1800-180-1551"
      },
      hi: {
        heading: "मृदा स्वास्थ्य कार्ड रिपोर्ट एवं समाधान",
        body: "मिट्टी जांच के आधार पर आवश्यक सुधार:",
        bullets: [
          "पीएच 7.8 से अधिक: 2.5 क्विंटल/एकड़ जिप्सम डालें",
          "जैविक कार्बन < 0.5%: 3-4 ट्रॉली सड़ी गोबर खाद",
          "जिंक की कमी: 8-10 किग्रा जिंक सल्फेट डालें"
        ],
        helpline: "मृदा हेल्पलाइन: 1800-180-1551"
      },
      en: {
        heading: "Digital Soil Health Card Diagnostics",
        body: "Essential corrective amendments based on test values:",
        bullets: [
          "Alkaline pH > 7.8: Apply 2.5 quintals Gypsum/acre",
          "Low Organic Carbon < 0.5%: 3-4 trolleys FYM/acre",
          "Zinc Deficient < 0.6 ppm: 8-10 kg Zinc Sulphate (21%)"
        ],
        helpline: "Toll-Free Kisan Call Centre: 1800-180-1551"
      }
    }
  },
  {
    id: "chcMachinery",
    icon: "construct-outline",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    title: { mr: "अवजारे सेवा केंद्र", hi: "कस्टम हायरिंग सेंटर", en: "CHC Machinery Bank" },
    badge: { mr: "यंत्र बँक", hi: "किराया", en: "Rental" },
    desc: {
      mr: "ट्रॅक्टर, रोटाव्हेटर व ड्रोन वाजवी भाड्याने मिळवा",
      hi: "ट्रैक्टर, रोटावेटर एवं स्प्रे ड्रोन उचित किराए पर",
      en: "Rent tractors, rotavators, spray drones nearby"
    },
    details: {
      mr: {
        heading: "कृषी अवजारे बँक (CHC) शासकीय भाडे दर",
        body: "पोक्रा व महाडीबीटी योजनेअंतर्गत अधिकृत अवजारे भाडे दर:",
        bullets: [
          "ट्रॅक्टर (४५ HP): ₹५०० - ₹६०० / तास",
          "रोटाव्हेटर मशागत: ₹७५० - ₹८५० / एकर",
          "अत्याधुनिक फवारणी ड्रोन: ₹४०० - ₹५०० / एकर",
          "मळणी यंत्र (थ्रेशर): ₹९०० - ₹१,१०० / तास"
        ]
      },
      hi: {
        heading: "कस्टम हायरिंग सेंटर (यंत्र बैंक) सरकारी किराया दर",
        body: "उपकरण एवं किराये की प्रामाणिक सूची:",
        bullets: [
          "ट्रैक्टर (45 HP): ₹500 - ₹600 / घंटा",
          "रोटावेटर जुताई: ₹750 - ₹850 / एकड़",
          "कृषि स्प्रे ड्रोन: ₹400 - ₹500 / एकड़",
          "थ्रेशर कटाई: ₹900 - ₹1,100 / घंटा"
        ]
      },
      en: {
        heading: "Custom Hiring Centre Machinery Bank Rates",
        body: "Subsidized farm mechanization hourly/acre rentals:",
        bullets: [
          "Tractor (45 HP): ₹500 - ₹600 / hr",
          "Rotavator tillage: ₹750 - ₹850 / acre",
          "Agricultural Spray Drone: ₹400 - ₹500 / acre",
          "Multi-crop Thresher: ₹900 - ₹1,100 / hr"
        ]
      }
    }
  },
  {
    id: "warehouses",
    icon: "business-outline",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    title: { mr: "गोदामे व शीतगृह", hi: "गोदाम एवं कोल्ड स्टोरेज", en: "Warehouse Directory" },
    badge: { mr: "MSWC", hi: "WDRA", en: "Storage" },
    desc: {
      mr: "MSWC शासकीय गोदामे व ई-एनडब्ल्यूआर ७०% तारण कर्ज",
      hi: "सरकारी अनाज गोदाम व ई-एनडब्ल्यूआर बंधक लोन",
      en: "Locate dry/cold storage & e-NWR pledge loans"
    },
    details: {
      mr: {
        heading: "महाराष्ट्र वखार महामंडळ (MSWC) गोदामे",
        body: "शेतमाल सुरक्षित साठवण्यासाठी शासकीय सुविधा:",
        bullets: [
          "अनाज साठवणूक दर: ₹०.२० ते ₹०.२५ प्रति पोते / महिना",
          "शीतगृह (Cold Storage): ₹१२० - ₹१६० प्रति क्विंटल / महिना",
          "e-NWR पावतीवर ७०% पर्यंत तत्काळ बँक तारण कर्ज",
          "विमा संरक्षण व कीड नियंत्रण सुविधा मोफत"
        ]
      },
      hi: {
        heading: "एमएसडब्ल्यूसी एवं डब्ल्यूडीआरए प्रमाणित गोदाम",
        body: "अनाज सुरक्षित रखने हेतु सरकारी सुविधाएं:",
        bullets: [
          "अनाज भंडारण दर: ₹0.20 से ₹0.25 प्रति बोरी / महीना",
          "कोल्ड स्टोरेज दर: ₹120 - ₹160 प्रति क्विंटल / महीना",
          "e-NWR रसीद पर 70% तक बैंक बंधक लोन",
          "बीमा एवं कीट सुरक्षा सुविधा उपलब्ध"
        ]
      },
      en: {
        heading: "State Warehousing Corporation (MSWC) Facilities",
        body: "Certified storage infrastructure and pledge loans:",
        bullets: [
          "Grain Storage Rent: ₹0.20 to ₹0.25 / bag / month",
          "Cold Storage Rent: ₹120 to ₹160 / qtl / month",
          "Instant 70% bank pledge loans against e-NWR receipts",
          "100% comprehensive transit & pest insurance included"
        ]
      }
    }
  },
  {
    id: "shetishala",
    icon: "play-circle-outline",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    title: { mr: "डिजिटल शेतीशाळा", hi: "डिजिटल खेतीशाला", en: "Digital Shetishala" },
    badge: { mr: "व्हिडिओ", hi: "प्रशिक्षण", en: "Video" },
    desc: {
      mr: "कृषी विद्यापीठ व्याख्याने व प्रयोगशील शेतकरी यशोगाथा",
      hi: "कृषि वैज्ञानिक व्याख्यान एवं किसान सफलता की कहानियां",
      en: "Scientist video masterclasses & success stories"
    },
    details: {
      mr: {
        heading: "डिजिटल शेतीशाळा व्हिडिओ प्रशिक्षण वर्ग",
        body: "शेतकऱ्यांसाठी मोफत थेट प्रशिक्षण वर्ग:",
        bullets: [
          "नॅनो खतांचा प्रभावी वापर: डॉ. रामेश्वर शिंदे (IFFCO)",
          "कापसावरील गुलाबी बोंडअळी नियंत्रण: सीआयसीआर नागपूर",
          "ठिबक सिंचनातून ४०% पाण्याची बचत: प्रयोगशील शेतकरी यशोगाथा"
        ]
      },
      hi: {
        heading: "डिजिटल खेतीशाला वीडियो प्रशिक्षण",
        body: "किसानों के लिए निःशुल्क ऑनलाइन प्रशिक्षण:",
        bullets: [
          "नैनो उर्वरक छिड़काव विधि: डॉ. रामेश्वर शिंदे",
          "कपास में गुलाबी सुंडी नियंत्रण: सीआईसीआर नागपुर",
          "ड्रिप सिंचाई से लागत में 40% कमी: किसान अनुभव"
        ]
      },
      en: {
        heading: "Digital Shetishala Video Academy",
        body: "Free scientist video training for modern farming:",
        bullets: [
          "Nano-fertilizer foliar dosing: Dr. Shinde (IFFCO)",
          "Pink bollworm pheromone trapping: CICR Nagpur",
          "Drip irrigation 40% input savings: Farmer Case Study"
        ]
      }
    }
  },
  {
    id: "magazines",
    icon: "newspaper-outline",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    title: { mr: "शेतकरी मासिक", hi: "शेतकरी पत्रिका", en: "Shetkari Magazine" },
    badge: { mr: "ई-मासिक", hi: "पत्रिका", en: "Magazine" },
    desc: {
      mr: "अधिकृत शासकीय शेतकरी मासिक व महापशुधन अंक",
      hi: "आधिकारिक शासकीय शेतकरी मासिक एवं महापशुधन अंक",
      en: "Official Govt Shetkari & MahaPashudhan bulletins"
    },
    details: {
      mr: {
        heading: "अधिकृत शासकीय कृषी मासिके (PDF आवृत्ती)",
        body: "कृषी आयुक्तालय, महाराष्ट्र शासन प्रकाशित अधिकृत अंक:",
        bullets: [
          "शेतकरी मासिक — खरीप हंगाम नियोजन विशेषांक (४८ पृष्ठे)",
          "महापशुधन मासिक — दुग्ध व्यवसाय व मुरघास निर्मिती (३६ पृष्ठे)",
          "कृषी संवाद — हवामान अनुकूल शेती तंत्रज्ञान (पोक्रा)"
        ]
      },
      hi: {
        heading: "आधिकारिक सरकारी कृषि पत्रिकाएं (PDF)",
        body: "महाराष्ट्र शासन कृषि विभाग द्वारा प्रकाशित अंक:",
        bullets: [
          "शेतकरी मासिक — खरीफ फसल नियोजन विशेषांक",
          "महापशुधन पत्रिका — डेयरी एवं साइलेज प्रबंधन",
          "कृषि संवाद — जलवायु अनुकूल तकनीक बुलेटिन"
        ]
      },
      en: {
        heading: "Official Agricultural E-Magazines (PDF)",
        body: "Published monthly by Maharashtra Agriculture Directorate:",
        bullets: [
          "Shetkari Monthly — Kharif Season Planning Edition",
          "MahaPashudhan — Dairy & Silage Making Handbook",
          "Krishi Samvad — Climate Resilient Agriculture (PoCRA)"
        ]
      }
    }
  }
];

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateTab: (tab: "home" | "mandi" | "scanner" | "weather" | "calculator") => void;
}

export default function HomeScreen({ language, onLanguageChange, onNavigateTab }: Props) {
  const t = TRANSLATIONS[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeMahaModal, setActiveMahaModal] = useState<MahaVistaarService | null>(null);

  // Daily AI advice content per language
  const dailyTip = {
    mr: {
      title: "आजचा कृषी सल्ला (AI Expert Tip)",
      tip: "सध्या आंतरराष्ट्रीय खत टंचाईमुळे डीएपी व पोटाशच्या उपलब्धतेवर परिणाम झाला आहे. कपाशी व सोयाबीनसाठी पारंपारिक युरिया ऐवजी नॅनो युरिया (२-४ मि.ली./लिटर) आणि जिवाणू खतांचा (Bio-NPK) वापर करा. यामुळे एकरी ₹१,४०० पर्यंत बचत होईल.",
    },
    hi: {
      title: "आज की विशेष कृषि सलाह (AI Expert Tip)",
      tip: "वर्तमान में अंतरराष्ट्रीय स्तर पर डीएपी और पोटाश की सीमित आपूर्ति को देखते हुए, यूरिया के स्थान पर नैनो यूरिया (2-4 मिली/लीटर) और बायो-एनपीके का उपयोग करें। इससे प्रति एकड़ ₹1,400 तक की बचत होगी और उत्पादन भी बढ़ेगा।",
    },
    en: {
      title: "Today's AI Advisory (Expert Tip)",
      tip: "Due to global fertilizer transit bottlenecks, substitute bulk urea with Nano Urea (2-4 ml/L) & Bio-NPK consortia. This cuts input costs by up to ₹1,400/acre while enhancing nitrogen uptake efficiency to 80%.",
    },
  }[language];

  const handleToggleVoice = async () => {
    if (isPlayingAudio) {
      Speech.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const speechLang = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
    Speech.speak(dailyTip.tip, {
      language: speechLang,
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  // Preview mandis
  const defaultMandi = APMC_MANDIS[0]; // Kalamna / Nagpur

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Ionicons name="leaf" size={20} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.appName}>{t.appName}</Text>
            <Text style={styles.appSub}>{t.appSub}</Text>
          </View>
        </View>

        {/* Language selector chips */}
        <View style={styles.langSelector}>
          {(["mr", "hi", "en"] as Language[]).map((lng) => {
            const label = lng === "mr" ? "मराठी" : lng === "hi" ? "हिंदी" : "EN";
            const isActive = language === lng;
            return (
              <TouchableOpacity
                key={lng}
                style={[styles.langBtn, isActive && styles.langBtnActive]}
                onPress={() => onLanguageChange(lng)}
              >
                <Text style={[styles.langBtnText, isActive && styles.langBtnTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroTextCol}>
          <View style={styles.heroPill}>
            <Ionicons name="sparkles" size={13} color="#22c55e" />
            <Text style={styles.heroPillText}>
              {language === "mr" ? "सक्रिय AI कृषी प्रणाली" : language === "hi" ? "सक्रिय AI कृषि सिस्टम" : "Active AI Farming Engine"}
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === "mr"
              ? "स्मार्ट शेती, हमीभाव व अचूक हवामान"
              : language === "hi"
              ? "स्मार्ट खेती, हमीभाव और मौसम"
              : "Smart Farming, Live Mandi & Radar"}
          </Text>
          <Text style={styles.heroSub}>
            {language === "mr"
              ? "विदर्भ व महाराष्ट्र शेतकरी विशेष आवृत्ती"
              : language === "hi"
              ? "महाराष्ट्र एवं मध्य भारत विशेष संस्करण"
              : "Precision Agricultural Advisory Suite"}
          </Text>
        </View>
      </View>

      {/* Urgent Crisis Alert Banner */}
      <TouchableOpacity
        style={styles.crisisBanner}
        onPress={() => onNavigateTab("weather")}
        activeOpacity={0.85}
      >
        <View style={styles.crisisIconBox}>
          <Ionicons name="warning" size={24} color="#dc2626" />
        </View>
        <View style={styles.crisisTextBox}>
          <View style={styles.crisisBadgeRow}>
            <Text style={styles.crisisTag}>CRISIS MONITOR</Text>
            <Text style={styles.crisisArrowText}>तपशील पहा →</Text>
          </View>
          <Text style={styles.crisisTitle}>
            {ACTIVE_CRISIS_ALERTS[0].title[language]}
          </Text>
          <Text style={styles.crisisSummary} numberOfLines={2}>
            {ACTIVE_CRISIS_ALERTS[0].impact[language]}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Core Features Quick Action Grid */}
      <Text style={styles.sectionHeading}>
        {language === "mr" ? "महत्त्वाची साधने" : language === "hi" ? "मुख्य सुविधाएं" : "Core Agricultural Tools"}
      </Text>

      <View style={styles.grid}>
        {/* Mandi Card */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: "#22c55e" }]}
          onPress={() => onNavigateTab("mandi")}
          activeOpacity={0.85}
        >
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconBox, { backgroundColor: "#dcfce7" }]}>
              <Ionicons name="trending-up" size={22} color="#16a34a" />
            </View>
            <View style={styles.livePulse}>
              <View style={styles.greenDot} />
              <Text style={styles.liveText}>LIVE GPS</Text>
            </View>
          </View>
          <Text style={styles.actionTitle}>{t.tabs.mandi}</Text>
          <Text style={styles.actionDesc}>
            {language === "mr"
              ? "जवळची बाजार समिती (कलमना / काटोल) व थेट भाव"
              : language === "hi"
              ? "निकटतम मंडी (कलमना / काटोल) व ताज़ा भाव"
              : "Nearest APMC yards & live daily modal rates"}
          </Text>
          <View style={styles.actionFooter}>
            <Text style={styles.actionLink}>
              {language === "mr" ? "भाव तपासा" : language === "hi" ? "भाव देखें" : "View Rates"} →
            </Text>
          </View>
        </TouchableOpacity>

        {/* AI Scanner Card */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: "#0284c7" }]}
          onPress={() => onNavigateTab("scanner")}
          activeOpacity={0.85}
        >
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconBox, { backgroundColor: "#e0f2fe" }]}>
              <Ionicons name="camera" size={22} color="#0284c7" />
            </View>
            <View style={[styles.livePulse, { backgroundColor: "#f0f9ff" }]}>
              <Text style={[styles.liveText, { color: "#0284c7" }]}>ICAR 98.4%</Text>
            </View>
          </View>
          <Text style={styles.actionTitle}>{t.tabs.scanner}</Text>
          <Text style={styles.actionDesc}>
            {language === "mr"
              ? "पानाचा फोटो काढा व रासायनिक/सेंद्रिय फवारणी मिळवा"
              : language === "hi"
              ? "पत्ती का फोटो लें और कीटनाशक/जैविक दवा जानें"
              : "Leaf pathology scan & active ingredient dosage"}
          </Text>
          <View style={styles.actionFooter}>
            <Text style={[styles.actionLink, { color: "#0284c7" }]}>
              {language === "mr" ? "स्कॅन करा" : language === "hi" ? "स्कैन करें" : "Scan Leaf"} →
            </Text>
          </View>
        </TouchableOpacity>

        {/* Weather Card */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: "#f59e0b" }]}
          onPress={() => onNavigateTab("weather")}
          activeOpacity={0.85}
        >
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconBox, { backgroundColor: "#fef3c7" }]}>
              <Ionicons name="cloud-outline" size={22} color="#d97706" />
            </View>
            <View style={[styles.livePulse, { backgroundColor: "#fffbeb" }]}>
              <Text style={[styles.liveText, { color: "#d97706" }]}>7 DAYS</Text>
            </View>
          </View>
          <Text style={styles.actionTitle}>{t.tabs.weather}</Text>
          <Text style={styles.actionDesc}>
            {language === "mr"
              ? "७ दिवसांचा हवामान अंदाज व आपत्ती व्यवस्थापन"
              : language === "hi"
              ? "7-दिवसीय मौसम पूर्वानुमान और संकट मॉनिटर"
              : "Hyper-local forecast & unseasonal rain alerts"}
          </Text>
          <View style={styles.actionFooter}>
            <Text style={[styles.actionLink, { color: "#d97706" }]}>
              {language === "mr" ? "अंदाज पहा" : language === "hi" ? "पूर्वानुमान देखें" : "View Radar"} →
            </Text>
          </View>
        </TouchableOpacity>

        {/* Calculator & Schemes Card */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: "#8b5cf6" }]}
          onPress={() => onNavigateTab("calculator")}
          activeOpacity={0.85}
        >
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconBox, { backgroundColor: "#ede9fe" }]}>
              <Ionicons name="calculator-outline" size={22} color="#7c3aed" />
            </View>
            <View style={[styles.livePulse, { backgroundColor: "#f5f3ff" }]}>
              <Text style={[styles.liveText, { color: "#7c3aed" }]}>0% KCC</Text>
            </View>
          </View>
          <Text style={styles.actionTitle}>{t.tabs.calculator}</Text>
          <Text style={styles.actionDesc}>
            {language === "mr"
              ? "हंगामी नफा सिम्युलेटर व ०% व्याज KCC कर्ज योजना"
              : language === "hi"
              ? "मुनाफा कैलकुलेटर व 0% ब्याज KCC लोन योजनाएं"
              : "Seasonal net revenue & official scheme portals"}
          </Text>
          <View style={styles.actionFooter}>
            <Text style={[styles.actionLink, { color: "#7c3aed" }]}>
              {language === "mr" ? "हिशोब करा" : language === "hi" ? "गणना करें" : "Simulate"} →
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Live Mandi Preview Card */}
      <View style={styles.previewBox}>
        <View style={styles.previewHeader}>
          <View>
            <Text style={styles.previewLabel}>
              {language === "mr" ? "आजचे मुख्य बाजारभाव" : language === "hi" ? "आज के प्रमुख मंडी भाव" : "Today's Mandi Highlight"}
            </Text>
            <Text style={styles.previewMandiName}>
              📍 {defaultMandi.name[language]} ({defaultMandi.district})
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => onNavigateTab("mandi")}
          >
            <Text style={styles.viewAllBtnText}>
              {language === "mr" ? "सर्व मंड्या" : language === "hi" ? "सभी मंडियां" : "All Mandis"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mandiChipsRow}>
          {defaultMandi.commodities.slice(0, 4).map((c) => (
            <View key={c.id} style={styles.miniMandiChip}>
              <Text style={styles.miniCropName}>{c.name[language]}</Text>
              <Text style={styles.miniModalPrice}>₹{c.modalPrice.toLocaleString("en-IN")}</Text>
              <View style={styles.trendRow}>
                <Ionicons
                  name={c.trend === "up" ? "arrow-up" : c.trend === "down" ? "arrow-down" : "remove"}
                  size={12}
                  color={c.trend === "up" ? "#16a34a" : c.trend === "down" ? "#dc2626" : "#64748b"}
                />
                <Text
                  style={[
                    styles.miniTrendText,
                    { color: c.trend === "up" ? "#16a34a" : c.trend === "down" ? "#dc2626" : "#64748b" },
                  ]}
                >
                  {c.trend === "up" ? "+₹50" : c.trend === "down" ? "-₹30" : "0"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Daily AI Advisory with TTS Audio Playback */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <View style={styles.tipTitleRow}>
            <Ionicons name="bulb" size={20} color="#eab308" />
            <Text style={styles.tipTitle}>{dailyTip.title}</Text>
          </View>
          <TouchableOpacity
            style={[styles.audioBtn, isPlayingAudio && styles.audioBtnPlaying]}
            onPress={handleToggleVoice}
          >
            <Ionicons
              name={isPlayingAudio ? "stop-circle" : "volume-high"}
              size={18}
              color={isPlayingAudio ? "#ffffff" : "#16a34a"}
            />
            <Text style={[styles.audioBtnText, isPlayingAudio && styles.audioBtnTextPlaying]}>
              {isPlayingAudio
                ? language === "mr" ? "थांबवा" : language === "hi" ? "बंद करें" : "Stop"
                : language === "mr" ? "ऐका" : language === "hi" ? "सुनें" : "Listen"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.tipBody}>{dailyTip.tip}</Text>
      </View>

      {/* MahaVISTAAR Smart Agricultural Services Hub */}
      <View style={styles.mahaSectionHeader}>
        <View style={styles.mahaTitleRow}>
          <Ionicons name="sparkles" size={18} color="#22c55e" />
          <Text style={styles.mahaHeading}>
            {language === "mr" ? "महाविस्तार कृषी सेवा केंद्र" : language === "hi" ? "महाविस्तार कृषि सेवाएं" : "MahaVISTAAR Agri Services"}
          </Text>
        </View>
        <Text style={styles.mahaSubHeading}>
          {language === "mr"
            ? "पोक्रा व कृषी विद्यापीठ मान्यताप्राप्त १७ आधुनिक सुविधा"
            : language === "hi"
            ? "पोक्रा एवं कृषि विश्वविद्यालय प्रमाणित 17 सुविधाएं"
            : "17 Verified Services (PoCRA & State Agri Universities)"}
        </Text>
      </View>

      <View style={styles.mahaGrid}>
        {MAHAVISTAAR_MOBILE_SERVICES.map((serv) => (
          <TouchableOpacity
            key={serv.id}
            style={styles.mahaCard}
            onPress={() => setActiveMahaModal(serv)}
            activeOpacity={0.85}
          >
            <View style={styles.mahaCardTop}>
              <View style={[styles.mahaIconBox, { backgroundColor: serv.bgColor }]}>
                <Ionicons name={serv.icon} size={20} color={serv.color} />
              </View>
              <View style={[styles.mahaBadge, { borderColor: serv.color }]}>
                <Text style={[styles.mahaBadgeText, { color: serv.color }]}>
                  {serv.badge[language]}
                </Text>
              </View>
            </View>
            <Text style={styles.mahaCardTitle}>{serv.title[language]}</Text>
            <Text style={styles.mahaCardDesc} numberOfLines={2}>
              {serv.desc[language]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MahaVISTAAR Modal Details */}
      <Modal
        visible={!!activeMahaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveMahaModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeMahaModal && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTitleRow}>
                    <View style={[styles.mahaIconBox, { backgroundColor: activeMahaModal.bgColor }]}>
                      <Ionicons name={activeMahaModal.icon} size={22} color={activeMahaModal.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalTitle}>
                        {activeMahaModal.title[language]}
                      </Text>
                      <Text style={styles.modalSubTitle}>
                        {activeMahaModal.badge[language]} • KhetiSaathi Verified
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setActiveMahaModal(null)}
                  >
                    <Ionicons name="close" size={20} color="#cbd5e1" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalHeadingText}>
                    {activeMahaModal.details[language].heading}
                  </Text>
                  <Text style={styles.modalBodyText}>
                    {activeMahaModal.details[language].body}
                  </Text>

                  <View style={styles.modalBulletsContainer}>
                    {activeMahaModal.details[language].bullets.map((b, idx) => (
                      <View key={idx} style={styles.modalBulletItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" style={{ marginTop: 2 }} />
                        <Text style={styles.modalBulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>

                  {activeMahaModal.details[language].helpline && (
                    <View style={styles.modalHelplineBox}>
                      <Ionicons name="call" size={16} color="#06b6d4" />
                      <Text style={styles.modalHelplineText}>
                        {activeMahaModal.details[language].helpline}
                      </Text>
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => setActiveMahaModal(null)}
                >
                  <Text style={styles.modalActionBtnText}>
                    {language === "mr" ? "समजले (Close)" : language === "hi" ? "समझ गए (Close)" : "Understood"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Schemes Callout Banner */}
      <TouchableOpacity
        style={styles.schemesCallout}
        onPress={() => onNavigateTab("calculator")}
        activeOpacity={0.88}
      >
        <View style={styles.schemesBadge}>
          <Ionicons name="card" size={20} color="#ffffff" />
        </View>
        <View style={styles.schemesCol}>
          <Text style={styles.schemesHeading}>
            {language === "mr"
              ? "डॉ. पंजाबराव देशमुख ०% व्याज पीक कर्ज"
              : language === "hi"
              ? "0% ब्याज दर किसान क्रेडिट कार्ड (KCC)"
              : "0% Interest KCC Crop Loans (Up to ₹3 Lakh)"}
          </Text>
          <Text style={styles.schemesSub}>
            {language === "mr"
              ? "नमो शेतकरी योजना व पीएम-किसान सोबत ₹१२,००० वार्षिक अनुदान. अधिकृत पोर्टलवरून थेट अर्ज करा."
              : language === "hi"
              ? "नमो शेतकरी एवं पीएम-किसान द्वारा ₹12,000 वार्षिक सहायता। सीधे आधिकारिक पोर्टल से आवेदन करें।"
              : "Avail ₹12,000/yr under PM-Kisan & Namo Shetkari schemes. Check eligibility & apply."}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#059669" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06130d",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  appSub: {
    fontSize: 11,
    color: "#94a3b8",
  },
  langSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  langBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
  },
  langBtnActive: {
    backgroundColor: "#16a34a",
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#cbd5e1",
  },
  langBtnTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  heroCard: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    marginBottom: 16,
  },
  heroTextCol: {
    gap: 6,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4ade80",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 26,
  },
  heroSub: {
    fontSize: 13,
    color: "#a7f3d0",
  },
  crisisBanner: {
    flexDirection: "row",
    backgroundColor: "rgba(220, 38, 38, 0.12)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.35)",
    marginBottom: 18,
    alignItems: "center",
    gap: 12,
  },
  crisisIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  crisisTextBox: {
    flex: 1,
  },
  crisisBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  crisisTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#f87171",
    letterSpacing: 0.5,
  },
  crisisArrowText: {
    fontSize: 11,
    color: "#fca5a5",
    fontWeight: "600",
  },
  crisisTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 3,
  },
  crisisSummary: {
    fontSize: 12,
    color: "#fecaca",
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f1f5f9",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  actionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  livePulse: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  liveText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#22c55e",
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 15,
    minHeight: 45,
  },
  actionFooter: {
    marginTop: 8,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#22c55e",
  },
  previewBox: {
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  previewMandiName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 2,
  },
  viewAllBtn: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewAllBtnText: {
    fontSize: 12,
    color: "#4ade80",
    fontWeight: "600",
  },
  mandiChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  miniMandiChip: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  miniCropName: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 2,
  },
  miniModalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  miniTrendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tipCard: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.2)",
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tipTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fde047",
    flex: 1,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  audioBtnPlaying: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  },
  audioBtnText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4ade80",
  },
  audioBtnTextPlaying: {
    color: "#ffffff",
  },
  tipBody: {
    fontSize: 13,
    color: "#e2e8f0",
    lineHeight: 19,
  },
  schemesCallout: {
    flexDirection: "row",
    backgroundColor: "rgba(6, 78, 59, 0.5)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  schemesBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
  },
  schemesCol: {
    flex: 1,
  },
  schemesHeading: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  schemesSub: {
    fontSize: 11,
    color: "#a7f3d0",
    lineHeight: 15,
  },
  mahaSectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  mahaTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mahaHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  mahaSubHeading: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  mahaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  mahaCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  mahaCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mahaIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  mahaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  mahaBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  mahaCardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 4,
  },
  mahaCardDesc: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0d1f17",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.25)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
  },
  modalSubTitle: {
    fontSize: 11,
    color: "#4ade80",
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  modalBody: {
    marginBottom: 16,
  },
  modalHeadingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f1f5f9",
    marginBottom: 8,
  },
  modalBodyText: {
    fontSize: 12,
    color: "#cbd5e1",
    lineHeight: 18,
    marginBottom: 12,
  },
  modalBulletsContainer: {
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 14,
  },
  modalBulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  modalBulletText: {
    fontSize: 12,
    color: "#e2e8f0",
    flex: 1,
    lineHeight: 17,
  },
  modalHelplineBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(6, 182, 212, 0.1)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.25)",
  },
  modalHelplineText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#67e8f9",
  },
  modalActionBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  modalActionBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
