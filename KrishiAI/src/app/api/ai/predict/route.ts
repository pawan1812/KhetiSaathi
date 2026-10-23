import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface PredictBody {
  crop?: string;
  land?: number;
  location?: string;
  soil?: string;
  season?: string;
  costs?: {
    seeds?: number;
    fertilizer?: number;
    irrigation?: number;
    labor?: number;
    machinery?: number;
    pesticide?: number;
  };
}

const CROP_BASE_STATS: Record<string, { yield: number; price: number; unit: string }> = {
  Wheat: { yield: 21.0, price: 2425, unit: "quintal" }, // Updated to MSP 2025-26
  Rice: { yield: 25.5, price: 2300, unit: "quintal" },
  Mustard: { yield: 8.0, price: 5950, unit: "quintal" },
  Cotton: { yield: 11.0, price: 7121, unit: "quintal" },
  Sugarcane: { yield: 340.0, price: 340, unit: "quintal" },
  Maize: { yield: 24.0, price: 2225, unit: "quintal" },
  Chickpea: { yield: 9.5, price: 5440, unit: "quintal" },
  Soybean: { yield: 10.5, price: 4892, unit: "quintal" },
  Onion: { yield: 85.0, price: 2450, unit: "quintal" },
};

const SOIL_MULTIPLIERS: Record<string, number> = {
  Alluvial: 1.15,
  "Black Cotton": 1.10,
  Red: 0.95,
  Laterite: 0.90,
  "Sandy Loam": 0.88,
  Clay: 1.02,
};

function generateAgroSimulation(body: PredictBody) {
  const crop = body.crop || "Wheat";
  const land = Number(body.land) || 12;
  const soil = body.soil || "Alluvial";
  const season = body.season || "Rabi (Winter)";
  const location = body.location || "Maharashtra";

  const stats = CROP_BASE_STATS[crop] || { yield: 18.0, price: 2200, unit: "quintal" };
  const soilMult = SOIL_MULTIPLIERS[soil] || 1.0;

  const yieldPerAcre = Math.round(stats.yield * soilMult * 10) / 10;
  const totalYield = Math.round(yieldPerAcre * land * 10) / 10;
  const pricePerQuintal = stats.price;
  const estimatedRevenue = Math.round(totalYield * pricePerQuintal);

  // Scaled input costs
  const userCosts = body.costs || {
    seeds: 8000,
    fertilizer: 15000,
    irrigation: 6000,
    labor: 12000,
    machinery: 10000,
    pesticide: 3000,
  };

  const scale = Math.max(1, land / 12);
  const rawFertCost = Math.round((userCosts.fertilizer ?? 15000) * scale);
  const adjustedFertCost = Math.round(rawFertCost * 1.35); // 35% Hormuz crisis surge
  const fertIncrease = adjustedFertCost - rawFertCost;

  const seedsCost = Math.round((userCosts.seeds ?? 8000) * scale);
  const laborCost = Math.round((userCosts.labor ?? 12000) * scale);
  const machineryCost = Math.round((userCosts.machinery ?? 10000) * scale);
  const irrigationCost = Math.round((userCosts.irrigation ?? 6000) * scale);
  const pesticideCost = Math.round((userCosts.pesticide ?? 3000) * scale);

  const totalCost = seedsCost + adjustedFertCost + laborCost + machineryCost + irrigationCost + pesticideCost;
  const netProfit = estimatedRevenue - totalCost;
  const profitabilityPct = Math.round((netProfit / totalCost) * 1000) / 10;

  const costBreakdown = [
    { name: "Fertilizer", value: adjustedFertCost, pct: Math.round((adjustedFertCost / totalCost) * 1000) / 10, crisisAdjusted: true },
    { name: "Labor", value: laborCost, pct: Math.round((laborCost / totalCost) * 1000) / 10 },
    { name: "Machinery", value: machineryCost, pct: Math.round((machineryCost / totalCost) * 1000) / 10 },
    { name: "Seeds", value: seedsCost, pct: Math.round((seedsCost / totalCost) * 1000) / 10 },
    { name: "Irrigation", value: irrigationCost, pct: Math.round((irrigationCost / totalCost) * 1000) / 10 },
    { name: "Pesticides", value: pesticideCost, pct: Math.round((pesticideCost / totalCost) * 1000) / 10 },
  ];

  let advice = "";
  if (profitabilityPct > 80) {
    advice = `Exceptional return forecasted! ${crop} on ${land} acres of ${soil} soil in ${location} produces high margin despite the +35% fertilizer surge. To maximize net profit, substitute 40% conventional urea with liquid Nano Urea (₹225/bottle) and ensure prompt APMC mandi sales.`;
  } else if (profitabilityPct > 30) {
    advice = `Moderate profitability projected. Fertilizer cost accounts for ${Math.round((adjustedFertCost / totalCost) * 100)}% of expenses due to the Hormuz strait disruption. Consider split nitrogen dosing and register for the Emergency Fertilizer Relief Package (₹5,000/acre).`;
  } else {
    advice = `Tight margins detected due to inflated input costs. Switching to direct-seeded methods or intercropping with short-duration pulses (moong/urad) can cut diesel and fertilizer expenses by up to 25%.`;
  }

  return {
    crop,
    land,
    season,
    soil,
    location,
    totalCost,
    estimatedRevenue,
    netProfit,
    profitabilityPct,
    yieldPerAcre,
    pricePerQuintal,
    totalYield,
    costBreakdown,
    crisisImpact: {
      normalFertCost: rawFertCost,
      adjustedFertCost,
      increase: fertIncrease,
      reason: "Strait of Hormuz disruption — urea +35%, DAP +28%",
    },
    aiAdvice: advice,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: PredictBody = await req.json();

    const simulation = generateAgroSimulation(body);

    // Call Google Gemini to enrich the agricultural advisory
    try {
      const geminiPrompt = `You are KhetiSaathi Agricultural Economics AI.
A farmer is evaluating ${body.crop || "Wheat"} on ${body.land || 10} acres in ${body.location || "Maharashtra"}.
Soil: ${body.soil || "Black Cotton"}, Season: ${body.season || "Kharif"}.
Estimated Net Profit: ₹${simulation.netProfit}, ROI: ${simulation.profitabilityPct}%.
Fertilizer costs have spiked 35% due to the Strait of Hormuz global crisis.

Provide a concise, practical, high-value 2-3 sentence agricultural advisory for this farmer explaining how to optimize inputs (like Nano Urea or split dosing) and maximize APMC mandi profit.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: { maxOutputTokens: 256, temperature: 0.3 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const geminiAdvice = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiAdvice && geminiAdvice.trim().length > 0) {
          simulation.aiAdvice = geminiAdvice.trim();
        }
      }
    } catch (gErr) {
      console.warn("Gemini prediction enrichment skipped:", gErr);
    }

    return NextResponse.json(simulation);
  } catch (error) {
    console.error("Predict API error:", error);
    return NextResponse.json(generateAgroSimulation({}));
  }
}
