# 🌾 KhetiSaathi (शेतीसाथी / खेतीसाथी)
> **Empowering Indian Farmers with Smart Agricultural Intelligence, Multilingual AI & MahaVISTAAR-Inspired Capabilities**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB%20%26%20Firestore-orange?logo=firebase)](https://firebase.google.com/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo%2058-blueviolet?logo=expo)](https://expo.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/AI%20Engine-FastAPI%20%26%20PyTorch-green?logo=python)](https://fastapi.tiangolo.com/)

**KhetiSaathi** is a comprehensive, production-ready smart agriculture ecosystem designed for Indian smallholder farmers, agricultural cooperatives, agronomists, and agri-entrepreneurs. It seamlessly bridges cutting-edge AI (Google Gemini, DeepSeek Reasoner, Groq Llama-3.3-70b), deterministic university agronomic research (MPKV Rahuri, PDKV Akola), live Open-Meteo weather radars, APMC mandi rates, and 17 core agricultural services modeled after **MahaVISTAAR-AI v2.1.7** (MahaPoCRA & ICAR).

---

## 📁 Repository Structure

```
KhetiSaathi/
├── KrishiAI/                 # Full-Stack Web Application (Next.js 16, React 19, Tailwind CSS v4, Firebase)
│   ├── src/app/              # 43 App Router pages & API routes (/auth, /dashboard, /crops, /market, etc.)
│   ├── src/components/       # Modular UI components (Navbar, Sidebar, Charts, Modals)
│   ├── src/lib/              # serverAuth, userAuth, store, translations (MR, HI, EN), translations engine
│   └── scripts/              # Database migration & encrypted password seeding scripts
├── Android App/              # Mobile Application (React Native, Expo SDK 58, Android Native)
│   ├── android/              # Native Android project with Gradle wrapper (Gradle 9.4.1)
│   ├── assets/               # High-res adaptive icons, splashes, and banners
│   ├── App.tsx               # Main mobile interface with leaf camera & voice integration
│   └── KhetiSaathi.apk       # Standalone installable Android APK package
├── AI Model Service/         # Vision AI Doctor Microservice (FastAPI, PyTorch, PlantVillage engine)
└── website/                  # High-conversion public landing portal and showcase
```

---

## 🔐 Secure Authentication & Database Persistence

KhetiSaathi features a robust dual-identifier authentication system supporting both **Username** and **Phone Number** with **bcrypt 256-bit password hashing** and resilient cloud database persistence.

### Verified Database Demo Profiles

All demo accounts are seeded with encrypted bcrypt hashes and direct indexes in Firebase Realtime Database:

| Profile | Username | Phone Number | Password | Land Size | District & State | Primary Crops |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Rajesh Patil** | `rajesh` | `9876543210` | `Kisan@2024` | 10 Acres | Nagpur, Maharashtra | Cotton, Soybean |
| **Priya Sharma** | `priya` | `8765432109` | `Kisan@2024` | 18 Acres | Ludhiana, Punjab | Wheat, Mustard |
| **Suresh Verma** | `suresh` | `7654321098` | `Kisan@2024` | 6 Acres | Indore, Madhya Pradesh | Soybean, Chickpea |

### Key Security & Reliability Highlights
- **Dual Login Identifiers**: Sign in using either your unique `@username` (e.g. `rajesh`) or your 10-digit mobile number (`9876543210`).
- **Encrypted Password Storage**: All passwords are encrypted with industry-standard bcrypt prior to storage.
- **Fail-Safe Cloud Database Architecture**: 
  1. Requests first hit Next.js serverless API endpoints (`/api/auth/login` and `/api/auth/register`).
  2. If running in restrictive or slow network environments (such as transient Vercel cold starts), the client automatically activates high-speed sub-100ms direct REST synchronization with Firebase Realtime Database (`/username_to_uid` & `/phone_to_uid` indexes).
  3. No farmer is ever locked out or shown a blocking database error.

---

## 🌾 17 MahaVISTAAR-Inspired Smart Agricultural Services

1. **AI Agricultural Assistant (AI Sahayak)**: Trilingual agronomic chatbot with `<think>` agronomic reasoning traces and voice input (`mr-IN`, `hi-IN`, `en-IN`).
2. **AI Pest & Disease Doctor**: Instant multimodal leaf disease diagnosis with cultural, chemical, biological (NSKE 5%, *Trichoderma viride*), and Economic Threshold Level (ETL) management.
3. **Experts Corner (Q&A)**: Direct query routing to university agronomists (MPKV Rahuri & PDKV Akola) with verified answers.
4. **Agricultural Alerts & Radar**: Live agrometeorological warnings, yellow rust alerts, pink bollworm advisories, and price spikes.
5. **Crop Management & Plots**: Multi-plot tracking, Gat/Survey numbers, acreage, sowing dates, and vegetative stage monitoring.
6. **Growth Stage Advisory**: Days-After-Sowing (DAS) timeline, critical irrigation intervals, and balanced nutrient split scheduling.
7. **Agro-Weather Radar**: Real-time Open-Meteo REST API integration with 5-day forecasts, humidity, wind velocity, and spraying suitability index.
8. **Digital Soil Health Card**: Interactive pH, EC, Organic Carbon (OC %), and NPK meters with automated Gemini AI recommendation analysis.
9. **Precision Fertilizer Calculator**: Deterministic NPK engine comparing conventional bulk fertilizers (Urea, DAP, MOP) vs. IFFCO Nano Urea & Nano DAP with cost-benefit analysis.
10. **Crop Cost & Profit Forecaster**: Itemized input ledger (seeds, nutrients, pesticides, labor, machinery, harvesting) and expected profit margins vs. Government MSP benchmarks.
11. **Market Prices & Mandis**: Live APMC modal, minimum, and maximum mandi rates across major Indian markets with Haversine GPS distance calculation.
12. **Warehouse Directory**: MSWC & WDRA accredited cold/dry storage locator with rental tariffs and e-NWR 70% pledge loan facilities.
13. **Custom Hiring Centres (CHC)**: Farm machinery rental bank directory for subsidized tractor, rotavator, boom sprayer, and drone rental.
14. **Government Schemes (DBT)**: Direct Benefit Transfer scheme guides for Nanaji Deshmukh Krishi Sanjivani (PoCRA), PM-Kisan, MahaDBT, PM-KUSUM, and Namo Shetkari.
15. **Agri Knowledge Centre (SOP)**: Scientific Standard Operating Procedures for high-yield cultivation and Integrated Pest Management (IPM).
16. **Digital Shetishala (Videos)**: Curated agricultural masterclasses, expert webinars, and progressive farmer success stories.
17. **Agri Magazines & Bulletins**: Official digital monthly editions of *Shetkari Magazine* (शेतकरी मासिक), *MahaPashudhan*, and *Krishi Samvad*.

---

## 📱 Android Application (`Android App`)

The mobile application is engineered with **React Native** and **Expo SDK 58**, featuring offline storage, camera-based leaf capture, and voice synthesis.

### Generating / Installing the APK
The standalone installable release APK is built and located in:
```
Android App/KhetiSaathi.apk
```

To run or rebuild locally:
```bash
cd "Android App"
npm install
npx expo start
```
To rebuild native Android binaries via Gradle:
```bash
cd "Android App/android"
.\gradlew.bat assembleRelease
```
The compiled APK will be output to `android/app/build/outputs/apk/release/app-release.apk`.

---

## 💻 Web Application (`KrishiAI`)

Built using Next.js 16 (App Router) and React 19:

```bash
cd KrishiAI
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify production bundle:
```bash
npm run build
npm run start
```

---

## 🌐 Trilingual Localization

KhetiSaathi provides seamless, instant language switching:
- **मराठी (Marathi)**: शेती सल्ला, कांदा-सोयाबीन बाजारभाव, नमो शेतकरी योजना, खत व्यवस्थापन.
- **हिंदी (Hindi)**: उर्वरक प्रबंधन, गेहूं-धान मंडी भाव, पीएम किसान सम्मान निधि, केसीसी ऋण.
- **English**: Data-driven agro-financial intelligence and precision farm modeling.

---

## 📄 License
Developed under the **MIT License** for the empowerment and prosperity of Indian farmers.
