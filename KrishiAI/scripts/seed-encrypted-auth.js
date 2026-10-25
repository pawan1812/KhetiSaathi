const bcrypt = require("bcryptjs");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getDatabase } = require("firebase-admin/database");
const path = require("path");

// Load .env.local
const fs = require("fs");
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const DEMO_USERS = [
  {
    uid: "user-001",
    name: "Rajesh Kumar",
    username: "rajesh",
    phone: "+91 98765 43210",
    plainPassword: "demo123",
    state: "Punjab",
    district: "Ludhiana",
    village: "Machhiwara",
    acres: 12,
    crops: ["Wheat", "Rice", "Mustard"],
    avatar: "RK",
    aadhaar_last4: "4523",
    bankAccount: "SBI, Ludhiana Branch",
    healthScore: 74,
  },
  {
    uid: "user-002",
    name: "Priya Devi",
    username: "priya",
    phone: "+91 87654 32109",
    plainPassword: "farmer2",
    state: "Uttar Pradesh",
    district: "Meerut",
    village: "Sardhana",
    acres: 7,
    crops: ["Sugarcane", "Wheat", "Vegetables"],
    avatar: "PD",
    aadhaar_last4: "7812",
    bankAccount: "Bank of Baroda, Meerut",
    healthScore: 61,
  },
  {
    uid: "user-003",
    name: "Suresh Patel",
    username: "suresh",
    phone: "+91 76543 21098",
    plainPassword: "agri2026",
    state: "Maharashtra",
    district: "Nashik",
    village: "Niphad",
    acres: 18,
    crops: ["Grapes", "Onion", "Cotton"],
    avatar: "SP",
    aadhaar_last4: "2934",
    bankAccount: "NABARD Co-op, Nashik",
    healthScore: 82,
  },
];

async function seedEncryptedUsers() {
  console.log("=== SEEDING REAL DATABASE WITH ENCRYPTED PASSWORDS ===");

  let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });

  const db = getFirestore(app);
  const rtdb = getDatabase(app);

  for (const user of DEMO_USERS) {
    const cleanPhone = user.phone.replace(/[^0-9]/g, "").slice(-10);
    console.log(`\nEncrypting password for ${user.name} (${cleanPhone})...`);
    
    // Hash password using bcryptjs with 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.plainPassword, salt);

    console.log(`  -> Plain Password: ${user.plainPassword}`);
    console.log(`  -> Bcrypt Encrypted Hash: ${passwordHash.slice(0, 20)}...`);

    const storedUser = {
      uid: user.uid,
      name: user.name,
      username: user.username,
      phone: user.phone,
      phoneClean: cleanPhone,
      passwordHash: passwordHash, // ONLY ENCRYPTED HASH IS SAVED
      state: user.state,
      district: user.district,
      village: user.village,
      acres: user.acres,
      crops: user.crops,
      avatar: user.avatar,
      aadhaar_last4: user.aadhaar_last4,
      bankAccount: user.bankAccount,
      healthScore: user.healthScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Write to Realtime Database
    await rtdb.ref(`users/${user.uid}/profile`).set({
      uid: user.uid,
      name: user.name,
      username: user.username,
      phone: user.phone,
      phoneClean: cleanPhone,
      state: user.state,
      district: user.district,
      village: user.village,
      acres: user.acres,
      crops: user.crops,
      avatar: user.avatar,
      aadhaar_last4: user.aadhaar_last4,
      bankAccount: user.bankAccount,
      healthScore: user.healthScore,
      createdAt: storedUser.createdAt,
      updatedAt: storedUser.updatedAt,
    });

    await rtdb.ref(`users/${user.uid}/auth`).set({
      uid: user.uid,
      username: user.username,
      phone: user.phone,
      phoneClean: cleanPhone,
      passwordHash: passwordHash, // Encrypted!
      updatedAt: storedUser.updatedAt,
    });

    // Write indexes for instant lookup (phone and username)
    await rtdb.ref(`phone_to_uid/${cleanPhone}`).set(user.uid);
    if (user.username) {
      await rtdb.ref(`username_to_uid/${user.username.toLowerCase()}`).set(user.uid);
    }
    console.log(`  -> Realtime Database written for ${user.name} (username: ${user.username})`);

    // 2. Write to Firestore
    await db.collection("users").doc(user.uid).set(storedUser, { merge: true });
    console.log(`  -> Firestore document written for ${user.name}`);

    // Verify verification check
    const verifyMatch = await bcrypt.compare(user.plainPassword, passwordHash);
    const verifyFail = await bcrypt.compare("wrong_password", passwordHash);
    console.log(`  -> Test verify correct password: ${verifyMatch ? "SUCCESS (Matched)" : "FAIL"}`);
    console.log(`  -> Test verify wrong password: ${!verifyFail ? "SUCCESS (Rejected)" : "FAIL"}`);
  }

  console.log("\n✅ ALL USERS SECURELY ENCRYPTED & SAVED IN REAL DATABASE!");
  process.exit(0);
}

seedEncryptedUsers().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
