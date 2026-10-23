export interface WeatherData {
  currentTemp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  weatherCode: number;
  weatherDescription: { mr: string; hi: string; en: string };
  city: string;
  dailyForecast: {
    date: string;
    dayName: { mr: string; hi: string; en: string };
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    weatherCode: number;
  }[];
}

export interface CrisisAlert {
  id: string;
  severity: "high" | "medium" | "warning";
  title: { mr: string; hi: string; en: string };
  impact: { mr: string; hi: string; en: string };
  mitigation: { mr: string; hi: string; en: string };
  actionLabel: { mr: string; hi: string; en: string };
  badge: { mr: string; hi: string; en: string };
}

// Built-in Agro-Crisis Database
export const ACTIVE_CRISIS_ALERTS: CrisisAlert[] = [
  {
    id: "hormuz_fertilizer_crisis",
    severity: "high",
    title: {
      mr: "⚠️ हॉर्मुझ आखात खत दरवाढ संकट (युरिया व डीएपी +३५%)",
      hi: "⚠️ होर्मुज जलडमरूमध्य उर्वरक संकट (यूरिया व डीएपी +35%)",
      en: "⚠️ Hormuz Strait Fertilizer Spike (Urea & DAP +35%)",
    },
    impact: {
      mr: "आंतरराष्ट्रीय मालवाहतूक विस्कळीत झाल्याने पारंपरिक युरियाच्या पोत्याचे दर वाढले आहेत. प्रति एकर खत खर्च ३५% ने वाढण्याची शक्यता.",
      hi: "वैश्विक आपूर्ति शृंखला बाधित होने से रासायनिक उर्वरक महंगे हुए हैं। प्रति एकड़ लागत ₹1,500 से ₹4,000 तक बढ़ सकती है।",
      en: "Geopolitical freight bottleneck has disrupted bulk fertilizer imports, escalating conventional bag prices by 35%.",
    },
    mitigation: {
      mr: "१ पारंपरिक ४५ किलो पोत्याऐवजी १ बाटली ५०० मि.ली. इफको नॅनो युरिया (किंमत ₹२२५) पानांवर फवारा. यामुळे एकरी ₹१,२०० ते ₹४,५०० थेट बचत होते आणि पिकाला ८५% नत्र मिळते.",
      hi: "1 बैग पारंपरिक यूरिया के स्थान पर 1 बोतल इफको नैनो यूरिया लिक्विड (₹225) का पर्णीय छिड़काव करें। इससे प्रति एकड़ ₹4,500 तक की सीधी बचत होगी।",
      en: "Substitute granular sacks with IFFCO Nano Urea Liquid (₹225/500ml bottle). Delivers 85% nitrogen absorption and saves ₹1,200 to ₹4,500 per acre.",
    },
    actionLabel: {
      mr: "नॅनो युरिया वापर मार्गदर्शक",
      hi: "नैनो यूरिया छिड़काव गाइड",
      en: "Nano Urea Protocol",
    },
    badge: {
      mr: "खत संकट",
      hi: "खाद संकट",
      en: "Input Crisis",
    },
  },
  {
    id: "unseasonal_rain_hail",
    severity: "medium",
    title: {
      mr: "⛈️ अवकाळी पाऊस व गारपीट पूर्वसूचना",
      hi: "⛈️ बेमौसम बारिश एवं ओलावृष्टि पूर्व चेतावनी",
      en: "⛈️ Unseasonal Rain & Hailstorm Defense Alert",
    },
    impact: {
      mr: "कांदा व गहू काढणीच्या अवस्थेत असताना पाणी साचल्यास सड होण्याची व दाणे काळे पडण्याची दाट शक्यता.",
      hi: "प्याज व गेहूं की कटाई के समय जलभराव से सड़न और दानों की गुणवत्ता खराब होने का खतरा।",
      en: "Sudden precipitation during pod maturity risks fungal rot, lodging, and significant mandi grade discounts.",
    },
    mitigation: {
      mr: "१. शेतातील मुख्य व उपनिचरा चर मोकळे ठेवा.\n२. काढलेला शेतमाल तात्काळ ताडपत्रीने झाका.\n३. पाऊस थांबल्यानंतर बुरशीपासून बचावासाठी कॉपर ऑक्सिक्लोराईड २.५ ग्रॅम/लिटर फवारा.",
      hi: "1. खेत से पानी निकासी की नालियां तुरंत साफ करें।\n2. कटी हुई फसल को तिरपाल से सुरक्षित स्थान पर ढकें।\n3. बारिश थमने पर फफूंदनाशक कॉपर ऑक्सीक्लोराइड 2.5 ग्राम/लीटर का स्प्रे करें।",
      en: "1. Ensure unobstructed drainage trenches across furrows.\n2. Move harvested produce under waterproof tarpaulins.\n3. Spray Copper Oxychloride @ 2.5g/L post-shower to halt spore germination.",
    },
    actionLabel: {
      mr: "आपत्ती निवारण पद्धत",
      hi: "बचाव के उपाय",
      en: "Drainage Protocol",
    },
    badge: {
      mr: "हवामान इशारा",
      hi: "मौसम चेतावनी",
      en: "Weather Alert",
    },
  },
  {
    id: "thermal_heatwave",
    severity: "warning",
    title: {
      mr: "☀️ कडक ऊन व उष्णतेची लाट (तापमान > ३८°C)",
      hi: "☀️ भीषण गर्मी व लू का प्रकोप (तापमान > 38°C)",
      en: "☀️ High Temperature Thermal Stress (> 38°C)",
    },
    impact: {
      mr: "संत्रा, कापूस व भाजीपाल्याची फुले आणि लहान फळे गळण्याचा (Drop) धोका निर्माण होतो.",
      hi: "संतरा, कपास और सब्जियों में फूल व छोटे फल झड़ने की समस्या उत्पन्न होती है।",
      en: "Elevated transpiration leads to blossom abortion and premature citrus/cotton boll shedding.",
    },
    mitigation: {
      mr: "दुपारच्या उन्हात सिंचन करणे टाळा; केवळ सायंकाळी ठिबक किंवा हलके पाणी द्या. झाडांची प्रतिकारशक्ती वाढवण्यासाठी पोटॅशियम नायट्रेट (१३:००:४५) ५ ग्रॅम/लिटर फवारा.",
      hi: "दोपहर में सिंचाई न करें; केवल शाम के समय ड्रिप या हल्का पानी दें। पत्तों पर पोटैशियम नाइट्रेट (13:0:45) 5 ग्राम/लीटर का छिड़काव करें।",
      en: "Irrigate strictly during evening hours via drip. Apply 1% Potassium Nitrate (13:0:45) foliar spray to bolster cellular turgidity.",
    },
    actionLabel: {
      mr: "फुलगळ प्रतिबंध उपाय",
      hi: "फूल झड़ने से रोकें",
      en: "Thermal Shield",
    },
    badge: {
      mr: "उष्णता ताण",
      hi: "तापमान संकट",
      en: "Heat Stress",
    },
  },
];

