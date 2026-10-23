# 🌾 KhetiSaathi (खेतीसाथी / शेतीसाथी)
### Industry-Grade AI-Powered Agricultural & Financial Intelligence Platform

> **KhetiSaathi** is a modern, production-ready web application engineered for Indian farmers, agricultural cooperatives, and agri-entrepreneurs. It delivers hyper-localized market intelligence, real-time agro-meteorology, predictive crop economics, and AI-driven advisory in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**.

---

## 🚀 Key Industry Features

### 1. 🌦️ Live Agri-Weather & Radar (Zero-Key Open Source API)
- Integrated with the **Open-Meteo** API for real-time temperature, humidity, wind velocity, and UV index.
- **GPS-Based Location Detection**: Automatically detects browser coordinates or allows instant switching between major Indian agricultural hubs (Nashik, Pune, Nagpur, Baramati, Indore, Ludhiana, Karnal, Meerut, Rajkot).
- **5-Day Agro-Meteorological Forecast**: Precipitation probability, max/min temperatures, and actionable agronomic advisories (irrigation, spraying, and frost risk) translated dynamically into the user's selected language.

### 2. 🏛️ Proximity APMC Mandi Engine & Agmarknet Rates
- Calculates real **Haversine distances (in km)** from the farmer's coordinates to regional APMC mandis (Lasalgaon, Pimpalgaon, Gultekdi Pune, Baramati, Khanna, Indore, Rajkot, etc.).
- Real-world modal, minimum, and maximum rates compared against **Government Minimum Support Prices (MSP 2025–26)**.
- SMS & in-app price alerts with target triggers.

### 3. 🤖 KhetiSaathi AI Sahayak (Trilingual Agronomy Assistant)
- Deep domain knowledge on **fertilizer crisis mitigation** (Strait of Hormuz gas disruption, Nano-Urea replacement of 45 kg conventional bags, foliar dosing).
- Trilingual conversational support:
  - **मराठी (Marathi)**: शेती सल्ला, कांदा-सोयाबीन बाजारभाव, नमो शेतकरी महासन्मान योजना.
  - **हिंदी (Hindi)**: उर्वरक प्रबंधन, गेहूं-धान मंडी भाव, पीएम किसान सम्मान निधि, केसीसी ऋण.
  - **English**: Data-driven agro-financial recommendations.
- **`<think>` Reasoning Traces**: Complete transparency into the agronomic reasoning process.
- **Web Speech Recognition**: Hands-free voice query input in Marathi (`mr-IN`), Hindi (`hi-IN`), and English (`en-IN`).

### 4. 💰 Precision Crop Profit & Yield Forecaster
- Dynamic calculation of gross revenue, operational expenses (seeds, fertilizers, labor, machinery), and net farm income.
- Crisis surcharge adjustments (+35% fertilizer factor).
- One-click **PDF Farm Advisory Export** for bank credit and loan applications.

### 5. 📊 Interactive Expense Ledger
- Real-time farm ledger with categorized expense tracking (Seeds, Fertilizers, Labor, Machinery, Pesticides, Irrigation).
- Live calculation of spent budget, remaining capital, and burn rates.
- Instant **CSV Export** and **Printable Report**.

---

## 🌐 Supported Languages
- 🇬🇧 **English (`en`)**
- 🇮🇳 **हिन्दी / Hindi (`hi`)**
- 🚩 **मराठी / Marathi (`mr`)**

Language state is synchronized across navigation, dashboard widgets, market analysis, prediction reports, and the AI chatbot.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (Turbopack) & React 19
- **State Management**: Zustand with persistent storage
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens (High-contrast Dark/Light mode)
- **Visualizations**: Recharts & Framer Motion animations
- **APIs**:
  - Weather: Open-Meteo REST API (`api.open-meteo.com`)
  - Market Rates: Agmarknet APMC Proximity Engine
  - AI Assistant: Groq (Llama-3.3-70b), DeepSeek Reasoner, or Native Domain Agronomic Expert Engine

---

## ⚡ Quick Start & Local Run

### Prerequisites
- Node.js 18+ or 20+

### Installation
```bash
git clone https://github.com/your-org/KhetiSaathi.git
cd KhetiSaathi/KrishiAI
npm install
```

### Environment Variables (Optional)
Create a `.env.local` file:
```env
# Optional external AI providers (if omitted, KhetiSaathi runs on its built-in expert agronomic engine)
GROQ_API_KEY=your_groq_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚢 Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy on Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Set the root directory to `KrishiAI` (or the project root).
3. Click **Deploy**.

---

## 📄 License
Licensed under the Apache-2.0 / MIT License. Developed for Indian Agriculture & Farmers.
