// ============================================
// KRISHIAI — COMPREHENSIVE MOCK DATA
// Realistic dynamic demo data for all modules
// ============================================

export const farmerProfile = {
  uid: "demo-farmer-001",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  state: "Punjab",
  district: "Ludhiana",
  village: "Machhiwara",
  acres: 12,
  crops: ["Wheat", "Rice", "Mustard"],
  lang: "hi",
  aadhaar_last4: "4523",
  avatar: "RK",
  joinedDate: "2025-08-15",
  bankAccount: "SBI, Ludhiana Branch",
};

export const kpiData = {
  netProfitForecast: 485000,
  netProfitChange: 12.5,
  landCoverage: 12,
  landUtilization: 92,
  activeLoans: 2,
  totalLoanAmount: 350000,
  schemeBenefits: 126000,
  schemesApplied: 4,
};

export const crisisData = {
  active: true,
  title: "⚠️ Strait of Hormuz Crisis — Fertilizer Price Surge",
  subtitle: "Iran-US conflict disrupting 33% of global seaborne fertilizer trade",
  ureaSpikePct: 35,
  dapSpikePct: 28,
  mopSpikePct: 18,
  currentUreaPrice: 2850,
  previousUreaPrice: 2110,
  currentDAPPrice: 3200,
  previousDAPPrice: 2500,
  currentMOPPrice: 1980,
  previousMOPPrice: 1680,
  lastUpdated: "2026-03-28T05:00:00Z",
  hormuzStatus: "restricted",
  gasImportPct: 86,
  ureaImportPct: 25,
  govtSubsidyStatus: "Under Review — Emergency PM-Kisan fertilizer package expected April 2026",
  keyAlerts: [
    "Urea prices up 35% since January 2026 due to Strait of Hormuz blockade",
    "India's urea stock at 6.2M tonnes — needs 8M by June sowing season",
    "Emergency fertilizer subsidy bill ₹12,000 Cr introduced in Parliament",
    "PM-Kisan installment of ₹2,000 expedited for affected states",
    "India's record wheat harvest (120.2 MT) stabilizing global food markets",
  ],
  timeline: [
    { date: "Jan 2026", event: "Iran conflict escalates, Hormuz strait partially blocked" },
    { date: "Feb 2026", event: "Global urea prices jump 20%, shipping costs double" },
    { date: "Mar 2026", event: "India urea imports down 40%, emergency stocks deployed" },
    { date: "Apr 2026 (Est)", event: "Govt expected to announce ₹12,000 Cr emergency subsidy" },
    { date: "Jun 2026 (Risk)", event: "Kharif sowing season — fertilizer demand peaks" },
  ],
  stateWiseStock: [
    { state: "Punjab", stock: 0.82, required: 1.2, status: "warning" },
    { state: "Haryana", stock: 0.65, required: 0.9, status: "warning" },
    { state: "UP", stock: 1.4, required: 2.5, status: "danger" },
    { state: "Maharashtra", stock: 0.95, required: 1.3, status: "warning" },
    { state: "MP", stock: 0.78, required: 1.1, status: "warning" },
    { state: "Rajasthan", stock: 0.54, required: 0.8, status: "danger" },
    { state: "Gujarat", stock: 0.62, required: 0.7, status: "ok" },
    { state: "Bihar", stock: 0.48, required: 0.9, status: "danger" },
  ],
};

