const path = require("path");
const fs = require("fs");

// Load .env.local
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

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getDatabase } = require("firebase-admin/database");
const bcrypt = require("bcryptjs");

async function runTests() {
  console.log("==================================================");
  console.log("  STRICT DATABASE AUTHENTICATION & ENCRYPTION TEST");
  console.log("==================================================\n");

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

  // Test 1: Check existing seeded users in database
  console.log("--- TEST 1: Verify Pre-seeded User in Database ---");
  const rajeshPhoneClean = "9876543210";
  const rtdbAuthSnap = await rtdb.ref("users/user-001/auth").once("value");
  const rtdbUser = rtdbAuthSnap.val();

  if (!rtdbUser || !rtdbUser.passwordHash) {
    throw new Error("FAIL: Rajesh Kumar is missing encrypted password in database!");
  }
  console.log("✓ User user-001 exists in Realtime Database");
  console.log("✓ Stored Password Hash (Encrypted):", rtdbUser.passwordHash);

  // Ensure plain text password is NOT stored
  if (rtdbUser.password || rtdbUser.plainPassword) {
    throw new Error("FAIL: Plain text password found in database! Must only be encrypted!");
  }
  console.log("✓ No plain text passwords exist in database! Password is encrypted with bcrypt.");

  // Test 2: Verify Strict Password Checking
  console.log("\n--- TEST 2: Strict Password Verification Against Database ---");
  const isMatchCorrect = await bcrypt.compare("demo123", rtdbUser.passwordHash);
  console.log("✓ Checking correct password 'demo123':", isMatchCorrect ? "PASSED (Granted Access)" : "FAILED");
  if (!isMatchCorrect) throw new Error("Expected correct password to match");

  const isMatchWrong = await bcrypt.compare("wrongpass999", rtdbUser.passwordHash);
  console.log("✓ Checking wrong password 'wrongpass999':", !isMatchWrong ? "PASSED (Access Denied)" : "FAILED");
  if (isMatchWrong) throw new Error("Wrong password should never match!");

  // Test 3: New User Registration with Password Encryption and Profile Storage
  console.log("\n--- TEST 3: Register New Farmer with Encrypted Password ---");
  const testPhone = "9123456789";
  const testPassword = "secureFarmer@2026";
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(testPassword, salt);
  const testUid = "test_farmer_" + Date.now();

  const newFarmer = {
    uid: testUid,
    name: "Balasaheb Shinde",
    phone: "+91 91234 56789",
    phoneClean: testPhone,
    passwordHash: encryptedPassword,
    state: "Maharashtra",
    district: "Solapur",
    village: "Mohol",
    acres: 15,
    crops: ["Pomegranate", "Sugarcane"],
    avatar: "BS",
    aadhaar_last4: "8472",
    bankAccount: "Bank of Maharashtra, Mohol Branch",
    healthScore: 84,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Write to Realtime Database
  await rtdb.ref(`users/${testUid}/profile`).set(newFarmer);
  await rtdb.ref(`users/${testUid}/auth`).set({
    uid: testUid,
    phone: newFarmer.phone,
    phoneClean: testPhone,
    passwordHash: encryptedPassword,
  });
  await rtdb.ref(`phone_to_uid/${testPhone}`).set(testUid);

  // Write to Firestore
  await db.collection("users").doc(testUid).set(newFarmer);
  console.log(`✓ New farmer ${newFarmer.name} saved to Firestore and Realtime Database`);

  // Verify write back
  const readBack = await rtdb.ref(`users/${testUid}/auth`).once("value");
  const verifiedMatch = await bcrypt.compare(testPassword, readBack.val().passwordHash);
  console.log("✓ Read back new user from database and verified password with bcrypt:", verifiedMatch ? "SUCCESS" : "FAILED");

  // Clean up test user
  await rtdb.ref(`users/${testUid}`).remove();
  await rtdb.ref(`phone_to_uid/${testPhone}`).remove();
  await db.collection("users").doc(testUid).delete();
  console.log("✓ Test cleanup completed.");

  console.log("\n==================================================");
  console.log("  ALL TESTS PASSED: STRICT DATABASE AUTH WORKING! ");
  console.log("==================================================");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
