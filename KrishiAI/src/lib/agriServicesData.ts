// ============================================================================
// KHETISAATHI — VERIFIED AGRICULTURAL DATA & KNOWLEDGE ENGINE
// Agronomic intelligence modeled with ICAR & State Agri University research
// ============================================================================

export interface CropStage {
  id: string;
  name: { en: string; mr: string; hi: string };
  startDay: number;
  endDay: number;
  description: { en: string; mr: string; hi: string };
  advisory: { en: string; mr: string; hi: string };
  irrigation: { en: string; mr: string; hi: string };
  nutrition: { en: string; mr: string; hi: string };
  potentialPests: string[];
}

export interface CropMaster {
  id: string;
  name: { en: string; mr: string; hi: string };
  scientificName: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Perennial";
  typicalDurationDays: number;
  varieties: { name: string; duration: string; yieldQtl: string; specialFeature: string }[];
  stages: CropStage[];
  recommendedNPK: { n: number; p: number; k: number; unit: "kg/acre" };
  recommendedFYM: number; // tonnes/acre
}

export interface PestDiseaseGuide {
  id: string;
  cropId: string;
  cropName: { en: string; mr: string; hi: string };
  name: { en: string; mr: string; hi: string };
  scientificName: string;
  type: "pest" | "disease";
  stageIds: string[];
  severity: "mild" | "moderate" | "severe";
  symptoms: { en: string; mr: string; hi: string };
  causes: { en: string; mr: string; hi: string };
  preventiveMeasures: { en: string; mr: string; hi: string };
  curativeChemical: { en: string; mr: string; hi: string };
  curativeOrganic: { en: string; mr: string; hi: string };
  culturalPractices: { en: string; mr: string; hi: string };
  etlThreshold: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  district: string;
  taluka: string;
  address: string;
  totalCapacityMT: number;
  availableCapacityMT: number;
  type: "Dry Warehouse" | "Cold Storage" | "Grain Silo";
  contactPerson: string;
  phone: string;
  accreditedBy: "WDRA" | "MSWC" | "CWC" | "Private";
  ratesPerQuintalPerMonth: number;
  amenities: string[];
  lat: number;
  lng: number;
}

export interface CHCCentre {
  id: string;
  name: string;
  district: string;
  taluka: string;
  village: string;
  contactPerson: string;
  phone: string;
  distanceKm: number;
  machinery: {
    type: string;
    model: string;
    hourlyRate: number;
    dailyRate: number;
    available: boolean;
  }[];
  lat: number;
  lng: number;
}

export interface AgriScheme {
  id: string;
  title: { en: string; mr: string; hi: string };
  department: string;
  subsidyPercentage: string;
  maxSubsidyAmount: string;
  description: { en: string; mr: string; hi: string };
  eligibility: string[];
  documentsRequired: string[];
  applicationProcess: { en: string; mr: string; hi: string };
  officialLink: string;
  isPoCRA: boolean;
  status: "Active" | "Upcoming" | "Closed";
  deadline?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: { en: string; mr: string; hi: string };
  category: "Crop SOP" | "Pest Management" | "Organic Farming" | "Irrigation" | "Post-Harvest";
  crop?: string;
  readTime: string;
  publishedDate: string;
  author: string;
  summary: { en: string; mr: string; hi: string };
  contentSections: { heading: string; body: string }[];
}

export interface ExpertQA {
  id: string;
  question: { en: string; mr: string; hi: string };
  askedBy: string;
  location: string;
  date: string;
  crop: string;
  status: "Answered" | "Pending";
  expertName: string;
  expertTitle: string;
  answer: { en: string; mr: string; hi: string };
  upvotes: number;
}

export interface VideoTutorial {
  id: string;
  title: { en: string; mr: string; hi: string };
  category: "Digital Shetishala" | "Fertilizer Management" | "Pest Control" | "Farmer Story";
  duration: string;
  youtubeId: string;
  speaker: string;
  views: string;
  thumbnail: string;
}

export interface AgriMagazine {
  id: string;
  title: { en: string; mr: string; hi: string };
  issue: string;
  publisher: string;
  publishDate: string;
  coverImage: string;
  pdfUrl: string;
  pages: number;
  topics: string[];
}

export interface AgriNotification {
  id: string;
  type: "weather" | "pest" | "mandi" | "scheme" | "system";
  title: { en: string; mr: string; hi: string };
  description: { en: string; mr: string; hi: string };
  timestamp: string;
  severity: "info" | "warning" | "alert";
  isRead: boolean;
  actionUrl?: string;
}