export const marketPrices = {
  wheat: {
    name: "Wheat",
    emoji: "🌾",
    currentPrice: 2275,
    msp: 2275,
    weeklyChange: 2.3,
    unit: "per quintal",
    chartData: [
      { month: "Oct", price: 2180 },
      { month: "Nov", price: 2210 },
      { month: "Dec", price: 2240 },
      { month: "Jan", price: 2260 },
      { month: "Feb", price: 2250 },
      { month: "Mar", price: 2275 },
    ],
    mandis: [
      { name: "Khanna Mandi", distance: "15 km", price: 2290, trend: 1.8 },
      { name: "Ludhiana Grain Market", distance: "22 km", price: 2275, trend: 2.1 },
      { name: "Jalandhar Mandi", distance: "45 km", price: 2310, trend: 3.2 },
      { name: "Amritsar Mandi", distance: "95 km", price: 2330, trend: 2.8 },
      { name: "Patiala Mandi", distance: "68 km", price: 2280, trend: 1.5 },
    ],
  },
  rice: {
    name: "Rice (Paddy)",
    emoji: "🍚",
    currentPrice: 2300,
    msp: 2300,
    weeklyChange: -0.8,
    unit: "per quintal",
    chartData: [
      { month: "Oct", price: 2250 },
      { month: "Nov", price: 2280 },
      { month: "Dec", price: 2310 },
      { month: "Jan", price: 2350 },
      { month: "Feb", price: 2320 },
      { month: "Mar", price: 2300 },
    ],
    mandis: [
      { name: "Khanna Mandi", distance: "15 km", price: 2310, trend: -0.5 },
      { name: "Ludhiana Grain Market", distance: "22 km", price: 2290, trend: -1.2 },
      { name: "Karnal Mandi", distance: "120 km", price: 2340, trend: 0.8 },
      { name: "Ambala Mandi", distance: "85 km", price: 2320, trend: 0.3 },
    ],
  },
  mustard: {
    name: "Mustard",
    emoji: "🌻",
    currentPrice: 5450,
    msp: 5650,
    weeklyChange: 4.2,
    unit: "per quintal",
    chartData: [
      { month: "Oct", price: 5100 },
      { month: "Nov", price: 5200 },
      { month: "Dec", price: 5250 },
      { month: "Jan", price: 5300 },
      { month: "Feb", price: 5380 },
      { month: "Mar", price: 5450 },
    ],
    mandis: [
      { name: "Ludhiana Market", distance: "22 km", price: 5400, trend: 3.8 },
      { name: "Jaipur Mandi", distance: "620 km", price: 5520, trend: 5.1 },
      { name: "Kota Mandi", distance: "780 km", price: 5480, trend: 4.5 },
    ],
  },
};

export const weatherData = {
  current: {
    temp: 28,
    feelsLike: 30,
    humidity: 45,
    windSpeed: 12,
    condition: "Partly Cloudy",
    icon: "⛅",
    uv: 6,
    rainfall: 0,
  },
  forecast: [
    { day: "Today", high: 32, low: 18, icon: "⛅", rain: 0 },
    { day: "Sat", high: 34, low: 19, icon: "☀️", rain: 0 },
    { day: "Sun", high: 33, low: 20, icon: "🌤️", rain: 10 },
    { day: "Mon", high: 30, low: 19, icon: "🌧️", rain: 60 },
    { day: "Tue", high: 28, low: 17, icon: "🌧️", rain: 80 },
    { day: "Wed", high: 29, low: 18, icon: "⛅", rain: 20 },
    { day: "Thu", high: 31, low: 19, icon: "☀️", rain: 0 },
  ],
  advisory: "Light rain expected Monday-Tuesday. Good window for wheat harvest this weekend. Delay fertilizer application until Wednesday.",
  location: "Machhiwara, Ludhiana",
};

export const recentActivities = [
  { id: "1", type: "prediction", text: "Wheat profit prediction: ₹4,85,000", time: "2h ago", icon: "📊" },
  { id: "2", type: "market", text: "Wheat price alert: ₹2,275/quintal at Khanna", time: "4h ago", icon: "📈" },
  { id: "3", type: "scheme", text: "PM-Kisan ₹2,000 installment credited", time: "1d ago", icon: "🏛️" },
  { id: "4", type: "expense", text: "Added expense: Fertilizer ₹18,500", time: "2d ago", icon: "💰" },
  { id: "5", type: "chat", text: "AI: Best time to sell wheat is April first week", time: "3d ago", icon: "🤖" },
];

