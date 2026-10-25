import bcrypt from "bcryptjs";
import { adminDb, adminRtdb } from "./firebaseAdmin";
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
  // Return last 10 digits (standard Indian mobile number format)
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// Encrypt / hash a plain text password using bcrypt
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainTextPassword, salt);
}

// Verify a plain text password against an encrypted bcrypt hash
export async function verifyPassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
  if (!plainTextPassword || !passwordHash) return false;
  return bcrypt.compare(plainTextPassword, passwordHash);
}

// Sanitize user before returning to client (never send password or passwordHash)
export function sanitizeUser(user: StoredUser | (DemoUser & { passwordHash?: string; phoneClean?: string })): SafeUser {
  const clone = { ...user } as Record<string, unknown>;
  delete clone.password;
  delete clone.passwordHash;
  return clone as SafeUser;
}

// Memory cache to ensure instant performance and offline fallback
const memoryUserDb: Record<string, StoredUser> = {};
const memoryPhoneIndex: Record<string, string> = {}; // phoneClean -> uid
let isSeeded = false;

// Pre-seed demo users with encrypted passwords in database
export async function ensureDemoUsersSeeded(): Promise<void> {
  if (isSeeded) return;

  for (const demo of DEMO_USERS) {
    const cleanPhone = cleanPhoneNumber(demo.phone);
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
      console.log(`[Auth DB] Seeded demo farmer ${demo.name} with encrypted password to database.`);
    }
  }
  isSeeded = true;
}

// Save complete user record to both Firestore and Realtime Database
export async function saveStoredUserToDatabases(storedUser: StoredUser): Promise<void> {
  const { uid, phoneClean } = storedUser;

  // 1. Update In-Memory cache
  memoryUserDb[uid] = { ...storedUser };
  if (phoneClean) {
    memoryPhoneIndex[phoneClean] = uid;
  }

  // 2. Save to Firebase Realtime Database
  if (adminRtdb) {
    try {
      // Save user record
      await adminRtdb.ref(`users/${uid}/profile`).set(sanitizeUser(storedUser));
      await adminRtdb.ref(`users/${uid}/auth`).set({
        uid: storedUser.uid,
        phone: storedUser.phone,
        phoneClean: storedUser.phoneClean,
        passwordHash: storedUser.passwordHash,
        updatedAt: storedUser.updatedAt,
      });

      // Save phone lookup index for O(1) query
      if (phoneClean) {
        await adminRtdb.ref(`phone_to_uid/${phoneClean}`).set(uid);
      }
      console.log(`[RTDB] User ${uid} credentials & profile written to Realtime DB.`);
    } catch (err: unknown) {
      console.warn(`[RTDB] Failed to save user ${uid}:`, (err as Error)?.message);
    }
  }

  // 3. Save to Firebase Firestore
  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).set(storedUser, { merge: true });
      console.log(`[Firestore] User ${uid} credentials & profile written to Firestore.`);
    } catch (err: unknown) {
      console.warn(`[Firestore] Failed to save user ${uid}:`, (err as Error)?.message);
    }
  }
}