// ============================================================================
// 1. CROPS MASTER DATA WITH GROWTH STAGES & ADVISORIES
// ============================================================================
export const CROP_MASTER_LIST: CropMaster[] = [
  {
    id: "cotton",
    name: { en: "Cotton", mr: "कापूस", hi: "कपास" },
    scientificName: "Gossypium hirsutum",
    season: "Kharif",
    typicalDurationDays: 160,
    recommendedNPK: { n: 40, p: 20, k: 20, unit: "kg/acre" },
    recommendedFYM: 4,
    varieties: [
      { name: "Bt Cotton (Bollgard II)", duration: "150-160 days", yieldQtl: "10-14 qtl/acre", specialFeature: "Tolerant to bollworms, high ginning outturn" },
      { name: "Ajit-155", duration: "160-170 days", yieldQtl: "12-15 qtl/acre", specialFeature: "Heavy bolls, drought resilient" },
      { name: "RCH-659", duration: "150-160 days", yieldQtl: "11-14 qtl/acre", specialFeature: "Suitable for medium to heavy black soils" }
    ],
    stages: [
      {
        id: "sowing",
        name: { en: "Germination & Emergence", mr: "उगवण टप्पा", hi: "अंकुरण अवस्था" },
        startDay: 0,
        endDay: 15,
        description: {
          en: "Seed emergence and cotyledon leaf opening. Critical moisture required.",
          mr: "बियांची उगवण व दोन पानांची अवस्था. जमिनीत योग्य ओलावा आवश्यक.",
          hi: "बीज अंकुरण एवं प्रारंभिक पत्तियों का निकलना। खेत में उचित नमी आवश्यक।"
        },
        advisory: {
          en: "Ensure soil moisture at 15-20%. Fill gaps within 10 days of sowing.",
          mr: "नांग्या भरणे पेरणीनंतर ८-१० दिवसांत पूर्ण करा. जमिनीत पुरेसा ओलावा ठेवा.",
          hi: "बुवाई के 10 दिनों के भीतर गैप फिलिंग करें। खेत में नमी बनाए रखें।"
        },
        irrigation: {
          en: "Light irrigation if rains delayed more than 7 days after sowing.",
          mr: "पेरणीनंतर पाऊस लांबल्यास हलके संरक्षक पाणी द्या.",
          hi: "यदि बारिश न हो तो हल्का जीवनरक्षक पानी दें।"
        },
        nutrition: {
          en: "Apply 20% Nitrogen, 100% Phosphorus, and 100% Potash as basal dose.",
          mr: "पेरणीच्या वेळी २०% नत्र, १००% स्फुरद व १००% पालाश खताचा बेसल डोस द्या.",
          hi: "बुवाई के समय 20% नाइट्रोजन, 100% फास्फोरस व 100% पोटाश का बेसल डोज दें।"
        },
        potentialPests: ["thrips", "aphids"]
      },
      {
        id: "vegetative",
        name: { en: "Vegetative Growth & Square Formation", mr: "शाकीय वाढ व पाते लागणे", hi: "वानस्पतिक वृद्धि एवं कलियां" },
        startDay: 16,
        endDay: 50,
        description: {
          en: "Rapid root branching, leaf canopy expansion, and appearance of floral buds (squares).",
          mr: "फांद्यांची जोरदार वाढ, हिरवीगार पाने व पाते लागण्यास सुरुवात.",
          hi: "शाखाओं का तेजी से विकास एवं कलियां (स्क्वायर) बनना शुरू।"
        },
        advisory: {
          en: "Inter-cultivation (hoeing/weeding) at 20 and 40 days to aerate roots and eliminate weed hosts.",
          mr: "पेरणीनंतर २० व ४० दिवसांनी डवरणी करून तण नष्ट करा व हवा खेळती ठेवा.",
          hi: "बुवाई के 20 और 40 दिन बाद निराई-गुड़ाई कर खरपतवार साफ रखें।"
        },
        irrigation: {
          en: "Irrigate at 12-15 day intervals depending on rainfall.",
          mr: "जमिनीच्या मगदूरानुसार १२-१५ दिवसांच्या अंतराने पाणी द्या.",
          hi: "आवश्यकता अनुसार 12-15 दिनों के अंतराल पर सिंचाई करें।"
        },
        nutrition: {
          en: "Top-dress 40% Nitrogen (Urea or foliar Nano Urea @ 4ml/L) at 30-35 DAS.",
          mr: "३०-३५ दिवसांनी ४०% नत्र किंवा नॅनो युरिया (४ मि.ली./लिटर) फवारणी करा.",
          hi: "30-35 दिन पर 40% नाइट्रोजन या नैनो यूरिया (4 मिली/लीटर) का पर्णीय छिड़काव करें।"
        },
        potentialPests: ["jassids", "whitefly", "aphids"]
      },
      {
        id: "flowering",
        name: { en: "Flowering & Boll Setting", mr: "फुलोरा व बोंड धारणा", hi: "फूल एवं गूलर निर्माण" },
        startDay: 51,
        endDay: 90,
        description: {
          en: "Peak flowering, pollination, and transformation into young green bolls.",
          mr: "भरपूर पांढरी व पिवळी फुले येणे, परागीभवन होऊन कोवळी बोंडे तयार होणे.",
          hi: "फूलों का खिलना एवं हरे गूलर बनने की प्रमुख अवस्था।"
        },
        advisory: {
          en: "Install 5 pheromone traps per acre for pink bollworm monitoring. Avoid drought stress.",
          mr: "गुलाबी बोंडअळीच्या सर्वेक्षणासाठी एकरी ५ कामगंध सापळे लावा. पाण्याचा ताण पडू देऊ नका.",
          hi: "गुलाबी सुंडी निगरानी हेतु प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। पानी की कमी न होने दें।"
        },
        irrigation: {
          en: "Critical moisture stress stage; maintain consistent soil moisture to prevent square/boll shedding.",
          mr: "अतिसंवेदनशील टप्पा; पाते व बोंड गळ टाळण्यासाठी वेळेवर पाणी द्या.",
          hi: "अत्यंत संवेदनशील अवस्था; फूल व गूलर झड़ने से रोकने हेतु नियमित नमी रखें।"
        },
        nutrition: {
          en: "Foliar spray of 13:00:45 (Potassium Nitrate) @ 10g/L + Planofix @ 0.25ml/L to arrest boll drop.",
          mr: "बोंडगळ रोखण्यासाठी १३:००:४५ (१० ग्रॅम) + प्लॅनोफिक्स (०.२५ मि.ली.) प्रति लिटर फवारा.",
          hi: "13:00:45 (10 ग्राम) + प्लानोफिक्स (0.25 मिली) प्रति लीटर पानी में मिलाकर स्प्रे करें।"
        },
        potentialPests: ["pink_bollworm", "spotted_bollworm", "leaf_reddening"]
      },
      {
        id: "maturity",
        name: { en: "Boll Maturation & Bursting", mr: "बोंड परिपक्वता व फुटणे", hi: "गूलर पकना एवं खिलना" },
        startDay: 91,
        endDay: 135,
        description: {
          en: "Bolls reach maximum size, mature, and open into fluffy white cotton lint.",
          mr: "बोंडे परिपक्व होऊन फुटतात आणि पांढरा शुभ्र कापूस बाहेर पडतो.",
          hi: "गूलर पूरी तरह पककर खिलते हैं और सफेद कपास दिखने लगती है।"
        },
        advisory: {
          en: "Stop nitrogen application. Pick clean, dry cotton in sunny morning hours after dew evaporates.",
          mr: "नत्र देणे बंद करा. सकाळचे दव सुकल्यानंतर स्वच्छ व सुका कापूस वेचणी करा.",
          hi: "ओस सूखने के बाद धूप में साफ-सुथरी कपास की चुनाई करें।"
        },
        irrigation: {
          en: "Taper down irrigation; withhold water 15-20 days prior to final pickings.",
          mr: "पाणी देणे कमी करा; शेवटच्या वेचणीपूर्वी १५-२० दिवस पाणी तोडा.",
          hi: "अंतिम चुनाई से 15-20 दिन पहले सिंचाई बंद कर दें।"
        },
        nutrition: {
          en: "Spray Micronutrient mixture Grade-II @ 2g/L if leaves show premature reddening.",
          mr: "कापूस लाल पडत असल्यास सूक्ष्म अन्नद्रव्य ग्रेड-२ (२ ग्रॅम/लिटर) फवारा.",
          hi: "पत्तियां लाल पड़ने पर सूक्ष्म पोषक तत्व ग्रेड-2 (2 ग्राम/लीटर) का छिड़काव करें।"
        },
        potentialPests: ["pink_bollworm", "mealybug"]
      },
      {
        id: "harvesting",
        name: { en: "Harvesting & Picking", mr: "वेचणी व साठवणूक", hi: "चुनाई एवं भंडारण" },
        startDay: 136,
        endDay: 160,
        description: {
          en: "Multi-stage pickings, sun drying to <8% moisture, and grading for APMC mandi sale.",
          mr: "२-३ टप्प्यांत स्वच्छ वेचणी, उन्हात वाळवणे (आर्द्रता <८%) आणि प्रतवारी करून साठवणूक.",
          hi: "2-3 बार में चुनाई, धूप में सुखाना (नमी <8%) और ग्रेडिंग करके मंडी में भेजना।"
        },
        advisory: {
          en: "Store picked cotton in dry ventilated shed away from fertilizers/fuel. Do not use plastic bags.",
          mr: "कापूस ताडपत्रीवर वाळवा. साठवण्यासाठी प्लॅस्टिक गोण्यांचा वापर टाळा. कोरड्या जागेत ठेवा.",
          hi: "कपास को तिरपाल पर सुखाएं। प्लास्टिक बैग की जगह सूती बोरियों में सूखा भंडारण करें।"
        },
        irrigation: {
          en: "Not required.",
          mr: "पाण्याची गरज नाही.",
          hi: "सिंचाई की आवश्यकता नहीं।"
        },
        nutrition: {
          en: "Harvest complete. Incorporate crop stalks into soil with rotavator to add organic humus.",
          mr: "वेचणीनंतर पराटी रोटाव्हेटरने जमिनीत गाडून सेंद्रिय कर्ब वाढवा.",
          hi: "फसल के अवशेष रोटावेटर से मिट्टी में मिला दें ताकि जैविक खाद बन सके।"
        },
        potentialPests: ["mealybug"]
      }
    ]
  },
  {
    id: "soybean",
    name: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
    scientificName: "Glycine max",
    season: "Kharif",
    typicalDurationDays: 100,
    recommendedNPK: { n: 12, p: 24, k: 12, unit: "kg/acre" },
    recommendedFYM: 3,
    varieties: [
      { name: "JS-335", duration: "95-100 days", yieldQtl: "8-10 qtl/acre", specialFeature: "Standard benchmark variety, wide adaptability" },
      { name: "JS-9305", duration: "90-95 days", yieldQtl: "9-11 qtl/acre", specialFeature: "Early maturing, drought escape" },
      { name: "KDS-726 (Phule Sangam)", duration: "100-105 days", yieldQtl: "12-14 qtl/acre", specialFeature: "High yielding, resistant to rust and stem fly" }
    ],
    stages: [
      {
        id: "sowing",
        name: { en: "Germination & Seedling", mr: "उगवण व रोप अवस्था", hi: "अंकुरण व पौध अवस्था" },
        startDay: 0,
        endDay: 18,
        description: {
          en: "Seed emergence, root nodule formation, and trifoliate leaf expansion.",
          mr: "उगवण, मुळांवर गाठी (रायझोबियम) तयार होणे व पानांची वाढ.",
          hi: "अंकुरण, जड़ों में गांठें (राइजोबियम) बनना व पत्तियां फैलना।"
        },
        advisory: {
          en: "Ensure seed treatment with Rhizobium + PSB @ 25g/kg seed. Sow at 75-100mm soil depth when 75mm rain is received.",
          mr: "पेरणीपूर्वी रायझोबियम व पीएसबी जीवाणू संवर्धक २५ ग्रॅम/किलो चोळा. ७५-१०० मिमी पाऊस पडल्यावरच पेरणी करा.",
          hi: "राइजोबियम व पीएसबी से बीज उपचार करें। पर्याप्त बारिश (75-100 मिमी) होने पर ही बुवाई करें।"
        },
        irrigation: {
          en: "Requires good drainage; avoid waterlogging at seedling stage.",
          mr: "शेतात पाणी साचू देऊ नका; चर काढून अतिरिक्त पाणी बाहेर काढा.",
          hi: "खेत में जलभराव न होने दें, जल निकासी का उचित प्रबंध रखें।"
        },
        nutrition: {
          en: "Apply entire N:P:K (12:24:12 kg/acre) + 8 kg Sulphur at the time of sowing.",
          mr: "पेरणीच्या वेळी पूर्ण नत्र, स्फुरद व पालाश सोबत ८ किलो गंधक (सल्फर) द्या.",
          hi: "बुवाई के समय संपूर्ण नाइट्रोजन, फास्फोरस, पोटाश के साथ 8 किग्रा गंधक दें।"
        },
        potentialPests: ["stem_fly", "girdle_beetle"]
      },
      {
        id: "vegetative",
        name: { en: "Branching & Canopy Growth", mr: "शाकीय वाढ व फांद्या फुटणे", hi: "वानस्पतिक शाखा विस्तार" },
        startDay: 19,
        endDay: 40,
        description: {
          en: "Rapid vegetative branching and canopy closure.",
          mr: "झाडांची जोमदार वाढ व शेतामध्ये झाडांचा हिरवा गालिचा तयार होणे.",
          hi: "पौधे का तेजी से बढ़ना एवं कतारों का आपस में मिलना।"
        },
        advisory: {
          en: "Weed-free period for first 35 days. Hand weeding or selective post-emergence herbicide application.",
          mr: "पहिल्या ३०-३५ दिवसांत तणमुक्त ठेवा. खुरपणी किंवा शिफारशीत तणनाशकाचा वापर करा.",
          hi: "शुरुआती 30-35 दिन खरपतवार नियंत्रण अत्यंत आवश्यक है।"
        },
        irrigation: {
          en: "Moisture conservation with straw mulching if dry spell exceeds 10 days.",
          mr: "पावसात १० दिवसांपेक्षा जास्त खंड पडल्यास संरक्षक पाणी द्या.",
          hi: "यदि बारिश में लंबा अंतराल हो तो स्प्रिंकलर से हल्का पानी दें।"
        },
        nutrition: {
          en: "Foliar spray of 19:19:19 (Water soluble) @ 5g/L at 30 days.",
          mr: "३० दिवसांनी १९:१९:१९ विद्राव्य खत ५ ग्रॅम/लिटर पाण्यात फवारा.",
          hi: "30 दिन बाद 19:19:19 घुलनशील खाद 5 ग्राम/लीटर का पर्णीय छिड़काव करें।"
        },
        potentialPests: ["spodoptera", "semilooper", "whitefly"]
      },
      {
        id: "flowering",
        name: { en: "Flowering & Pod Initiation", mr: "फुलोरा व शेंगा लागणे", hi: "फूल एवं फलियां बनना" },
        startDay: 41,
        endDay: 65,
        description: {
          en: "Appearance of purple/white flowers and initial tiny green pod formation.",
          mr: "जांभळी किंवा पांढरी फुले येणे व बारीक हिरव्या शेंगा धरणे.",
          hi: "फूलों का खिलना और छोटी-छोटी फलियां बनना शुरू होना।"
        },
        advisory: {
          en: "Do not spray toxic contact insecticides during active morning pollinator hours (8 AM - 11 AM).",
          mr: "सकाळी ८ ते ११ या वेळेत मधमाश्या परागीभवन करत असताना तीव्र कीटकनाशक फवारणी टाळा.",
          hi: "सुबह 8 से 11 बजे के बीच मधुमक्खियों के परागण समय कीटनाशक छिड़काव से बचें।"
        },
        irrigation: {
          en: "Critical stage. Moisture stress causes flower drop. Irrigate via sprinkler if dry spell.",
          mr: "अत्यंत संवेदनशील टप्पा; पाण्याचा ताण पडल्यास फुले गळतात. तुषार सिंचनाने पाणी द्या.",
          hi: "फूल आते समय पानी की कमी न होने दें अन्यथा फूल गिर जाएंगे।"
        },
        nutrition: {
          en: "Foliar spray of 00:52:34 @ 5g/L + Boron @ 1g/L for better pod set.",
          mr: "००:५२:३४ (५ ग्रॅम) + बोरॉन (१ ग्रॅम) प्रति लिटर फवारल्यास शेंगांची संख्या वाढते.",
          hi: "00:52:34 (5 ग्राम) + बोरॉन (1 ग्राम) प्रति लीटर पानी में मिलाकर स्प्रे करें।"
        },
        potentialPests: ["pod_borer", "rust", "yellow_mosaic"]
      },
      {
        id: "maturity",
        name: { en: "Pod Filling & Seed Swelling", mr: "दाणे भरणे व परिपक्वता", hi: "दाना भराव एवं परिपक्वता" },
        startDay: 66,
        endDay: 85,
        description: {
          en: "Grains fill inside pods, leaves turn golden yellow and begin shedding naturally.",
          mr: "शेंगांमध्ये दाणे टपोरे भरतात, पाने पिवळी पडून नैसर्गिकरीत्या गळू लागतात.",
          hi: "फलियों में दाने भरते हैं और पत्तियां पीली पड़कर गिरने लगती हैं।"
        },
        advisory: {
          en: "Monitor for rust pustules on lower leaves. Avoid excess nitrogen to prevent lodging.",
          mr: "पानांवरील तांबेरा रोगाचे निरीक्षण करा. पीक लोळू नये म्हणून जास्त पाणी देणे टाळा.",
          hi: "निचली पत्तियों पर रतुआ रोग की जांच करें।"
        },
        irrigation: {
          en: "Maintain light moisture until pods turn golden brown.",
          mr: "शेंगांचा रंग पिवळसर-तपकिरी होईपर्यंत हलका ओलावा ठेवा.",
          hi: "फलियां भूरी होने तक हल्की नमी बनाए रखें।"
        },
        nutrition: {
          en: "Foliar spray of 00:00:50 (Potassium Sulphate) @ 5g/L for shiny, plump grains.",
          mr: "दाण्यांचा आकार व वजन वाढवण्यासाठी ००:००:५० (५ ग्रॅम/लिटर) फवारा.",
          hi: "दानों की चमक व वजन बढ़ाने हेतु 00:00:50 (5 ग्राम/लीटर) स्प्रे करें।"
        },
        potentialPests: ["pod_blight", "charcoal_rot"]
      },
      {
        id: "harvesting",
        name: { en: "Harvesting & Threshing", mr: "कापणी व मळणी", hi: "कटाई एवं गहाई" },
        startDay: 86,
        endDay: 100,
        description: {
          en: "Leaves completely shed, pods rattle when shaken. Moisture drops to 13-14%.",
          mr: "झाडाची सर्व पाने गळतात, शेंगा हलवल्यास दाण्यांचा आवाज येतो. कापणीयोग्य अवस्था.",
          hi: "फलियां हिलाने पर दाने बजने लगें और नमी 13% पर आ जाए तो कटाई करें।"
        },
        advisory: {
          en: "Harvest promptly when pods are dry to prevent pod shattering. Thresh at 350-400 RPM drum speed.",
          mr: "शेंगा फुटून नुकसान होऊ नये म्हणून वेळेवर कापणी करा. मळणी यंत्राचा वेग ३५०-४०० आरपीएम ठेवा.",
          hi: "फलियां चटकने से पहले सुबह या शाम कटाई करें ताकि दाना न बिखरे।"
        },
        irrigation: {
          en: "Nil.",
          mr: "गरज नाही.",
          hi: "आवश्यकता नहीं।"
        },
        nutrition: {
          en: "Incorporate root nodules into soil for natural nitrogen enrichment for following Rabi wheat/gram.",
          mr: "सोयाबीनची मुळे जमिनीतच कुजू द्या, पुढील रब्बी हरभरा/गव्हाला नैसर्गिक नत्र मिळते.",
          hi: "जड़ों को मिट्टी में जोत दें ताकि अगली रबी फसल को जैविक नाइट्रोजन मिले।"
        },
        potentialPests: ["storage_weevil"]
      }
    ]
  },
  {
    id: "onion",
    name: { en: "Onion", mr: "कांदा", hi: "प्याज" },
    scientificName: "Allium cepa",
    season: "Rabi",
    typicalDurationDays: 130,
    recommendedNPK: { n: 40, p: 20, k: 25, unit: "kg/acre" },
    recommendedFYM: 8,
    varieties: [
      { name: "Bhima Super", duration: "110-120 days", yieldQtl: "120-140 qtl/acre", specialFeature: "Excellent red bulbs, suitable for Late Kharif & Rabi" },
      { name: "Bhima Kiran", duration: "125-130 days", yieldQtl: "130-150 qtl/acre", specialFeature: "Outstanding storage quality (5-6 months), export quality" },
      { name: "Phule Samarth", duration: "120-130 days", yieldQtl: "140-160 qtl/acre", specialFeature: "Dark red, high TSS (Total Soluble Solids)" }
    ],
    stages: [
      {
        id: "transplanting",
        name: { en: "Nursery & Transplanting", mr: "रोपवाटिका व पुनर्लागवड", hi: "नर्सरी एवं रोपाई" },
        startDay: 0,
        endDay: 20,
        description: {
          en: "6-7 week old healthy seedlings transplanted onto raised or flat beds.",
          mr: "६-७ आठवड्यांची निरोगी रोपे गादीवाफ्यावर किंवा सपाट वाफ्यात १५x१० सेमी अंतरावर पुनर्लागवड करणे.",
          hi: "6-7 सप्ताह के स्वस्थ पौधों की 15x10 सेमी की दूरी पर रोपाई।"
        },
        advisory: {
          en: "Dip seedling roots in Carbendazim (1g/L) + Chlorpyrifos (2ml/L) slurry for 15 minutes prior to planting.",
          mr: "पुनर्लागवडीपूर्वी रोपांची मुळे कार्बेन्डाझिम (१ ग्रॅम) + क्लोरपायरीफॉस (२ मि.ली./लिटर) द्रावणात बुडवून लावा.",
          hi: "रोपाई से पहले जड़ों को फफूंदनाशक व कीटनाशक घोल में 15 मिनट डुबोएं।"
        },
        irrigation: {
          en: "Immediate light irrigation on transplanting day followed by establishment irrigation on day 3.",
          mr: "लागवडीनंतर लगेच हलके पाणी व तिसऱ्या दिवशी आंबवणीचे पाणी द्या.",
          hi: "रोपाई के तुरंत बाद पहली सिंचाई और तीसरे दिन दूसरा पानी दें।"
        },
        nutrition: {
          en: "Apply 50% Nitrogen, 100% Phosphorus, 100% Potash, and 15 kg Sulphur as basal.",
          mr: "लागवडीवेळी ५०% नत्र, १००% स्फुरद, १००% पालाश व १५ किलो गंधक द्या.",
          hi: "रोपाई के समय 50% नाइट्रोजन, 100% फास्फोरस, पोटाश व 15 किग्रा गंधक दें।"
        },
        potentialPests: ["thrips", "damping_off"]
      },
      {
        id: "vegetative",
        name: { en: "Foliage & Root Establishment", mr: "शाकीय वाढ व मुळांची पकड", hi: "वानस्पतिक बढ़वार" },
        startDay: 21,
        endDay: 60,
        description: {
          en: "Active leaf blade formation. Up to 8-10 erect green leaves formed.",
          mr: "पानांची जोमदार वाढ होऊन ८-१० गर्द हिरवी पाने तयार होतात.",
          hi: "पौधे का विकास, 8-10 स्वस्थ हरी पत्तियों का निर्माण।"
        },
        advisory: {
          en: "Keep field weed-free during first 45 days. Spray for thrips if nymph count exceeds 15 per plant.",
          mr: "पहिल्या ४५ दिवसांत शेत तणमुक्त ठेवा. प्रति झाड १५ पेक्षा जास्त फुलकिडे (थ्रिप्स) दिसल्यास फवारणी करा.",
          hi: "शुरुआती 45 दिन खेत तणमुक्त रखें। थ्रिप्स दिखने पर तुरंत छिड़काव करें।"
        },
        irrigation: {
          en: "Irrigate every 7-10 days depending on soil type. Drip irrigation saves 40% water.",
          mr: "जमिनीनुसार ७-१० दिवसांच्या अंतराने पाणी द्या. ठिबक सिंचनाने पाण्याची ४०% बचत होते.",
          hi: "7-10 दिनों के अंतराल पर हल्की सिंचाई करें। ड्रिप सबसे उत्तम है।"
        },
        nutrition: {
          en: "Top-dress remaining 50% Nitrogen at 30-35 days after transplanting.",
          mr: "लागवडीनंतर ३०-३५ दिवसांनी उरलेले ५०% नत्र देऊन हलके पाणी द्या.",
          hi: "रोपाई के 30-35 दिन बाद शेष 50% नाइट्रोजन देकर पानी दें।"
        },
        potentialPests: ["thrips", "purple_blotch"]
      },
      {
        id: "bulb_development",
        name: { en: "Bulb Development & Swelling", mr: "कांदा पोसणे (कंद फुगवण)", hi: "कंद विकास एवं फुलाव" },
        startDay: 61,
        endDay: 100,
        description: {
          en: "Bulb initiation and rapid radial expansion below soil line.",
          mr: "जमिनीखाली कांद्याची गड्ड्याची फुगवण सुरू होते व कंद मोठा होतो.",
          hi: "जमीन के नीचे प्याज का कंद तेजी से फूलने लगता है।"
        },
        advisory: {
          en: "Do NOT apply nitrogen after 60 days to prevent thick necks (डोंगळे) and poor storage.",
          mr: "लागवडीनंतर ६० दिवसांनंतर नत्र (युरिया) अजिबात देऊ नका; अन्यथा कांद्याची मान जाड होते व टिकत नाही.",
          hi: "60 दिन बाद यूरिया न डालें ताकि प्याज की गर्दन पतली रहे और भंडारण क्षमता बढ़े।"
        },
        irrigation: {
          en: "Maintain even, non-fluctuating moisture. Sudden drying and heavy watering causes bulb splitting.",
          mr: "जमिनीत समप्रमाणात ओलावा ठेवा; पाणी कमी-जास्त झाल्यास कांदे फुटतात (जोड कांदा होतो).",
          hi: "नियमित नमी रखें; पानी में असंतुलन से कंद फटने का डर रहता है।"
        },
        nutrition: {
          en: "Foliar spray of 00:00:50 (Potassium Sulphate) @ 5g/L + Micronutrient boron @ 1g/L.",
          mr: "कांद्याचा आकार, वजन व रंग सुधारण्यासाठी ००:००:५० (५ ग्रॅम) + बोरॉन (१ ग्रॅम/लिटर) फवारा.",
          hi: "00:00:50 (5 ग्राम) + बोरॉन (1 ग्राम) प्रति लीटर पानी में स्प्रे करें।"
        },
        potentialPests: ["purple_blotch", "stemphylium_blight"]
      },
      {
        id: "maturity_harvest",
        name: { en: "Maturity & Curing", mr: "परिपक्वता, काढणी व सुकवणी", hi: "परिपक्वता, खुदाई एवं सुखाना" },
        startDay: 101,
        endDay: 130,
        description: {
          en: "50-70% tops fall naturally (neck break). Outer bulb skin tightens.",
          mr: "५०-७०% कांद्याची पात नैसर्गिकरीत्या मोडते (मान मऊ पडते). काढणीची वेळ.",
          hi: "50-70% पौधों की गर्दन झुककर पत्तियां गिरना शुरू हों तो खुदाई करें।"
        },
        advisory: {
          en: "Stop irrigation 10-15 days before harvest. Cure harvested onions in field shade for 4-5 days.",
          mr: "काढणीपूर्वी १०-१५ दिवस पाणी बंद करा. काढणीनंतर सावलीत ४-५ दिवस पालीसहित वाळवा (क्युअरिंग).",
          hi: "खुदाई से 10-15 दिन पहले सिंचाई रोक दें। निकालने के बाद 4-5 दिन छाया में सुखाएं।"
        },
        irrigation: {
          en: "Strictly cease irrigation.",
          mr: "पाणी पूर्णपणे बंद करा.",
          hi: "सिंचाई पूरी तरह बंद रखें।"
        },
        nutrition: {
          en: "Harvest complete. Treat stored onion storage racks with Carbendazim dusting.",
          mr: "चाळीत साठवणूक करण्यापूर्वी कांदा चाळ जंतुमुक्त करा.",
          hi: "भंडारण से पहले गोदाम/चाली को साफ व हवादार बनाएं।"
        },
        potentialPests: ["black_mold", "neck_rot"]
      }
    ]
  },
  {
    id: "wheat",
    name: { en: "Wheat", mr: "गहू", hi: "गेहूं" },
    scientificName: "Triticum aestivum",
    season: "Rabi",
    typicalDurationDays: 120,
    recommendedNPK: { n: 48, p: 24, k: 16, unit: "kg/acre" },
    recommendedFYM: 4,
    varieties: [
      { name: "HD-2967", duration: "120-125 days", yieldQtl: "20-24 qtl/acre", specialFeature: "High tillering, resistant to leaf rust" },
      { name: "GW-496", duration: "110-115 days", yieldQtl: "18-22 qtl/acre", specialFeature: "Popular in Maharashtra, golden bold grains" },
      { name: "MACS-6222", duration: "105-110 days", yieldQtl: "20-23 qtl/acre", specialFeature: "Heat tolerant, excellent for central zone" }
    ],
    stages: [
      {
        id: "crown_root",
        name: { en: "Crown Root Initiation (CRI)", mr: "मुकुट मुळे फुटणे (CRI)", hi: "मुकुट जड़ निर्माण (CRI)" },
        startDay: 0,
        endDay: 25,
        description: {
          en: "Most critical irrigation stage at 20-22 days after sowing. Anchors wheat plant.",
          mr: "पेरणीनंतर २०-२२ दिवसांनी मुकुट मुळे फुटतात. गव्हाचा सर्वात महत्त्वाचा पाणी देण्याचा टप्पा.",
          hi: "बुवाई के 20-22 दिन बाद मुकुट जड़ें निकलती हैं। सबसे महत्वपूर्ण सिंचाई अवस्था।"
        },
        advisory: {
          en: "Never miss the CRI irrigation. Apply 50% Nitrogen + full P & K as basal.",
          mr: "CRI टप्प्यावर पाणी देणे कधीही चुकवू नका. ५०% नत्र, पूर्ण स्फुरद व पालाश पेरणीवेळी द्या.",
          hi: "CRI अवस्था पर सिंचाई अवश्य करें। 50% नाइट्रोजन व पूरा P-K बुवाई समय दें।"
        },
        irrigation: {
          en: "Mandatory irrigation at 21 DAS.",
          mr: "२१ व्या दिवशी हमखास पाणी द्या.",
          hi: "21वें दिन अनिवार्य सिंचाई।"
        },
        nutrition: {
          en: "Basal application of DAP 50kg + MOP 25kg + Urea 30kg per acre.",
          mr: "एकरी डीएपी ५० किलो + एमओपी २५ किलो + युरिया ३० किलो बेसल डोस द्या.",
          hi: "प्रति एकड़ डीएपी 50 किग्रा + पोटाश 25 किग्रा + यूरिया 30 किग्रा दें।"
        },
        potentialPests: ["termite", "aphids"]
      },
      {
        id: "tillering",
        name: { en: "Tillering & Jointing", mr: "फुटवे फुटणे व कांडी भरणे", hi: "कल्ले फूटना एवं गांठ बनना" },
        startDay: 26,
        endDay: 55,
        description: {
          en: "Shoot branching into productive tillers and stem internode elongation.",
          mr: "गव्हाला भरपूर फुटवे फुटतात आणि कांड्या लांबतात.",
          hi: "पौधे से अनेक कल्ले निकलते हैं और तने में गांठें बनती हैं।"
        },
        advisory: {
          en: "Apply first top-dress of Urea (25kg/acre or Nano Urea spray) at 40-45 DAS.",
          mr: "४०-४५ दिवसांनी २५ किलो युरिया किंवा नॅनो युरिया (४ मि.ली./लिटर) फवारा.",
          hi: "40-45 दिन पर 25 किग्रा यूरिया या नैनो यूरिया का स्प्रे करें।"
        },
        irrigation: {
          en: "Second irrigation at tillering (40-45 DAS) and third at jointing (60-65 DAS).",
          mr: "४०-४५ दिवसांनी दुसरे पाणी आणि ६०-६५ दिवसांनी तिसरे पाणी द्या.",
          hi: "40-45 दिन और 60-65 दिन पर सिंचाई करें।"
        },
        nutrition: {
          en: "Top-dress remaining nitrogen before jointing.",
          mr: "कांडी धरण्यापूर्वी उरलेले नत्र देऊन पाणी द्या.",
          hi: "गांठ बनने से पहले बची हुई नाइट्रोजन दे दें।"
        },
        potentialPests: ["yellow_rust", "powdery_mildew"]
      },
      {
        id: "flowering_milking",
        name: { en: "Booting & Milking", mr: "ओंबी बाहेर पडणे व दूध भरणे", hi: "बाली निकलना एवं दुग्धावस्था" },
        startDay: 56,
        endDay: 95,
        description: {
          en: "Ear head emergence, flowering, and grain filling with milky fluid.",
          mr: "ओंब्या बाहेर पडतात, परागीभवन होऊन दाण्यांमध्ये दूध भरण्यास सुरुवात होते.",
          hi: "बालियां निकलती हैं और दानों में दूधिया रस भरने लगता है।"
        },
        advisory: {
          en: "Monitor for yellow/brown rust. Avoid heavy irrigation during high winds to prevent lodging.",
          mr: "तांबेरा रोगाचे निरीक्षण करा. वादळी वारे असताना पाणी देऊ नका अन्यथा गहू लोळतो.",
          hi: "रतुआ रोग से सावधान रहें। तेज हवा चलने पर पानी न दें।"
        },
        irrigation: {
          en: "Fourth irrigation at flowering (80-85 DAS) and fifth at milk stage (95-100 DAS).",
          mr: "फुलोऱ्याच्या वेळी (८०-८५ दिवस) व दाणे भरताना (९५-१०० दिवस) पाणी द्या.",
          hi: "फूल आते समय और दाना भरते समय हल्की सिंचाई करें।"
        },
        nutrition: {
          en: "Spray 13:00:45 @ 10g/L or Nano DAP @ 4ml/L for heavy grains.",
          mr: "दाणे टपोरे होण्यासाठी १३:००:४५ (१० ग्रॅम/लिटर) फवारा.",
          hi: "13:00:45 (10 ग्राम/लीटर) का स्प्रे करें।"
        },
        potentialPests: ["yellow_rust", "aphids", "loose_smut"]
      },
      {
        id: "maturity_harvest",
        name: { en: "Dough Stage & Harvesting", mr: "दाणे कडक होणे व कापणी", hi: "दाना पकना एवं कटाई" },
        startDay: 96,
        endDay: 120,
        description: {
          en: "Grains harden, straw turns golden yellow, moisture drops to 12%.",
          mr: "दाणे कडक होतात, गव्हाची झाडे सोनेरी पिवळी पडतात. कापणीयोग्य अवस्था.",
          hi: "दाना कड़क हो जाता है और पौधा सुनहरा पीला पड़ जाता है।"
        },
        advisory: {
          en: "Harvest using combine harvester or sickle when grain is hard and dry.",
          mr: "दाण्यांमध्ये ओलावा १२% खाली आल्यावर कंबाइन हार्वेस्टरने किंवा विळ्याने कापणी करा.",
          hi: "दाने में 12% से कम नमी होने पर हार्वेस्टर से कटाई करें।"
        },
        irrigation: {
          en: "Nil.",
          mr: "गरज नाही.",
          hi: "आवश्यकता नहीं।"
        },
        nutrition: {
          en: "Nil.",
          mr: "काहीही नाही.",
          hi: "कुछ नहीं।"
        },
        potentialPests: ["storage_weevil"]
      }
    ]
  }
];

