// ============================================
// KRISHIAI — MULTI-USER DEMO AUTH STORE
// ============================================

export interface DemoUser {
  uid: string;
  name: string;
  username?: string;
  phone: string;
  password?: string;
  passwordHash?: string;
  state: string;
  district: string;
  village: string;
  acres: number;
  crops: string[];
  avatar: string;
  aadhaar_last4: string;
  bankAccount: string;
  kpi: {
    netProfitForecast: number;
    netProfitChange: number;
    landCoverage: number;
    landUtilization: number;
    activeLoans: number;
    totalLoanAmount: number;
    schemeBenefits: number;
    schemesApplied: number;
  };
  healthScore: number;
  recentActivities: { id: string; icon: string; text: string; time: string }[];
  loans: { id: string; type: string; bank: string; limit: number; emi: number; effectiveRate: number; status: string; tenure: string; subsidyRate: number; features: string[] }[];
  expenses: { id: string; category: string; amount: number; date: string; notes: string }[];
}

export const DEMO_USERS: DemoUser[] = [
  {
    uid: "user-001",
    name: "Rajesh Kumar",
    username: "rajesh",
    phone: "+91 98765 43210",
    password: "demo123",
    state: "Punjab",
    district: "Ludhiana",
    village: "Machhiwara",
    acres: 12,
    crops: ["Wheat", "Rice", "Mustard"],
    avatar: "RK",
    aadhaar_last4: "4523",
    bankAccount: "SBI, Ludhiana Branch",
    healthScore: 74,
    kpi: {
      netProfitForecast: 485000,
      netProfitChange: 12.5,
      landCoverage: 12,
      landUtilization: 92,
      activeLoans: 2,
      totalLoanAmount: 350000,
      schemeBenefits: 126000,
      schemesApplied: 4,
    },
    recentActivities: [
      { id: "a1", icon: "💰", text: "PM-Kisan installment ₹2,000 credited", time: "2 hours ago" },
      { id: "a2", icon: "📈", text: "Wheat price rose to ₹2,330/qtl in Jalandhar", time: "4 hours ago" },
      { id: "a3", icon: "🌾", text: "AI crop prediction updated for Rabi season", time: "Yesterday" },
      { id: "a4", icon: "💳", text: "KCC loan EMI of ₹4,200 debited", time: "2 days ago" },
      { id: "a5", icon: "🚨", text: "Crisis alert: Urea price up 35%", time: "3 days ago" },
    ],
    loans: [
      { id: "l1", type: "Kisan Credit Card (KCC)", bank: "State Bank of India", limit: 300000, emi: 4200, effectiveRate: 4.0, status: "Pre-Approved", tenure: "5 Years", subsidyRate: 3.0, features: ["Zero collateral up to ₹1.6L", "Interest subvention 3%", "Crop insurance included"] },
      { id: "l2", type: "PM Agriculture Infrastructure Fund", bank: "Punjab National Bank", limit: 1000000, emi: 9800, effectiveRate: 3.0, status: "Eligible", tenure: "10 Years", subsidyRate: 4.0, features: ["3% interest subvention", "Govt backed", "Farm storage eligible"] },
    ],
    expenses: [
      { id: "e1", category: "Fertilizer", amount: 28500, date: "2026-03-10", notes: "Urea 10 bags + DAP 5 bags" },
      { id: "e2", category: "Labor", amount: 12000, date: "2026-03-05", notes: "Wheat harvesting wages" },
      { id: "e3", category: "Seeds", amount: 8000, date: "2026-02-20", notes: "HD-2967 wheat seeds 40kg" },
      { id: "e4", category: "Irrigation", amount: 6000, date: "2026-02-15", notes: "Canal water charges + diesel" },
      { id: "e5", category: "Machinery", amount: 10000, date: "2026-03-18", notes: "Combine harvester rental" },
      { id: "e6", category: "Pesticide", amount: 3200, date: "2026-02-28", notes: "Fungicide spray for yellow rust" },
    ],
  },
  {
    uid: "user-002",
    name: "Priya Devi",
    username: "priya",
    phone: "+91 87654 32109",
    password: "farmer2",
    state: "Uttar Pradesh",
    district: "Meerut",
    village: "Sardhana",
    acres: 7,
    crops: ["Sugarcane", "Wheat", "Vegetables"],
    avatar: "PD",
    aadhaar_last4: "7812",
    bankAccount: "Bank of Baroda, Meerut",
    healthScore: 61,
    kpi: {
      netProfitForecast: 290000,
      netProfitChange: 8.2,
      landCoverage: 7,
      landUtilization: 85,
      activeLoans: 1,
      totalLoanAmount: 180000,
      schemeBenefits: 74000,
      schemesApplied: 3,
    },
    recentActivities: [
      { id: "b1", icon: "🎁", text: "PM-Kisan ₹2,000 credited to account", time: "1 day ago" },
      { id: "b2", icon: "🌿", text: "Sugarcane FRP rate set at ₹340/qtl for 2026-27", time: "3 days ago" },
      { id: "b3", icon: "💸", text: "Crop insurance claim ₹15,000 approved", time: "5 days ago" },
      { id: "b4", icon: "📋", text: "Soil health card renewed, N:P:K report ready", time: "1 week ago" },
      { id: "b5", icon: "🏦", text: "Loan application submitted to Bank of Baroda", time: "2 weeks ago" },
    ],
    loans: [
      { id: "l3", type: "Short Term Crop Loan", bank: "Bank of Baroda", limit: 180000, emi: 2800, effectiveRate: 7.0, status: "Active", tenure: "12 Months", subsidyRate: 2.0, features: ["Simple documentation", "Seasonal repayment", "UP Govt subsidy 2%"] },
    ],
    expenses: [
      { id: "e7", category: "Fertilizer", amount: 18000, date: "2026-03-12", notes: "Sugarcane ratoon fertilizer" },
      { id: "e8", category: "Labor", amount: 9500, date: "2026-03-08", notes: "Sugarcane cutting workers" },
      { id: "e9", category: "Irrigation", amount: 4500, date: "2026-02-25", notes: "Borewell electricity charge" },
      { id: "e10", category: "Seeds", amount: 5500, date: "2026-02-18", notes: "Vegetable seeds - tomato, brinjal" },
      { id: "e11", category: "Pesticide", amount: 2800, date: "2026-03-01", notes: "Whitefly control spray" },
    ],
  },
  {
    uid: "user-003",
    name: "Suresh Patel",
    username: "suresh",
    phone: "+91 76543 21098",
    password: "agri2026",
    state: "Maharashtra",
    district: "Nashik",
    village: "Niphad",
    acres: 18,
    crops: ["Grapes", "Onion", "Cotton"],
    avatar: "SP",
    aadhaar_last4: "2934",
    bankAccount: "NABARD Co-op, Nashik",
    healthScore: 82,
    kpi: {
      netProfitForecast: 720000,
      netProfitChange: 18.7,
      landCoverage: 18,
      landUtilization: 94,
      activeLoans: 3,
      totalLoanAmount: 650000,
      schemeBenefits: 195000,
      schemesApplied: 6,
    },
    recentActivities: [
      { id: "c1", icon: "🍇", text: "Grape export order received — ₹85,000 contract", time: "5 hours ago" },
      { id: "c2", icon: "💰", text: "NABARD scheme disbursement ₹50,000 received", time: "1 day ago" },
      { id: "c3", icon: "🌡️", text: "Weather alert: Hail risk on March 30 — cover grapes", time: "2 days ago" },
      { id: "c4", icon: "📦", text: "Onion sold at Lasalgaon — ₹18.5/kg (record high)", time: "3 days ago" },
      { id: "c5", icon: "🏅", text: "Progressive Farmer award nominated by district", time: "1 week ago" },
    ],
    loans: [
      { id: "l4", type: "Horticulture Development Loan", bank: "NABARD Co-op", limit: 500000, emi: 8500, effectiveRate: 6.5, status: "Active", tenure: "7 Years", subsidyRate: 3.5, features: ["Horticulture specific", "Cold storage subsidy included", "Export linkage support"] },
      { id: "l5", type: "Kisan Credit Card (KCC)", bank: "Bank of Maharashtra", limit: 250000, emi: 3800, effectiveRate: 4.0, status: "Pre-Approved", tenure: "5 Years", subsidyRate: 3.0, features: ["Rotating credit line", "ATM withdrawal enabled", "Zero processing fee"] },
      { id: "l6", type: "Drip Irrigation Subsidy Loan", bank: "Maharashtra Gramin Bank", limit: 200000, emi: 2200, effectiveRate: 3.0, status: "Eligible", tenure: "8 Years", subsidyRate: 5.0, features: ["75% subsidy from PM-KUSUM", "Reduces water use 40%", "Maharashtra top-up available"] },
    ],
    expenses: [
      { id: "e12", category: "Fertilizer", amount: 45000, date: "2026-03-05", notes: "Grape seasonal fertigation" },
      { id: "e13", category: "Labor", amount: 32000, date: "2026-03-15", notes: "Grape harvest + packing workers" },
      { id: "e14", category: "Irrigation", amount: 18000, date: "2026-02-28", notes: "Drip irrigation maintenance" },
      { id: "e15", category: "Pesticide", amount: 22000, date: "2026-03-01", notes: "Fungicide + insecticide grapes" },
      { id: "e16", category: "Machinery", amount: 15000, date: "2026-03-10", notes: "Cold storage transport" },
      { id: "e17", category: "Seeds", amount: 8500, date: "2026-02-10", notes: "Onion hybrid seeds 5kg" },
      { id: "e18", category: "Pesticide", amount: 6500, date: "2026-02-22", notes: "Onion thrips control" },
    ],
  },
];

// Auth helpers
const USER_KEY = "khetisaathi-current-user";
const LEGACY_USER_KEY = "krishiai-current-user";

export function setAuthenticatedUser(user: DemoUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
    try {
      const sessionData = {
        uid: user.uid,
        username: user.username || "",
        phone: user.phone || "",
        time: Date.now(),
      };
      const token = btoa(JSON.stringify(sessionData));
      document.cookie = `khetisaathi_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `khetisaathi_uid=${encodeURIComponent(user.uid)}; path=/; max-age=2592000; SameSite=Lax`;
    } catch (e) {
      console.warn("Could not set auth cookies:", e);
    }
  }
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && parsed.uid ? parsed : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    document.cookie = "khetisaathi_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "khetisaathi_uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

