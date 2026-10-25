import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getDatabase, type Database } from "firebase-admin/database";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminRtdb: Database | null = null;
let adminAuth: Auth | null = null;

// Fallback embedded credentials for Vercel deployment where env vars may not be manually added
const FALLBACK_PROJECT_ID = "khetisaathi-a7e6c";
const FALLBACK_CLIENT_EMAIL = "firebase-adminsdk-fbsvc@khetisaathi-a7e6c.iam.gserviceaccount.com";
const FALLBACK_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9JmPobaPuajDe\nDYcbNFKzt4AVPme/YDPHeQf7W3YR2MrCJBR9c0FP5mXN6zFJrUg6q0SwNp8rtAP0\nVsRpmgYCXZ45HWb7r2DSmRohSwVHKIlOLuw2g+0zYWacYSbboN3/44sykD/vjZKz\nhmYHJBbUhqx4FjYrtL1zwStAXDoEg2zJdPeu4VY7Wr2ClKgr5kLcbfKhEhqTP+Jf\nrZgV6nJBeff1KB2TH66ZEX+uj7fZDj2H71JNgzPfKeoqPRRAJ12RZwZilibW6TU2\noQyL8blrVW1spmkHyK+mJphETKLqLU7TlNZYDwrxdnno2S2lrLK9jKqAR+VskkXY\nfUTp7WHLAgMBAAECggEAKjVlaQoCYWMH+Z06L3trExiZN+RfoWiV1WbwPYqI2+2t\nPUpw2he8lNhckmlv67mD2ze50bq2pTl8AmvUU55fxepfMu6ZOwPFTumEV7aWfG0S\nysQUyQuChIsxKydQ1QTeVUpRFxzyb4H/oRkWLnTCtXVCCmAmgXVJK4oJHUkXV0cc\nDZ4l81FQImdTSbsSx7D5jbZk2O9jI9yYA190bNJeBK767Ig/3RFSetq1uJYKKlWx\nxP0vhkG3jP598rQQMjK/KRkPIqQA08iuWawUUkeiof1AZvR6EhVnPW+AjjaE8yd6\nqlBesPiDFGJgLdB2wZxqSiZ/S+EduMqjrkTwHMI+5QKBgQDv5OYJ4MfjyEgc02JE\nSlWuUSZhgBsqmnToDjZoLBRS8LGQ2jArIVVhnItidWJzoud8od5w18x0hfjnKpLD\nb6pqoRjw5WstO9zsR3Lw6WCKXp2Ub+OQGC93U4/1Y7PFtlfDMUHdTZ02bIrOZyIO\n7DkD1lLFRVHHXHOw2lRzC13nrQKBgQDJ2VfJkhIR0Z4GPOa1KQzaD7atk8Hnskm0\n3kQ+JheBfaFdcUO3/XwP1rx94Uw8ptCwYS/vIdOHYbK00Yotse8wMOKpRTPOieSg\nET7uJG/AQliqsS1dNd9NyVHZ2zsGv0v11vpoJaKJXSZ5+SzAY6zNqHvR2Ih01hNj\nW/4Dgn7+VwKBgQCteblgK0xhS9PaBIJrH9YV2FkI6Lq8dDVWGfD+I+IOmD/Pn/h1\nOAWmMK4a5Qfs10DOv787mtIe8UKs5/x5l6aEtTpz+XMnosJ/mqtjy2Akr4cEcGT/\nLn4krCjOKus1bkbIwDYA8r9dO+Ckoa/fWrNgMvxn61jX8eM3YKrxBqdBgQKBgD+m\nU7JyZ1RLH2OkLLQPv8e7kMVnhIvFgsyQEkDuzha9QPcwUkRgoJB2DHY9Z0bw63nT\nC8SCjCtyuWGfec0zANPXdoIeGloUzY1UIt4Bi2O7CC67NCziYgorY64pHZHhHNjm\n84uH4psiTpHD60K3q7QmXvUrLMx6/R4l0hHVQqp9AoGAZvHyEEHa1neHAR2PkLkN\ns3dXwqOZ8gB4UBjUMdaHrQCNrYWpR1/xE0ELCb03sC6n4jrcF8L/6usYjI3MObtl\nvk/f3a9+2LrGCfJPJrau+g+Uazj43ditdRJoWeNl4XrY9hQ3GbkDMKh5FxQJzOAP\nneJZUPZRZgcpMQB39cLDE+4=\n-----END PRIVATE KEY-----\n";

export const RTDB_BASE_URL = `https://${FALLBACK_PROJECT_ID}-default-rtdb.firebaseio.com`;

try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID || FALLBACK_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || FALLBACK_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || FALLBACK_PRIVATE_KEY;

    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
    });
    console.log("[Firebase Admin] Initialized with certified credentials for project:", projectId);
  }

  if (adminApp) {
    adminDb = getFirestore(adminApp);
    adminRtdb = getDatabase(adminApp);
    adminAuth = getAuth(adminApp);
  }
} catch (error) {
  console.warn("[Firebase Admin] Initialization warning (REST API fallback active):", (error as Error)?.message);
}

export { adminApp, adminDb, adminRtdb, adminAuth };
