import { adminDb, adminRtdb, RTDB_BASE_URL } from "./firebaseAdmin";
import { DEMO_USERS, type DemoUser } from "./userAuth";

export interface UserExpense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
}

export interface UserCropPrediction {
  id: string;
  crop: string;
  acres: number;
  season: string;
  soil: string;
  projectedYieldQtl: number;
  projectedRevenue: number;
  projectedCost: number;
  netProfit: number;
  roi: number;
  timestamp: string;
  recommendation: string;
}

export interface MandiAlert {
  id: string;
  crop: string;
  targetPrice: number;
  currentPrice: number;
  mandi: string;
  active: boolean;
  createdAt: string;
}

// In-memory sync fallback cache for high speed & if Cloud project needs local fallback
const inMemoryUserCache: Record<string, DemoUser> = {};
const inMemoryPredictions: Record<string, UserCropPrediction[]> = {};
const inMemoryAlerts: Record<string, MandiAlert[]> = {};

// Initialize cache with default demo users
DEMO_USERS.forEach((u) => {
  inMemoryUserCache[u.uid] = { ...u };
  inMemoryAlerts[u.uid] = [
    {
      id: "alt-1",
      crop: u.crops[0] || "Wheat",
      targetPrice: 2450,
      currentPrice: 2330,
      mandi: "APMC Main Mandi",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];
});

// Dynamic KPI Calculator based on user's real acreage and crops
export function calculateDynamicKPI(acres: number, crops: string[], baseUser?: DemoUser) {
  const cropProfitPerAcre: Record<string, number> = {
    Wheat: 35000,
    Rice: 42000,
    Cotton: 48000,
    Soybean: 38000,
    Sugarcane: 65000,
    Mustard: 32000,
    Maize: 30000,
    Onion: 75000,
    Grapes: 120000,
    Tomato: 70000,
    Potato: 60000,
    Gram: 32000,
  };

  // Average profit per acre based on selected crops
  let avgRate = 40000;
  if (crops && crops.length > 0) {
    const totalRate = crops.reduce((acc, c) => acc + (cropProfitPerAcre[c] || 38000), 0);
    avgRate = Math.round(totalRate / crops.length);
  }

  const netProfitForecast = Math.round(acres * avgRate);
  const landCoverage = acres;
  const landUtilization = Math.min(98, Math.max(75, Math.round(85 + (acres % 10))));

  const activeLoans = baseUser?.kpi?.activeLoans ?? (acres > 10 ? 2 : 1);
  const totalLoanAmount = baseUser?.kpi?.totalLoanAmount ?? Math.round(acres * 25000);
  const schemeBenefits = baseUser?.kpi?.schemeBenefits ?? (acres <= 5 ? 12000 : 25000);
  const schemesApplied = baseUser?.kpi?.schemesApplied ?? 3;

  return {
    netProfitForecast,
    netProfitChange: baseUser?.kpi?.netProfitChange ?? 14.2,
    landCoverage,
    landUtilization,
    activeLoans,
    totalLoanAmount,
    schemeBenefits,
    schemesApplied,
  };
}

// -------------------------------------------------------------
// USER PROFILE METHODS (Firestore + Realtime DB + REST Fallback)
// -------------------------------------------------------------
export async function getUserProfile(uid: string): Promise<DemoUser> {
  // 1. In-memory cache
  if (inMemoryUserCache[uid]) {
    return inMemoryUserCache[uid];
  }

  // 2. Realtime Database REST API (Fastest and non-hanging on Vercel)
  try {
    const res = await fetch(`${RTDB_BASE_URL}/users/${uid}/profile.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.uid) {
        inMemoryUserCache[uid] = data;
        return data;
      }
    }
  } catch (err: unknown) {
    console.warn(`[RTDB REST] Read user profile failed for ${uid}:`, (err as Error)?.message);
  }

  // 3. Check Firestore
  if (adminDb) {
    try {
      const doc = await adminDb.collection("users").doc(uid).get();
      if (doc.exists) {
        const data = doc.data() as DemoUser;
        inMemoryUserCache[uid] = data;
        return data;
      }
    } catch (err: unknown) {
      console.warn(`[Firestore] Read user profile failed for ${uid}:`, (err as Error)?.message);
    }
  }

  // 4. Check Realtime Database SDK
  if (adminRtdb) {
    try {
      const snapshot = await adminRtdb.ref(`users/${uid}/profile`).once("value");
      if (snapshot.exists()) {
        const data = snapshot.val() as DemoUser;
        inMemoryUserCache[uid] = data;
        return data;
      }
    } catch (err: unknown) {
      console.warn(`[RTDB] Read user profile failed for ${uid}:`, (err as Error)?.message);
    }
  }

  // 5. Fallback to default Demo User
  const defaultUser = DEMO_USERS.find((u) => u.uid === uid) || DEMO_USERS[0];
  inMemoryUserCache[uid] = { ...defaultUser, uid };
  return inMemoryUserCache[uid];
}

export async function saveUserProfile(uid: string, updates: Partial<DemoUser>): Promise<DemoUser> {
  const current = await getUserProfile(uid);

  // Recalculate dynamic KPIs if acres or crops change
  const newAcres = typeof updates.acres === "number" ? updates.acres : current.acres;
  const newCrops = updates.crops || current.crops;
  const dynamicKpi = calculateDynamicKPI(newAcres, newCrops, current);

  const updated: DemoUser = {
    ...current,
    ...updates,
    acres: newAcres,
    crops: newCrops,
    kpi: {
      ...current.kpi,
      ...dynamicKpi,
      ...(updates.kpi || {}),
    },
  };

  inMemoryUserCache[uid] = updated;

  // 1. Direct REST PUT to Realtime Database
  try {
    fetch(`${RTDB_BASE_URL}/users/${uid}/profile.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {});
  } catch (err: unknown) {
    console.warn(`[RTDB REST] Save failed for ${uid}:`, (err as Error)?.message);
  }

  // 2. Write to Firestore
  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).set(updated, { merge: true });
      console.log(`[Firestore] User ${uid} saved successfully.`);
    } catch (err: unknown) {
      console.warn(`[Firestore] Save failed for ${uid}:`, (err as Error)?.message);
    }
  }

  // 2. Write to Realtime Database
  if (adminRtdb) {
    try {
      await adminRtdb.ref(`users/${uid}/profile`).set(updated);
      console.log(`[RTDB] User ${uid} profile synced.`);
    } catch (err: unknown) {
      console.warn(`[RTDB] Sync failed for ${uid}:`, (err as Error)?.message);
    }
  }

  return updated;
}