export const schemes = [
  {
    id: "pmkisan",
    name: "PM-Kisan Samman Nidhi",
    type: "Direct Benefit",
    benefit: "₹6,000/year in 3 installments",
    deadline: "2026-06-30",
    eligibility: "High",
    status: "Active",
    description: "Direct income support of ₹6,000 per year to all landholding farmer families across the country.",
    documents: ["Aadhaar Card", "Land Records (7/12)", "Bank Passbook"],
    applyUrl: "https://pmkisan.gov.in",
    category: "subsidy",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana",
    type: "Insurance",
    benefit: "Crop insurance at 1.5-2% premium",
    deadline: "2026-04-15",
    eligibility: "High",
    status: "Enrollment Open",
    description: "Comprehensive crop insurance covering all food & oilseed crops. Premium: Kharif 2%, Rabi 1.5%.",
    documents: ["Aadhaar Card", "Land Records", "Sowing Certificate", "Bank Account"],
    applyUrl: "https://pmfby.gov.in",
    category: "insurance",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    type: "Credit",
    benefit: "Loan up to ₹3L at 4% interest",
    deadline: "Ongoing",
    eligibility: "High",
    status: "Active",
    description: "Short-term crop loans at subsidized 4% interest rate for all farmers. Repayment within crop season.",
    documents: ["Aadhaar Card", "Land Records", "Passport Photo", "ID Proof"],
    applyUrl: "https://www.sbi.co.in/kcc",
    category: "subsidy",
  },
  {
    id: "smam",
    name: "Sub-Mission on Agri Mechanization",
    type: "Equipment",
    benefit: "50-80% subsidy on farm equipment",
    deadline: "2026-05-31",
    eligibility: "Medium",
    status: "Active",
    description: "Subsidy for purchase of tractors, harvesters, sprayers and other farm equipment.",
    documents: ["Aadhaar Card", "Land Records", "Bank Account", "Quotation from dealer"],
    applyUrl: "https://agrimachinery.nic.in",
    category: "equipment",
  },
  {
    id: "emergency_fert",
    name: "🚨 Emergency Fertilizer Relief Package",
    type: "Emergency",
    benefit: "₹5,000/acre additional subsidy",
    deadline: "2026-04-30",
    eligibility: "High",
    status: "NEW — Crisis Response",
    description: "Emergency fertilizer subsidy in response to Strait of Hormuz crisis. ₹5,000 per acre for affected farmers to offset 35% urea price surge.",
    documents: ["Aadhaar Card", "Land Records", "Last fertilizer purchase receipt"],
    applyUrl: "https://pib.gov.in",
    category: "subsidy",
  },
  {
    id: "soil_health",
    name: "Soil Health Card Scheme",
    type: "Subsidy",
    benefit: "Free soil testing + nutrient advisory",
    deadline: "Ongoing",
    eligibility: "High",
    status: "Active",
    description: "Free soil test report every 2 years with crop-specific fertilizer recommendations.",
    documents: ["Aadhaar Card", "Land Records"],
    applyUrl: "https://soilhealth.dac.gov.in",
    category: "subsidy",
  },
];

export const loans = [
  {
    id: "kcc-1",
    type: "Kisan Credit Card",
    bank: "State Bank of India",
    limit: 300000,
    interest: 4.0,
    subsidyRate: 3.0,
    effectiveRate: 4.0,
    tenure: "12 months",
    status: "Pre-Approved",
    emi: 26000,
    features: ["No collateral up to ₹1.6L", "Crop insurance included", "Flexible repayment"],
  },
  {
    id: "pm-kmy",
    type: "PM Kisan Maan-Dhan Yojana",
    bank: "NABARD",
    limit: 500000,
    interest: 5.5,
    subsidyRate: 2.0,
    effectiveRate: 5.5,
    tenure: "36 months",
    status: "Eligible",
    emi: 15100,
    features: ["Pension after 60", "Govt matches contribution", "Voluntary enrollment"],
  },
  {
    id: "nabard-term",
    type: "NABARD Term Loan",
    bank: "Punjab National Bank",
    limit: 750000,
    interest: 8.5,
    subsidyRate: 0,
    effectiveRate: 8.5,
    tenure: "60 months",
    status: "Eligible",
    emi: 15350,
    features: ["Long term investment", "Farm infrastructure", "Dairy / poultry setup"],
  },
];

export const documentChecklist = [
  { name: "Aadhaar Card", completed: true },
  { name: "Land Records (7/12 Extract)", completed: true },
  { name: "Bank Passbook / Statement", completed: true },
  { name: "Passport Size Photo", completed: true },
  { name: "Soil Health Card", completed: false },
  { name: "Income Certificate", completed: false },
  { name: "Caste Certificate (if applicable)", completed: false },
];