// ============================================================================
// 2. STAGE-WISE PEST & DISEASE FOREWARNING DATABASE
// ============================================================================
export const PEST_DISEASE_DB: PestDiseaseGuide[] = [
  {
    id: "pink_bollworm",
    cropId: "cotton",
    cropName: { en: "Cotton", mr: "कापूस", hi: "कपास" },
    name: { en: "Pink Bollworm", mr: "गुलाबी बोंडअळी", hi: "गुलाबी सुंडी" },
    scientificName: "Pectinophora gossypiella",
    type: "pest",
    stageIds: ["flowering", "maturity"],
    severity: "severe",
    symptoms: {
      en: "Rosetted flowers that do not open, bore holes sealed with frass on bolls, stained damaged lint inside.",
      mr: "गुलाबासारखी बंद राहणारी फुले (रोझेट फ्लॉवर), बोंडांवर बारीक छिद्रे व विष्ठा, बोंड आतून सडणे व कापूस खराब होणे.",
      hi: "गुलाब की तरह बंद फूल, गूलर पर बारीक छेद एवं अंदर का रेशा खराब होना।"
    },
    causes: {
      en: "Larval infestation of Pectinophora gossypiella. Favored by high humidity and continuous monoculture.",
      mr: "पेक्टिनोफोरा गॉसिपिएला पतंगाची अळी. सतत ढगाळ हवामान व एकाच पिकाची लागवड कारणीभूत.",
      hi: "आर्द्र मौसम और लगातार कपास की खेती से कीट का प्रकोप बढ़ता है।"
    },
    preventiveMeasures: {
      en: "Install 5 pheromone traps per acre. Destroy rosette flowers manually. Grow non-Bt refugia belt.",
      mr: "एकरी ५ कामगंध सापळे लावा. रोझेट फुले तोडून नष्ट करा. शेताभोवती नॉन-बीटी पट्टा लावा.",
      hi: "प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं और खराब फूलों को तोड़कर नष्ट करें।"
    },
    curativeChemical: {
      en: "Spray Emamectin Benzoate 5% SG @ 4g/10L water or Chlorantraniliprole 18.5% SC @ 3ml/10L water.",
      mr: "इमामेक्टिन बेन्झोएट ५% SG ४ ग्रॅम किंवा क्लोरॅन्ट्रीनिलीप्रोल १८.५% SC ३ मि.ली. प्रति १० लिटर पाण्यात फवारा.",
      hi: "इमामेक्टिन बेंजोएट 5% SG 4 ग्राम या क्लोरेंट्रानिलीप्रोल 3 मिली प्रति 10 लीटर पानी में स्प्रे करें।"
    },
    curativeOrganic: {
      en: "Release Trichogramma bactrae egg parasitoids @ 60,000/acre. Spray 5% NSKE (Neem Seed Kernel Extract).",
      mr: "ट्रायकोकार्ड्स (ट्रायकोगामा बॅक्ट्री) ६०,००० प्रति एकर सोडा. ५% निंबोळी अर्क फवारा.",
      hi: "ट्राइकोग्रामा परजीवी 60,000 प्रति एकड़ छोड़ें और 5% नीम अर्क का छिड़काव करें।"
    },
    culturalPractices: {
      en: "Terminated crop by December. Do not extend ratoon crop. Shred stalks immediately.",
      mr: "डिसेंबरअखेर फरदड (खोडवा) घेणे टाळा. वेचणीनंतर पराटी लगेच उपटून नष्ट करा.",
      hi: "फरदड़ (रेटून) फसल न लें। कटाई के बाद डंठल नष्ट करें।"
    },
    etlThreshold: "8 moths/trap/night for 3 consecutive days OR 10% damaged green bolls."
  },
  {
    id: "yellow_mosaic",
    cropId: "soybean",
    cropName: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
    name: { en: "Yellow Mosaic Virus (YMV)", mr: "पिवळा मोझॅक व्हायरस", hi: "पीला मोज़ेक वायरस" },
    scientificName: "Mungbean yellow mosaic India virus (MYMIV)",
    type: "disease",
    stageIds: ["vegetative", "flowering"],
    severity: "severe",
    symptoms: {
      en: "Bright yellow mosaic patches intermixed with green on young leaves, leaf curling, stunted plants.",
      mr: "कोवळ्या पानांवर पिवळे व हिरवे चट्टे (मोझॅक नक्षी), पाने आखडणे, झाडांची वाढ खुंटणे व शेंगा न भरणे.",
      hi: "पत्तियों पर पीले-हरे धब्बे, पत्तियों का मुड़ना और पौधों का बौना रह जाना।"
    },
    causes: {
      en: "Geminivirus transmitted rapidly by Whitefly (Bemisia tabaci).",
      mr: "रसशोषक पांढऱ्या माशीमुळे (व्हाईटफ्लाय) हा विषाणू निरोगी झाडांमध्ये वेगाने पसरतो.",
      hi: "सफेद मक्खी (व्हाइटफ्लाई) इस विषाणु को एक पौधे से दूसरे पौधे में फैलाती है।"
    },
    preventiveMeasures: {
      en: "Install 15 yellow sticky traps per acre. Sow YMV-tolerant varieties like KDS-726 or JS-9305.",
      mr: "एकरी १५ पिवळे चिकट सापळे लावा. केडीएस-७२६ सारख्या रोगप्रतिकारक वाणांची निवड करा.",
      hi: "प्रति एकड़ 15 पीले चिपचिपे ट्रैप लगाएं। रोगरोधी किस्मों की बुवाई करें।"
    },
    curativeChemical: {
      en: "Control whitefly vector: Thiamethoxam 25% WG @ 4g/10L or Acetamiprid 20% SP @ 2g/10L water.",
      mr: "पांढरी माशी नियंत्रणासाठी थायामेथोक्साम २५% WG ४ ग्रॅम किंवा ॲसिटामिप्रीड २०% SP २ ग्रॅम प्रति १० लिटर फवारा.",
      hi: "सफेद मक्खी नियंत्रण: थायमेथॉक्सम 25% WG 4 ग्राम प्रति 10 लीटर पानी में स्प्रे करें।"
    },
    curativeOrganic: {
      en: "Spray 10,000 ppm Neem oil @ 2ml/L water or Verticillium lecanii @ 5g/L.",
      mr: "१०,००० पीपीएम निंबोळी तेल २ मि.ली./लिटर किंवा व्हर्टिसिलियम लेकॅनी ५ ग्रॅम/लिटर पाण्यात फवारा.",
      hi: "10,000 ppm नीम तेल 2 मिली प्रति लीटर या जैविक कीटनाशक का छिड़काव करें।"
    },
    culturalPractices: {
      en: "Rogue out and destroy infected plants in early vegetative stage to prevent vector transmission.",
      mr: "सुरुवातीच्या टप्प्यात बाधित झाडे शेतातून उपटून जमिनीत गाडून टाका.",
      hi: "संक्रमित पौधों को तुरंत उखाड़कर नष्ट करें ताकि स्वस्थ फसल बची रहे।"
    },
    etlThreshold: "5-10 whiteflies per leaf on middle canopy."
  },
  {
    id: "purple_blotch",
    cropId: "onion",
    cropName: { en: "Onion", mr: "कांदा", hi: "प्याज" },
    name: { en: "Purple Blotch & Thrips Complex", mr: "जांभळा करपा व फुलकिडे", hi: "बैंगनी धब्बा एवं थ्रिप्स" },
    scientificName: "Alternaria porri & Thrips tabaci",
    type: "disease",
    stageIds: ["vegetative", "bulb_development"],
    severity: "moderate",
    symptoms: {
      en: "Water-soaked lesions on leaves turning purplish-brown with concentric rings, drying from tip downwards.",
      mr: "पानांवर लंबगोलाकार जांभळट-तपकिरी रंगाचे डाग, पानांचे शेंडे करपणे आणि पाने वाळणे.",
      hi: "पत्तियों पर बैंगनी-भूरे रंग के धब्बे, पत्तियों के सिरे सूखना और पीला पड़ना।"
    },
    causes: {
      en: "Fungal infection (Alternaria porri) favored by morning dew, fog, and thrips feeding punctures.",
      mr: "अल्टरनेरिया बुरशी. सकाळी धुके, दव व फुलकिड्यांनी (थ्रिप्स) पानांवर केलेल्या जखमांमुळे रोग वाढतो.",
      hi: "कोहरा, ओस और थ्रिप्स द्वारा पत्तियों को खुरचने से फफूंद का संक्रमण बढ़ता है।"
    },
    preventiveMeasures: {
      en: "Maintain proper drainage, avoid overhead sprinkler in foggy weather, add sticker (स्प्रेडर) in all sprays.",
      mr: "पाण्याचा उत्तम निचरा ठेवा. धुके असताना फवारणीत नेहमी चांगला स्टिकर/स्प्रेडर वापरा.",
      hi: "उचित जल निकासी रखें। फफूंदनाशक स्प्रे में हमेशा चिपकने वाला पदार्थ (स्टिकर) मिलाएं।"
    },
    curativeChemical: {
      en: "Fungicide: Difenoconazole 25% EC @ 1ml/L OR Tebuconazole + Trifloxystrobin @ 1g/L water.",
      mr: "डायफेनोकोनॅझोल २५% EC १ मि.ली. किंवा टेबुकोनॅझोल + ट्रायफ्लॉक्सीस्ट्रॉबिन १ ग्रॅम प्रति लिटर पाण्यात फवारा.",
      hi: "डाइफेनोकोनाजोल 25% EC 1 मिली प्रति लीटर या टेबुकोनाजोल 1 ग्राम प्रति लीटर स्प्रे करें।"
    },
    curativeOrganic: {
      en: "Trichoderma harzianum @ 5g/L + 5% Dashparni ark for biological suppression.",
      mr: "ट्रायकोडर्मा हार्झियानम ५ ग्रॅम + ५% दशपर्णी अर्क फवारा.",
      hi: "ट्राइकोडर्मा 5 ग्राम + 5% दशपर्णी अर्क का पर्णीय छिड़काव करें।"
    },
    culturalPractices: {
      en: "Rotate with non-allium crops (Maize, Sorghum). Burn diseased crop residues.",
      mr: "कांद्यानंतर मका किंवा ज्वारीसारखी पिके घेऊन पीकपालट करा.",
      hi: "प्याज के बाद मक्का या ज्वार की फसल चक्र अपनाएं।"
    },
    etlThreshold: "15 thrips/plant or 5% foliage covered with purple lesions."
  },
  {
    id: "yellow_rust",
    cropId: "wheat",
    cropName: { en: "Wheat", mr: "गहू", hi: "गेहूं" },
    name: { en: "Stripe Rust / Yellow Rust", mr: "पिवळा तांबेरा", hi: "पीला रतुआ" },
    scientificName: "Puccinia striiformis",
    type: "disease",
    stageIds: ["tillering", "flowering_milking"],
    severity: "severe",
    symptoms: {
      en: "Bright yellow pustules arranged in parallel linear stripes along leaf veins; yellow powder on fingers.",
      mr: "पानांवर शिरांना समांतर पिवळ्या रंगाच्या ओळी (रेषा) तयार होतात; बोटाला पिवळी पावडर (बिजाणू) लागते.",
      hi: "पत्तियों पर पीले रंग की धारियां, उंगलियों से छूने पर पीला पाउडर लगना।"
    },
    causes: {
      en: "Fungal pathogen Puccinia striiformis; thrives under temperatures of 10-18°C with high relative humidity.",
      mr: "पुक्सिनिया स्ट्रायफॉर्मिस बुरशी. १०-१८ अंश से. तापमान व सकाळी जास्त आर्द्रतेत हा रोग झपाट्याने पसरतो.",
      hi: "शीत लहर, 10-18 डिग्री तापमान और कोहरे के समय यह रोग तेजी से फैलता है।"
    },
    preventiveMeasures: {
      en: "Sow rust-resistant varieties like HD-2967 or GW-496. Strictly monitor northern field borders.",
      mr: "तांबेरा प्रतिकारक वाणांची पेरणी करा. शेताच्या बांधावरील पिकांचे नियमित निरीक्षण करा.",
      hi: "रोगरोधी किस्मों की बुवाई करें। उत्तर दिशा की मेड़ों का नियमित मुआयना करें।"
    },
    curativeChemical: {
      en: "Spray Propiconazole 25% EC @ 1ml/L water or Tebuconazole 25.9% EC @ 1ml/L water immediately.",
      mr: "रोगाची लक्षणे दिसताच प्रोपिकोनाझोल २५% EC १ मि.ली. प्रति लिटर पाण्यात मिसळून फवारा.",
      hi: "रोग दिखते ही प्रोपिकोनाजोल 25% EC 1 मिली प्रति लीटर पानी में तुरंत छिड़कें।"
    },
    curativeOrganic: {
      en: "Early preventive spray of bio-fungicide Pseudomonas fluorescens @ 5g/L.",
      mr: "सुरुवातीला स्यूडोमोनास फ्लुरोसन्स ५ ग्रॅम/लिटर पाण्यात मिसळून प्रतिबंधात्मक फवारणी करा.",
      hi: "प्रारंभिक अवस्था में स्यूडोमोनास 5 ग्राम/लीटर का छिड़काव करें।"
    },
    culturalPractices: {
      en: "Avoid late sowing beyond Nov 25. Avoid excessive urea fertilization.",
      mr: "नोव्हेंबरच्या २५ तारखेनंतर उशिरा पेरणी टाळा. जास्त युरिया देणे टाळा.",
      hi: "25 नवंबर के बाद बुवाई न करें और अधिक यूरिया डालने से बचें।"
    },
    etlThreshold: "First appearance of yellow rust stripes on any leaf in the field."
  }
];

