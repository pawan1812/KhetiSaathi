export interface CommodityRate {
  id: string;
  name: { mr: string; hi: string; en: string };
  modalPrice: number; // ₹ per quintal
  minPrice: number;
  maxPrice: number;
  arrivalsQtl: number;
  trend: "up" | "down" | "stable";
  trendAmount: number;
}

export interface APMCMandi {
  id: string;
  name: { mr: string; hi: string; en: string };
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  commodities: CommodityRate[];
  distanceKm?: number;
}

export const APMC_MANDIS: APMCMandi[] = [
  {
    id: "nagpur_kalamna",
    name: {
      mr: "कळमना कृषी उत्पन्न बाजार समिती, नागपूर",
      hi: "कलमना कृषि उपज मंडी, नागपुर",
      en: "Kalamna APMC Market Yard, Nagpur",
    },
    district: "Nagpur",
    state: "Maharashtra",
    latitude: 21.1738,
    longitude: 79.1364,
    phone: "0712-2680412",
    commodities: [
      {
        id: "soybean",
        name: { mr: "सोयाबीन (पिवळा)", hi: "सोयाबीन (पीला)", en: "Soybean (Yellow)" },
        modalPrice: 4890,
        minPrice: 4500,
        maxPrice: 4980,
        arrivalsQtl: 1420,
        trend: "up",
        trendAmount: 65,
      },
      {
        id: "cotton",
        name: { mr: "मध्यम धागा कापूस", hi: "मध्यम रेशा कपास", en: "Cotton (Medium Staple)" },
        modalPrice: 7420,
        minPrice: 7100,
        maxPrice: 7650,
        arrivalsQtl: 2100,
        trend: "up",
        trendAmount: 110,
      },
      {
        id: "orange",
        name: { mr: "नागपूर संत्रा (मृग बहार)", hi: "नागपुर संतरा", en: "Nagpur Mandarin Orange" },
        modalPrice: 4350,
        minPrice: 3800,
        maxPrice: 4700,
        arrivalsQtl: 880,
        trend: "up",
        trendAmount: 150,
      },
      {
        id: "wheat",
        name: { mr: "शरबती गहू", hi: "शरबती गेहूं", en: "Sharbati Wheat" },
        modalPrice: 2540,
        minPrice: 2425,
        maxPrice: 2680,
        arrivalsQtl: 650,
        trend: "stable",
        trendAmount: 0,
      },
    ],
  },
  {
    id: "katol",
    name: {
      mr: "काटोल कृषी उत्पन्न बाजार समिती",
      hi: "काटोल कृषि उपज मंडी",
      en: "Katol APMC Market Yard",
    },
    district: "Nagpur",
    state: "Maharashtra",
    latitude: 21.2687,
    longitude: 78.5852,
    phone: "07112-222045",
    commodities: [
      {
        id: "orange",
        name: { mr: "नागपूर संत्रा (ग्रेड १)", hi: "नागपुर संतरा (ग्रेड 1)", en: "Nagpur Orange (Grade 1)" },
        modalPrice: 4600,
        minPrice: 4100,
        maxPrice: 4850,
        arrivalsQtl: 1250,
        trend: "up",
        trendAmount: 220,
      },
      {
        id: "soybean",
        name: { mr: "सोयाबीन", hi: "सोयाबीन", en: "Soybean" },
        modalPrice: 4860,
        minPrice: 4450,
        maxPrice: 4940,
        arrivalsQtl: 920,
        trend: "stable",
        trendAmount: 15,
      },
      {
        id: "cotton",
        name: { mr: "कापूस", hi: "कपास", en: "Raw Cotton" },
        modalPrice: 7380,
        minPrice: 7050,
        maxPrice: 7520,
        arrivalsQtl: 1150,
        trend: "up",
        trendAmount: 80,
      },
    ],
  },
  {
    id: "hingna",
    name: {
      mr: "हिंगणा उपबाजार, नागपूर",
      hi: "हिंगणा उपमंडी, नागपुर",
      en: "Hingna Sub-Market, Nagpur",
    },
    district: "Nagpur",
    state: "Maharashtra",
    latitude: 21.0667,
    longitude: 78.9667,
    phone: "07104-242130",
    commodities: [
      {
        id: "cotton",
        name: { mr: "कापूस", hi: "कपास", en: "Cotton" },
        modalPrice: 7350,
        minPrice: 6980,
        maxPrice: 7500,
        arrivalsQtl: 780,
        trend: "down",
        trendAmount: -40,
      },
      {
        id: "soybean",
        name: { mr: "सोयाबीन", hi: "सोयाबीन", en: "Soybean" },
        modalPrice: 4820,
        minPrice: 4400,
        maxPrice: 4910,
        arrivalsQtl: 540,
        trend: "up",
        trendAmount: 30,
      },
    ],
  },
  {
    id: "lasalgaon",
    name: {
      mr: "लासलगाव कृषी उत्पन्न बाजार समिती (कांदा मुख्य बाजार)",
      hi: "लासलगांव कृषि उपज मंडी (एशिया की सबसे बड़ी प्याज मंडी)",
      en: "Lasalgaon APMC (Asia's Largest Onion Market)",
    },
    district: "Nashik",
    state: "Maharashtra",
    latitude: 20.1472,
    longitude: 74.2281,
    phone: "02550-266024",
    commodities: [
      {
        id: "onion",
        name: { mr: "उन्हाळी लाल कांदा", hi: "गर्मी का लाल प्याज", en: "Summer Red Onion" },
        modalPrice: 2350,
        minPrice: 1650,
        maxPrice: 2750,
        arrivalsQtl: 18500,
        trend: "up",
        trendAmount: 120,
      },
      {
        id: "soybean",
        name: { mr: "सोयाबीन", hi: "सोयाबीन", en: "Soybean" },
        modalPrice: 4910,
        minPrice: 4600,
        maxPrice: 5020,
        arrivalsQtl: 1200,
        trend: "up",
        trendAmount: 45,
      },
      {
        id: "wheat",
        name: { mr: "लोकवन गहू", hi: "लोकवन गेहूं", en: "Lokwan Wheat" },
        modalPrice: 2480,
        minPrice: 2425,
        maxPrice: 2620,
        arrivalsQtl: 890,
        trend: "stable",
        trendAmount: 0,
      },
    ],
  },
  {
    id: "pimpalgaon",
    name: {
      mr: "पिंपळगाव बसवंत बाजार समिती",
      hi: "पिंपलगांव बसवंत कृषि मंडी",
      en: "Pimpalgaon Baswant APMC",
    },
    district: "Nashik",
    state: "Maharashtra",
    latitude: 20.1718,
    longitude: 73.9856,
    phone: "02557-221235",
    commodities: [
      {
        id: "onion",
        name: { mr: "कांदा (उत्तम प्रत)", hi: "प्याज (सुपर क्वालिटी)", en: "Red Onion (Export Quality)" },
        modalPrice: 2420,
        minPrice: 1700,
        maxPrice: 2800,
        arrivalsQtl: 14200,
        trend: "up",
        trendAmount: 90,
      },
      {
        id: "tomato",
        name: { mr: "हायब्रिड टोमॅटो", hi: "हाइब्रिड टमाटर", en: "Hybrid Tomato" },
        modalPrice: 1650,
        minPrice: 1200,
        maxPrice: 2100,
        arrivalsQtl: 6500,
        trend: "down",
        trendAmount: -80,
      },
    ],
  },
  {
    id: "amravati",
    name: {
      mr: "अमरावती कृषी उत्पन्न बाजार समिती",
      hi: "अमरावती कृषि उपज मंडी",
      en: "Amravati APMC Market Yard",
    },
    district: "Amravati",
    state: "Maharashtra",
    latitude: 20.9374,
    longitude: 77.7796,
    phone: "0721-2562145",
    commodities: [
      {
        id: "cotton",
        name: { mr: "कापूस", hi: "कपास", en: "Cotton" },
        modalPrice: 7450,
        minPrice: 7100,
        maxPrice: 7680,
        arrivalsQtl: 3200,
        trend: "up",
        trendAmount: 70,
      },
      {
        id: "soybean",
        name: { mr: "सोयाबीन", hi: "सोयाबीन", en: "Soybean" },
        modalPrice: 4875,
        minPrice: 4500,
        maxPrice: 4950,
        arrivalsQtl: 2400,
        trend: "stable",
        trendAmount: 10,
      },
      {
        id: "tur",
        name: { mr: "लाल तूर (अरहर)", hi: "लाल तुअर (अरहर)", en: "Pigeon Pea (Red Tur)" },
        modalPrice: 9850,
        minPrice: 9200,
        maxPrice: 10400,
        arrivalsQtl: 950,
        trend: "up",
        trendAmount: 180,
      },
    ],
  },
  {
    id: "pune_gultekdi",
    name: {
      mr: "पुणे गुलटेकडी कृषी उत्पन्न बाजार समिती",
      hi: "पुणे गुलटेकड़ी कृषि उपज मंडी",
      en: "Pune Gultekdi APMC Yard",
    },
    district: "Pune",
    state: "Maharashtra",
    latitude: 18.4975,
    longitude: 73.8698,
    phone: "020-24263333",
    commodities: [
      {
        id: "onion",
        name: { mr: "कांदा", hi: "प्याज", en: "Onion" },
        modalPrice: 2280,
        minPrice: 1550,
        maxPrice: 2650,
        arrivalsQtl: 11200,
        trend: "stable",
        trendAmount: 20,
      },
      {
        id: "wheat",
        name: { mr: "लोकवन गहू", hi: "गेहूं", en: "Wheat" },
        modalPrice: 2620,
        minPrice: 2450,
        maxPrice: 2850,
        arrivalsQtl: 1450,
        trend: "up",
        trendAmount: 50,
      },
    ],
  },
  {
    id: "indore",
    name: {
      mr: "देवी अहिल्याबाई होळकर मंडी, इंदूर",
      hi: "देवी अहिल्याबाई होल्कर कृषि उपज मंडी, इंदौर",
      en: "Indore APMC Market Yard",
    },
    district: "Indore",
    state: "Madhya Pradesh",
    latitude: 22.7196,
    longitude: 75.8577,
    phone: "0731-2534567",
    commodities: [
      {
        id: "soybean",
        name: { mr: "सोयाबीन (पिवळा)", hi: "सोयाबीन (पीला)", en: "Soybean (Yellow)" },
        modalPrice: 4930,
        minPrice: 4650,
        maxPrice: 5040,
        arrivalsQtl: 16500,
        trend: "up",
        trendAmount: 75,
      },
      {
        id: "wheat",
        name: { mr: "मालवराज गहू", hi: "मालवराज गेहूं", en: "Malavraj Durum Wheat" },
        modalPrice: 2560,
        minPrice: 2425,
        maxPrice: 2720,
        arrivalsQtl: 8400,
        trend: "up",
        trendAmount: 35,
      },
    ],
  },
];

/**
 * Calculate distance in kilometers between two GPS coordinates using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Sort mandis by distance from user's current GPS location
 */
export function getMandisSortedByDistance(
  userLat: number,
  userLon: number
): APMCMandi[] {
  return APMC_MANDIS.map((m) => {
    const dist = calculateHaversineDistance(userLat, userLon, m.latitude, m.longitude);
    return { ...m, distanceKm: dist };
  }).sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
}
