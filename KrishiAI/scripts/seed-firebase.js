const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function seedDatabase() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Missing Firebase environment variables. Please check .env.local");
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });

  const db = admin.database();

  console.log("Connected to Firebase! Writing mock data...");

  // We'll require mockData (we need to compile it since it's TS, or just use hardcoded JSON here to be safe and quick).
  // I will just hardcode the main nodes from the schema to be absolutely sure it writes properly.
  
  const initialData = {
    users: {
      "demo-farmer-001": {
        profile: {
          name: "Rajesh Kumar",
          state: "Punjab",
          district: "Ludhiana",
          acres: 12,
          crops: ["Wheat", "Rice", "Mustard"],
          lang: "hi"
        },
        health_score: {
          score: 742,
          updated: new Date().toISOString()
        }
      }
    },
    alerts: {
      global: {
        fertilizer_crisis: {
          active: true,
          urea_spike_pct: 35,
          updated: new Date().toISOString()
        }
      }
    },
    crisis: {
      fertilizer_prices: {
        urea: 2850,
        DAP: 3200,
        MOP: 1980
      },
      hormuz_status: "restricted"
    },
    market: {
      prices: {
        wheat: {
          Punjab: {
            "2026-03-28": { min: 2280, max: 2330, modal: 2310 }
          }
        }
      }
    }
  };

  try {
    await db.ref("/").set(initialData);
    console.log("✅ Successfully seeded Firebase Realtime Database with Demo Data!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed database:", err);
    process.exit(1);
  }
}

seedDatabase();
