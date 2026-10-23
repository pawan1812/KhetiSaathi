export type Language = "mr" | "hi" | "en";

export interface Translations {
  appName: string;
  appSub: string;
  tabs: {
    home: string;
    mandi: string;
    scanner: string;
    weather: string;
    calculator: string;
  };
  mandi: {
    title: string;
    subtitle: string;
    gpsLocating: string;
    gpsLocated: string;
    refreshBtn: string;
    nearestBadge: string;
    modalPrice: string;
    minPrice: string;
    maxPrice: string;
    arrivals: string;
    distance: string;
    allCommodities: string;
  };
  weather: {
    title: string;
    subtitle: string;
    forecast7Days: string;
    crisisMonitorTitle: string;
    crisisWarningBadge: string;
    temp: string;
    humidity: string;
    wind: string;
    rainProb: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    cropSelect: string;
    acresLabel: string;
    netProfit: string;
    grossRev: string;
    totalCost: string;
    nanoSavings: string;
    mspRef: string;
    schemesTitle: string;
    schemesSub: string;
    applyBtn: string;
    eligibilityTitle: string;
  };
  scanner: {
    title: string;
    subtitle: string;
    cameraBtn: string;
    galleryBtn: string;
    analyzing: string;
    confidence: string;
    symptoms: string;
    methodsTitle: string;
    tabChemical: string;
    tabOrganic: string;
    tabCultural: string;
    tabPrevention: string;
    tabFertilizer: string;
    listenAudio: string;
    stopAudio: string;
    kvkCall: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  mr: {
    appName: "शेतीसाथी",
    appSub: "स्मार्ट कृषी व मंडी सहाय्यक",
    tabs: {
      home: "मुख्य",
      mandi: "बाजारभाव",
      scanner: "AI स्कॅनर",
      weather: "हवामान",
      calculator: "कॅल्क्युलेटर",
    },
    mandi: {
      title: "थेट APMC बाजार समिती भाव",
      subtitle: "GPS द्वारे तुमच्या गावाजवळच्या सर्वात जवळच्या बाजार समित्यांचे आजचे मूळ भाव",
      gpsLocating: "GPS स्थान शोधत आहे...",
      gpsLocated: "जवळची बाजार समिती सापडली",
      refreshBtn: "ताजे भाव पहा",
      nearestBadge: "सर्वात जवळ",
      modalPrice: "सरासरी भाव",
      minPrice: "किमान भाव",
      maxPrice: "कमाल भाव",
      arrivals: "आजची आवक",
      distance: "थेट अंतर",
      allCommodities: "सर्व पिके",
    },
    weather: {
      title: "हवामान रडार व आपत्कालीन संकट केंद्र",
      subtitle: "७ दिवसांचा अचूक कृषी अंदाज आणि आपत्ती व्यवस्थापन सल्ला",
      forecast7Days: "७ दिवसांचा हवामान अंदाज",
      crisisMonitorTitle: "कृषी संकट व जोखीम नियंत्रण केंद्र (Crisis Monitor)",
      crisisWarningBadge: "तात्काळ उपाय आवश्यक",
      temp: "तापमान",
      humidity: "आर्द्रता",
      wind: "वाऱ्याचा वेग",
      rainProb: "पावसाची शक्यता",
    },
    calculator: {
      title: "शेती नफा व खर्च सिम्युलेटर",
      subtitle: "हंगामी नफा, हमीभाव (MSP २०२५-२६) व शासकीय योजना",
      cropSelect: "मुख्य पीक निवडा",
      acresLabel: "जमीन (एकर)",
      netProfit: "अपेक्षित निव्वळ नफा",
      grossRev: "एकूण उत्पन्न",
      totalCost: "उत्पादन खर्च",
      nanoSavings: "नॅनो युरियामुळे बचत",
      mspRef: "हमीभाव (MSP)",
      schemesTitle: "शासकीय योजना व ०% व्याज पीक कर्ज (KCC)",
      schemesSub: "पात्रता, कागदपत्रे व थेट अर्ज करण्याची अधिकृत लिंक",
      applyBtn: "ऑनलाइन अर्ज करा",
      eligibilityTitle: "पात्रता निकष:",
    },
    scanner: {
      title: "AI पीक पान रोग निदान",
      subtitle: "पानाचा फोटो काढा, तात्काळ रोग ओळखा आणि रासायनिक/सेंद्रिय फवारणीचे प्रमाण पाहा",
      cameraBtn: "कॅमेराने फोटो काढा",
      galleryBtn: "गॅलरीतून निवडा",
      analyzing: "AI पान स्कॅन करत आहे... लक्षणे तपासत आहे...",
      confidence: "AI अचूकता",
      symptoms: "निरीक्षित लक्षणे",
      methodsTitle: "प्रमाणित उपाय व फवारणी नियोजन",
      tabChemical: "🧪 रासायनिक",
      tabOrganic: "🌿 सेंद्रिय",
      tabCultural: "🚜 मशागत",
      tabPrevention: "🛡️ प्रतिबंध",
      tabFertilizer: "🌾 खत नियोजन",
      listenAudio: "मराठीत ऐका",
      stopAudio: "आवाज थांबवा",
      kvkCall: "KVK हेल्पलाइन (१८००-१८०-१५५१)",
    },
  },

  hi: {
    appName: "खेतीसाथी",
    appSub: "स्मार्ट कृषि एवं मंडी सहायक",
    tabs: {
      home: "होम",
      mandi: "मंडी भाव",
      scanner: "AI स्कैनर",
      weather: "मौसम",
      calculator: "कैलकुलेटर",
    },
    mandi: {
      title: "लाइव APMC मंडी भाव",
      subtitle: "GPS के आधार पर निकटतम मंडियों के आज के वास्तविक मॉडल भाव",
      gpsLocating: "GPS लोकेशन प्राप्त हो रही है...",
      gpsLocated: "निकटतम मंडी मिली",
      refreshBtn: "ताज़ा भाव लोड करें",
      nearestBadge: "सबसे पास",
      modalPrice: "मॉडल भाव",
      minPrice: "न्यूनतम भाव",
      maxPrice: "अधिकतम भाव",
      arrivals: "दैनिक आवक",
      distance: "दूरी",
      allCommodities: "सभी फसलें",
    },
    weather: {
      title: "मौसम रडार एवं कृषि संकट केंद्र",
      subtitle: "7-दिवसीय सटीक कृषि पूर्वानुमान और संकट निवारण",
      forecast7Days: "7-दिवसीय मौसम पूर्वानुमान",
      crisisMonitorTitle: "कृषि संकट एवं जोखिम मॉनिटर (Crisis Monitor)",
      crisisWarningBadge: "तत्काल कार्रवाई आवश्यक",
      temp: "तापमान",
      humidity: "आर्द्रता",
      wind: "हवा की गति",
      rainProb: "वर्षा की संभावना",
    },
    calculator: {
      title: "फार्म मुनाफा एवं लागत कैलकुलेटर",
      subtitle: "शुद्ध आय, एमएसपी (MSP 2025-26) और सरकारी योजनाएं",
      cropSelect: "फसल चुनें",
      acresLabel: "रकबा (एकड़)",
      netProfit: "अनुमानित शुद्ध लाभ",
      grossRev: "कुल बाजार आय",
      totalCost: "उत्पादन लागत",
      nanoSavings: "नैनो यूरिया से बचत",
      mspRef: "न्यूनतम समर्थन मूल्य (MSP)",
      schemesTitle: "सरकारी योजनाएं एवं 0% ब्याज फसल ऋण (KCC)",
      schemesSub: "पात्रता, आवश्यक दस्तावेज एवं ऑनलाइन आवेदन लिंक",
      applyBtn: "ऑनलाइन आवेदन करें",
      eligibilityTitle: "पात्रता शर्तें:",
    },
    scanner: {
      title: "AI फसल पत्ती रोग निदान",
      subtitle: "पत्ती का फोटो लें, तुरंत रोग पहचानें और कीटनाशक/जैविक दवा की सटीक मात्रा जानें",
      cameraBtn: "कैमरा से फोटो लें",
      galleryBtn: "गैलरी से चुनें",
      analyzing: "AI पत्ती का विश्लेषण कर रहा है...",
      confidence: "सटीकता",
      symptoms: "पत्ती पर लक्षण",
      methodsTitle: "प्रमाणित उपचार एवं छिड़काव विधि",
      tabChemical: "🧪 रासायनिक",
      tabOrganic: "🌿 जैविक",
      tabCultural: "🚜 खेत प्रबंधन",
      tabPrevention: "🛡️ रोकथाम",
      tabFertilizer: "🌾 उर्वरक सलाह",
      listenAudio: "हिंदी में सुनें",
      stopAudio: "आवाज बंद करें",
      kvkCall: "KVK हेल्पलाइन (1800-180-1551)",
    },
  },

  en: {
    appName: "KhetiSaathi",
    appSub: "Smart Agriculture & Mandi Assistant",
    tabs: {
      home: "Home",
      mandi: "Mandi Rates",
      scanner: "AI Scanner",
      weather: "Weather",
      calculator: "Calculator",
    },
    mandi: {
      title: "Live APMC Mandi Rates",
      subtitle: "GPS proximity discovery of nearest APMC market yards and live modal prices",
      gpsLocating: "Acquiring GPS location...",
      gpsLocated: "Nearest Mandi Discovered",
      refreshBtn: "Refresh Rates",
      nearestBadge: "Nearest",
      modalPrice: "Modal Price",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      arrivals: "Today's Arrivals",
      distance: "Distance",
      allCommodities: "All Crops",
    },
    weather: {
      title: "Weather Radar & Crisis Monitor",
      subtitle: "Hyper-local 7-day agricultural radar and risk mitigation prescriptions",
      forecast7Days: "7-Day Weather Forecast",
      crisisMonitorTitle: "Agricultural Crisis & Supply Chain Monitor",
      crisisWarningBadge: "Immediate Action Recommended",
      temp: "Temperature",
      humidity: "Humidity",
      wind: "Wind Speed",
      rainProb: "Rain Probability",
    },
    calculator: {
      title: "Farm Economics & Profit Simulator",
      subtitle: "Harvest revenues, MSP 2025-26, and nano fertilizer cost reducer",
      cropSelect: "Select Crop",
      acresLabel: "Land (Acres)",
      netProfit: "Projected Net Profit",
      grossRev: "Gross Market Revenue",
      totalCost: "Total Input Costs",
      nanoSavings: "Nano Urea Savings",
      mspRef: "Central MSP Benchmark",
      schemesTitle: "Government Schemes & 0% KCC Crop Loans",
      schemesSub: "Eligibility criteria, required documents, and official portal links",
      applyBtn: "Apply Online",
      eligibilityTitle: "Eligibility Criteria:",
    },
    scanner: {
      title: "AI Crop Leaf Pathology",
      subtitle: "Photograph leaves to instantly diagnose pathogens and obtain exact chemical dosages",
      cameraBtn: "Take Photo",
      galleryBtn: "Choose from Gallery",
      analyzing: "AI is scanning leaf pathology...",
      confidence: "Confidence",
      symptoms: "Observed Symptoms",
      methodsTitle: "Verified Treatment Methods",
      tabChemical: "🧪 Chemical",
      tabOrganic: "🌿 Organic",
      tabCultural: "🚜 Cultural",
      tabPrevention: "🛡️ Prevention",
      tabFertilizer: "🌾 Fertilizer",
      listenAudio: "Listen Audio",
      stopAudio: "Stop Audio",
      kvkCall: "Kisan Helpline (1800-180-1551)",
    },
  },
};
