import bcrypt from "bcryptjs";
import { adminDb, adminRtdb, RTDB_BASE_URL } from "./firebaseAdmin";
import { DEMO_USERS, type DemoUser } from "./userAuth";
import { calculateDynamicKPI } from "./firebaseService";

export interface StoredUser extends Omit<DemoUser, "password"> {
  passwordHash: string;
  phoneClean: string;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<DemoUser, "password"> & {
  phoneClean?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Normalize any phone number to 10 digits
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// Timeout wrapper to prevent Vercel 504 serverless hangs
async function withTimeout<T>(promise: Promise<T>, ms = 2500, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// Encrypt / hash a plain text password using bcrypt
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainTextPassword, salt);
}

// Verify a plain text password against an encrypted bcrypt hash
export async function verifyPassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
  if (!plainTextPassword || !passwordHash) return false;
  try {
    return await bcrypt.compare(plainTextPassword, passwordHash);
  } catch (err) {
    console.warn("[Auth] bcrypt compare error:", err);
    return false;
  }
}

// Sanitize user before returning to client (never send password or passwordHash)
export function sanitizeUser(user: StoredUser | (DemoUser & { passwordHash?: string; phoneClean?: string })): SafeUser {
  const clone = { ...user } as Record<string, unknown>;
  delete clone.password;
  delete clone.passwordHash;
  return clone as SafeUser;
}

// Memory cache to ensure instant performance on serverless
const memoryUserDb: Record<string, StoredUser> = {};
const memoryPhoneIndex: Record<string, string> = {};
let isSeeded = false;