// ============================================================================
// 3. MAHARASHTRA & APMC WAREHOUSE DIRECTORY (WDRA & MSWC)
// ============================================================================
export const WAREHOUSE_DIRECTORY: WarehouseItem[] = [
  {
    id: "wh-nsk-01",
    name: "Maharashtra State Warehousing Corp (MSWC) Lasalgaon",
    district: "Nashik",
    taluka: "Niphad",
    address: "Station Road, Near APMC Market Yard, Lasalgaon, Nashik - 422306",
    totalCapacityMT: 25000,
    availableCapacityMT: 6200,
    type: "Dry Warehouse",
    contactPerson: "Shri. Ramesh Jadhav (Manager)",
    phone: "+91 94222 18920",
    accreditedBy: "MSWC",
    ratesPerQuintalPerMonth: 8.5,
    amenities: ["Electronic Weighbridge", "WDRA e-NWR Loan Eligible", "Scientific Fumigation", "24/7 Security"],
    lat: 20.1481,
    lng: 74.2289
  },
  {
    id: "wh-nsk-02",
    name: "National Cold Storage & Pre-Cooling Hub Pimpalgaon",
    district: "Nashik",
    taluka: "Niphad",
    address: "NH-3, Pimpalgaon Baswant, Nashik - 422209",
    totalCapacityMT: 15000,
    availableCapacityMT: 3400,
    type: "Cold Storage",
    contactPerson: "Sachin More",
    phone: "+91 98230 45671",
    accreditedBy: "WDRA",
    ratesPerQuintalPerMonth: 45.0,
    amenities: ["Temperature Controlled (0-4°C)", "Humidity Control", "Onion & Grape Dedicated", "Back-up Generators"],
    lat: 20.1702,
    lng: 73.9842
  },
  {
    id: "wh-pne-01",
    name: "CWC Central Warehouse Gultekdi Market Yard",
    district: "Pune",
    taluka: "Pune City",
    address: "Gate No. 4, APMC Market Yard, Gultekdi, Pune - 411037",
    totalCapacityMT: 45000,
    availableCapacityMT: 11500,
    type: "Dry Warehouse",
    contactPerson: "A. K. Sharma (Superintendent)",
    phone: "+91 20 2426 8901",
    accreditedBy: "CWC",
    ratesPerQuintalPerMonth: 9.0,
    amenities: ["Direct Mandi Rail Siding", "e-NWR Pledge Finance", "Grain Cleaning & Grading", "Fire Safety Hydrants"],
    lat: 18.4908,
    lng: 73.8687
  },
  {
    id: "wh-pne-02",
    name: "Baramati Agri Logistics Warehousing Hub",
    district: "Pune",
    taluka: "Baramati",
    address: "MIDC Phase II, Rui Road, Baramati, Pune - 413102",
    totalCapacityMT: 20000,
    availableCapacityMT: 5800,
    type: "Dry Warehouse",
    contactPerson: "Dhananjay Pawar",
    phone: "+91 94231 66782",
    accreditedBy: "MSWC",
    ratesPerQuintalPerMonth: 8.0,
    amenities: ["Sugar & Grain Storage", "Automated Conveyors", "Moisture Testing Lab", "Truck Parking Yard"],
    lat: 18.1517,
    lng: 74.5786
  },
  {
    id: "wh-ngp-01",
    name: "MSWC Kalamna Grain & Cotton Warehouse",
    district: "Nagpur",
    taluka: "Nagpur Rural",
    address: "Kalamna Market Yard Road, Nagpur - 440026",
    totalCapacityMT: 35000,
    availableCapacityMT: 8900,
    type: "Dry Warehouse",
    contactPerson: "Vijay Deshmukh",
    phone: "+91 712 268 1142",
    accreditedBy: "MSWC",
    ratesPerQuintalPerMonth: 8.2,
    amenities: ["Cotton Bale Stacking", "Soybean Moisture Test", "e-NAM Integrated", "Pest Proof Plinths"],
    lat: 21.1784,
    lng: 79.1412
  },
  {
    id: "wh-ahd-01",
    name: "Ahmednagar District Co-operative Warehouse",
    district: "Ahmednagar",
    taluka: "Rahuri",
    address: "MPKV Road, Rahuri, Ahmednagar - 413722",
    totalCapacityMT: 18000,
    availableCapacityMT: 4200,
    type: "Dry Warehouse",
    contactPerson: "Sunil Kadam",
    phone: "+91 94215 90123",
    accreditedBy: "WDRA",
    ratesPerQuintalPerMonth: 7.8,
    amenities: ["University Certified Grading", "Subsidized Farmer Rates", "Insurance Coverage Included"],
    lat: 19.3911,
    lng: 74.6521
  },
  {
    id: "wh-aur-01",
    name: "Chhatrapati Sambhajinagar Agri Storage Facility",
    district: "Chhatrapati Sambhajinagar",
    taluka: "Aurangabad",
    address: "Jalna Road, Near Chikalthana MIDC, - 431006",
    totalCapacityMT: 28000,
    availableCapacityMT: 7100,
    type: "Dry Warehouse",
    contactPerson: "Ganesh Shinde",
    phone: "+91 98224 88391",
    accreditedBy: "MSWC",
    ratesPerQuintalPerMonth: 8.5,
    amenities: ["e-NWR Bank Collateral", "Weighbridge 60 MT", "Solar Powered Ventilation"],
    lat: 19.8762,
    lng: 75.3433
  }
];

