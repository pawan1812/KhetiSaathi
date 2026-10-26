import bcrypt from "bcryptjs";
import { adminDb, adminRtdb, RTDB_BASE_URL } from "./firebaseAdmin";
import { DEMO_USERS, type DemoUser } from "./userAuth";
import { calculateDynamicKPI } from "./firebaseService";

export interface StoredUser extends Omit<DemoUser, "password"> {
  passwordHash?: string;
  plainPassword?: string;
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

// Normalize username to lowercase alphanumeric + underscore
export function cleanUsername(username: string): string {
  if (!username) return "";
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
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

// Verify a plain text password against an encrypted bcrypt hash or plain text fallback
export async function verifyPassword(
  plainTextPassword: string,
  passwordHash?: string,
  plainPasswordFallback?: string
): Promise<boolean> {
  if (!plainTextPassword) return false;
  const input = plainTextPassword.trim();

  // 1. Plain text comparison if available (e.g. initial registration before bcrypt)
  if (plainPasswordFallback && plainPasswordFallback.trim() === input) {
    return true;
  }

  // 2. Direct equality if passwordHash is plain text
  if (passwordHash && passwordHash === input) {
    return true;
  }

  // 3. Encrypted bcrypt hash compare
  if (passwordHash && passwordHash.startsWith("$2")) {
    try {
      return await bcrypt.compare(input, passwordHash);
    } catch (err) {
      console.warn("[Auth] bcrypt compare error:", err);
      return false;
    }
  }

  return false;
}

// Sanitize user before returning to client (never send password, passwordHash, or plainPassword)
export function sanitizeUser(user: StoredUser | (DemoUser & { passwordHash?: string; phoneClean?: string; plainPassword?: string })): SafeUser {
  const clone = { ...user } as Record<string, unknown>;
  delete clone.password;
  delete clone.passwordHash;
  delete clone.plainPassword;
  return clone as SafeUser;
}

// Memory cache to ensure instant performance on serverless
const memoryUserDb: Record<string, StoredUser> = {};
const memoryPhoneIndex: Record<string, string> = {};
const memoryUsernameIndex: Record<string, string> = {};
let isSeeded = false;

// Pre-seed demo users with encrypted passwords in database
export async function ensureDemoUsersSeeded(): Promise<void> {
  if (isSeeded) return;

  try {
    for (const demo of DEMO_USERS) {
      const cleanPhone = cleanPhoneNumber(demo.phone);
      const cleanUser = cleanUsername(demo.username || "");
      if (!cleanPhone && !cleanUser) continue;

      const existing = (cleanUser ? await findUserByUsername(cleanUser) : null) || (cleanPhone ? await findUserByPhone(cleanPhone) : null);
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
  const cleanUser = cleanUsername(storedUser.username || "");

  // 1. Update In-Memory cache
  memoryUserDb[uid] = { ...storedUser };
  if (phoneClean) {
    memoryPhoneIndex[phoneClean] = uid;
  }
  if (cleanUser) {
    memoryUsernameIndex[cleanUser] = uid;
  }

  // 2. Direct HTTPS REST API to Firebase Realtime Database (100% reliable on Vercel)
  try {
    const safe = sanitizeUser(storedUser);
    const puts = [
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
          username: storedUser.username || "",
          phone: storedUser.phone,
          phoneClean: storedUser.phoneClean,
          passwordHash: storedUser.passwordHash,
          updatedAt: storedUser.updatedAt,
        }),
      }),
    ];

    if (phoneClean) {
      puts.push(
        fetch(`${RTDB_BASE_URL}/phone_to_uid/${phoneClean}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uid),
        })
      );
    }

    if (cleanUser) {
      puts.push(
        fetch(`${RTDB_BASE_URL}/username_to_uid/${cleanUser}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uid),
        })
      );
    }

    await Promise.allSettled(puts);
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
          const user = await findUserByUid(uid);
          if (user) {
            memoryPhoneIndex[cleanPhone] = uid;
            return user;
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

// Find user in database by Username
export async function findUserByUsername(rawUsername: string): Promise<StoredUser | null> {
  const cleanUser = cleanUsername(rawUsername);
  if (!cleanUser) return null;

  // 1. Memory check
  if (memoryUsernameIndex[cleanUser] && memoryUserDb[memoryUsernameIndex[cleanUser]]) {
    return memoryUserDb[memoryUsernameIndex[cleanUser]];
  }

  // 2. Realtime Database REST API
  try {
    const idxRes = await withTimeout(
      fetch(`${RTDB_BASE_URL}/username_to_uid/${cleanUser}.json`),
      2000,
      null as Response | null
    );

    if (idxRes && idxRes.ok) {
      const uid = await idxRes.json();
      if (uid && typeof uid === "string") {
        const user = await findUserByUid(uid);
        if (user) {
          memoryUsernameIndex[cleanUser] = uid;
          return user;
        }
      }
    }
  } catch (err: unknown) {
    console.warn(`[RTDB REST] Username lookup error for ${cleanUser}:`, (err as Error)?.message);
  }

  // 3. Fallback to DEMO_USERS
  const demoMatch = DEMO_USERS.find((d) => cleanUsername(d.username || "") === cleanUser);
  if (demoMatch) {
    const cleanPhone = cleanPhoneNumber(demoMatch.phone);
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

// Find user in database by Identifier (either username or phone)
export async function findUserByIdentifier(identifier: string): Promise<StoredUser | null> {
  if (!identifier) return null;
  const trimmed = identifier.trim();

  // If identifier has 10+ digits without letters, try phone first
  const cleanDigits = cleanPhoneNumber(trimmed);
  if (cleanDigits.length >= 10 && !/[a-zA-Z]/.test(trimmed)) {
    const byPhone = await findUserByPhone(cleanDigits);
    if (byPhone) return byPhone;
  }

  // Try username
  const cleanUser = cleanUsername(trimmed);
  if (cleanUser) {
    const byUser = await findUserByUsername(cleanUser);
    if (byUser) return byUser;
  }

  // Fallback try phone
  if (cleanDigits.length >= 10) {
    return await findUserByPhone(cleanDigits);
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

  // 2. Realtime Database REST API (load entire user in single request with timeout)
  try {
    const userRes = await withTimeout(
      fetch(`${RTDB_BASE_URL}/users/${uid}.json`),
      2500,
      null as Response | null
    );

    if (userRes && userRes.ok) {
      const data = await userRes.json();
      if (data) {
        const profile = data.profile || data;
        const auth = data.auth || {};
        if (profile && (profile.uid || uid)) {
          const user: StoredUser = {
            ...profile,
            uid: profile.uid || uid,
            username: profile.username || auth?.username || "",
            passwordHash: auth?.passwordHash || profile.passwordHash || "",
            plainPassword: auth?.plainPassword || profile?.password || profile?.plainPassword || "",
            phoneClean: auth?.phoneClean || profile.phoneClean || cleanPhoneNumber(profile.phone || ""),
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: auth?.updatedAt || new Date().toISOString(),
          };
          memoryUserDb[uid] = user;
          if (user.phoneClean) memoryPhoneIndex[user.phoneClean] = uid;
          if (user.username) memoryUsernameIndex[cleanUsername(user.username)] = uid;
          return user;
        }
      }
    }
  } catch (err: unknown) {
    console.warn(`[RTDB REST] findUserByUid lookup warning for ${uid}:`, (err as Error)?.message);
  }

  // 3. Fallback to demo users
  const demo = DEMO_USERS.find((d) => d.uid === uid);
  if (demo) {
    const hashed = await hashPassword(demo.password || "kheti@2026");
    const stored: StoredUser = {
      ...demo,
      passwordHash: hashed,
      plainPassword: demo.password,
      phoneClean: cleanPhoneNumber(demo.phone),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryUserDb[uid] = stored;
    return stored;
  }

  return null;
}

// Strict Database Login Authentication (Supports Username OR Mobile Number)
export async function authenticateFarmer(
  rawIdentifier: string,
  plainTextPassword: string
): Promise<{ success: boolean; error?: string; user?: SafeUser; sessionToken?: string }> {
  const identifier = (rawIdentifier || "").trim();
  if (!identifier) {
    return {
      success: false,
      error: "कृपया युजरनेम किंवा मोबाईल नंबर टाका (Please enter your username or mobile number).",
    };
  }

  if (!plainTextPassword || plainTextPassword.trim().length === 0) {
    return {
      success: false,
      error: "कृपया पासवर्ड टाका (Please enter your password).",
    };
  }

  // 1. Search database for user by Username or Phone
  const user = await findUserByIdentifier(identifier);

  if (!user) {
    return {
      success: false,
      error: "या युजरनेम किंवा फोन नंबरसह खाते डेटाबेसमध्ये सापडले नाही. कृपया प्रथम नोंदणी करा (No account found with this username or phone number. Please register first).",
    };
  }

  // 2. Check password against bcrypt hash or plain text fallback in database
  let isMatch = await verifyPassword(plainTextPassword.trim(), user.passwordHash, user.plainPassword);

  if (!isMatch) {
    // Check if DEMO_USERS has a match for this user
    const demo = DEMO_USERS.find(
      (d) =>
        (d.username && cleanUsername(d.username) === cleanUsername(identifier)) ||
        cleanPhoneNumber(d.phone) === cleanPhoneNumber(identifier)
    );
    if (demo && demo.password === plainTextPassword.trim()) {
      isMatch = true;
    }
  }

  if (!isMatch) {
    return {
      success: false,
      error: "चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा (Incorrect password. Access denied).",
    };
  }

  // Upgrade password to encrypted bcrypt in background if missing or plain text
  if (!user.passwordHash || !user.passwordHash.startsWith("$2")) {
    try {
      const newHash = await hashPassword(plainTextPassword.trim());
      user.passwordHash = newHash;
      fetch(`${RTDB_BASE_URL}/users/${user.uid}/auth.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordHash: newHash, updatedAt: new Date().toISOString() }),
      }).catch(() => {});
    } catch {}
  }

  // 3. Return sanitized safe user
  const safe = sanitizeUser(user);
  const sessionToken = Buffer.from(
    JSON.stringify({
      uid: user.uid,
      username: user.username || "",
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

// Strict Database Registration with Username support
export async function registerFarmer(data: {
  name: string;
  username?: string;
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
  const rawUsername = (data.username || "").trim();
  const plainTextPassword = (data.password || "").trim();
  const cleanPhone = cleanPhoneNumber(rawPhone);
  const cleanUser = cleanUsername(rawUsername);

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

  // Check username uniqueness if provided
  if (cleanUser) {
    if (cleanUser.length < 3) {
      return {
        success: false,
        error: "युजरनेम किमान ३ अक्षरांचा असावा (Username must be at least 3 characters long).",
      };
    }
    const existingUserByUsername = await findUserByUsername(cleanUser);
    if (existingUserByUsername) {
      return {
        success: false,
        error: "हा युजरनेम आधीच वापरला आहे. कृपया दुसरा युजरनेम निवडा (This username is already taken. Please choose another).",
      };
    }
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

  const assignedUsername = cleanUser || `kisan_${cleanPhone.slice(-4)}`;

  const storedUser: StoredUser = {
    uid,
    name,
    username: assignedUsername,
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