// -------------------------------------------------------------
// EXPENSES METHODS (Firestore + Realtime DB)
// -------------------------------------------------------------
export async function getUserExpenses(uid: string): Promise<UserExpense[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection("users").doc(uid).collection("expenses").orderBy("date", "desc").get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserExpense, "id">) }));
      }
    } catch (err: unknown) {
      console.warn(`[Firestore] Read expenses failed:`, (err as Error)?.message);
    }
  }

  const profile = await getUserProfile(uid);
  return profile.expenses || [];
}

export async function addUserExpense(uid: string, expense: Omit<UserExpense, "id">): Promise<UserExpense> {
  const id = "exp_" + Date.now();
  const fullExpense: UserExpense = { id, ...expense };

  // Write to Firestore collection
  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).collection("expenses").doc(id).set(fullExpense);
    } catch (err: unknown) {
      console.warn(`[Firestore] Add expense failed:`, (err as Error)?.message);
    }
  }

  // Write to Realtime DB
  if (adminRtdb) {
    try {
      await adminRtdb.ref(`users/${uid}/expenses/${id}`).set(fullExpense);
    } catch (err: unknown) {
      console.warn(`[RTDB] Add expense failed:`, (err as Error)?.message);
    }
  }

  // Also update user profile expenses array
  const profile = await getUserProfile(uid);
  const expenses = [fullExpense, ...(profile.expenses || [])];
  await saveUserProfile(uid, { expenses });

  return fullExpense;
}