// Find user in database by phone number
export async function findUserByPhone(rawPhone: string): Promise<StoredUser | null> {
  const cleanPhone = cleanPhoneNumber(rawPhone);
  if (!cleanPhone) return null;

  // 1. Check in RTDB via index
  if (adminRtdb) {
    try {
      const idxSnap = await adminRtdb.ref(`phone_to_uid/${cleanPhone}`).once("value");
      if (idxSnap.exists()) {
        const uid = idxSnap.val() as string;
        const [profileSnap, authSnap] = await Promise.all([
          adminRtdb.ref(`users/${uid}/profile`).once("value"),
          adminRtdb.ref(`users/${uid}/auth`).once("value"),
        ]);

        if (profileSnap.exists()) {
          const profile = profileSnap.val();
          const auth = authSnap.exists() ? authSnap.val() : {};
          const user: StoredUser = {
            ...profile,
            passwordHash: auth.passwordHash || profile.passwordHash,
            phoneClean: cleanPhone,
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: auth.updatedAt || new Date().toISOString(),
          };
          memoryUserDb[uid] = user;
          memoryPhoneIndex[cleanPhone] = uid;
          return user;
        }
      }
    } catch (err: unknown) {
      console.warn(`[RTDB] Phone lookup error for ${cleanPhone}:`, (err as Error)?.message);
    }
  }

  // 2. Check in Firestore
  if (adminDb) {
    try {
      // Query by phoneClean
      const querySnap = await adminDb
        .collection("users")
        .where("phoneClean", "==", cleanPhone)
        .limit(1)
        .get();

      if (!querySnap.empty) {
        const doc = querySnap.docs[0];
        const user = doc.data() as StoredUser;
        memoryUserDb[user.uid] = user;
        memoryPhoneIndex[cleanPhone] = user.uid;
        return user;
      }

      // Query by raw phone string
      const rawQuerySnap = await adminDb
        .collection("users")
        .where("phone", "==", rawPhone.trim())
        .limit(1)
        .get();

      if (!rawQuerySnap.empty) {
        const doc = rawQuerySnap.docs[0];
        const user = doc.data() as StoredUser;
        memoryUserDb[user.uid] = user;
        memoryPhoneIndex[cleanPhone] = user.uid;
        return user;
      }
    } catch (err: unknown) {
      console.warn(`[Firestore] Phone lookup error for ${cleanPhone}:`, (err as Error)?.message);
    }
  }

  // 3. Check In-Memory index
  if (memoryPhoneIndex[cleanPhone] && memoryUserDb[memoryPhoneIndex[cleanPhone]]) {
    return memoryUserDb[memoryPhoneIndex[cleanPhone]];
  }

  // 4. Check DEMO_USERS fallback (and seed into DB if found)
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
    // Persist to DB asynchronously
    saveStoredUserToDatabases(stored).catch(() => {});
    return stored;
  }

  return null;
}

// Find user in database by UID
export async function findUserByUid(uid: string): Promise<StoredUser | null> {
  if (!uid) return null;

  // 1. RTDB lookup
  if (adminRtdb) {
    try {
      const [profileSnap, authSnap] = await Promise.all([
        adminRtdb.ref(`users/${uid}/profile`).once("value"),
        adminRtdb.ref(`users/${uid}/auth`).once("value"),
      ]);

      if (profileSnap.exists()) {
        const profile = profileSnap.val();
        const auth = authSnap.exists() ? authSnap.val() : {};
        const user: StoredUser = {
          ...profile,
          passwordHash: auth.passwordHash || profile.passwordHash,
          phoneClean: auth.phoneClean || profile.phoneClean || cleanPhoneNumber(profile.phone),
          createdAt: profile.createdAt || new Date().toISOString(),
          updatedAt: auth.updatedAt || new Date().toISOString(),
        };
        memoryUserDb[uid] = user;
        return user;
      }
    } catch (err: unknown) {
      console.warn(`[RTDB] UID lookup error for ${uid}:`, (err as Error)?.message);
    }
  }

  // 2. Firestore lookup
  if (adminDb) {
    try {
      const doc = await adminDb.collection("users").doc(uid).get();
      if (doc.exists) {
        const user = doc.data() as StoredUser;
        memoryUserDb[uid] = user;
        return user;
      }
    } catch (err: unknown) {
      console.warn(`[Firestore] UID lookup error for ${uid}:`, (err as Error)?.message);
    }
  }

  // 3. Memory cache
  if (memoryUserDb[uid]) {
    return memoryUserDb[uid];
  }

  return null;
}