/**
 * Fetch hyper-local 7-day weather from Open-Meteo free API
 */
export async function fetchLiveWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API failed");
    const data = await res.json();

    const dayNames = [
      { mr: "रविवार", hi: "रविवार", en: "Sunday" },
      { mr: "सोमवार", hi: "सोमवार", en: "Monday" },
      { mr: "मंगळवार", hi: "मंगलवार", en: "Tuesday" },
      { mr: "बुधवार", hi: "बुधवार", en: "Wednesday" },
      { mr: "गुरुवार", hi: "गुरुवार", en: "Thursday" },
      { mr: "शुक्रवार", hi: "शुक्रवार", en: "Friday" },
      { mr: "शनिवार", hi: "शनिवार", en: "Saturday" },
    ];

    const dailyForecast = (data.daily?.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      const dayIdx = d.getDay();
      return {
        date: dateStr,
        dayName: dayNames[dayIdx],
        maxTemp: Math.round(data.daily.temperature_2m_max[idx] ?? 32),
        minTemp: Math.round(data.daily.temperature_2m_min[idx] ?? 20),
        rainProb: Math.round(data.daily.precipitation_probability_max[idx] ?? 10),
        weatherCode: data.daily.weather_code[idx] ?? 1,
      };
    });

    const wCode = data.current?.weather_code ?? 1;
    let desc = { mr: "निरभ्र व सूर्यप्रकाश", hi: "साफ मौसम एवं धूप", en: "Clear & Sunny" };
    if (wCode >= 61) desc = { mr: "पावसाची शक्यता", hi: "बारिश की संभावना", en: "Rain Showers" };
    else if (wCode >= 51) desc = { mr: "ढगाळ व हलके थेंब", hi: "बादल व बूंदाबांदी", en: "Overcast & Drizzle" };
    else if (wCode >= 3) desc = { mr: "अंशतः ढगाळ", hi: "आंशिक रूप से बादल", en: "Partly Cloudy" };

    return {
      currentTemp: Math.round(data.current?.temperature_2m ?? 31),
      apparentTemp: Math.round(data.current?.apparent_temperature ?? 32),
      humidity: Math.round(data.current?.relative_humidity_2m ?? 48),
      windSpeed: Math.round(data.current?.wind_speed_10m ?? 12),
      rainProbability: Math.round(data.daily?.precipitation_probability_max?.[0] ?? 15),
      weatherCode: wCode,
      weatherDescription: desc,
      city: "स्थानिक शेत परिसर (Local Farm)",
      dailyForecast,
    };
  } catch (err) {
    console.warn("Using fallback weather data:", err);
    return getFallbackWeather();
  }
}