// Pre-seed demo users with encrypted passwords in database
export async function ensureDemoUsersSeeded(): Promise<void> {
  if (isSeeded) return;

  try {
    for (const demo of DEMO_USERS) {
      const cleanPhone = cleanPhoneNumber(demo.phone);
      if (!cleanPhone) continue;

      const existing = await findUserByPhone(cleanPhone);
      if (!existing) {
        const hashed = await hashPassword(demo.password || "kheti@2026");
        const stored: StoredUser = {
          ...demo,
          passwordHash: hashed,
          phoneClean: cleanPhone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveStoredUserToDatabases(stored);
      }
    }
    isSeeded = true;
  } catch (err) {
    console.warn("[Auth DB] Demo seeding background notice:", (err as Error)?.message);
  }
}

// Save complete user record to RTDB REST API, Firebase Admin & In-Memory
export async function saveStoredUserToDatabases(storedUser: StoredUser): Promise<void> {
  const { uid, phoneClean } = storedUser;

  // 1. Update In-Memory cache
  memoryUserDb[uid] = { ...storedUser };
  if (phoneClean) {
    memoryPhoneIndex[phoneClean] = uid;
  }

  // 2. Direct HTTPS REST API to Firebase Realtime Database (100% reliable on Vercel)
  try {
    const safe = sanitizeUser(storedUser);
    await Promise.allSettled([
      fetch(`${RTDB_BASE_URL}/users/${uid}/profile.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safe),
      }),
      fetch(`${RTDB_BASE_URL}/users/${uid}/auth.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: storedUser.uid,
          phone: storedUser.phone,
          phoneClean: storedUser.phoneClean,
          passwordHash: storedUser.passwordHash,
          updatedAt: storedUser.updatedAt,
        }),
      }),
      phoneClean
        ? fetch(`${RTDB_BASE_URL}/phone_to_uid/${phoneClean}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(uid),
          })
        : Promise.resolve(),
    ]);
  } catch (err: unknown) {
    console.warn(`[RTDB REST] Save warning for ${uid}:`, (err as Error)?.message);
  }

  // 3. Save to Firebase RTDB SDK (non-blocking)
  if (adminRtdb) {
    withTimeout(
      Promise.allSettled([
        adminRtdb.ref(`users/${uid}/profile`).set(sanitizeUser(storedUser)),
        adminRtdb.ref(`users/${uid}/auth`).set({
          uid: storedUser.uid,
          phone: storedUser.phone,
          phoneClean: storedUser.phoneClean,
          passwordHash: storedUser.passwordHash,
          updatedAt: storedUser.updatedAt,
        }),
        phoneClean ? adminRtdb.ref(`phone_to_uid/${phoneClean}`).set(uid) : Promise.resolve(),
      ]),
      2000,
      null
    ).catch(() => {});
  }

  // 4. Save to Firebase Firestore (non-blocking)
  if (adminDb) {
    withTimeout(
      adminDb.collection("users").doc(uid).set(storedUser, { merge: true }),
      2000,
      null
    ).catch(() => {});
  }
}

// Find user in database by phone number
export async function findUserByPhone(rawPhone: string): Promise<StoredUser | null> {
  const cleanPhone = cleanPhoneNumber(rawPhone);
  if (!cleanPhone) return null;

  // 1. Check In-Memory index first (fastest)
  if (memoryPhoneIndex[cleanPhone] && memoryUserDb[memoryPhoneIndex[cleanPhone]]) {
    return memoryUserDb[memoryPhoneIndex[cleanPhone]];
  }

  // 2. Check Firebase Realtime Database via REST API (fast and never hangs on Vercel)
  try {
    const idxRes = await withTimeout(
      fetch(`${RTDB_BASE_URL}/phone_to_uid/${cleanPhone}.json`),
      2000,
      null as Response | null
    );

    if (idxRes && idxRes.ok) {
      const uid = await idxRes.json();
      if (uid && typeof uid === "string") {
        const [profileRes, authRes] = await Promise.all([
          fetch(`${RTDB_BASE_URL}/users/${uid}/profile.json`),
          fetch(`${RTDB_BASE_URL}/users/${uid}/auth.json`),
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          const auth = authRes.ok ? await authRes.json() : {};
          if (profile) {
            const user: StoredUser = {
              ...profile,
              passwordHash: auth?.passwordHash || profile.passwordHash,
              phoneClean: cleanPhone,
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: auth?.updatedAt || new Date().toISOString(),
            };
            memoryUserDb[uid] = user;
            memoryPhoneIndex[cleanPhone] = uid;
            return user;
          }
        }
      }
    }
  } catch (err: unknown) {
    console.warn(`[RTDB REST] Lookup notice for ${cleanPhone}:`, (err as Error)?.message);
  }

  // 3. Check RTDB SDK with timeout
  if (adminRtdb) {
    try {
      const userFromRtdb = await withTimeout(
        (async () => {
          const idxSnap = await adminRtdb.ref(`phone_to_uid/${cleanPhone}`).once("value");
          if (!idxSnap.exists()) return null;
          const uid = idxSnap.val() as string;
          const [profileSnap, authSnap] = await Promise.all([
            adminRtdb.ref(`users/${uid}/profile`).once("value"),
            adminRtdb.ref(`users/${uid}/auth`).once("value"),
          ]);
          if (!profileSnap.exists()) return null;
          const profile = profileSnap.val();
          const auth = authSnap.exists() ? authSnap.val() : {};
          return {
            ...profile,
            passwordHash: auth.passwordHash || profile.passwordHash,
            phoneClean: cleanPhone,
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: auth.updatedAt || new Date().toISOString(),
          } as StoredUser;
        })(),
        2000,
        null
      );

      if (userFromRtdb) {
        memoryUserDb[userFromRtdb.uid] = userFromRtdb;
        memoryPhoneIndex[cleanPhone] = userFromRtdb.uid;
        return userFromRtdb;
      }
    } catch {
      // Fall through
    }
  }

  // 4. Check DEMO_USERS fallback
  const demoMatch = DEMO_USERS.find((d) => cleanPhoneNumber(d.phone) === cleanPhone);
  if (demoMatch) {
    const hashed = await hashPassword(demoMatch.password || "kheti@2026");
    const stored: StoredUser = {
      ...demoMatch,
      passwordHash: hashed,
      phoneClean: cleanPhone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveStoredUserToDatabases(stored).catch(() => {});
    return stored;
  }

  return null;
}

// Find user in database by UID
export async function findUserByUid(uid: string): Promise<StoredUser | null> {
  if (!uid) return null;

  // 1. Memory check
  if (memoryUserDb[uid]) {
    return memoryUserDb[uid];
  }

  // 2. Realtime Database REST API
  try {
    const [profileRes, authRes] = await Promise.all([
      fetch(`${RTDB_BASE_URL}/users/${uid}/profile.json`),
      fetch(`${RTDB_BASE_URL}/users/${uid}/auth.json`),
    ]);

    if (profileRes.ok) {
      const profile = await profileRes.json();
      const auth = authRes.ok ? await authRes.json() : {};
      if (profile && profile.uid) {
        const user: StoredUser = {
          ...profile,
          passwordHash: auth?.passwordHash || profile.passwordHash,
          phoneClean: auth?.phoneClean || profile.phoneClean || cleanPhoneNumber(profile.phone),
          createdAt: profile.createdAt || new Date().toISOString(),
          updatedAt: auth?.updatedAt || new Date().toISOString(),
        };
        memoryUserDb[uid] = user;
        return user;
      }
    }
  } catch {
    // Fall through
  }

  // 3. Fallback to demo users
  const demo = DEMO_USERS.find((d) => d.uid === uid);
  if (demo) {
    const hashed = await hashPassword(demo.password || "kheti@2026");
    const stored: StoredUser = {
      ...demo,
      passwordHash: hashed,
      phoneClean: cleanPhoneNumber(demo.phone),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryUserDb[uid] = stored;
    return stored;
  }

  return null;
}

// Strict Database Login Authentication
export async function authenticateFarmer(
  rawPhone: string,
  plainTextPassword: string
): Promise<{ success: boolean; error?: string; user?: SafeUser; sessionToken?: string }> {
  const cleanPhone = cleanPhoneNumber(rawPhone);
  if (!cleanPhone || cleanPhone.length < 10) {
    return {
      success: false,
      error: "कृपया १० अंकी वैध मोबाईल नंबर टाका (Please enter a valid 10-digit mobile number).",
    };
  }

  if (!plainTextPassword || plainTextPassword.trim().length === 0) {
    return {
      success: false,
      error: "कृपया पासवर्ड टाका (Please enter your password).",
    };
  }

  // 1. Search database for user
  const user = await findUserByPhone(cleanPhone);

  if (!user) {
    return {
      success: false,
      error: "या फोन नंबरसह शेतकरी खाते डेटाबेसमध्ये सापडले नाही. कृपया प्रथम नोंदणी करा (No account found in database with this phone number. Please register first).",
    };
  }

  // 2. Check encrypted password against stored bcrypt hash in database
  const isMatch = await verifyPassword(plainTextPassword.trim(), user.passwordHash);

  if (!isMatch) {
    return {
      success: false,
      error: "चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा (Incorrect password. Access denied).",
    };
  }

  // 3. Return sanitized safe user
  const safe = sanitizeUser(user);
  const sessionToken = Buffer.from(
    JSON.stringify({
      uid: user.uid,
      phone: user.phone,
      time: Date.now(),
    })
  ).toString("base64");

  return {
    success: true,
    user: safe,
    sessionToken,
  };
}

// Strict Database Registration
export async function registerFarmer(data: {
  name: string;
  phone: string;
  password: string;
  acres?: number;
  crops?: string[];
  state?: string;
  district?: string;
  village?: string;
}): Promise<{ success: boolean; error?: string; user?: SafeUser; sessionToken?: string }> {
  const name = (data.name || "").trim();
  const rawPhone = (data.phone || "").trim();
  const plainTextPassword = (data.password || "").trim();
  const cleanPhone = cleanPhoneNumber(rawPhone);

  if (!name || name.length < 2) {
    return { success: false, error: "कृपया आपले पूर्ण नाव प्रविष्ट करा (Please enter your full name)." };
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: "कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा (Please enter a valid 10-digit mobile number)." };
  }
  if (!plainTextPassword || plainTextPassword.length < 6) {
    return {
      success: false,
      error: "पासवर्ड किमान ६ अक्षरांचा असावा (Password must be at least 6 characters long).",
    };
  }

  // Check if phone already registered in database
  const existingUser = await findUserByPhone(cleanPhone);
  if (existingUser) {
    return {
      success: false,
      error: "हा मोबाईल नंबर आधीपासूनच डेटाबेसमध्ये नोंदणीकृत आहे. कृपया लॉगिन करा (This mobile number is already registered in the database. Please sign in).",
    };
  }

  // Encrypt password using bcrypt
  const passwordHash = await hashPassword(plainTextPassword);

  const uid = `farmer_${Date.now()}_${cleanPhone.slice(-4)}`;
  const acres = Number(data.acres) || 5;
  const crops = data.crops && data.crops.length > 0 ? data.crops : ["Cotton", "Soybean"];
  const state = (data.state || "Maharashtra").trim();
  const district = (data.district || "Nagpur").trim();
  const village = (data.village || "Kalmeshwar").trim();

  const dynamicKpi = calculateDynamicKPI(acres, crops);

  // Generate tailored loans for this user based on their acres & state
  const kccBank = state.toLowerCase().includes("punjab")
    ? "State Bank of India, Ludhiana"
    : state.toLowerCase().includes("pradesh")
    ? "Bank of Baroda"
    : "Maharashtra Gramin Bank";

  const cropLoanType = crops.includes("Sugarcane")
    ? "Sugarcane Production & Mill Credit"
    : crops.includes("Grapes")
    ? "Horticulture Development Loan"
    : crops.includes("Cotton")
    ? "Cotton & Cash Crop Seasonal Loan"
    : "Kisan Credit Card (KCC) Crop Loan";

  const tailoredLoans = [
    {
      id: `loan-${uid}-1`,
      type: "Kisan Credit Card (KCC)",
      bank: kccBank,
      limit: Math.round(acres * 30000),
      emi: Math.round(acres * 400),
      effectiveRate: 4.0,
      status: "Pre-Approved",
      tenure: "5 Years",
      subsidyRate: 3.0,
      features: ["3% interest subvention", "Zero collateral up to ₹1.6L", "Direct DBT subsidy"],
    },
    {
      id: `loan-${uid}-2`,
      type: cropLoanType,
      bank: "NABARD Co-operative Agri Society",
      limit: Math.round(acres * 20000),
      emi: Math.round(acres * 250),
      effectiveRate: 3.5,
      status: "Active",
      tenure: "12 Months",
      subsidyRate: 2.5,
      features: ["Flexible repayment at harvest", "Crop insurance linked", "Govt guaranteed"],
    },
  ];

  // Generate tailored initial expenses for their crops & land size
  const tailoredExpenses = [
    {
      id: `exp-${uid}-1`,
      category: "Fertilizer",
      amount: Math.round(acres * 2800),
      date: new Date().toISOString().split("T")[0],
      notes: `${crops[0] || "Crop"} Seasonal Fertilizer & Micro-nutrients`,
    },
    {
      id: `exp-${uid}-2`,
      category: "Seeds",
      amount: Math.round(acres * 1200),
      date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
      notes: `Certified Hybrid Seeds (${crops.join(", ")})`,
    },
    {
      id: `exp-${uid}-3`,
      category: "Irrigation",
      amount: Math.round(acres * 900),
      date: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      notes: "Drip irrigation maintenance & power charges",
    },
    {
      id: `exp-${uid}-4`,
      category: "Labor",
      amount: Math.round(acres * 1800),
      date: new Date(Date.now() - 21 * 86400000).toISOString().split("T")[0],
      notes: "Field preparation and sowing labor wages",
    },
  ];

  const storedUser: StoredUser = {
    uid,
    name,
    phone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
    phoneClean: cleanPhone,
    passwordHash,
    state,
    district,
    village,
    acres,
    crops,
    avatar: name.slice(0, 2).toUpperCase(),
    aadhaar_last4: String(Math.floor(1000 + Math.random() * 9000)),
    bankAccount: `${kccBank}, ${district}`,
    healthScore: Math.min(95, Math.max(65, 75 + (acres % 10))),
    kpi: {
      netProfitForecast: dynamicKpi.netProfitForecast,
      netProfitChange: 14.5,
      landCoverage: acres,
      landUtilization: 92,
      activeLoans: tailoredLoans.length,
      totalLoanAmount: tailoredLoans.reduce((sum, l) => sum + l.limit, 0),
      schemeBenefits: acres <= 5 ? 12000 : 25000,
      schemesApplied: 3,
    },
    recentActivities: [
      {
        id: `act-${uid}-1`,
        icon: "🌱",
        text: `KhetiSaathi खाते सक्रिय — ${acres} एकर शेती नोंदणीकृत`,
        time: "Just now",
      },
      {
        id: `act-${uid}-2`,
        icon: "💳",
        text: `KCC कर्ज मर्यादा ₹${(Math.round(acres * 30000)).toLocaleString("en-IN")} पूर्व-मंजूर`,
        time: "Just now",
      },
    ],
    loans: tailoredLoans,
    expenses: tailoredExpenses,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Write encrypted credentials and user profile to databases
  await saveStoredUserToDatabases(storedUser);

  const safe = sanitizeUser(storedUser);
  const sessionToken = Buffer.from(
    JSON.stringify({
      uid: storedUser.uid,
      phone: storedUser.phone,
      time: Date.now(),
    })
  ).toString("base64");

  return {
    success: true,
    user: safe,
    sessionToken,
  };
}
