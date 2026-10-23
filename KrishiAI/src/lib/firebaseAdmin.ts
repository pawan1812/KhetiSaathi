import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getDatabase, type Database } from "firebase-admin/database";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminRtdb: Database | null = null;
let adminAuth: Auth | null = null;

try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID || "khetisaathi-a7e6c";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@khetisaathi-a7e6c.iam.gserviceaccount.com";
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";

    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    if (privateKey && clientEmail) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
      });
      console.log("[Firebase Admin] Modular SDK initialized for project:", projectId);
    } else {
      adminApp = initializeApp({
        projectId,
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
      });
    }
  }

  if (adminApp) {
    adminDb = getFirestore(adminApp);
    adminRtdb = getDatabase(adminApp);
    adminAuth = getAuth(adminApp);
  }
} catch (error) {
  console.error("[Firebase Admin] Initialization warning (fallback active):", (error as Error)?.message);
}

export { adminApp, adminDb, adminRtdb, adminAuth };