export async function deleteUserExpense(uid: string, expenseId: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).collection("expenses").doc(expenseId).delete();
    } catch (err: unknown) {
      console.warn(`[Firestore] Delete expense failed:`, (err as Error)?.message);
    }
  }

  if (adminRtdb) {
    try {
      await adminRtdb.ref(`users/${uid}/expenses/${expenseId}`).remove();
    } catch (err: unknown) {
      console.warn(`[RTDB] Delete expense failed:`, (err as Error)?.message);
    }
  }

  const profile = await getUserProfile(uid);
  const expenses = (profile.expenses || []).filter((e) => e.id !== expenseId);
  await saveUserProfile(uid, { expenses });
  return true;
}

// -------------------------------------------------------------
// CROP PREDICTIONS HISTORY (Firestore + Realtime DB)
// -------------------------------------------------------------
export async function savePredictionHistory(uid: string, prediction: Omit<UserCropPrediction, "id" | "timestamp">): Promise<UserCropPrediction> {
  const id = "pred_" + Date.now();
  const fullPrediction: UserCropPrediction = {
    id,
    timestamp: new Date().toISOString(),
    ...prediction,
  };

  if (!inMemoryPredictions[uid]) {
    inMemoryPredictions[uid] = [];
  }
  inMemoryPredictions[uid].unshift(fullPrediction);

  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).collection("predictions").doc(id).set(fullPrediction);
    } catch (err: unknown) {
      console.warn(`[Firestore] Save prediction failed:`, (err as Error)?.message);
    }
  }

  if (adminRtdb) {
    try {
      await adminRtdb.ref(`users/${uid}/predictions/${id}`).set(fullPrediction);
    } catch (err: unknown) {
      console.warn(`[RTDB] Save prediction failed:`, (err as Error)?.message);
    }
  }

  return fullPrediction;
}

export async function getPredictionHistory(uid: string): Promise<UserCropPrediction[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection("users").doc(uid).collection("predictions").orderBy("timestamp", "desc").limit(10).get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserCropPrediction, "id">) }));
      }
    } catch (err: unknown) {
      console.warn(`[Firestore] Get predictions failed:`, (err as Error)?.message);
    }
  }

  return inMemoryPredictions[uid] || [];
}

// -------------------------------------------------------------
// MANDI ALERTS (Firestore + Realtime DB)
// -------------------------------------------------------------
export async function getMandiAlerts(uid: string): Promise<MandiAlert[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection("users").doc(uid).collection("mandi_alerts").get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MandiAlert, "id">) }));
      }
    } catch (err: unknown) {
      console.warn(`[Firestore] Get alerts failed:`, (err as Error)?.message);
    }
  }

  return inMemoryAlerts[uid] || [];
}

export async function addMandiAlert(uid: string, alert: Omit<MandiAlert, "id" | "createdAt">): Promise<MandiAlert> {
  const id = "alt_" + Date.now();
  const fullAlert: MandiAlert = {
    id,
    createdAt: new Date().toISOString(),
    ...alert,
  };

  if (!inMemoryAlerts[uid]) inMemoryAlerts[uid] = [];
  inMemoryAlerts[uid].unshift(fullAlert);

  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).collection("mandi_alerts").doc(id).set(fullAlert);
    } catch (err: unknown) {
      console.warn(`[Firestore] Add alert failed:`, (err as Error)?.message);
    }
  }

  if (adminRtdb) {
    try {
      await adminRtdb.ref(`users/${uid}/mandi_alerts/${id}`).set(fullAlert);
    } catch (err: unknown) {
      console.warn(`[RTDB] Add alert failed:`, (err as Error)?.message);
    }
  }

  return fullAlert;
}

export async function deleteMandiAlert(uid: string, alertId: string): Promise<boolean> {
  if (inMemoryAlerts[uid]) {
    inMemoryAlerts[uid] = inMemoryAlerts[uid].filter((a) => a.id !== alertId);
  }

  if (adminDb) {
    try {
      await adminDb.collection("users").doc(uid).collection("mandi_alerts").doc(alertId).delete();
    } catch (err: unknown) {
      console.warn(`[Firestore] Delete alert failed:`, (err as Error)?.message);
    }
  }

  if (adminRtdb) {
    try {
      await adminRtdb.ref(`users/${uid}/mandi_alerts/${alertId}`).remove();
    } catch (err: unknown) {
      console.warn(`[RTDB] Delete alert failed:`, (err as Error)?.message);
    }
  }

  return true;
}