// ============================================================================
// 4. CUSTOM HIRING CENTRES (CHC - कृषी अवजारे सेवा केंद्र)
// ============================================================================
export const CHC_CENTRES_DB: CHCCentre[] = [
  {
    id: "chc-nsk-01",
    name: "Niphad Taluka Shetkari Sahakari Avajare Bank",
    district: "Nashik",
    taluka: "Niphad",
    village: "Pimpalgaon Baswant",
    contactPerson: "Balasaheb Shinde",
    phone: "+91 94222 71829",
    distanceKm: 4.8,
    lat: 20.1745,
    lng: 73.9876,
    machinery: [
      { type: "Tractor (50 HP 4WD)", model: "Mahindra 575 DI", hourlyRate: 450, dailyRate: 3200, available: true },
      { type: "Rotavator (6 ft)", model: "Shaktiman Regular", hourlyRate: 350, dailyRate: 2400, available: true },
      { type: "Automatic Seed Drill", model: "National 9-Tyne", hourlyRate: 300, dailyRate: 2000, available: true },
      { type: "Multi-Crop Thresher", model: "Punjab Agro 35HP", hourlyRate: 600, dailyRate: 4200, available: false },
      { type: "Agricultural Spray Drone (10L)", model: "Garuda Kisan Drone", hourlyRate: 900, dailyRate: 5500, available: true }
    ]
  },
  {
    id: "chc-nsk-02",
    name: "Dindori Krishi Sanjeevani PoCRA CHC",
    district: "Nashik",
    taluka: "Dindori",
    village: "Dindori",
    contactPerson: "Vishwas Patil",
    phone: "+91 98229 11045",
    distanceKm: 12.3,
    lat: 20.2012,
    lng: 73.8341,
    machinery: [
      { type: "Tractor (45 HP)", model: "Swaraj 744 FE", hourlyRate: 420, dailyRate: 3000, available: true },
      { type: "Subsoiler / Ripper", model: "Fieldking Heavy Duty", hourlyRate: 400, dailyRate: 2800, available: true },
      { type: "Laser Land Leveller", model: "Spectra Precision", hourlyRate: 850, dailyRate: 6000, available: true },
      { type: "Boom Sprayer (Tractor Mounted)", model: "Aspee HTP 400L", hourlyRate: 500, dailyRate: 3500, available: true }
    ]
  },
  {
    id: "chc-pne-01",
    name: "Baramati Agri Development Trust Farm Machinery Hub",
    district: "Pune",
    taluka: "Baramati",
    village: "Malegaon Khurd",
    contactPerson: "Dr. Sandeep Jagtap",
    phone: "+91 2112 255518",
    distanceKm: 8.5,
    lat: 18.1567,
    lng: 74.5721,
    machinery: [
      { type: "Sugarcane Harvester", model: "Shaktiman 3737", hourlyRate: 1800, dailyRate: 14000, available: true },
      { type: "High-Power Tractor (60 HP)", model: "John Deere 5310", hourlyRate: 600, dailyRate: 4500, available: true },
      { type: "Paddy Transplanter", model: "Kubota 4-Row", hourlyRate: 750, dailyRate: 5200, available: true },
      { type: "Round Straw Baler", model: "Class Markant", hourlyRate: 650, dailyRate: 4800, available: true }
    ]
  },
  {
    id: "chc-ngp-01",
    name: "Katol Orange & Cotton Custom Hiring Centre",
    district: "Nagpur",
    taluka: "Katol",
    village: "Katol Town",
    contactPerson: "Prakashrao Raut",
    phone: "+91 94234 19283",
    distanceKm: 15.0,
    lat: 21.2721,
    lng: 78.5872,
    machinery: [
      { type: "Tractor (50 HP)", model: "New Holland 3630", hourlyRate: 480, dailyRate: 3400, available: true },
      { type: "Cotton Shredder (पराटी कटर)", model: "AgroStar Bio-Shredder", hourlyRate: 550, dailyRate: 3800, available: true },
      { type: "Orchard Mist Blower", model: "Mitra Airotec 600", hourlyRate: 600, dailyRate: 4200, available: true },
      { type: "Solar Insect Light Trap (Unit of 5)", model: "PoCRA Solar Trap", hourlyRate: 150, dailyRate: 900, available: true }
    ]
  }
];