export const expenses = [
  { id: "e1", category: "Fertilizer", amount: 18500, date: "2026-03-25", notes: "Urea 10 bags (price up 35%)" },
  { id: "e2", category: "Seeds", amount: 8400, date: "2026-03-20", notes: "Wheat HD-2967 certified seeds" },
  { id: "e3", category: "Labor", amount: 15000, date: "2026-03-18", notes: "Harvesting labor (5 workers x 3 days)" },
  { id: "e4", category: "Irrigation", amount: 4200, date: "2026-03-15", notes: "Diesel pump operation" },
  { id: "e5", category: "Machinery", amount: 12000, date: "2026-03-10", notes: "Combine harvester rental" },
  { id: "e6", category: "Fertilizer", amount: 14200, date: "2026-02-28", notes: "DAP 8 bags" },
  { id: "e7", category: "Seeds", amount: 6800, date: "2026-02-20", notes: "Mustard seeds" },
  { id: "e8", category: "Pesticide", amount: 3200, date: "2026-02-15", notes: "Weedicide spray" },
  { id: "e9", category: "Labor", amount: 9000, date: "2026-02-10", notes: "Sowing labor" },
  { id: "e10", category: "Machinery", amount: 8500, date: "2026-02-05", notes: "Tractor ploughing" },
  { id: "e11", category: "Fertilizer", amount: 12800, date: "2026-01-25", notes: "Urea 7 bags" },
  { id: "e12", category: "Irrigation", amount: 3800, date: "2026-01-20", notes: "Electric pump bill" },
];

export const expenseCategories = [
  { name: "Fertilizer", color: "#E74C3C", icon: "🧪", total: 45500 },
  { name: "Seeds", color: "#2ECC71", icon: "🌱", total: 15200 },
  { name: "Labor", color: "#3498DB", icon: "👷", total: 24000 },
  { name: "Irrigation", color: "#9B59B6", icon: "💧", total: 8000 },
  { name: "Machinery", color: "#F39C12", icon: "🚜", total: 20500 },
  { name: "Pesticide", color: "#1ABC9C", icon: "🛡️", total: 3200 },
];

export const monthlyExpenses = [
  { month: "Oct", total: 28000 },
  { month: "Nov", total: 32000 },
  { month: "Dec", total: 25000 },
  { month: "Jan", total: 34600 },
  { month: "Feb", total: 41700 },
  { month: "Mar", total: 58100 },
];

export const healthScore = {
  overall: 742,
  max: 850,
  grade: "Good",
  breakdown: [
    { category: "Crop Yield History", score: 78, max: 100, weight: 25 },
    { category: "Loan Repayment", score: 92, max: 100, weight: 30 },
    { category: "Expense Management", score: 65, max: 100, weight: 20 },
    { category: "Scheme Utilization", score: 85, max: 100, weight: 15 },
    { category: "Market Timing", score: 70, max: 100, weight: 10 },
  ],
  tips: [
    "Diversify crops to reduce risk — consider adding chickpeas next Rabi season",
    "Your fertilizer costs are 34% above average due to crisis pricing — apply for emergency subsidy",
    "Excellent loan repayment record (92/100) — you qualify for higher credit limits",
    "Consider selling wheat this week — prices at Jalandhar Mandi are 2.4% above MSP",
  ],
  history: [
    { quarter: "Q1 2025", score: 698 },
    { quarter: "Q2 2025", score: 712 },
    { quarter: "Q3 2025", score: 725 },
    { quarter: "Q4 2025", score: 738 },
    { quarter: "Q1 2026", score: 742 },
  ],
};