export function getFallbackWeather(): WeatherData {
  return {
    currentTemp: 31,
    apparentTemp: 33,
    humidity: 52,
    windSpeed: 14,
    rainProbability: 20,
    weatherCode: 2,
    weatherDescription: { mr: "अंशतः ढगाळ व पोषक", hi: "आंशिक बादल व अनुकूल", en: "Partly Cloudy" },
    city: "विदर्भ / महाराष्ट्र शेत परिसर",
    dailyForecast: [
      { date: "आज", dayName: { mr: "आज", hi: "आज", en: "Today" }, maxTemp: 33, minTemp: 21, rainProb: 20, weatherCode: 2 },
      { date: "उद्या", dayName: { mr: "उद्या", hi: "कल", en: "Tomorrow" }, maxTemp: 34, minTemp: 22, rainProb: 15, weatherCode: 1 },
      { date: "+२ दिवस", dayName: { mr: "सोमवार", hi: "सोमवार", en: "Monday" }, maxTemp: 32, minTemp: 20, rainProb: 35, weatherCode: 51 },
      { date: "+३ दिवस", dayName: { mr: "मंगळवार", hi: "मंगलवार", en: "Tuesday" }, maxTemp: 31, minTemp: 19, rainProb: 40, weatherCode: 61 },
      { date: "+४ दिवस", dayName: { mr: "बुधवार", hi: "बुधवार", en: "Wednesday" }, maxTemp: 33, minTemp: 21, rainProb: 10, weatherCode: 0 },
      { date: "+५ दिवस", dayName: { mr: "गुरुवार", hi: "गुरुवार", en: "Thursday" }, maxTemp: 35, minTemp: 22, rainProb: 5, weatherCode: 0 },
      { date: "+६ दिवस", dayName: { mr: "शुक्रवार", hi: "शुक्रवार", en: "Friday" }, maxTemp: 34, minTemp: 21, rainProb: 15, weatherCode: 1 },
    ],
  };
}