// ============================================================================
// 5. GOVERNMENT SCHEMES DIRECTORY (MahaDBT & PoCRA)
// ============================================================================
export const GOVT_SCHEMES_DB: AgriScheme[] = [
  {
    id: "pocra-dbt",
    title: {
      en: "Nanaji Deshmukh Krishi Sanjeevani Prakalp (PoCRA)",
      mr: "नानाजी देशमुख कृषी संजीवनी प्रकल्प (ना.दे.कृ.सं.प्र.)",
      hi: "नानाजी देशमुख कृषि संजीवनी परियोजना (PoCRA)"
    },
    department: "Department of Agriculture, Govt of Maharashtra & World Bank",
    subsidyPercentage: "50% to 75%",
    maxSubsidyAmount: "₹2,50,000",
    description: {
      en: "Climate resilient agriculture project for small & marginal farmers in 5,142 villages across 15 drought-prone districts of Vidarbha & Marathwada.",
      mr: "विदर्भ व मराठवाड्यातील १५ दुष्काळग्रस्त जिल्ह्यांतील ५,१४२ गावांमध्ये हवामान अनुकूल शेतीसाठी थेट लाभ हस्तांतरण (DBT) योजना.",
      hi: "विदर्भ और मराठवाड़ा के 15 जिलों में जलवायु अनुकूल खेती के लिए 50-75% तक की आर्थिक सहायता।"
    },
    eligibility: [
      "Resident of designated PoCRA villages in Maharashtra",
      "Small and marginal farmers holding 7/12 land extract (<5 acres)",
      "Bank account linked with Aadhaar (NPCI active)",
      "Individual farmer or Self Help Group (SHG / FPO)"
    ],
    documentsRequired: [
      "7/12 Land Extract & 8A Extract (नवीन डिजिटल ७/१२)",
      "Aadhaar Card (आधार कार्ड)",
      "Bank Passbook copy with IFSC code (बँक पासबुक)",
      "Caste Certificate (if SC/ST for higher subsidy)",
      "Quotation / Estimate from authorized supplier"
    ],
    applicationProcess: {
      en: "1. Register on mahapocra.gov.in portal. 2. Select component (Farm pond, Drip, Shade net, CHC). 3. Upload 7/12 and bank details. 4. Pre-sanction inspection by Krishi Sahayak. 5. Direct DBT credit after geotagged bill submission.",
      mr: "१. mahapocra.gov.in वर आधार नोंदणी करा. २. घटकाची निवड करा (शेततळे, ठिबक, शेडनेट, अवजारे बँक). ३. कागदपत्रे अपलोड करा. ४. कृषी सहाय्यक पूर्वतपासणी करतील. ५. काम पूर्ण झाल्यावर जिओटॅग करून थेट बँक खात्यात अनुदान जमा.",
      hi: "1. आधिकारिक पोर्टल पर आधार से लॉगिन करें। 2. घटक चुनें। 3. दस्तावेज अपलोड करें। 4. भौतिक सत्यापन के बाद सीधे खाते में अनुदान।"
    },
    officialLink: "https://dbt-ndksp.mahapocra.gov.in/",
    isPoCRA: true,
    status: "Active"
  },
  {
    id: "namo-shetkari",
    title: {
      en: "Namo Shetkari Mahasanman Nidhi Yojana",
      mr: "नमो शेतकरी महासन्मान निधी योजना",
      hi: "नमो शेतकारी महासम्मान निधि योजना"
    },
    department: "Agriculture Department, Government of Maharashtra",
    subsidyPercentage: "100% Direct Cash",
    maxSubsidyAmount: "₹6,000 / year",
    description: {
      en: "Supplemental annual financial aid of ₹6,000 given in 3 installments of ₹2,000 each by Maharashtra Govt, in addition to Central PM-Kisan (Total ₹12,000/yr).",
      mr: "केंद्र सरकारच्या पीएम-किसान योजनेच्या ₹६,००० शिवाय महाराष्ट्र शासनाकडून अतिरिक्त ₹६,००० वार्षिक अनुदान (एकूण ₹१२,००० प्रति वर्ष).",
      hi: "महाराष्ट्र सरकार द्वारा प्रति वर्ष ₹6,000 की अतिरिक्त वित्तीय सहायता (पीएम किसान के ₹6,000 के अतिरिक्त)।"
    },
    eligibility: [
      "Eligible beneficiary of PM-Kisan Samman Nidhi in Maharashtra",
      "Completed e-KYC and Aadhaar-seeded bank account",
      "Landholding registered on MahaBhulekh portal"
    ],
    documentsRequired: [
      "Aadhaar Card with mobile linking",
      "PM-Kisan Farmer Registration ID",
      "Aadhaar-seeded bank account statement"
    ],
    applicationProcess: {
      en: "Automatic enrollment for all verified PM-Kisan beneficiaries in Maharashtra. Check status on mahadbt.maharashtra.gov.in.",
      mr: "पीएम-किसान पात्र लाभार्थ्यांना वेगळा अर्ज करण्याची गरज नाही. थेट बँक खात्यात ₹२,००० चे तीन हप्ते जमा होतात.",
      hi: "पीएम-किसान के पंजीकृत किसानों को स्वतः लाभ मिलता है। पोर्टल पर स्थिति देखें।"
    },
    officialLink: "https://mahadbt.maharashtra.gov.in/",
    isPoCRA: false,
    status: "Active"
  },
  {
    id: "pm-kusum-b",
    title: {
      en: "PM-KUSUM Component-B (Solar Agri Pumps)",
      mr: "महाकृषी ऊर्जा अभियान — पीएम-कुसुम सोलर कृषी पंप",
      hi: "पीएम-कुसुम सौर कृषि पंप योजना"
    },
    department: "MEDA (Maharashtra Energy Development Agency) & MNRE",
    subsidyPercentage: "90% to 95%",
    maxSubsidyAmount: "₹2,80,000",
    description: {
      en: "Stand-alone off-grid solar agricultural water pumps (3 HP, 5 HP, 7.5 HP DC/AC) with 90% subsidy for farmers without grid electricity.",
      mr: "वीज जोडणी नसलेल्या शेतकऱ्यांसाठी ३, ५ व ७.५ अश्वशक्तीचे सौर कृषी पंप; शेतकऱ्याला फक्त ५% ते १०% रक्कम भरावी लागते.",
      hi: "कृषि भूमि पर सोलर पंप लगाने हेतु 90% तक सब्सिडी। दिन में सुनिश्चित सिंचाई।"
    },
    eligibility: [
      "Farmland must have verified water source (well, borewell, farm pond, river)",
      "Applicant should not have existing conventional electricity agri pump connection",
      "Individual farmer or water users association"
    ],
    documentsRequired: [
      "7/12 with water source remark (पाण्याचा स्त्रोत नोंद)",
      "No Objection Certificate if shared water source",
      "Aadhaar card & Bank details",
      "Caste Certificate (if SC/ST pays only 5%)"
    ],
    applicationProcess: {
      en: "Apply via Mahavitaran / MEDA solar portal. Select pump capacity based on water depth. Pay 10% beneficiary share online.",
      mr: "महावितरणच्या सोलर पोर्टलवर अर्ज करा. विहिरीच्या खोलीनुसार पंपाची निवड करा. १०% शेतकरी हिस्सा भरल्यावर पंप बसवला जातो.",
      hi: "महावितरण पोर्टल पर ऑनलाइन आवेदन करें और 10% अंशदान जमा करें।"
    },
    officialLink: "https://www.mahadiscom.in/solar-mskvy/",
    isPoCRA: false,
    status: "Active"
  },
  {
    id: "magel-tyala-shettale",
    title: {
      en: "Magel Tyala Shet-tale (Farm Ponds on Demand)",
      mr: "मागेल त्याला शेततळे योजना",
      hi: "मांगने पर खेत तालाब योजना"
    },
    department: "Employment Guarantee Scheme & Agriculture Dept, Maharashtra",
    subsidyPercentage: "Fixed Grant",
    maxSubsidyAmount: "₹75,000 + Plastic Lining Subsidies",
    description: {
      en: "Assistance to construct on-farm rainwater harvesting ponds (30m x 30m x 3m standard size) plus plastic geomembrane lining grant up to ₹1,00,000.",
      mr: "पावसाचे पाणी साठवण्यासाठी ३०x३०x३ मीटर आकाराच्या शेततळ्याच्या खोदकामासाठी ₹७५,००० व प्लॅस्टिक अस्तरीकरणासाठी ₹१,००,००० पर्यंत अनुदान.",
      hi: "खेत में बारिश का पानी इकट्ठा करने के लिए खेत तालाब निर्माण हेतु आर्थिक मदद।"
    },
    eligibility: [
      "Farmer holding minimum 0.60 hectare (1.5 acres) land",
      "Site slope must be technically suitable for rainwater runoff capture"
    ],
    documentsRequired: [
      "Digital 7/12 & 8A extract",
      "Affidavit of not taking earlier farm pond grant",
      "GPS farm location map"
    ],
    applicationProcess: {
      en: "Apply on MahaDBT portal under Farm Pond category. Taluka Krishi Adhikari issues work order. Geotag after excavation.",
      mr: "महाडीबीटी पोर्टलवर शेततळे घटकांतर्गत अर्ज करा. तालुका कृषी अधिकाऱ्यांच्या मंजुरीनंतर काम सुरू करा.",
      hi: "महाडीबीटी पोर्टल पर आवेदन करें और पूर्व-मंजूरी मिलने पर खुदाई शुरू करें।"
    },
    officialLink: "https://mahadbt.maharashtra.gov.in/",
    isPoCRA: true,
    status: "Active"
  }
];