export const chatMessages = [
  {
    id: "m1",
    role: "assistant" as const,
    text: "नमस्ते राजेश जी! 🙏 मैं KhetiSaathi (खेतीसाथी) हूँ, आपका स्मार्ट कृषि वित्तीय सहायक। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    time: "10:00 AM",
    lang: "hi",
  },
  {
    id: "m2",
    role: "user" as const,
    text: "मेरी गेहूं की फसल कब बेचनी चाहिए?",
    time: "10:02 AM",
    lang: "hi",
  },
  {
    id: "m3",
    role: "assistant" as const,
    text: "राजेश जी, वर्तमान बाजार विश्लेषण के अनुसार:\n\n📊 **गेहूं की कीमत:** ₹2,275/क्विंटल (MSP पर)\n📈 **जालंधर मंडी:** ₹2,310/क्विंटल (+2.4% MSP से ऊपर)\n\n**मेरी सलाह:** इस हफ्ते या अगले हफ्ते बेचना सबसे अच्छा रहेगा। कारण:\n1. सोमवार-मंगलवार बारिश के बाद कीमतें गिर सकती हैं\n2. भारत के रिकॉर्ड 120.2 MT गेहूं उत्पादन से April में supply pressure बढ़ेगा\n3. जालंधर मंडी में सबसे अच्छा भाव मिल रहा है\n\n🎯 **Best move:** शनिवार/रविवार को जालंधर मंडी में बेचें — ₹2,310 × आपकी 12 एकड़ = अनुमानित ₹4,85,000+ का मुनाफा",
    time: "10:02 AM",
    lang: "hi",
  },
];

export const cropPredictionDefaults = {
  crops: ["Wheat", "Rice", "Mustard", "Cotton", "Sugarcane", "Maize", "Chickpea", "Soybean"],
  soilTypes: ["Alluvial", "Black Cotton", "Red", "Laterite", "Sandy Loam", "Clay"],
  seasons: ["Rabi (Winter)", "Kharif (Monsoon)", "Zaid (Summer)"],
  states: [
    "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Maharashtra",
    "Rajasthan", "Gujarat", "Bihar", "West Bengal", "Karnataka",
    "Tamil Nadu", "Andhra Pradesh", "Telangana", "Odisha",
  ],
  costBreakdown: {
    seeds: { label: "Seeds", default: 8000, range: [2000, 25000] },
    fertilizer: { label: "Fertilizer", default: 15000, range: [5000, 40000] },
    irrigation: { label: "Irrigation", default: 6000, range: [2000, 20000] },
    labor: { label: "Labor", default: 12000, range: [5000, 30000] },
    machinery: { label: "Machinery", default: 10000, range: [3000, 25000] },
    pesticide: { label: "Pesticides", default: 3000, range: [1000, 10000] },
  },
};

export const predictionResult = {
  crop: "Wheat",
  land: 12,
  season: "Rabi",
  totalCost: 186000,
  estimatedRevenue: 485000,
  netProfit: 299000,
  profitabilityPct: 160.8,
  yieldPerAcre: 18.5,
  pricePerQuintal: 2275,
  totalYield: 222,
  costBreakdown: [
    { name: "Fertilizer", value: 52000, pct: 28, crisisAdjusted: true },
    { name: "Labor", value: 42000, pct: 22.6 },
    { name: "Seeds", value: 28000, pct: 15.1 },
    { name: "Machinery", value: 32000, pct: 17.2 },
    { name: "Irrigation", value: 20000, pct: 10.8 },
    { name: "Pesticides", value: 12000, pct: 6.5 },
  ],
  crisisImpact: {
    normalFertCost: 38500,
    adjustedFertCost: 52000,
    increase: 13500,
    reason: "Strait of Hormuz crisis — urea +35%, DAP +28%",
  },
  aiAdvice: "Despite the fertilizer price surge, wheat remains profitable at 160.8% ROI. Consider early procurement of fertilizer before June price peaks. Your predicted yield of 18.5 quintal/acre is achievable with current soil conditions.",
};

export const supportedLanguages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
];

export const notifications = [
  { id: "n1", type: "price", title: "Wheat price ₹2,310 at Jalandhar", time: "2h ago", read: false },
  { id: "n2", type: "scheme", title: "PM-Kisan installment credited ₹2,000", time: "1d ago", read: false },
  { id: "n3", type: "crisis", title: "Emergency fertilizer subsidy announced", time: "2d ago", read: true },
  { id: "n4", type: "weather", title: "Rain expected Mon-Tue — plan harvest", time: "3d ago", read: true },
];
