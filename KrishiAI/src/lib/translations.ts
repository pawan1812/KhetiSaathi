export type Language = "en" | "hi" | "mr";

export interface Translations {
  appName: string;
  appTagline: string;
  nav: {
    dashboard: string;
    cropPrediction: string;
    marketPrices: string;
    loans: string;
    schemes: string;
    expenses: string;
    chat: string;
    healthScore: string;
    crisisHub: string;
    settings: string;
  };
  common: {
    loading: string;
    search: string;
    back: string;
    next: string;
    save: string;
    cancel: string;
    delete: string;
    viewAll: string;
    details: string;
    acres: string;
    farmer: string;
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    detectLocation: string;
    detectingLocation: string;
    currentLocation: string;
    kmAway: string;
    verifiedMandi: string;
    liveData: string;
  };
  dashboard: {
    kpiProfitForecast: string;
    kpiLandCoverage: string;
    kpiUtilized: string;
    kpiActiveLoans: string;
    kpiSchemeBenefits: string;
    kpiActive: string;
    crisisAlertTitle: string;
    crisisAlertBadge: string;
    quickActions: string;
    predictProfit: string;
    checkLoans: string;
    findSchemes: string;
    askAi: string;
    marketPulse: string;
    weatherCardTitle: string;
    humidity: string;
    wind: string;
    uvIndex: string;
    recentActivity: string;
  };
  market: {
    title: string;
    subtitle: string;
    selectCrop: string;
    currentPrice: string;
    mspPrice: string;
    bestMandiPrice: string;
    aboveMsp: string;
    priceTrend: string;
    nearestMandis: string;
    searchMandi: string;
    distanceFilter: string;
    arrivals: string;
    modalPrice: string;
    minMaxPrice: string;
    aiSellRecommendation: string;
    whyPricesMoving: string;
    setPriceAlert: string;
    alertTargetPlaceholder: string;
    alertButton: string;
    alertActive: string;
    alertSuccessMsg: string;
  };
  crops: {
    title: string;
    subtitle: string;
    stepCropLocation: string;
    stepSoilSeason: string;
    stepInputCosts: string;
    stepResults: string;
    selectCrop: string;
    state: string;
    landSize: string;
    soilType: string;
    season: string;
    fertilizerCrisisAdjustment: string;
    totalEstimatedCost: string;
    predictButton: string;
    predicting: string;
    totalCost: string;
    estRevenue: string;
    netProfit: string;
    roi: string;
    costBreakdown: string;
    yieldAnalysis: string;
    yieldPerAcre: string;
    totalYield: string;
    pricePerQuintal: string;
    aiAdvisory: string;
    newPrediction: string;
    downloadReport: string;
  };
  chat: {
    assistantTitle: string;
    engineBadge: string;
    placeholder: string;
    thinking: string;
    viewReasoning: string;
    quickQuestions: string[];
  };
  landing: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    registerBtn: string;
    launchBtn: string;
    exploreDemoBtn: string;
    loginBtn: string;
    liveTickerTitle: string;
    featuresTitle: string;
    featuresSubtitle: string;
    statsFarmers: string;
    statsMandis: string;
    statsSavings: string;
    statsAccuracy: string;
    testimonialsTitle: string;
    faqTitle: string;
    footerTagline: string;
  };
  auth: {
    signInTab: string;
    registerTab: string;
    signInTitle: string;
    registerTitle: string;
    phoneLabel: string;
    phonePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    acresLabel: string;
    cropsLabel: string;
    stateLabel: string;
    districtLabel: string;
    villageLabel: string;
    signInBtn: string;
    registerBtn: string;
    quickDemoTitle: string;
    invalidCreds: string;
    registrationSuccess: string;
  };
  expenses: {
    title: string;
    subtitle: string;
    addExpense: string;
    totalThisSeason: string;
    highestCategory: string;
    thisMonth: string;
    aiInsightTitle: string;
    monthlySpending: string;
    categoryBreakdown: string;
    searchExpenses: string;
    exportCsv: string;
    exportPdf: string;
    category: string;
    amount: string;
    date: string;
    notes: string;
    saveExpense: string;
    noExpenses: string;
  };
  schemes: {
    title: string;
    subtitle: string;
    eligibleBenefits: string;
    schemesAvailable: string;
    applied: string;
    searchSchemes: string;
    applyNow: string;
    deadline: string;
  };
  loans: {
    title: string;
    subtitle: string;
    preApprovedLimit: string;
    effectiveRate: string;
    activeLoanAmount: string;
    applyLoan: string;
    subsidyIncluded: string;
  };
  crisis: {
    title: string;
    subtitle: string;
    activeAlert: string;
    ureaSpike: string;
    dapSpike: string;
    reliefPackage: string;
    substituteSolution: string;
  };
  agriServices: {
    sectionTitle: string;
    sectionSubtitle: string;
    categories: {
      aiAndProtection: string;
      farmAndAdvisory: string;
      economicsAndStorage: string;
      schemesAndCommunity: string;
    };
    services: Record<string, { title: string; desc: string; badge?: string; link: string }>;
  };
  cropManagement: {
    title: string;
    subtitle: string;
    addCrop: string;
    editCrop: string;
    cropName: string;
    variety: string;
    sowingDate: string;
    farmPlot: string;
    gatNumber: string;
    area: string;
    areaUnit: string;
    currentStage: string;
    daysAfterSowing: string;
    growthTimeline: string;
    cropHistory: string;
    noCropsYet: string;
    noCropsDesc: string;
    viewAdvisory: string;
    viewPests: string;
    saveCrop: string;
  };
  soilHealth: {
    title: string;
    subtitle: string;
    shcNumber: string;
    testDate: string;
    labName: string;
    parametersTitle: string;
    low: string;
    medium: string;
    high: string;
    uploadReport: string;
    viewPdf: string;
    geminiInterpretation: string;
    enterValues: string;
    saveRecord: string;
  };
  fertilizerCalc: {
    title: string;
    subtitle: string;
    selectCrop: string;
    farmArea: string;
    areaUnit: string;
    targetYield: string;
    haveSoilReport: string;
    fymManure: string;
    productOption: string;
    conventional: string;
    nanoPackage: string;
    sspPackage: string;
    calculateBtn: string;
    totalRequiredNutrients: string;
    productsBreakdown: string;
    splitDosingTitle: string;
    formulasTitle: string;
    costSavingsHighlight: string;
  };
  warehouses: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterDistrict: string;
    totalCapacity: string;
    availableCapacity: string;
    contactNumber: string;
    ratesPerQuintal: string;
    amenities: string;
    getDirections: string;
  };
  chcLocator: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterDistrict: string;
    nearbyCentres: string;
    machineryAvailable: string;
    hourlyRate: string;
    dailyRate: string;
    callCentre: string;
    bookEquipment: string;
  };
  knowledgeHub: {
    title: string;
    subtitle: string;
    searchArticles: string;
    allCategories: string;
    cropSop: string;
    pestManagement: string;
    organicFarming: string;
    readArticle: string;
  };
  expertsCorner: {
    title: string;
    subtitle: string;
    askQuestion: string;
    postQuery: string;
    expertVerified: string;
    universityAffiliation: string;
    yourQuestionPlaceholder: string;
    submitQuery: string;
  };
  shetishala: {
    title: string;
    subtitle: string;
    featuredLive: string;
    watchNow: string;
    trainingModules: string;
    upcomingWebinars: string;
  };
  magazines: {
    title: string;
    subtitle: string;
    readMagazine: string;
    downloadPdf: string;
    publisher: string;
    latestIssues: string;
  };
  notificationsHub: {
    title: string;
    subtitle: string;
    allAlerts: string;
    weatherAlerts: string;
    pestWarnings: string;
    mandiUpdates: string;
    markAllRead: string;
  };

}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KhetiSaathi",
    appTagline: "Smart Agriculture & Financial Partner",
    nav: {
      dashboard: "Dashboard",
      cropPrediction: "Crop Prediction",
      marketPrices: "Market & Mandis",
      loans: "Kisan Loans",
      schemes: "Govt Schemes",
      expenses: "Farm Expenses",
      chat: "AI Sahayak",
      healthScore: "Health Score",
      crisisHub: "Crisis Monitor",
      settings: "Settings",
    },
    common: {
      loading: "Loading KhetiSaathi…",
      search: "Search…",
      back: "Back",
      next: "Next",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      viewAll: "View All",
      details: "Details",
      acres: "acres",
      farmer: "Kisan",
      greetingMorning: "Good Morning",
      greetingAfternoon: "Good Afternoon",
      greetingEvening: "Good Evening",
      detectLocation: "Detect My Location",
      detectingLocation: "Detecting GPS…",
      currentLocation: "Current Location",
      kmAway: "km away",
      verifiedMandi: "Agmarknet Verified APMC",
      liveData: "Live Data",
    },
    dashboard: {
      kpiProfitForecast: "Net Profit Forecast",
      kpiLandCoverage: "Land Coverage",
      kpiUtilized: "utilized",
      kpiActiveLoans: "Active Kisan Loans",
      kpiSchemeBenefits: "Scheme Benefits",
      kpiActive: "active",
      crisisAlertTitle: "Strait of Hormuz Fertilizer Crisis",
      crisisAlertBadge: "Live Crisis Monitor",
      quickActions: "Quick Actions",
      predictProfit: "Predict Profit",
      checkLoans: "Check Loans",
      findSchemes: "Find Schemes",
      askAi: "Ask AI Sahayak",
      marketPulse: "Live Mandi Pulse",
      weatherCardTitle: "Agri Weather & Radar",
      humidity: "Humidity",
      wind: "Wind",
      uvIndex: "UV Index",
      recentActivity: "Recent Farm Activity",
    },
    market: {
      title: "Mandi Prices & Nearest APMCs",
      subtitle: "Live location-based market rates from Agmarknet & APMC mandis",
      selectCrop: "Select Commodity",
      currentPrice: "Current Modal Rate",
      mspPrice: "Govt MSP (2025-26)",
      bestMandiPrice: "Best Mandi Rate",
      aboveMsp: "above MSP",
      priceTrend: "Price Trend (6 Months)",
      nearestMandis: "Nearest APMC Mandis by Distance",
      searchMandi: "Search mandi or district...",
      distanceFilter: "Sort by Proximity",
      arrivals: "Arrivals",
      modalPrice: "Modal Price",
      minMaxPrice: "Min / Max",
      aiSellRecommendation: "AI Mandi Sell Recommendation",
      whyPricesMoving: "Market Intelligence & Geopolitics",
      setPriceAlert: "Set Mandi Price SMS Alert",
      alertTargetPlaceholder: "Enter target price (₹)",
      alertButton: "Set Alert",
      alertActive: "Alert Active",
      alertSuccessMsg: "SMS and WhatsApp alert registered successfully!",
    },
    crops: {
      title: "Crop Profit & Yield Prediction",
      subtitle: "AI-powered profit forecasting with crisis-adjusted input costs",
      stepCropLocation: "Crop & Location",
      stepSoilSeason: "Soil & Season",
      stepInputCosts: "Input Costs",
      stepResults: "Prediction Results",
      selectCrop: "Select Crop",
      state: "State & District",
      landSize: "Land Size",
      soilType: "Soil Type",
      season: "Season",
      fertilizerCrisisAdjustment: "Active Crisis: Fertilizer Costs +35% (Hormuz Disruption)",
      totalEstimatedCost: "Total Estimated Input Cost",
      predictButton: "Predict Profit & Yield",
      predicting: "AI is calculating...",
      totalCost: "Total Cost",
      estRevenue: "Estimated Revenue",
      netProfit: "Net Profit",
      roi: "Return on Investment (ROI)",
      costBreakdown: "Cost Breakdown",
      yieldAnalysis: "Yield Analysis",
      yieldPerAcre: "Yield/Acre",
      totalYield: "Total Yield",
      pricePerQuintal: "Price/Quintal",
      aiAdvisory: "AI Agronomic Advisory",
      newPrediction: "New Prediction",
      downloadReport: "Download PDF Report",
    },
    chat: {
      assistantTitle: "KhetiSaathi AI Sahayak",
      engineBadge: "Powered by KhetiSaathi AI Engine (Trilingual: MR / HI / EN)",
      placeholder: "Ask in Marathi, Hindi, or English (e.g., When to sell wheat? / Alternative to Urea?)",
      thinking: "Analyzing agricultural data...",
      viewReasoning: "View AI Reasoning",
      quickQuestions: [
        "What is the best alternative to Urea right now?",
        "When should I sell my Wheat harvest?",
        "How to apply for PM-Kisan & Namo Shetkari scheme?",
        "How can I cut farm input costs by 30%?",
        "What are the interest rates on KCC loan?",
        "Suggest high-profit crops for next Kharif season",
      ],
    },
    landing: {
      heroBadge: "🇮🇳 India's #1 Smart Agri-Financial & Mandi Platform",
      heroTitle: "Maximize Farm Profits with KhetiSaathi AI & Real APMC Mandi Rates",
      heroSubtitle: "Accurate crop profitability forecasting, real-time APMC mandi prices with GPS proximity, hyper-local Open-Meteo weather radar, and fertilizer crisis optimization for Indian farmers.",
      registerBtn: "Register Free",
      launchBtn: "Launch Web App",
      exploreDemoBtn: "Explore Interactive Demo",
      loginBtn: "Farmer Login",
      liveTickerTitle: "Live APMC Mandi Rates Today",
      featuresTitle: "Engineered for the Modern Indian Farmer",
      featuresSubtitle: "Everything you need to optimize farm profitability, protect against climate risks, and secure top market prices.",
      statsFarmers: "50,000+ Farmers Empowered",
      statsMandis: "80+ APMC Mandis Connected",
      statsSavings: "₹4,800/Acre Input Cost Saved",
      statsAccuracy: "94.2% AI Prediction Accuracy",
      testimonialsTitle: "Trusted by Farmers Across Maharashtra, Punjab & MP",
      faqTitle: "Frequently Asked Questions",
      footerTagline: "KhetiSaathi — Democratizing AI & Market Transparency for every Indian Kisan.",
    },
    auth: {
      signInTab: "Sign In",
      registerTab: "Register New Farmer",
      signInTitle: "Sign In to Your KhetiSaathi Account",
      registerTitle: "Register Your Farm & Join KhetiSaathi",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+91 98765 43210",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter secure password",
      nameLabel: "Farmer Full Name",
      namePlaceholder: "e.g. Ramesh Patil",
      acresLabel: "Total Land Size (Acres)",
      cropsLabel: "Primary Cultivated Crops",
      stateLabel: "State",
      districtLabel: "District",
      villageLabel: "Village",
      signInBtn: "Sign In →",
      registerBtn: "Create Farmer Account & Sync",
      quickDemoTitle: "— Quick One-Click Demo Profiles —",
      invalidCreds: "Invalid phone or password. Try a demo profile below.",
      registrationSuccess: "Registration successful! Redirecting to your farm dashboard...",
    },
    expenses: {
      title: "Farm Expenses & Ledger",
      subtitle: "Track, categorize, and optimize your farm input costs with Firebase cloud sync",
      addExpense: "Add New Expense",
      totalThisSeason: "Total Spent This Season",
      highestCategory: "Highest Expense Category",
      thisMonth: "Spent This Month",
      aiInsightTitle: "AI Expense Insight",
      monthlySpending: "Monthly Spending Trend",
      categoryBreakdown: "Category Breakdown",
      searchExpenses: "Search expenses...",
      exportCsv: "Export CSV",
      exportPdf: "Export PDF / Print",
      category: "Category",
      amount: "Amount (₹)",
      date: "Date",
      notes: "Notes / Description",
      saveExpense: "Save & Sync Expense",
      noExpenses: "No expenses found matching your filter.",
    },
    schemes: {
      title: "Government Agriculture Schemes",
      subtitle: "Central and State welfare benefits, subsidies, and eligibility verification",
      eligibleBenefits: "Total Eligible Subsidies",
      schemesAvailable: "Schemes Active",
      applied: "Applied",
      searchSchemes: "Search scheme name...",
      applyNow: "Apply Scheme",
      deadline: "Deadline",
    },
    loans: {
      title: "Kisan Credit Card & Loans",
      subtitle: "Low-interest institutional credit, subventions, and pre-approved limits",
      preApprovedLimit: "Pre-Approved Limit",
      effectiveRate: "Effective Interest Rate",
      activeLoanAmount: "Active Credit Utilized",
      applyLoan: "Apply for Loan",
      subsidyIncluded: "Interest Subvention Included",
    },
    crisis: {
      title: "Fertilizer Crisis Monitor",
      subtitle: "Hormuz Strait supply shock tracker, Urea price surge & substitute management",
      activeAlert: "Hormuz Strait Supply Disruption Active",
      ureaSpike: "Urea Price Spike",
      dapSpike: "DAP Price Spike",
      reliefPackage: "Government Emergency Relief",
      substituteSolution: "Nano Urea Solution",
    },
    agriServices: {
      sectionTitle: "Agricultural Services Hub",
      sectionSubtitle: "Comprehensive MahaVISTAAR-inspired intelligent farm tools and advisory",
      categories: {
        aiAndProtection: "AI & Crop Protection",
        farmAndAdvisory: "Crop & Weather Advisory",
        economicsAndStorage: "Agri-Economics & Storage",
        schemesAndCommunity: "Govt Schemes & Learning",
      },
      services: {
        aiChat: { title: "AI Agricultural Assistant", desc: "Trilingual farming AI powered by Google Gemini", badge: "Gemini AI", link: "/chat" },
        cropManagement: { title: "Crop Management & Plots", desc: "Track crops, plots, gat numbers, and growth stages", badge: "Core", link: "/crops" },
        cropAdvisory: { title: "Crop Advisory & Stages", desc: "Stage-wise management, sowing dates and nutrient guide", badge: "Advisory", link: "/advisory" },
        weatherAdvisory: { title: "Agro-Weather Radar", desc: "Live 5-day weather and agromet spraying alerts", badge: "Live Radar", link: "/weather" },
        pestScanner: { title: "AI Pest & Disease Doctor", desc: "Leaf diagnosis with camera, symptoms and cure", badge: "Multimodal", link: "/scanner" },
        soilHealth: { title: "Soil Health Card", desc: "Digital nutrient report, pH and NPK status", badge: "SHC", link: "/soil-health" },
        fertilizerCalc: { title: "Fertilizer Calculator", desc: "Exact NPK dosage, nano urea and split schedules", badge: "Calculator", link: "/fertilizer-calculator" },
        marketPrices: { title: "APMC Mandi Rates", desc: "Live APMC prices, MSP benchmark and nearest mandis", badge: "Agmarknet", link: "/market" },
        warehouses: { title: "Warehouse Directory", desc: "Search MSWC and WDRA warehouses and cold storages", badge: "Directory", link: "/warehouses" },
        costCalculator: { title: "Crop Cost & Profit Calculator", desc: "Deterministic expenses, revenue and net profit", badge: "Calculator", link: "/calculator" },
        schemes: { title: "Government Schemes", desc: "MahaDBT, PoCRA, PM-Kisan and subsidy guide", badge: "DBT Portal", link: "/schemes" },
        chcLocator: { title: "Custom Hiring Centres (CHC)", desc: "Locate farm equipment banks and tractor rentals", badge: "Map View", link: "/chc-locator" },
        knowledge: { title: "Agri Knowledge Centre", desc: "Package of practices, crop SOPs and IPM protocols", badge: "ICAR SOPs", link: "/knowledge" },
        experts: { title: "Experts Corner Q&A", desc: "Ask university agronomists and verified scientists", badge: "Q&A", link: "/experts" },
        videos: { title: "Digital Shetishala", desc: "Farmer video education, playlists and live webinars", badge: "Shetishala", link: "/videos" },
        magazines: { title: "Agri Magazines & Bulletins", desc: "Shetkari and MahaPashudhan official publications", badge: "PDF E-Books", link: "/magazines" },
        notifications: { title: "Agricultural Updates", desc: "Agromet alerts, pest warnings and mandi updates", badge: "Alerts", link: "/notifications" },
      },
    },
    cropManagement: {
      title: "Crop Management & Farm Plots",
      subtitle: "Manage plots, gat numbers, sowing dates, and growth stages",
      addCrop: "Add New Crop",
      editCrop: "Edit Crop Details",
      cropName: "Crop Name",
      variety: "Crop Variety",
      sowingDate: "Sowing / Transplanting Date",
      farmPlot: "Farm / Plot Name",
      gatNumber: "Gat / Survey Number (गट क्र.)",
      area: "Area Size",
      areaUnit: "Area Unit",
      currentStage: "Current Growth Stage",
      daysAfterSowing: "Days After Sowing (DAS)",
      growthTimeline: "Crop Growth Stages Timeline",
      cropHistory: "Crop History & Past Harvests",
      noCropsYet: "No active crops added yet",
      noCropsDesc: "Add your first crop to receive tailored stage advisories, weather alerts, and pest forewarnings.",
      viewAdvisory: "View Stage Advisory",
      viewPests: "Pest Forewarning",
      saveCrop: "Save Crop Record",
    },
    soilHealth: {
      title: "Digital Soil Health Card",
      subtitle: "Official nutrient ratings, soil pH, and custom fertilization guidance",
      shcNumber: "Soil Health Card Number",
      testDate: "Sample Testing Date",
      labName: "Testing Laboratory / KVK",
      parametersTitle: "Primary Soil Nutrients & pH",
      low: "Low (Deficient)",
      medium: "Medium (Sufficient)",
      high: "High (Surplus)",
      uploadReport: "Upload Soil Report (PDF/Image)",
      viewPdf: "Preview Lab Report",
      geminiInterpretation: "Gemini AI Soil Advisory",
      enterValues: "Enter Soil Test Values",
      saveRecord: "Save Soil Record",
    },
    fertilizerCalc: {
      title: "Precision Fertilizer Calculator",
      subtitle: "Deterministic N-P-K recommendation, Nano-Urea crisis mitigation & split dosing",
      selectCrop: "Select Target Crop",
      farmArea: "Farm Area",
      areaUnit: "Unit",
      targetYield: "Target Yield (qtl/acre)",
      haveSoilReport: "Do you have a Soil Health Card report?",
      fymManure: "Farmyard Manure / FYM Applied (Tonnes)",
      productOption: "Fertilizer Product Package",
      conventional: "Conventional (Urea + DAP + MOP)",
      nanoPackage: "Eco-Nano Package (Nano Urea + Nano DAP + MOP)",
      sspPackage: "SSP Package (Single Super Phosphate + Urea + MOP)",
      calculateBtn: "Calculate Exact Fertilizer Doses",
      totalRequiredNutrients: "Total Elemental Nutrients Required",
      productsBreakdown: "Required Commercial Products",
      splitDosingTitle: "Split Application Schedule",
      formulasTitle: "Deterministic Formulas & Agronomic Principles",
      costSavingsHighlight: "Estimated Savings with Nano Fertilizer Package",
    },
    warehouses: {
      title: "Warehouse & Cold Storage Directory",
      subtitle: "Find certified MSWC and WDRA accredited grain and cold storage near you",
      searchPlaceholder: "Search by district, taluka, or warehouse name...",
      filterDistrict: "Filter District",
      totalCapacity: "Total Capacity",
      availableCapacity: "Available Space",
      contactNumber: "Contact Phone",
      ratesPerQuintal: "Storage Rate",
      amenities: "Warehouse Amenities",
      getDirections: "Get Directions on Map",
    },
    chcLocator: {
      title: "Custom Hiring Centre (CHC) Locator",
      subtitle: "Rent modern tractors, harvesters, rotavators, and spray drones from nearby machinery banks",
      searchPlaceholder: "Search machinery or custom hiring centres...",
      filterDistrict: "Select District",
      nearbyCentres: "Available Machinery Centres",
      machineryAvailable: "Available Equipment",
      hourlyRate: "Hourly Rate",
      dailyRate: "Daily Rate",
      callCentre: "Call Centre Manager",
      bookEquipment: "Book Equipment",
    },
    knowledgeHub: {
      title: "Agricultural Knowledge Centre & SOPs",
      subtitle: "Standard Operating Procedures (SOPs), package of practices, and scientific crop guides",
      searchArticles: "Search SOPs, crop guides, pest protocols...",
      allCategories: "All Topics",
      cropSop: "Crop SOPs",
      pestManagement: "Pest Management",
      organicFarming: "Organic Inputs",
      readArticle: "Read Complete Guide",
    },
    expertsCorner: {
      title: "Experts Corner (तज्ञांचा सल्ला)",
      subtitle: "Ask agronomy questions to agricultural university scientists and extension officers",
      askQuestion: "Ask an Agricultural Expert",
      postQuery: "Submit Question",
      expertVerified: "Verified University Agronomist",
      universityAffiliation: "MPKV Rahuri / PDKV Akola / ICAR",
      yourQuestionPlaceholder: "Describe your crop, symptoms, sowing date, and question clearly...",
      submitQuery: "Submit Question to Expert Panel",
    },
    shetishala: {
      title: "Digital Shetishala (डिजिटल शेतीशाळा)",
      subtitle: "Scientific video tutorials, live webinars, and farmer training modules",
      featuredLive: "Featured Shetishala Session",
      watchNow: "Watch Video",
      trainingModules: "Training Video Playlists",
      upcomingWebinars: "Upcoming Live Training Sessions",
    },
    magazines: {
      title: "Agricultural Magazines & Periodicals",
      subtitle: "Official monthly editions of Shetkari Magazine, MahaPashudhan, and Krishi Samvad",
      readMagazine: "Read Online",
      downloadPdf: "Download PDF",
      publisher: "Published By",
      latestIssues: "Recent Publications",
    },
    notificationsHub: {
      title: "Agricultural Notifications & Alerts",
      subtitle: "Real-time agromet advisories, pest forewarnings, mandi surges, and scheme updates",
      allAlerts: "All Alerts",
      weatherAlerts: "Agro-Weather Alerts",
      pestWarnings: "Pest Forewarnings",
      mandiUpdates: "Mandi Price Alerts",
      markAllRead: "Mark All as Read",
    },

  },

  hi: {
    appName: "खेतीसाथी",
    appTagline: "भारतीय किसानों का स्मार्ट कृषि एवं वित्तीय साथी",
    nav: {
      dashboard: "डैशबोर्ड",
      cropPrediction: "फसल मुनाफा अनुमान",
      marketPrices: "मंडी भाव एवं बाजार",
      loans: "किसान क्रेडिट / ऋण",
      schemes: "सरकारी योजनाएं",
      expenses: "खर्च खाता",
      chat: "कृषि सहायक (AI)",
      healthScore: "फार्म हेल्थ स्कोर",
      crisisHub: "संकट निगरानी",
      settings: "सेटिंग्स",
    },
    common: {
      loading: "खेतीसाथी लोड हो रहा है…",
      search: "खोजें…",
      back: "पीछे",
      next: "आगे",
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      delete: "हटाएं",
      viewAll: "सभी देखें",
      details: "विवरण",
      acres: "एकड़",
      farmer: "किसान",
      greetingMorning: "शुभ प्रभात",
      greetingAfternoon: "शुभ दोपहर",
      greetingEvening: "शुभ संध्या",
      detectLocation: "मेरी लोकेशन पता करें",
      detectingLocation: "GPS से खोज रहे हैं…",
      currentLocation: "वर्तमान स्थान",
      kmAway: "किमी दूर",
      verifiedMandi: "एगमार्कनेट सत्यापित एपीएमसी",
      liveData: "लाइव डेटा",
    },
    dashboard: {
      kpiProfitForecast: "अनुमानित शुद्ध मुनाफा",
      kpiLandCoverage: "कुल कृषि भूमि",
      kpiUtilized: "उपयोग में",
      kpiActiveLoans: "सक्रिय किसान ऋण",
      kpiSchemeBenefits: "योजना लाभ राशि",
      kpiActive: "सक्रिय योजनाएं",
      crisisAlertTitle: "होर्मुज जलडमरूमध्य उर्वरक संकट अलर्ट",
      crisisAlertBadge: "लाइव संकट मॉनिटर",
      quickActions: "त्वरित सेवाएं",
      predictProfit: "मुनाफा जांचें",
      checkLoans: "ऋण पात्रता",
      findSchemes: "योजनाएं खोजें",
      askAi: "AI सहायक से पूछें",
      marketPulse: "लाइव मंडी भाव",
      weatherCardTitle: "मौसम एवं कृषि रडार",
      humidity: "नमी",
      wind: "हवा की गति",
      uvIndex: "यूवी इंडेक्स",
      recentActivity: "हाल की गतिविधियां",
    },
    market: {
      title: "मंडी भाव और नजदीकी एपीएमसी",
      subtitle: "आपकी लोकेशन के आधार पर नजदीकी मंडियों के असली एगमार्कनेट भाव",
      selectCrop: "फसल चुनें",
      currentPrice: "वर्तमान मॉडल भाव",
      mspPrice: "सरकारी समर्थन मूल्य (MSP)",
      bestMandiPrice: "सर्वोत्तम मंडी भाव",
      aboveMsp: "एमएसपी से अधिक",
      priceTrend: "भाव रुझान (पिछले 6 माह)",
      nearestMandis: "दूरी के अनुसार नजदीकी मंडियां",
      searchMandi: "मंडी या जिला खोजें...",
      distanceFilter: "दूरी अनुसार क्रमबद्ध करें",
      arrivals: "आवक",
      modalPrice: "मॉडल भाव",
      minMaxPrice: "न्यूनतम / अधिकतम",
      aiSellRecommendation: "AI फसल बिक्री सलाह",
      whyPricesMoving: "बाजार विश्लेषण एवं कारण",
      setPriceAlert: "मंडी भाव SMS अलर्ट सेट करें",
      alertTargetPlaceholder: "लक्षित मूल्य दर्ज करें (₹)",
      alertButton: "अलर्ट सेट करें",
      alertActive: "अलर्ट सक्रिय है",
      alertSuccessMsg: "एसएमएस और ऐप अलर्ट सफलतापूर्वक पंजीकृत किया गया!",
    },
    crops: {
      title: "फसल मुनाफा एवं उत्पादन अनुमान",
      subtitle: "उर्वरक संकट मूल्यों के साथ एआई-आधारित सटीक आर्थिक विश्लेषण",
      stepCropLocation: "फसल और स्थान",
      stepSoilSeason: "मिट्टी और मौसम",
      stepInputCosts: "लागत खर्च",
      stepResults: "मुनाफा परिणाम",
      selectCrop: "फसल का चयन करें",
      state: "राज्य व जिला",
      landSize: "कृषि भूमि का आकार",
      soilType: "मिट्टी का प्रकार",
      season: "फसल मौसम",
      fertilizerCrisisAdjustment: "सक्रिय संकट: यूरिया/डीएपी मूल्य में +35% वृद्धि लागू",
      totalEstimatedCost: "कुल अनुमानित इनपुट लागत",
      predictButton: "मुनाफा और पैदावार निकालें",
      predicting: "AI गणना कर रहा है...",
      totalCost: "कुल खेती खर्च",
      estRevenue: "अनुमानित कुल आय",
      netProfit: "शुद्ध किसान मुनाफा",
      roi: "निवेश पर लाभ (ROI)",
      costBreakdown: "खर्चों का विभाजन",
      yieldAnalysis: "पैदावार एवं उत्पादन विश्लेषण",
      yieldPerAcre: "पैदावार प्रति एकड़",
      totalYield: "कुल पैदावार",
      pricePerQuintal: "मंडी बिक्री दर",
      aiAdvisory: "एआई कृषि विशेषज्ञ सलाह",
      newPrediction: "नई गणना करें",
      downloadReport: "सलाहकार रिपोर्ट डाउनलोड करें (PDF)",
    },
    chat: {
      assistantTitle: "खेतीसाथी एआई सहायक",
      engineBadge: "गूगल जेमिनी एआई द्वारा संचालित (हिंदी, मराठी, अंग्रेजी)",
      placeholder: "हिंदी, मराठी या अंग्रेजी में सवाल पूछें (उदा. गेहूं कब बेचें? / यूरिया का विकल्प?)",
      thinking: "कृषि डेटा का विश्लेषण हो रहा है...",
      viewReasoning: "AI विचार एवं तर्क देखें",
      quickQuestions: [
        "यूरिया की कमी से कैसे बचें और नैनो यूरिया का सही उपयोग क्या है?",
        "गेहूं की फसल बेचने का सबसे सही समय कौन सा है?",
        "पीएम-किसान सम्मान निधि के ₹6000 खाते में कैसे प्राप्त करें?",
        "खेती की इनपुट लागत 30% तक कैसे कम करें?",
        "किसान क्रेडिट कार्ड (KCC) पर 4% ब्याज का लाभ कैसे लें?",
        "खरीफ सीजन के लिए सबसे अधिक मुनाफे वाली फसलें कौन सी हैं?",
      ],
    },
    landing: {
      heroBadge: "🇮🇳 भारत का #1 स्मार्ट कृषि एवं मंडी प्लेटफॉर्म",
      heroTitle: "जेमिनी AI और वास्तविक मंडी भावों से बढ़ाएं अपनी खेती का मुनाफा",
      heroSubtitle: "सटीक फसल मुनाफा पूर्वानुमान, जीपीएस द्वारा नजदीकी एपीएमसी मंडियों के असली भाव, ओपन-मेटियो मौसम रडार और उर्वरक संकट समाधान।",
      registerBtn: "मुफ्त पंजीकरण करें",
      launchBtn: "ऐप शुरू करें",
      exploreDemoBtn: "लाइव डेमो देखें",
      loginBtn: "किसान लॉगिन",
      liveTickerTitle: "आज के ताजा मंडी भाव (एगमार्कनेट)",
      featuresTitle: "भारतीय किसानों के लिए विशेष रूप से तैयार",
      featuresSubtitle: "मुनाफा बढ़ाने, फसल सुरक्षा और सही मंडी चुनने के लिए संपूर्ण डिजिटल कृषि समाधान।",
      statsFarmers: "50,000+ संतुष्ट किसान",
      statsMandis: "80+ एपीएमसी मंडियां जुड़ी हैं",
      statsSavings: "₹4,800/एकड़ लागत की बचत",
      statsAccuracy: "94.2% AI सटीक अनुमान",
      testimonialsTitle: "महाराष्ट्र, पंजाब और मध्य प्रदेश के किसानों का भरोसा",
      faqTitle: "अक्सर पूछे जाने वाले सवाल",
      footerTagline: "खेतीसाथी — हर भारतीय किसान को समृद्ध और आत्मनिर्भर बनाने का संकल्प।",
    },
    auth: {
      signInTab: "लॉगिन करें",
      registerTab: "नया किसान पंजीकरण",
      signInTitle: "खेतीसाथी खाते में लॉगिन करें",
      registerTitle: "नया किसान खाता बनाएं एवं सिंक करें",
      phoneLabel: "मोबाइल नंबर",
      phonePlaceholder: "+91 98765 43210",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "सुरक्षित पासवर्ड डालें",
      nameLabel: "किसान का पूरा नाम",
      namePlaceholder: "जैसे: रमेश पाटिल",
      acresLabel: "कुल कृषि भूमि (एकड़ में)",
      cropsLabel: "मुख्य उगाई जाने वाली फसलें",
      stateLabel: "राज्य",
      districtLabel: "जिला",
      villageLabel: "गांव",
      signInBtn: "प्रवेश करें →",
      registerBtn: "खाता बनाएं और शुरू करें",
      quickDemoTitle: "— एक-क्लिक डेमो किसान प्रोफाइल —",
      invalidCreds: "अमान्य फोन नंबर या पासवर्ड। नीचे दिए डेमो खाते से लॉगिन करें।",
      registrationSuccess: "पंजीकरण सफल! डैशबोर्ड पर भेजा जा रहा है...",
    },
    expenses: {
      title: "खेती खर्च खाता एवं बहीखाता",
      subtitle: "अपने सभी कृषि खर्चों को दर्ज करें, श्रेणीबद्ध करें और क्लाउड पर सुरक्षित रखें",
      addExpense: "नया खर्च जोड़ें",
      totalThisSeason: "इस सीजन का कुल खर्च",
      highestCategory: "सर्वाधिक खर्च की श्रेणी",
      thisMonth: "इस माह का खर्च",
      aiInsightTitle: "AI खर्च विश्लेषण",
      monthlySpending: "मासिक खर्च रुझान",
      categoryBreakdown: "श्रेणीवार खर्च विभाजन",
      searchExpenses: "खर्च खोजें...",
      exportCsv: "CSV डाउनलोड करें",
      exportPdf: "PDF / प्रिंट निकालें",
      category: "श्रेणी",
      amount: "राशि (₹)",
      date: "दिनांक",
      notes: "विवरण / नोट",
      saveExpense: "खर्च सुरक्षित करें",
      noExpenses: "इस फिल्टर के अनुसार कोई खर्च नहीं मिला।",
    },
    schemes: {
      title: "सरकारी कृषि योजनाएं",
      subtitle: "केंद्रीय व राज्य सरकार की आर्थिक सहायता, सब्सिडी एवं पात्रता जांच",
      eligibleBenefits: "कुल पात्र सरकारी सहायता",
      schemesAvailable: "सक्रिय योजनाएं",
      applied: "आवेदन किया गया",
      searchSchemes: "योजना खोजें...",
      applyNow: "आवेदन करें",
      deadline: "अंतिम तिथि",
    },
    loans: {
      title: "किसान क्रेडिट कार्ड एवं कृषि ऋण",
      subtitle: "कम ब्याज पर संस्थागत ऋण, ब्याज छूट एवं पूर्व-स्वीकृत सीमा",
      preApprovedLimit: "पूर्व-स्वीकृत सीमा",
      effectiveRate: "प्रभावी ब्याज दर",
      activeLoanAmount: "उपयोग किया गया ऋण",
      applyLoan: "ऋण हेतु आवेदन करें",
      subsidyIncluded: "ब्याज छूट शामिल",
    },
    crisis: {
      title: "उर्वरक संकट मॉनिटर",
      subtitle: "होर्मुज जलमार्ग संकट ट्रैकर, यूरिया मूल्य वृद्धि एवं विकल्प प्रबंधन",
      activeAlert: "होर्मुज आपूर्ति बाधा सक्रिय है",
      ureaSpike: "यूरिया मूल्य वृद्धि",
      dapSpike: "डीएपी मूल्य वृद्धि",
      reliefPackage: "सरकारी राहत पैकेज",
      substituteSolution: "नैनो यूरिया समाधान",
    },
    agriServices: {
      sectionTitle: "कृषि सेवाएं एवं महाविस्तार हब",
      sectionSubtitle: "महाविस्तार-एआई से प्रेरित संपूर्ण कृषि प्रबंधन, मौसम एवं तकनीकी सलाह",
      categories: {
        aiAndProtection: "एआई एवं फसल सुरक्षा",
        farmAndAdvisory: "फसल प्रबंधन एवं मौसम",
        economicsAndStorage: "कृषि-अर्थशास्त्र एवं भंडारण",
        schemesAndCommunity: "सरकारी योजनाएं एवं ज्ञान",
      },
      services: {
        aiChat: { title: "एआई कृषि सहायक", desc: "गूगल जेमिनी द्वारा संचालित त्रिभाषी कृषि चैटबॉट", badge: "जेमिनी एआई", link: "/chat" },
        cropManagement: { title: "फसल प्रबंधन एवं खेत", desc: "फसलें, गट नंबर, बुवाई तिथि और विकास अवस्थाएं", badge: "मुख्य", link: "/crops" },
        cropAdvisory: { title: "फसल सलाह एवं अवस्थाएं", desc: "अवस्था-वार प्रबंधन, पोषण और बुवाई सलाह", badge: "सलाह", link: "/advisory" },
        weatherAdvisory: { title: "कृषि मौसम रडार", desc: "लाइव 5-दिवसीय मौसम एवं छिड़काव अनुकूलता चेतावनी", badge: "लाइव रडार", link: "/weather" },
        pestScanner: { title: "एआई कीट एवं रोग डॉक्टर", desc: "पत्ती फोटो स्कैन, लक्षण पहचान व उपचार", badge: "मल्टीमॉडल", link: "/scanner" },
        soilHealth: { title: "मृदा स्वास्थ्य कार्ड", desc: "डिजिटल मिट्टी परीक्षण रिपोर्ट, पीएच एवं एनपीके", badge: "मृदा कार्ड", link: "/soil-health" },
        fertilizerCalc: { title: "उर्वरक कैलकुलेटर", desc: "सटीक एनपीके मात्रा, नैनो यूरिया व विभाजन खुराक", badge: "कैलकुलेटर", link: "/fertilizer-calculator" },
        marketPrices: { title: "मंडी भाव एवं एपीएमसी", desc: "लाइव मंडी भाव, एमएसपी तुलना व नजदीकी मंडियां", badge: "एगमार्कनेट", link: "/market" },
        warehouses: { title: "गोदाम एवं कोल्ड स्टोरेज", desc: "डब्ल्यूडीआरए/एमएसडब्ल्यूसी मान्यता प्राप्त भंडारण केंद्र", badge: "निर्देशिका", link: "/warehouses" },
        costCalculator: { title: "लागत एवं मुनाफा कैलकुलेटर", desc: "बीज, खाद, श्रम, मशीनरी खर्च व शुद्ध लाभ", badge: "कैलकुलेटर", link: "/calculator" },
        schemes: { title: "सरकारी योजनाएं", desc: "महाडीबीटी, पोक्रा, पीएम-किसान एवं सब्सिडी निर्देशिका", badge: "डीबीटी पोर्टल", link: "/schemes" },
        chcLocator: { title: "कस्टम हायरिंग सेंटर (CHC)", desc: "कृषि यंत्र बैंक, ट्रैक्टर एवं ड्रोन किराए पर लें", badge: "मैप व्यू", link: "/chc-locator" },
        knowledge: { title: "कृषि ज्ञान केंद्र", desc: "वैज्ञानिक कार्यप्रणाली (एसओपी) व आईपीएम दिशानिर्देश", badge: "आईसीएआर", link: "/knowledge" },
        experts: { title: "विशेषज्ञ परामर्श (Q&A)", desc: "कृषि विश्वविद्यालय वैज्ञानिकों से सीधा सवाल-जवाब", badge: "प्रश्नोत्तरी", link: "/experts" },
        videos: { title: "डिजिटल खेतीशाला", desc: "किसान प्रशिक्षण वीडियो, वेबिनार व सफलता की कहानियां", badge: "खेतीशाला", link: "/videos" },
        magazines: { title: "कृषि पत्रिकाएं", desc: "शेतकरी व महापशुधन आधिकारिक मासिक पत्रिकाएं", badge: "ई-बुक", link: "/magazines" },
        notifications: { title: "कृषि समाचार एवं अलर्ट", desc: "मौसम चेतावनी, कीट प्रकोप सूचना व मंडी अपडेट", badge: "अलर्ट", link: "/notifications" },
      },
    },
    cropManagement: {
      title: "फसल प्रबंधन एवं खेत प्लॉट",
      subtitle: "खेत, गट नंबर, बुवाई तिथि और फसल विकास अवस्थाओं की निगरानी",
      addCrop: "नई फसल जोड़ें",
      editCrop: "फसल विवरण संपादित करें",
      cropName: "फसल का नाम",
      variety: "फसल की किस्म",
      sowingDate: "बुवाई / रोपाई की तिथि",
      farmPlot: "खेत / प्लॉट का नाम",
      gatNumber: "गट / खसरा नंबर",
      area: "रकबा (क्षेत्रफल)",
      areaUnit: "इकाई",
      currentStage: "वर्तमान विकास अवस्था",
      daysAfterSowing: "बुवाई के बाद के दिन (DAS)",
      growthTimeline: "फसल विकास अवस्थाएं",
      cropHistory: "फसल इतिहास",
      noCropsYet: "अभी तक कोई फसल नहीं जोड़ी गई",
      noCropsDesc: "अवस्था-वार सलाह, मौसम अलर्ट और कीट सूचना पाने हेतु अपनी पहली फसल जोड़ें।",
      viewAdvisory: "अवस्था सलाह देखें",
      viewPests: "कीट चेतावनी",
      saveCrop: "फसल सुरक्षित करें",
    },
    soilHealth: {
      title: "डिजिटल मृदा स्वास्थ्य कार्ड",
      subtitle: "आधिकारिक पोषक तत्व रेटिंग, मिट्टी पीएच एवं संतुलित उर्वरक प्रबंधन",
      shcNumber: "मृदा स्वास्थ्य कार्ड संख्या",
      testDate: "नमूना परीक्षण तिथि",
      labName: "परीक्षण प्रयोगशाला / केवीके",
      parametersTitle: "प्रमुख पोषक तत्व एवं पीएच",
      low: "कम (न्यून)",
      medium: "मध्यम (पर्याप्त)",
      high: "अधिक (उच्च)",
      uploadReport: "मृदा रिपोर्ट अपलोड करें (PDF/फोटो)",
      viewPdf: "लैब रिपोर्ट देखें",
      geminiInterpretation: "जेमिनी एआई मिट्टी विश्लेषण",
      enterValues: "मिट्टी जांच मान दर्ज करें",
      saveRecord: "रिकॉर्ड सुरक्षित करें",
    },
    fertilizerCalc: {
      title: "सटीक उर्वरक कैलकुलेटर",
      subtitle: "वैज्ञानिक एन-पी-के सिफारिश, नैनो यूरिया संकट समाधान एवं विभाजन खुराक",
      selectCrop: "फसल चुनें",
      farmArea: "खेत का क्षेत्रफल",
      areaUnit: "इकाई",
      targetYield: "लक्ष्य उपज (क्विंटल/एकड़)",
      haveSoilReport: "क्या आपके पास मिट्टी जांच रिपोर्ट है?",
      fymManure: "गोबर की खाद / एफवाईएम (टन)",
      productOption: "उर्वरक उत्पाद पैकेज",
      conventional: "पारंपरिक (यूरिया + डीएपी + एमओपी)",
      nanoPackage: "इको-नैनो पैकेज (नैनो यूरिया + नैनो डीएपी + एमओपी)",
      sspPackage: "एसएसपी पैकेज (सिंगल सुपर फास्फेट + यूरिया + पोटाश)",
      calculateBtn: "सटीक उर्वरक मात्रा निकालें",
      totalRequiredNutrients: "कुल आवश्यक प्राथमिक पोषक तत्व",
      productsBreakdown: "आवश्यक खाद उत्पाद",
      splitDosingTitle: "चरणबद्ध खुराक (खुराक विभाजन)",
      formulasTitle: "वैज्ञानिक सूत्र एवं गणना पद्धति",
      costSavingsHighlight: "नैनो उर्वरक से अनुमानित बचत",
    },
    warehouses: {
      title: "गोदाम एवं कोल्ड स्टोरेज निर्देशिका",
      subtitle: "अपने नजदीकी एमएसडब्ल्यूसी और डब्ल्यूडीआरए मान्यता प्राप्त सुरक्षित भंडारण केंद्र खोजें",
      searchPlaceholder: "जिला, तालुका या गोदाम नाम से खोजें...",
      filterDistrict: "जिला चुनें",
      totalCapacity: "कुल क्षमता",
      availableCapacity: "उपलब्ध खाली जगह",
      contactNumber: "संपर्क मोबाइल",
      ratesPerQuintal: "भंडारण दर",
      amenities: "गोदाम सुविधाएं",
      getDirections: "नक्शे पर रास्ता देखें",
    },
    chcLocator: {
      title: "कस्टम हायरिंग सेंटर (CHC) खोजें",
      subtitle: "ट्रैक्टर, हार्वेस्टर, रोटावेटर एवं ड्रोन किराए पर उपलब्ध कराने वाले नजदीकी केंद्र",
      searchPlaceholder: "कृषि यंत्र या केंद्र का नाम खोजें...",
      filterDistrict: "जिला चुनें",
      nearbyCentres: "उपलब्ध कृषि यंत्र केंद्र",
      machineryAvailable: "उपलब्ध मशीनरी",
      hourlyRate: "प्रति घंटा दर",
      dailyRate: "प्रति दिन दर",
      callCentre: "केंद्र प्रबंधक को कॉल करें",
      bookEquipment: "यंत्र बुक करें",
    },
    knowledgeHub: {
      title: "कृषि ज्ञान केंद्र एवं मानक कार्यप्रणाली (SOP)",
      subtitle: "उन्नत फसल पद्धतियां, पैकेज ऑफ प्रैक्टिसेज एवं एकीकृत कीट प्रबंधन दिशानिर्देश",
      searchArticles: "एसओपी, फसल गाइड, कीट नियंत्रण खोजें...",
      allCategories: "सभी विषय",
      cropSop: "फसल एसओपी",
      pestManagement: "कीट प्रबंधन",
      organicFarming: "जैविक कृषि",
      readArticle: "संपूर्ण गाइड पढ़ें",
    },
    expertsCorner: {
      title: "विशेषज्ञ परामर्श (तज्ञांचा सल्ला)",
      subtitle: "कृषि विश्वविद्यालय के वैज्ञानिकों एवं विस्तार अधिकारियों से सीधा मार्गदर्शन प्राप्त करें",
      askQuestion: "कृषि वैज्ञानिक से सवाल पूछें",
      postQuery: "प्रश्न दर्ज करें",
      expertVerified: "सत्यापित कृषि वैज्ञानिक",
      universityAffiliation: "एमपीकेवी राहुरी / पीडीकेवी अकोला / आईसीएआर",
      yourQuestionPlaceholder: "फसल का नाम, लक्षण, बुवाई की तारीख व अपनी समस्या विस्तार से लिखें...",
      submitQuery: "विशेषज्ञ पैनल को प्रश्न भेजें",
    },
    shetishala: {
      title: "डिजिटल खेतीशाला (Digital Shetishala)",
      subtitle: "वैज्ञानिक प्रशिक्षण वीडियो, लाइव वेबिनार एवं किसान पाठशाला",
      featuredLive: "विशेष खेतीशाला सत्र",
      watchNow: "वीडियो देखें",
      trainingModules: "प्रशिक्षण वीडियो श्रृंखला",
      upcomingWebinars: "आगामी लाइव वेबिनार",
    },
    magazines: {
      title: "कृषि पत्रिकाएं एवं ई-बुलेटिन",
      subtitle: "शेतकरी मासिक, महापशुधन एवं कृषि संवाद के आधिकारिक संस्करण",
      readMagazine: "ऑनलाइन पढ़ें",
      downloadPdf: "पीडीएफ डाउनलोड",
      publisher: "प्रकाशक",
      latestIssues: "नवीनतम अंक",
    },
    notificationsHub: {
      title: "कृषि सूचनाएं एवं चेतावनी",
      subtitle: "मौसम चेतावनी, कीट प्रकोप पूर्वसूचना, मंडी तेजी-मंदी व सरकारी योजना अपडेट",
      allAlerts: "सभी अलर्ट",
      weatherAlerts: "मौसम चेतावनी",
      pestWarnings: "कीट पूर्वसूचना",
      mandiUpdates: "मंडी भाव अलर्ट",
      markAllRead: "सभी को पढ़ा हुआ मार्क करें",
    },

  },

  mr: {
    appName: "शेतीसाथी",
    appTagline: "महाराष्ट्रातील व भारतीय शेतकऱ्यांचा विश्वासू डिजिटल कृषी साथी",
    nav: {
      dashboard: "डॅशबोर्ड",
      cropPrediction: "पीक नफा अंदाज",
      marketPrices: "बाजारभाव व बाजार समित्या",
      loans: "किसान कर्ज / KCC",
      schemes: "शासकीय योजना",
      expenses: "शेती खर्च वही",
      chat: "AI कृषी सहाय्यक",
      healthScore: "फार्म हेल्थ स्कोअर",
      crisisHub: "संकट मॉनिटर",
      settings: "सेटिंग्ज",
    },
    common: {
      loading: "शेतीसाथी सुरू होत आहे…",
      search: "शोधा…",
      back: "मागे",
      next: "पुढे",
      save: "जतन करा",
      cancel: "रद्द करा",
      delete: "हटवा",
      viewAll: "सर्व पहा",
      details: "तपशील",
      acres: "एकर",
      farmer: "शेतकरी बंधू",
      greetingMorning: "शुभ सकाळ",
      greetingAfternoon: "शुभ दुपार",
      greetingEvening: "शुभ संध्याकाळ",
      detectLocation: "माझे जीपीएस स्थान शोधा",
      detectingLocation: "स्थान शोधत आहे…",
      currentLocation: "सध्याचे स्थान",
      kmAway: "किमी अंतरावर",
      verifiedMandi: "सत्यापित कृषी उत्पन्न बाजार समिती",
      liveData: "थेट दर",
    },
    dashboard: {
      kpiProfitForecast: "अंदाजित निव्वळ नफा",
      kpiLandCoverage: "एकूण लागवड क्षेत्र",
      kpiUtilized: "वापरात",
      kpiActiveLoans: "सक्रिय पीक कर्ज",
      kpiSchemeBenefits: "शासकीय योजना लाभ",
      kpiActive: "सक्रिय योजना",
      crisisAlertTitle: "हॉर्मुझ आखात खत संकट सतर्कता",
      crisisAlertBadge: "थेट संकट निरीक्षण",
      quickActions: "जलद सेवा",
      predictProfit: "नफा अंदाज काढा",
      checkLoans: "कर्ज पात्रता तपासा",
      findSchemes: "योजना शोधा",
      askAi: "AI सहाय्यकाला विचारा",
      marketPulse: "थेट बाजारभाव कल",
      weatherCardTitle: "हवामान व कृषी रडार",
      humidity: "हवेतील आर्द्रता",
      wind: "वाऱ्याचा वेग",
      uvIndex: "अतिनील निर्देशांक",
      recentActivity: "नुकत्याच घडलेल्या घडामोडी",
    },
    market: {
      title: "बाजारभाव आणि जवळच्या कृषी उत्पन्न बाजार समित्या",
      subtitle: "तुमच्या स्थानावरून सर्वात जवळच्या बाजार समित्यांचे थेट एगमार्कनेट दर",
      selectCrop: "शेतमाल निवडा",
      currentPrice: "सध्याचा सरासरी (मॉडल) भाव",
      mspPrice: "शासकीय हमीभाव (MSP २०२५-२६)",
      bestMandiPrice: "सर्वोत्तम बाजारभाव",
      aboveMsp: "हमीभावापेक्षा जास्त",
      priceTrend: "भाव कल (मागील ६ महिने)",
      nearestMandis: "अंतराप्रमाणे जवळच्या बाजार समित्या",
      searchMandi: "बाजार समिती किंवा जिल्हा शोधा...",
      distanceFilter: "अंतराप्रमाणे क्रमवारी",
      arrivals: "दैनिक आवक",
      modalPrice: "सरासरी भाव",
      minMaxPrice: "किमान / कमाल",
      aiSellRecommendation: "AI शेतमाल विक्री सल्ला",
      whyPricesMoving: "बाजार विश्लेषण आणि कारणे",
      setPriceAlert: "बाजारभाव SMS अलर्ट सेट करा",
      alertTargetPlaceholder: "अपेक्षित दर टाका (₹)",
      alertButton: "अलर्ट सेट करा",
      alertActive: "अलर्ट सुरू आहे",
      alertSuccessMsg: "एसएमएस व अ‍ॅप अलर्ट यशस्वीरीत्या नोंदवला गेला आहे!",
    },
    crops: {
      title: "पीक नफा व उत्पादन अंदाज",
      subtitle: "खतांचे वाढीव दर लक्षात घेऊन एआय द्वारे अचूक कृषी आर्थिक नियोजन",
      stepCropLocation: "पीक व ठिकाण",
      stepSoilSeason: "जमीन व हंगाम",
      stepInputCosts: "उत्पादन खर्च",
      stepResults: "नफा अंदाज",
      selectCrop: "पीक निवडा",
      state: "राज्य व जिल्हा",
      landSize: "शेतजमीन आकार",
      soilType: "मातीचा प्रकार",
      season: "लागवड हंगाम",
      fertilizerCrisisAdjustment: "चालू संकट: युरिया व डीएपी खतांचे दर +३५% वाढलेले आहेत",
      totalEstimatedCost: "अंदाजित एकूण खर्च",
      predictButton: "नफा व उत्पादन काढा",
      predicting: "AI गणित मांडत आहे...",
      totalCost: "एकूण शेती खर्च",
      estRevenue: "अंदाजित एकूण उत्पन्न",
      netProfit: "निव्वळ शेतकरी नफा",
      roi: "गुंतवणुकीवरील परतावा (ROI)",
      costBreakdown: "खर्चाचे विभाजन",
      yieldAnalysis: "उत्पादन व पीक क्षमता विश्लेषण",
      yieldPerAcre: "एकरनिहाय उत्पादन",
      totalYield: "एकूण उत्पादन (क्विंटल)",
      pricePerQuintal: "अंदाजित विक्री दर",
      aiAdvisory: "एआय कृषी तज्ज्ञ सल्ला",
      newPrediction: "पुन्हा अंदाज घ्या",
      downloadReport: "शेतकरी अहवाल डाउनलोड करा (PDF)",
    },
    chat: {
      assistantTitle: "शेतीसाथी एआय सहाय्यक",
      engineBadge: "गुगल जेमिनी एआय समर्थित (मराठी, हिंदी, इंग्रजी)",
      placeholder: "मराठी, हिंदी किंवा इंग्रजीत विचारा (उदा. कांदा कधी विकावा? / युरियाला पर्याय काय?)",
      thinking: "कृषी माहितीचे विश्लेषण चालू आहे...",
      viewReasoning: "AI चा विचार व विश्लेषण पहा",
      quickQuestions: [
        "युरिया खताची टंचाई असताना नॅनो युरिया कसा वापरावा?",
        "माझा कांदा/गहू बाजारात विकण्याची सर्वोत्तम वेळ कोणती?",
        "नमो शेतकरी महासन्मान व पीएम-किसान योजनेचा पुढील हप्ता कधी जमा होणार?",
        "शेतीचा मशागत व औषध फवारणी खर्च २५-३०% ने कसा कमी करावा?",
        "पीक कर्जावर (KCC) शून्य टक्के व्याजाचा लाभ कसा मिळवावा?",
        "आगामी खरीप हंगामासाठी कमी पाण्यात येणारी फायदेशीर पिके कोणती?",
      ],
    },
    landing: {
      heroBadge: "🇮🇳 भारतातील #1 स्मार्ट कृषी आणि बाजारभाव प्लॅटफॉर्म",
      heroTitle: "जेमिनी AI आणि थेट बाजारभावांसह शेतीचा नफा दुप्पट करा",
      heroSubtitle: "अचूक पीक नफा अंदाज, जीपीएस द्वारे जवळच्या बाजार समित्यांचे थेट दर (उदा. नागपूर, लासलगाव), ओपन-मेटिओ हवामान रडार आणि खत संकट व्यवस्थापन.",
      registerBtn: "मोफत नोंदणी करा",
      launchBtn: "ॲप सुरू करा",
      exploreDemoBtn: "थेट डेमो पहा",
      loginBtn: "शेतकरी लॉगिन",
      liveTickerTitle: "आजचे थेट बाजारभाव (कृषी उत्पन्न बाजार समिती)",
      featuresTitle: "भारतीय व महाराष्ट्रातील शेतकऱ्यांसाठी आधुनिक डिजिटल तंत्रज्ञान",
      featuresSubtitle: "नफा वाढवण्यासाठी, हवामानाचे धोके टाळण्यासाठी आणि शेतमालाला योग्य भाव मिळवण्यासाठी सर्व काही एकाच ठिकाणी.",
      statsFarmers: "५०,०००+ शेतकरी बांधव जोडलेले",
      statsMandis: "८०+ कृषी उत्पन्न बाजार समित्या",
      statsSavings: "₹४,८००/एकर उत्पादन खर्चात बचत",
      statsAccuracy: "९४.२% एआय अंदाज अचूकता",
      testimonialsTitle: "नागपूर, नाशिक, पुणे आणि विदर्भातील शेतकऱ्यांचा विश्वास",
      faqTitle: "वारंवार विचारले जाणारे प्रश्न (FAQ)",
      footerTagline: "शेतीसाथी — प्रत्येक शेतकरी बांधवाला आधुनिक तंत्रज्ञानाने समृद्ध करण्याचा संकल्प.",
    },
    auth: {
      signInTab: "लॉगिन करा",
      registerTab: "नवीन शेतकरी नोंदणी",
      signInTitle: "शेतीसाथी खात्यात प्रवेश करा",
      registerTitle: "नवीन शेतकरी खाते तयार करा",
      phoneLabel: "मोबाईल नंबर",
      phonePlaceholder: "+91 98765 43210",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "सुरक्षित पासवर्ड प्रविष्ट करा",
      nameLabel: "शेतकऱ्याचे संपूर्ण नाव",
      namePlaceholder: "उदा: रमेश पाटील",
      acresLabel: "एकूण शेतजमीन (एकरमध्ये)",
      cropsLabel: "मुख्य लागवड पिके",
      stateLabel: "राज्य",
      districtLabel: "जिल्हा",
      villageLabel: "गाव",
      signInBtn: "प्रवेश करा →",
      registerBtn: "नोंदणी करा व ॲप सुरू करा",
      quickDemoTitle: "— एक-क्लिक डेमो शेतकरी प्रोफाईल —",
      invalidCreds: "चुकीचा मोबाईल नंबर किंवा पासवर्ड. खालील डेमो प्रोफाईल निवडा.",
      registrationSuccess: "नोंदणी यशस्वी झाली! डॅशबोर्डवर नेत आहोत...",
    },
    expenses: {
      title: "शेती खर्च वही व हिशेब",
      subtitle: "शेतीतील बियाणे, खते, मजुरी व इतर खर्च नोंदवा आणि क्लाउडवर सुरक्षित ठेवा",
      addExpense: "नवीन खर्च जोडा",
      totalThisSeason: "या हंगामातील एकूण खर्च",
      highestCategory: "सर्वाधिक खर्चाची श्रेणी",
      thisMonth: "या महिन्यातील खर्च",
      aiInsightTitle: "AI खर्च विश्लेषण",
      monthlySpending: "मासिक खर्च कल",
      categoryBreakdown: "खर्चाचे श्रेणीनिहाय विभाजन",
      searchExpenses: "खर्च शोधा...",
      exportCsv: "CSV डाउनलोड करा",
      exportPdf: "PDF / प्रिंट काढा",
      category: "श्रेणी",
      amount: "रक्कम (₹)",
      date: "तारीख",
      notes: "तपशील / वर्णन",
      saveExpense: "खर्च नोंदवा व सेव्ह करा",
      noExpenses: "या फिल्टरनुसार कोणताही खर्च आढळला नाही.",
    },
    schemes: {
      title: "शासकीय कृषी योजना",
      subtitle: "केंद्र व राज्य शासनाच्या अनुदाने, आर्थिक मदत व पात्रता तपासणी",
      eligibleBenefits: "पात्र एकूण अनुदान",
      schemesAvailable: "सक्रिय योजना",
      applied: "अर्ज केले",
      searchSchemes: "योजना शोधा...",
      applyNow: "अर्ज करा",
      deadline: "अंतिम मुदत",
    },
    loans: {
      title: "किसान क्रेडिट कार्ड व पीक कर्ज",
      subtitle: "कमी व्याजाचे संस्थात्मक कर्ज, व्याज परतावा व पूर्व-मंजूर मर्यादा",
      preApprovedLimit: "पूर्व-मंजूर मर्यादा",
      effectiveRate: "प्रभावी व्याज दर",
      activeLoanAmount: "वापरलेले पीक कर्ज",
      applyLoan: "कर्जासाठी अर्ज करा",
      subsidyIncluded: "व्याज सवलत समाविष्ट",
    },
    crisis: {
      title: "खत संकट मॉनिटर",
      subtitle: "हॉर्मुझ आखात पेचप्रसंग, युरिया दरवाढ व पर्याय व्यवस्थापन",
      activeAlert: "हॉर्मुझ आखात पुरवठा अडथळा सुरू आहे",
      ureaSpike: "युरिया दरवाढ",
      dapSpike: "डीएपी दरवाढ",
      reliefPackage: "शासकीय मदत पॅकेज",
      substituteSolution: "नॅनो युरिया पर्याय",
    },
    agriServices: {
      sectionTitle: "कृषी सेवा केंद्र व महाविस्तार हब",
      sectionSubtitle: "महाविस्तार-एआय (MahaVISTAAR) प्रेरित आधुनिक शेती, हवामान व पीक व्यवस्थापन",
      categories: {
        aiAndProtection: "एआय व पीक संरक्षण",
        farmAndAdvisory: "पीक व्यवस्थापन व हवामान",
        economicsAndStorage: "शेती-अर्थशास्त्र व साठवणूक",
        schemesAndCommunity: "शासकीय योजना व ज्ञान केंद्र",
      },
      services: {
        aiChat: { title: "एआय कृषी सल्लागार", desc: "गुगल जेमिनी आधारित शेतीसाथी त्रिभाषी व्हॉइस चॅटबॉट", badge: "जेमिनी एआय", link: "/chat" },
        cropManagement: { title: "पीक व्यवस्थापन व शेतजमीन", desc: "पिके, गट नंबर, पेरणी तारीख व वाढीचे टप्पे नोंदवा", badge: "मुख्य", link: "/crops" },
        cropAdvisory: { title: "पीक सल्ला व टप्पे", desc: "टप्प्यानुसार मार्गदर्शन, पेरणी सल्ला व अन्नद्रव्ये", badge: "सल्ला", link: "/advisory" },
        weatherAdvisory: { title: "कृषी हवामान रडार", desc: "थेट ५ दिवसांचा अंदाज, फवारणी वेळ व अवकाळी इशारा", badge: "थेट रडार", link: "/weather" },
        pestScanner: { title: "कीड व रोग ओळख डॉक्टर", desc: "पानाचा फोटो स्कॅन करा, लक्षणे ओळखा व उपाय मिळवा", badge: "मल्टीमॉडल", link: "/scanner" },
        soilHealth: { title: "मृदा आरोग्य पत्रिका (SHC)", desc: "डिजिटल माती परीक्षण अहवाल, सामू (pH) व खत शिफारस", badge: "मृदा पत्रिका", link: "/soil-health" },
        fertilizerCalc: { title: "खत कॅल्क्युलेटर (मात्रा गणक)", desc: "अचूक एनपीके मात्रा, नॅनो युरिया व खताचे हप्ते", badge: "कॅल्क्युलेटर", link: "/fertilizer-calculator" },
        marketPrices: { title: "बाजारभाव व कृषी उत्पन्न बाजार", desc: "थेट बाजारभाव, हमीभाव (MSP) व जवळच्या बाजार समित्या", badge: "एगमार्कनेट", link: "/market" },
        warehouses: { title: "गोदाम व साठवणूक निर्देशिका", desc: "महाराष्ट्र वखार महामंडळ (MSWC) गोदाम उपलब्धता", badge: "गोदाम", link: "/warehouses" },
        costCalculator: { title: "पीक खर्च व नफा कॅल्क्युलेटर", desc: "बियाणे, खते, मजुरी, मशागत खर्च व निव्वळ नफा", badge: "कॅल्क्युलेटर", link: "/calculator" },
        schemes: { title: "शासकीय कृषी योजना (डीबीटी)", desc: "नानाजी देशमुख पोक्रा, महाडीबीटी, नमो शेतकरी योजना", badge: "थेट लाभ (DBT)", link: "/schemes" },
        chcLocator: { title: "कृषी अवजारे सेवा केंद्र (CHC)", desc: "ट्रॅक्टर, हार्वेस्टर, रोटाव्हेटर व ड्रोन भाडे केंद्र शोधा", badge: "नकाशा", link: "/chc-locator" },
        knowledge: { title: "कृषी ज्ञान केंद्र (SOP)", desc: "सुधारित लागवड पद्धती, एसओपी व एकात्मिक कीड नियंत्रण", badge: "आयसीएआर एसओपी", link: "/knowledge" },
        experts: { title: "तज्ञांचा सल्ला (Q&A)", desc: "कृषी विद्यापीठ शास्त्रज्ञ व अधिकाऱ्यांकडून थेट मार्गदर्शन", badge: "प्रश्नोत्तरे", link: "/experts" },
        videos: { title: "डिजिटल शेतीशाळा", desc: "शेतकरी प्रशिक्षण व्हिडिओ, वेळापत्रक व यशोगाथा", badge: "शेतीशाळा", link: "/videos" },
        magazines: { title: "कृषी मासिके व ई-बुलेटिन", desc: "शेतकरी मासिक व महापशुधन अधिकृत ई-अंक", badge: "ई-मासिक", link: "/magazines" },
        notifications: { title: "कृषी सूचना व सतर्कता", desc: "हवामान इशारा, किडींचा प्रादुर्भाव व बाजारभाव अलर्ट", badge: "सूचना", link: "/notifications" },
      },
    },
    cropManagement: {
      title: "पीक व्यवस्थापन व शेतजमीन",
      subtitle: "शेताचे नाव, गट नंबर, पेरणी तारीख व पिकांच्या वाढीच्या टप्प्यांचा मागोवा",
      addCrop: "नवीन पीक जोडा",
      editCrop: "पीक तपशील संपादित करा",
      cropName: "पिकाचे नाव",
      variety: "वाण / जाती",
      sowingDate: "पेरणी / लागवड दिनांक",
      farmPlot: "शेताचे नाव / प्लॉट",
      gatNumber: "गट नंबर / सर्व्हे क्र.",
      area: "क्षेत्रफळ",
      areaUnit: "एकक",
      currentStage: "सध्याचा वाढीचा टप्पा",
      daysAfterSowing: "पेरणीनंतरचे दिवस (DAS)",
      growthTimeline: "पीक वाढीचे टप्पे कालमर्यादा",
      cropHistory: "मागील पिकांचा इतिहास",
      noCropsYet: "सध्या कोणतीही पिके जोडलेली नाहीत",
      noCropsDesc: "टप्प्यानुसार अचूक सल्ला, हवामान सूचना व कीड नियंत्रणासाठी आपले पहिले पीक जोडा.",
      viewAdvisory: "टप्प्याचा सल्ला पाहा",
      viewPests: "कीड इशारा",
      saveCrop: "पीक जतन करा",
    },
    soilHealth: {
      title: "मृदा आरोग्य पत्रिका (Soil Health Card)",
      subtitle: "माती परीक्षण अहवाल, सामू (pH), सेंद्रिय कर्ब व सूक्ष्म अन्नद्रव्ये",
      shcNumber: "मृदा आरोग्य पत्रिका क्रमांक",
      testDate: "नमुना तपासणी दिनांक",
      labName: "माती परीक्षण प्रयोगशाळा / केव्हीके",
      parametersTitle: "मातीतील प्रमुख अन्नद्रव्ये व सामू",
      low: "कमी (न्यून)",
      medium: "मध्यम (योग्य)",
      high: "जास्त (अधिक)",
      uploadReport: "अहवाल अपलोड करा (PDF / फोटो)",
      viewPdf: "अहवाल पाहा",
      geminiInterpretation: "जेमिनी एआय माती सल्ला",
      enterValues: "माती चाचणी मूल्ये प्रविष्ट करा",
      saveRecord: "अहवाल जतन करा",
    },
    fertilizerCalc: {
      title: "खत कॅल्क्युलेटर (खताच्या मात्रेची गणना)",
      subtitle: "विद्यापीठ शिफारशीनुसार अचूक एन-पी-के मात्रा, नॅनो युरिया वापर व खतांचे हप्ते",
      selectCrop: "पीक निवडा",
      farmArea: "शेताचे क्षेत्रफळ",
      areaUnit: "एकक",
      targetYield: "लक्ष्य उत्पन्न (क्विंटल/एकर)",
      haveSoilReport: "तुमच्याकडे माती परीक्षण अहवाल आहे का?",
      fymManure: "वापरलेले शेणखत (टन)",
      productOption: "खताचा पर्याय निवडा",
      conventional: "पारंपरिक खते (युरिया + डीएपी + एमओपी)",
      nanoPackage: "इको-नॅनो पॅकेज (नॅनो युरिया + नॅनो डीएपी + पालाश)",
      sspPackage: "एसएसपी पॅकेज (सिंगल सुपर फॉस्फेट + युरिया + पालाश)",
      calculateBtn: "खताच्या मात्रेची गणना करा",
      totalRequiredNutrients: "एकूण आवश्यक मूलद्रव्ये (नत्र, स्फुरद, पालाश)",
      productsBreakdown: "खतांची प्रत्यक्ष पोती व बाटल्या",
      splitDosingTitle: "खताचे टप्प्यानुसार हप्ते (स्प्लिट डोस)",
      formulasTitle: "गणनेचे सूत्र व विद्यापीठ शिफारस",
      costSavingsHighlight: "नॅनो खत पॅकेजमुळे होणारी अंदाजित बचत",
    },
    warehouses: {
      title: "गोदाम उपलब्धता व साठवणूक केंद्र",
      subtitle: "महाराष्ट्र वखार महामंडळ (MSWC) व डब्ल्यूडीआरए प्रमाणित सुरक्षित गोदामे शोधा",
      searchPlaceholder: "जिल्हा, तालुका किंवा गोदामाचे नाव शोधा...",
      filterDistrict: "जिल्हा निवडा",
      totalCapacity: "एकूण क्षमता",
      availableCapacity: "उपलब्ध शिल्लक जागा",
      contactNumber: "संपर्क क्रमांक",
      ratesPerQuintal: "साठवणूक दर",
      amenities: "गोदामातील सुविधा",
      getDirections: "नकाशावर मार्ग पाहा",
    },
    chcLocator: {
      title: "कृषी अवजारे सेवा केंद्र (CHC - अवजारे बँक)",
      subtitle: "ट्रॅक्टर, रोटाव्हेटर, मळणी यंत्रे व ड्रोन वाजवी भाडेतत्त्वावर मिळवा",
      searchPlaceholder: "अवजारे किंवा केंद्राचे नाव शोधा...",
      filterDistrict: "जिल्हा निवडा",
      nearbyCentres: "जवळील कृषी अवजारे केंद्रे",
      machineryAvailable: "उपलब्ध अवजारे व यंत्रसामग्री",
      hourlyRate: "प्रति तास दर",
      dailyRate: "प्रति दिवस दर",
      callCentre: "व्यवस्थापकाला फोन करा",
      bookEquipment: "अवजार बुक करा",
    },
    knowledgeHub: {
      title: "कृषी ज्ञान केंद्र व कार्यपद्धती (SOP)",
      subtitle: "सुधारित पीक लागवड तंत्रज्ञान, एसओपी व एकात्मिक कीड नियंत्रण मार्गदर्शिका",
      searchArticles: "एसओपी, पीक मार्गदर्शन, कीड नियंत्रण शोधा...",
      allCategories: "सर्व विषय",
      cropSop: "पीक एसओपी",
      pestManagement: "कीड व्यवस्थापन",
      organicFarming: "सेंद्रिय शेती",
      readArticle: "संपूर्ण मार्गदर्शिका वाचा",
    },
    expertsCorner: {
      title: "तज्ञांचा सल्ला (Experts Corner)",
      subtitle: "कृषी विद्यापीठ शास्त्रज्ञ व विस्तार अधिकाऱ्यांना थेट प्रश्न विचारा",
      askQuestion: "कृषी तज्ञांना प्रश्न विचारा",
      postQuery: "प्रश्न नोंदवा",
      expertVerified: "अधिकृत कृषी शास्त्रज्ञ",
      universityAffiliation: "महात्मा फुले कृषी विद्यापीठ राहुरी / डॉ. पंजाबराव देशमुख कृषी विद्यापीठ अकोला",
      yourQuestionPlaceholder: "पिकाचे नाव, लक्षणे, पेरणी तारीख व आपली समस्या सविस्तर लिहा...",
      submitQuery: "तज्ञ समितीकडे प्रश्न पाठवा",
    },
    shetishala: {
      title: "डिजिटल शेतीशाळा (Digital Shetishala)",
      subtitle: "आधुनिक शेतीचे शास्त्रीय प्रशिक्षण व्हिडिओ, थेट वेबिनार व यशोगाथा",
      featuredLive: "विशेष शेतीशाळा सत्र",
      watchNow: "व्हिडिओ पाहा",
      trainingModules: "प्रशिक्षण व्हिडिओ मालिका",
      upcomingWebinars: "आगामी थेट शेतीशाळा सत्र",
    },
    magazines: {
      title: "कृषी मासिके व ई-बुलेटिन",
      subtitle: "शेतकरी मासिक, महापशुधन व कृषी संवाद अधिकृत शासकीय ई-अंक",
      readMagazine: "ऑनलाइन वाचा",
      downloadPdf: "पीडीएफ डाउनलोड करा",
      publisher: "प्रकाशक",
      latestIssues: "नवीनतम प्रकाशित अंक",
    },
    notificationsHub: {
      title: "कृषी सूचना व हवामान इशारे",
      subtitle: "हवामान इशारा, किडींचा प्रादुर्भाव, बाजारभाव तेजी-मंदी व शासकीय योजना",
      allAlerts: "सर्व सूचना",
      weatherAlerts: "हवामान इशारे",
      pestWarnings: "कीड व रोग इशारे",
      mandiUpdates: "बाजारभाव सूचना",
      markAllRead: "सर्व वाचले म्हणून चिन्हांकित करा",
    },

  },
};

export function getTranslation(lang: Language = "en"): Translations {
  return translations[lang] || translations.en;
}