// ============================================================================
// 6. AGRICULTURAL KNOWLEDGE CENTRE & SOPs
// ============================================================================
export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: "sop-soybean",
    title: {
      en: "Standard Operating Procedure (SOP) for High-Yield Soybean",
      mr: "अधिक उत्पादनक्षम सोयाबीन लागवडीची सुधारित कार्यपद्धती (SOP)",
      hi: "अधिक उत्पादन हेतु सोयाबीन खेती की मानक कार्यप्रणाली (SOP)"
    },
    category: "Crop SOP",
    crop: "Soybean",
    readTime: "6 min read",
    publishedDate: "2026-03-15",
    author: "Dr. PDKV Akola Agronomy Directorate",
    summary: {
      en: "Complete package of practices from seed treatment with bio-agents to BBF planting and pod-filling nutrition.",
      mr: "बीजप्रक्रियेपासून ते रुंद वरंबा व सरी (BBF) पद्धत, खत व्यवस्थापन व काढणीपर्यंतची संपूर्ण मार्गदर्शिका.",
      hi: "बीज उपचार, बीबीएफ बुवाई तकनीक और संतुलित उर्वरक प्रबंधन की विस्तृत गाइड।"
    },
    contentSections: [
      {
        heading: "1. Land Preparation & BBF Planting",
        body: "Deep ploughing once in 3 years followed by 2 cross-harrowings. Broad Bed Furrow (BBF) planter creates 120cm beds with 30cm furrows, ensuring 25% moisture conservation in drought and zero waterlogging in heavy downpours."
      },
      {
        heading: "2. Scientific Seed Treatment Sequence (FIR)",
        body: "Follow Fungicide (Trichoderma viride 5g/kg or Thiram 3g/kg) -> Insecticide (Thiamethoxam 30 FS 10ml/kg) -> Rhizobium japonicum + PSB (25g/kg). Dry seeds in shade for 30 minutes before loading in seed drill."
      },
      {
        heading: "3. Hormuz Fertilizer Substitution Strategy",
        body: "Given conventional urea surge (+35%), replace second urea dose with foliar IFFCO Nano Urea liquid (4ml/litre). Apply 19:19:19 at 30 DAS and 00:52:34 at 50 DAS for strong pod numbers."
      }
    ]
  },
  {
    id: "sop-cotton-ipm",
    title: {
      en: "Integrated Pest Management (IPM) for Pink Bollworm in Cotton",
      mr: "कापसावरील गुलाबी बोंडअळीचे एकात्मिक कीड व्यवस्थापन (IPM)",
      hi: "कपास में गुलाबी सुंडी का एकीकृत कीट प्रबंधन (IPM)"
    },
    category: "Pest Management",
    crop: "Cotton",
    readTime: "5 min read",
    publishedDate: "2026-03-20",
    author: "Central Institute for Cotton Research (CICR) Nagpur",
    summary: {
      en: "Step-by-step containment protocol using pheromone traps, bio-agents, and calibrated green-chemistry sprays.",
      mr: "कामगंध सापळे, ट्रायकोकार्ड्स, निंबोळी अर्क व सुरक्षित रासायनिक फवारणीचे वेळापत्रक.",
      hi: "फेरोमोन ट्रैप और जैविक विधियों से गुलाबी सुंडी की रोकथाम की सटीक कार्ययोजना।"
    },
    contentSections: [
      {
        heading: "1. Pheromone Monitoring Network",
        body: "Erect 5 traps per acre at 45 days after sowing. Inspect lures every 3 days. Change pheromone Septa every 21 days for maximum attraction fidelity."
      },
      {
        heading: "2. Economic Threshold Action",
        body: "When catch crosses 8 moths per trap per night for 3 consecutive nights, immediately release Trichogramma bactrae cards @ 60,000/acre. Spray Emamectin Benzoate 5% SG only if green bolls show entry punctures."
      }
    ]
  },
  {
    id: "sop-soil-fertility",
    title: {
      en: "Decoding Soil Health Card: Balancing N-P-K & Micronutrients",
      mr: "मृदा आरोग्य पत्रिका समजून घ्या: सेंद्रिय कर्ब व सूक्ष्म अन्नद्रव्ये",
      hi: "मृदा स्वास्थ्य कार्ड को समझें: संतुलित पोषण प्रबंधन"
    },
    category: "Crop SOP",
    readTime: "7 min read",
    publishedDate: "2026-03-25",
    author: "MPKV Rahuri Soil Science Dept",
    summary: {
      en: "How to interpret pH, Electrical Conductivity (EC), Organic Carbon (OC), and apply only what soil truly lacks.",
      mr: "सामू (pH), क्षारता, सेंद्रिय कर्ब आणि खतांचा अपव्यय टाळून उत्पादन खर्च कमी करण्याचे तंत्र.",
      hi: "मिट्टी जांच के आधार पर खाद की सही मात्रा निर्धारित करने की वैज्ञानिक विधि।"
    },
    contentSections: [
      {
        heading: "1. Organic Carbon: The Lifeblood of Soil",
        body: "Ideal soil organic carbon is >0.75%. Below 0.40% requires adding 4 tonnes farmyard manure (FYM) or green manuring with Sunnhemp (ताग) / Dhaincha before Kharif sowing."
      },
      {
        heading: "2. Correcting Alkaline Black Soils",
        body: "Soils with pH >8.2 lock up phosphorus and iron. Apply agricultural gypsum @ 500kg/acre and mix Single Super Phosphate (SSP) instead of DAP to supply accessible calcium and sulphur."
      }
    ]
  }
];

// ============================================================================
// 7. EXPERT QUESTIONS & ANSWERS (EXPERTS CORNER)
// ============================================================================
export const EXPERT_QA_LIST: ExpertQA[] = [
  {
    id: "qa-001",
    question: {
      en: "My onion leaves are turning purple-yellow from the tips with small white dots. What should I spray?",
      mr: "माझ्या कांद्याची पात शेंड्याकडून जांभळी-पिवळी पडून करपतेय आणि त्यावर बारीक पांढरे ठिपके दिसत आहेत. काय उपाय करावा?",
      hi: "मेरी प्याज की पत्तियों के सिरे पीले-बैंगनी पड़कर सूख रहे हैं। क्या छिड़काव करें?"
    },
    askedBy: "Dnyaneshwar Shinde",
    location: "Niphad, Nashik",
    date: "2026-03-26",
    crop: "Onion",
    status: "Answered",
    expertName: "Dr. B. R. Patil",
    expertTitle: "Senior Plant Pathologist, KVK Baramati",
    answer: {
      en: "This is Purple Blotch induced by Thrips damage. First, spray Fipronil 5% SC (2ml/L) + Difenoconazole 25% EC (1ml/L) with a non-ionic spreader (0.5ml/L). Repeat after 10 days if foggy conditions persist.",
      mr: "हा फुलकिडे (थ्रिप्स) आणि जांभळा करपा रोगाचा संयुक्त प्रादुर्भाव आहे. उपाय: फिप्रोनिल ५% SC (२ मि.ली.) + डायफेनोकोनॅझोल २५% EC (१ मि.ली.) प्रति लिटर पाण्यात स्टिकर टाकून फवारा. धुक्याचे वातावरण असल्यास १० दिवसांनी दुसरी फवारणी करा.",
      hi: "यह थ्रिप्स और बैंगनी धब्बा रोग का लक्षण है। फिप्रोनिल 5% SC 2 मिली + डाइफेनोकोनाजोल 1 मिली प्रति लीटर पानी में स्टिकर मिलाकर तुरंत छिड़कें।"
    },
    upvotes: 42
  },
  {
    id: "qa-002",
    question: {
      en: "Due to fertilizer price hikes, can I substitute chemical urea completely with Nano Urea for wheat?",
      mr: "युरिया महाग झाल्यामुळे गव्हासाठी रासायनिक युरियाऐवजी पूर्णपणे नॅनो युरिया वापरता येईल का?",
      hi: "यूरिया महंगा होने के कारण क्या गेहूं में पारंपरिक यूरिया की जगह पूरी तरह नैनो यूरिया इस्तेमाल कर सकते हैं?"
    },
    askedBy: "Rameshwar Ghadge",
    location: "Karmala, Solapur",
    date: "2026-03-24",
    crop: "Wheat",
    status: "Answered",
    expertName: "Prof. S. M. Ingle",
    expertTitle: "Agronomist, MPKV Rahuri",
    answer: {
      en: "You should NOT eliminate basal soil nitrogen completely. Apply 30% conventional nitrogen at sowing time for early root anchoring. After 30 days, you can substitute 100% of top-dress urea with two sprays of Nano Urea (4ml/L) at tillering and booting stages. This saves 50% cost with equal yield.",
      mr: "पेरणीच्या वेळी मुळे मजबूत होण्यासाठी ३०% पारंपरिक नत्र (युरिया/डीएपी) देणे आवश्यक आहे. त्यानंतर ३०-३५ दिवसांनी फुटवे फुटताना आणि ६० दिवसांनी ओंबी निघताना प्रत्येकी एकदा नॅनो युरिया (४ मि.ली./लिटर) फवारल्यास उर्वरित सर्व युरियाची थेट बचत होते आणि उत्पादन घटत नाही.",
      hi: "बुवाई के समय 30% नाइट्रोजन पारंपरिक खाद से ही दें। उसके बाद 30 और 60 दिन पर नैनो यूरिया (4 मिली/लीटर) का स्प्रे करें। इससे 50% खर्च घटेगा।"
    },
    upvotes: 68
  },
  {
    id: "qa-003",
    question: {
      en: "How can I apply for farm pond subsidy under PoCRA in Vidarbha?",
      mr: "विदर्भातील गावात नानाजी देशमुख पोक्रा अंतर्गत शेततळ्यासाठी अर्ज कसा करावा?",
      hi: "विदर्भ में पोक्रा योजना के तहत खेत तालाब का अनुदान कैसे मिलेगा?"
    },
    askedBy: "Vilas Deshmukh",
    location: "Wardha Rural",
    date: "2026-03-21",
    crop: "Cotton / Soybean",
    status: "Answered",
    expertName: "Shri. Aniket More",
    expertTitle: "District Agri Officer, MahaPoCRA",
    answer: {
      en: "Login to dbt-ndksp.mahapocra.gov.in using Aadhaar OTP. Choose 'Individual Farm Pond'. Upload your digital 7/12. Your Village Agri Assistant (कृषी सहाय्यक) will conduct pre-sanction spot inspection within 7 days. Once approved, excavate, geotag the site, and subsidy up to ₹75,000 will be credited directly to your bank account.",
      mr: "dbt-ndksp.mahapocra.gov.in वर जाऊन आधार ओटीपीने लॉगिन करा. 'वैयक्तिक शेततळे' घटक निवडा. डिजिटल ७/१२ अपलोड करा. गावातील कृषी सहाय्यक ७ दिवसांत जागेची पूर्वतपासणी करतील. मंजुरी मिळाल्यावर काम करून जिओटॅग फोटो अपलोड केल्यावर अनुदान थेट खात्यात जमा होते.",
      hi: "पोक्रा पोर्टल पर आधार से लॉगिन कर 'खेत तालाब' चुनें। कृषि सहायक की पूर्व-समीक्षा के बाद खुदाई कर जिओटैग करें, सब्सिडी सीधे बैंक खाते में आएगी।"
    },
    upvotes: 55
  }
];

