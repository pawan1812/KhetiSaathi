# KhetiSaathi (शेतीसाथी / खेतीसाथी)
> **Empowering Indian Farmers with Smart Agricultural Intelligence & MahaVISTAAR-Inspired Capabilities**

KhetiSaathi is a full-stack smart agriculture ecosystem integrating **Google Gemini AI**, state university agronomy research (MPKV Rahuri, PDKV Akola), live weather radars, APMC mandi rates, and 17 comprehensive agricultural services modeled after **MahaVISTAAR-AI v2.1.7** (MahaPoCRA & ICAR).

---

## 📁 Repository Structure

```
KhetiSaathi/
├── KrishiAI/         # Full-Stack Web Application (Next.js 16, React 19, Tailwind CSS v4, Firebase)
├── Android App/      # Mobile Application (React Native, Expo SDK 52, Offline Agrometeorology)
└── website/          # Landing Page & Public Information Portal
```

---

## 🌾 17 Smart Agricultural Capabilities

1. **AI Agricultural Assistant (AI Sahayak):** Trilingual agro-intelligence powered by Google Gemini with voice reasoning in Marathi, Hindi, and English.
2. **AI Pest & Disease Doctor:** Multimodal leaf diagnosis with chemical, organic (NSKE/Trichoderma), cultural, and ETL thresholds.
3. **Experts Corner (Q&A):** Direct query submission and verified advice from MPKV Rahuri & PDKV Akola agricultural scientists.
4. **Agricultural Alerts & Radar:** Real-time agromet warnings, pink bollworm forewarnings, and price surge bulletins.
5. **Crop Management & Plots:** Plot and Gat/Survey number tracking, sowing dates, and growth stages.
6. **Crop Advisory & Growth Stages:** Days-After-Sowing (DAS) tracking, stage-specific fertilizer doses, and irrigation intervals.
7. **Agro-Weather Radar:** Live Open-Meteo REST API integration with 5-day agro-meteorological forecast and spraying suitability index.
8. **Digital Soil Health Card:** Visual pH, EC, Organic Carbon %, NPK rating meters, micronutrients, and Gemini AI card analysis.
9. **Precision Fertilizer Calculator:** Deterministic university NPK engine with IFFCO Nano Urea/DAP package vs conventional savings and split schedules.
10. **Crop Cost & Profit Calculator:** Itemized inputs (seeds, fertilizer, labor, machinery, harvesting, transport), expected yield, MSP benchmarks, and Benefit-Cost (B:C) ratio.
11. **Market Prices & Mandis:** Live APMC modal rates (Lasalgaon, Pimpalgaon, Kalamna, Pune, etc.), MSP comparisons, and GPS distance.
12. **Warehouse Directory:** MSWC & WDRA accredited dry/cold storages, rental rates, and e-NWR 70% pledge loan facility.
13. **Custom Hiring Centres (CHC):** Nearby farm machinery banks to rent tractors, rotavators, threshers, and spray drones at subsidized rates.
14. **Government Schemes (DBT):** Nanaji Deshmukh PoCRA, MahaDBT, Namo Shetkari, PM-Kisan, and PM-KUSUM solar pumps.
15. **Agri Knowledge Centre (SOP):** Standard Operating Procedures (SOPs) for high-yield cultivation, pink bollworm IPM, and drip fertigation.
16. **Digital Shetishala (Videos):** Video masterclasses, webinars, and progressive farmer case studies.
17. **Agri Magazines & Bulletins:** Official digital editions of *Shetkari Magazine* (शेतकरी मासिक), *MahaPashudhan*, and *Krishi Samvad*.

---

## 🚀 Getting Started

### 1. Web Application (`KrishiAI`)
```bash
cd KrishiAI
npm install
npm run dev
```
Runs at `http://localhost:3000`.

### 2. Mobile Application (`Android App`)
```bash
cd "Android App"
npm install
npx expo start
```

### 3. Landing Website (`website`)
Open `website/index.html` in any web browser.

---

## 🌐 Localization
Full trilingual support across:
- **मराठी (Marathi)**
- **हिंदी (Hindi)**
- **English**

---

## 📄 License
MIT License. Developed for Indian Agriculture & Farmer Empowerment.