// Strict Database Login Authentication
export async function authenticateFarmer(
  rawPhone: string,
  plainTextPassword: string
): Promise<{ success: boolean; error?: string; user?: SafeUser; sessionToken?: string }> {
  await ensureDemoUsersSeeded();

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

  // 1. First, search the database for this user
  console.log(`[Auth DB] Searching database for registered farmer with phone: ${cleanPhone}`);
  const user = await findUserByPhone(cleanPhone);

  if (!user) {
    console.warn(`[Auth DB] Login rejected: No user found in database with phone: ${cleanPhone}`);
    return {
      success: false,
      error: "या फोन नंबरसह शेतकरी खाते डेटाबेसमध्ये सापडले नाही. कृपया प्रथम नोंदणी करा (No account found in database with this phone number. Please register first).",
    };
  }

  // 2. Check encrypted password against stored bcrypt hash in database
  console.log(`[Auth DB] Farmer found in database (${user.name}). Verifying encrypted password...`);
  const isMatch = await verifyPassword(plainTextPassword.trim(), user.passwordHash);

  if (!isMatch) {
    console.warn(`[Auth DB] Login rejected: Password mismatch for user ${user.uid}`);
    return {
      success: false,
      error: "चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा (Incorrect password. Access denied).",
    };
  }

  // 3. Password matched! Create session token and return sanitized user
  const safe = sanitizeUser(user);
  const sessionToken = Buffer.from(
    JSON.stringify({
      uid: user.uid,
      phone: user.phone,
      time: Date.now(),
    })
  ).toString("base64");

  console.log(`[Auth DB] Authentication successful for farmer: ${user.name} (${user.uid})`);
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
  await ensureDemoUsersSeeded();

  const name = (data.name || "").trim();
  const rawPhone = (data.phone || "").trim();
  const plainTextPassword = (data.password || "").trim();
  const cleanPhone = cleanPhoneNumber(rawPhone);

  // Validation
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
  console.log(`[Auth DB] Encrypting password with bcrypt for new registration: ${cleanPhone}...`);
  const passwordHash = await hashPassword(plainTextPassword);

  const uid = `farmer_${Date.now()}_${cleanPhone.slice(-4)}`;
  const acres = Number(data.acres) || 5;
  const crops = data.crops && data.crops.length > 0 ? data.crops : ["Cotton", "Soybean"];
  const state = (data.state || "Maharashtra").trim();
  const district = (data.district || "Nagpur").trim();
  const village = (data.village || "Kalmeshwar").trim();

  const dynamicKpi = calculateDynamicKPI(acres, crops);

  const storedUser: StoredUser = {
    uid,
    name,
    phone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
    phoneClean: cleanPhone,
    passwordHash, // Stored encrypted!
    state,
    district,
    village,
    acres,
    crops,
    avatar: name.slice(0, 2).toUpperCase(),
    aadhaar_last4: String(Math.floor(1000 + Math.random() * 9000)),
    bankAccount: "SBI Agri Branch",
    healthScore: 78,
    kpi: {
      netProfitForecast: dynamicKpi.netProfitForecast,
      netProfitChange: 14.5,
      landCoverage: acres,
      landUtilization: 92,
      activeLoans: 1,
      totalLoanAmount: Math.round(acres * 25000),
      schemeBenefits: 12000,
      schemesApplied: 3,
    },
    recentActivities: [
      {
        id: "act-reg-1",
        icon: "🌱",
        text: "KhetiSaathi शेतकरी खात्याची यशस्वी नोंदणी (Account created)",
        time: "Just now",
      },
    ],
    loans: [
      {
        id: "l-reg-1",
        type: "Kisan Credit Card (KCC)",
        bank: "State Bank of India",
        limit: Math.round(acres * 25000),
        emi: Math.round(acres * 350),
        effectiveRate: 4.0,
        status: "Pre-Approved",
        tenure: "5 Years",
        subsidyRate: 3.0,
        features: ["Zero collateral up to ₹1.6L", "Interest subvention 3%", "Crop insurance included"],
      },
    ],
    expenses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Write encrypted credentials and user profile to both Firestore & RTDB
  console.log(`[Auth DB] Saving new farmer details & encrypted credentials to database...`);
  await saveStoredUserToDatabases(storedUser);

  const safe = sanitizeUser(storedUser);
  const sessionToken = Buffer.from(
    JSON.stringify({
      uid: storedUser.uid,
      phone: storedUser.phone,
      time: Date.now(),
    })
  ).toString("base64");

  console.log(`[Auth DB] New farmer successfully created & encrypted in database: ${storedUser.name} (${uid})`);
  return {
    success: true,
    user: safe,
    sessionToken,
  };
}