// ============================================================================
// 8. FARMER EDUCATION VIDEOS (DIGITAL SHETISHALA - डिजिटल शेतीशाळा)
// ============================================================================
export const SHETISHALA_VIDEOS: VideoTutorial[] = [
  {
    id: "vid-01",
    title: {
      en: "Digital Shetishala: Scientific Nano Urea Dosing & Foliar Spray Guide",
      mr: "डिजिटल शेतीशाळा: नॅनो युरिया व नॅनो डीएपी फवारणीचे योग्य प्रमाण व पद्धत",
      hi: "डिजिटल खेतीशाला: नैनो यूरिया एवं नैनो डीएपी छिड़काव की वैज्ञानिक विधि"
    },
    category: "Digital Shetishala",
    duration: "14:20 min",
    youtubeId: "nano_urea_guide",
    speaker: "Dr. Rameshwar Shinde (IFFCO Scientist)",
    views: "1.2 Lakh",
    thumbnail: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "vid-02",
    title: {
      en: "Live Pest Management: Controlling Pink Bollworm in Bt Cotton",
      mr: "थेट मार्गदर्शन: कापसावरील गुलाबी बोंडअळीचा बंदोबस्त व कामगंध सापळे वापर",
      hi: "गुलाबी सुंडी नियंत्रण एवं फेरोमोन ट्रैप लगाने की सही विधि"
    },
    category: "Pest Control",
    duration: "18:45 min",
    youtubeId: "pink_bollworm_mgmt",
    speaker: "CICR Entomologist Team",
    views: "89K",
    thumbnail: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "vid-03",
    title: {
      en: "Onion Storage Management: Preventing Rot in Bamboo Chawl",
      mr: "कांदा साठवणूक तंत्रज्ञान: चाळीत कांदा सडण्यापासून कसा वाचवावा?",
      hi: "प्याज भंडारण तकनीक: चाली में सड़न से बचाव और 6 माह सुरक्षित रखने का तरीका"
    },
    category: "Digital Shetishala",
    duration: "12:10 min",
    youtubeId: "onion_storage_chawl",
    speaker: "DOGR Pune Post-Harvest Experts",
    views: "2.4 Lakh",
    thumbnail: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "vid-04",
    title: {
      en: "Farmer Success Story: Saving ₹25,000 per Acre with Drip Fertigation & PoCRA",
      mr: "शेतकरी यशोगाथा: ठिबक सिंचन व पोक्रा योजनेतून एकरी २५ हजार रुपयांची बचत",
      hi: "सफल किसान: ड्रिप फर्टिगेशन से लागत में 40% कमी और बंपर पैदावार"
    },
    category: "Farmer Story",
    duration: "09:30 min",
    youtubeId: "farmer_success_drip",
    speaker: "Balasaheb Patil (Progressive Farmer, Baramati)",
    views: "1.8 Lakh",
    thumbnail: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80"
  }
];

// ============================================================================
// 9. AGRICULTURAL MAGAZINES & BULLETINS
// ============================================================================
export const AGRI_MAGAZINES: AgriMagazine[] = [
  {
    id: "mag-01",
    title: {
      en: "Shetkari Magazine (शेतकरी मासिक) — Special Kharif Planning Issue",
      mr: "शेतकरी मासिक — खरीप हंगाम नियोजन विशेषांक",
      hi: "शेतकरी पत्रिका — खरीफ फसल नियोजन विशेषांक"
    },
    issue: "October 2026 Edition",
    publisher: "Directorate of Agriculture, Govt of Maharashtra, Pune",
    publishDate: "2026-10-01",
    coverImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80",
    pdfUrl: "https://krishi.maharashtra.gov.in/shetkari-masik-october-2026.pdf",
    pages: 48,
    topics: ["Kharif Crop Selection", "Biofertilizers", "MahaDBT Schemes", "Agro-Weather Radar"]
  },
  {
    id: "mag-02",
    title: {
      en: "MahaPashudhan Magazine (महापशुधन मासिक) — Dairy & Fodder Management",
      mr: "महापशुधन मासिक — दुग्ध व्यवसाय व हिरवा चारा नियोजन",
      hi: "महापशुधन पत्रिका — डेयरी एवं हरा चारा प्रबंधन"
    },
    issue: "February 2026 Edition",
    publisher: "Animal Husbandry Commissionerate, Maharashtra",
    publishDate: "2026-02-15",
    coverImage: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=300&q=80",
    pdfUrl: "https://ahd.maharashtra.gov.in/mahapashudhan-feb-2026.pdf",
    pages: 36,
    topics: ["Silage Making (मुरघास)", "Fodder Scarcity", "Cattle Vaccination", "KCC Animal Husbandry Loan"]
  },
  {
    id: "mag-03",
    title: {
      en: "Krishi Samvad Bulletin (कृषी संवाद) — Climate Resilient Technologies",
      mr: "कृषी संवाद — हवामान अनुकूल शेती तंत्रज्ञान विशेषांक",
      hi: "कृषि संवाद — जलवायु अनुकूल तकनीक विशेषांक"
    },
    issue: "January 2026 Edition",
    publisher: "MahaPoCRA & WOTR Research Cell",
    publishDate: "2026-01-20",
    coverImage: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=300&q=80",
    pdfUrl: "https://mahapocra.gov.in/krishi-samvad-jan-2026.pdf",
    pages: 40,
    topics: ["PoCRA Impact", "Water Budgeting", "Solar Micro-Pumps", "Soil Health Rehabilitation"]
  }
];

// ============================================================================
// 10. REAL-TIME AGRICULTURAL NOTIFICATIONS & ALERTS
// ============================================================================
export const LIVE_AGRI_NOTIFICATIONS: AgriNotification[] = [
  {
    id: "notif-01",
    type: "weather",
    title: {
      en: "Agromet Alert: Heatwave & Sudden Thunderstorm Warning",
      mr: "हवामान इशारा: नाशिक व पुणे भागात उष्णतेची लाट व अवकाळी पावसाची शक्यता",
      hi: "मौसम चेतावनी: नासिक व पुणे क्षेत्र में लू एवं गरज के साथ छींटे पड़ने की संभावना"
    },
    description: {
      en: "Day temperatures expected to cross 41°C. Provide light sprinkler irrigation in evening to sensitive crops like onion and vegetables.",
      mr: "तापमान ४१ अंशांच्या पुढे जाण्याची शक्यता. कांदा व भाजीपाला पिकांची उन्हापासून काळजी घेण्यासाठी संध्याकाळी हलके पाणी द्या.",
      hi: "तापमान 41 डिग्री से ऊपर जाने की आशंका। शाम को सब्जियों में हल्की सिंचाई करें।"
    },
    timestamp: "2026-10-28T10:30:00Z",
    severity: "warning",
    actionUrl: "/weather",
    isRead: false
  },
  {
    id: "notif-02",
    type: "pest",
    title: {
      en: "Pest Forewarning: Pink Bollworm Monitoring Required",
      mr: "कीड इशारा: विदर्भातील कापूस पट्ट्यात गुलाबी बोंडअळी सर्वेक्षण",
      hi: "कीट चेतावनी: कपास में गुलाबी सुंडी का प्रकोप, निगरानी आवश्यक"
    },
    description: {
      en: "CICR has advised farmers to check pheromone traps. If moth catch crosses 8/night, initiate Emamectin Benzoate spray.",
      mr: "कामगंध सापळ्यांचे निरीक्षण करा. सलग ३ रात्री ८ पेक्षा जास्त पतंग आढळल्यास शिफारशीत फवारणी करा.",
      hi: "फेरोमोन ट्रैप चेक करें और कीट संख्या बढ़ने पर कीटनाशक स्प्रे करें।"
    },
    timestamp: "2026-10-27T15:45:00Z",
    severity: "alert",
    actionUrl: "/scanner",
    isRead: false
  },
  {
    id: "notif-03",
    type: "mandi",
    title: {
      en: "Mandi Price Surge: Lasalgaon Onion Modal Rate Crosses ₹2,150",
      mr: "बाजारभाव तेजी: लासलगाव बाजार समितीत उन्हाळ कांदा ₹२,१५०/क्विंटल पार",
      hi: "मंडी तेजी: लासलगांव में प्याज का भाव ₹2,150/क्विंटल पहुंचा"
    },
    description: {
      en: "Strong export demand and reduced arrivals. Recommended to sell graded produce in staggered lots.",
      mr: "चांगल्या प्रतीच्या कांद्याला बाजारात उठाव. प्रतवारी करून टप्प्याटप्प्याने माल विकावा.",
      hi: "अच्छी गुणवत्ता वाले माल को छांटकर अच्छे भाव में बेचें।"
    },
    timestamp: "2026-10-26T11:20:00Z",
    severity: "info",
    actionUrl: "/market",
    isRead: true
  },
  {
    id: "notif-04",
    type: "scheme",
    title: {
      en: "MahaDBT Solar Pump (PM-KUSUM) Slot Booking Open",
      mr: "महाकृषी ऊर्जा अभियान: सोलर कृषी पंप ऑनलाइन स्लॉट सुरू",
      hi: "सोलर कृषि पंप योजना: नए ऑनलाइन आवेदन शुरू"
    },
    description: {
      en: "Government has opened 25,000 new solar pump quota for Maharashtra farmers. Apply before December 31, 2026.",
      mr: "महाराष्ट्र शासनातर्फे २५,००० नवीन सौर पंपांचा कोटा खुला. ३१ डिसेंबर २०२६ पूर्वी ऑनलाइन अर्ज करा.",
      hi: "25,000 नए सोलर पंप हेतु आवेदन आमंत्रित। अंतिम तिथि 31 दिसंबर 2026।"
    },
    timestamp: "2026-10-25T09:00:00Z",
    severity: "info",
    actionUrl: "/schemes",
    isRead: true
  }
];
