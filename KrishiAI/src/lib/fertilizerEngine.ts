// ============================================================================
// KHETISAATHI — DETERMINISTIC FERTILIZER & SOIL HEALTH ENGINE
// Strict mathematical agronomy logic based on ICAR, MPKV Rahuri & PoCRA rules
// ============================================================================

export type AreaUnit = "acre" | "hectare" | "guntha";

export interface SoilTestValues {
  hasSoilReport: boolean;
  shcNumber?: string;
  testDate?: string;
  labName?: string;
  ph: number; // 6.5 - 8.5
  ec: number; // dS/m
  oc: number; // %
  n: number; // kg/ha
  p: number; // kg/ha
  k: number; // kg/ha
  zinc?: number; // ppm
  iron?: number; // ppm
  sulphur?: number; // ppm
  boron?: number; // ppm
}

export interface FertilizerCalculationInput {
  cropId: string;
  area: number;
  areaUnit: AreaUnit;
  targetYieldQtl?: number;
  soilTest: SoilTestValues;
  fymAppliedTonnes?: number; // Farm Yard Manure in tonnes
  productOption: "conventional" | "nano_package" | "ssp_package";
}

export interface SplitDose {
  stageName: { en: string; mr: string; hi: string };
  timing: { en: string; mr: string; hi: string };
  products: { name: string; quantity: number; unit: string; cost: number }[];
  instructions: { en: string; mr: string; hi: string };
}

export interface FertilizerCalculationResult {
  convertedAcres: number;
  baseNPKPerAcre: { n: number; p: number; k: number };
  adjustedNPKTotal: { n: number; p: number; k: number };
  nutrientRatings: {
    nRating: "Low" | "Medium" | "High";
    pRating: "Low" | "Medium" | "High";
    kRating: "Low" | "Medium" | "High";
    ocRating: "Low" | "Medium" | "High";
    phStatus: "Acidic" | "Normal (Neutral)" | "Alkaline";
  };
  fymCredit: { n: number; p: number; k: number };
  productsRequired: {
    name: string;
    quantity: number;
    unit: string;
    bagsOrBottles: number;
    estimatedCost: number;
    description: string;
  }[];
  totalEstimatedCost: number;
  nanoSavingsVsConventional: number;
  splitSchedule: SplitDose[];
  formulaSteps: string[];
}

// Convert any land unit into standardized Acres
export function convertToAcres(area: number, unit: AreaUnit): number {
  if (unit === "hectare") return area * 2.47105;
  if (unit === "guntha") return area / 40.0;
  return area;
}

// Rate soil test nutrients based on standard Indian soil benchmarks
export function evaluateSoilNutrientRatings(soil: SoilTestValues) {
  let nRating: "Low" | "Medium" | "High" = "Medium";
  if (soil.n < 280) nRating = "Low";
  else if (soil.n > 560) nRating = "High";

  let pRating: "Low" | "Medium" | "High" = "Medium";
  if (soil.p < 14) pRating = "Low";
  else if (soil.p > 28) pRating = "High";

  let kRating: "Low" | "Medium" | "High" = "Medium";
  if (soil.k < 140) kRating = "Low";
  else if (soil.k > 280) kRating = "High";

  let ocRating: "Low" | "Medium" | "High" = "Medium";
  if (soil.oc < 0.5) ocRating = "Low";
  else if (soil.oc > 0.75) ocRating = "High";

  let phStatus: "Acidic" | "Normal (Neutral)" | "Alkaline" = "Normal (Neutral)";
  if (soil.ph < 6.5) phStatus = "Acidic";
  else if (soil.ph > 7.8) phStatus = "Alkaline";

  return { nRating, pRating, kRating, ocRating, phStatus };
}

// Standard University NPK Recommendations (kg/acre)
const CROP_NPK_DEFAULTS: Record<string, { n: number; p: number; k: number; fym: number }> = {
  cotton: { n: 40, p: 20, k: 20, fym: 4 },
  soybean: { n: 12, p: 24, k: 12, fym: 3 },
  onion: { n: 40, p: 20, k: 25, fym: 8 },
  wheat: { n: 48, p: 24, k: 16, fym: 4 },
  sugarcane: { n: 100, p: 45, k: 45, fym: 10 },
  maize: { n: 48, p: 24, k: 16, fym: 4 },
  gram: { n: 10, p: 20, k: 10, fym: 2 },
  grapes: { n: 60, p: 40, k: 80, fym: 12 },
  default: { n: 35, p: 20, k: 20, fym: 4 }
};

// Deterministic calculation function
export function calculateFertilizerRequirements(
  input: FertilizerCalculationInput
): FertilizerCalculationResult {
  const acres = Math.max(0.1, convertToAcres(input.area, input.areaUnit));
  const baseNPK = CROP_NPK_DEFAULTS[input.cropId.toLowerCase()] || CROP_NPK_DEFAULTS.default;

  const ratings = evaluateSoilNutrientRatings(input.soilTest);

  // Adjustment factor based on soil report (+25% if soil low, 0% if medium, -25% if high)
  let nFactor = 1.0;
  let pFactor = 1.0;
  let kFactor = 1.0;

  if (input.soilTest.hasSoilReport) {
    if (ratings.nRating === "Low") nFactor = 1.25;
    else if (ratings.nRating === "High") nFactor = 0.75;

    if (ratings.pRating === "Low") pFactor = 1.25;
    else if (ratings.pRating === "High") pFactor = 0.75;

    if (ratings.kRating === "Low") kFactor = 1.25;
    else if (ratings.kRating === "High") kFactor = 0.75;
  }

  // FYM nutrient contribution deduction (1 tonne FYM supplies ~ 5kg N, 2.5kg P, 5kg K with 30% first-year availability)
  const fymTonnes = input.fymAppliedTonnes || 0;
  const fymN = Math.round(fymTonnes * 5 * 0.3);
  const fymP = Math.round(fymTonnes * 2.5 * 0.3);
  const fymK = Math.round(fymTonnes * 5 * 0.3);

  // Total required elemental N, P, K in kg for total acreage
  const totalN = Math.max(0, Math.round(baseNPK.n * nFactor * acres - fymN));
  const totalP = Math.max(0, Math.round(baseNPK.p * pFactor * acres - fymP));
  const totalK = Math.max(0, Math.round(baseNPK.k * kFactor * acres - fymK));

  const formulaSteps: string[] = [
    `1. Land Normalization: ${input.area} ${input.areaUnit} = ${acres.toFixed(2)} Acres.`,
    `2. Base University N:P:K recommendation for ${input.cropId.toUpperCase()}: ${baseNPK.n}:${baseNPK.p}:${baseNPK.k} kg/acre.`,
    input.soilTest.hasSoilReport
      ? `3. Soil Test Calibration: N (${ratings.nRating}, factor ${nFactor}), P (${ratings.pRating}, factor ${pFactor}), K (${ratings.kRating}, factor ${kFactor}).`
      : `3. Regional benchmark calibration applied (Soil report not provided).`,
    fymTonnes > 0
      ? `4. Farmyard Manure (FYM) Credit (${fymTonnes} tonnes): Subtracted ${fymN}kg N, ${fymP}kg P, ${fymK}kg K from requirement.`
      : `4. Organic FYM deduction: 0 kg (No FYM entered).`,
    `5. Net Nutrient Target: ${totalN} kg N, ${totalP} kg P, ${totalK} kg K.`
  ];

  // Pricing (Current 2026 subsidized and retail rates)
  const UREA_BAG_PRICE = 285; // 45kg bag
  const DAP_BAG_PRICE = 1350; // 50kg bag
  const MOP_BAG_PRICE = 1650; // 50kg bag
  const SSP_BAG_PRICE = 550; // 50kg bag
  const NANO_UREA_BOTTLE_PRICE = 225; // 500ml replaces 45kg urea
  const NANO_DAP_BOTTLE_PRICE = 600; // 500ml replaces 50kg DAP

  let productsRequired: FertilizerCalculationResult["productsRequired"] = [];
  let totalEstimatedCost = 0;
  let splitSchedule: SplitDose[] = [];

  if (input.productOption === "nano_package") {
    // Nano Fertilizer Package (mitigating Hormuz crisis)
    // Basal dose: 30% N from conventional urea for soil anchoring, 50% P from DAP
    const basalUreaKg = Math.round((totalN * 0.3) / 0.46);
    const basalUreaBags = Math.ceil(basalUreaKg / 45);

    // Remaining 70% N replaced with Nano Urea foliar sprays (1 bottle per acre per spray)
    const nanoUreaBottles = Math.max(1, Math.ceil(acres * 2)); // 2 sprays

    // Nano DAP foliar (1 bottle per acre)
    const nanoDapBottles = Math.max(1, Math.ceil(acres));

    // MOP for Potassium (60% K2O)
    const mopKg = Math.round(totalK / 0.6);
    const mopBags = Math.ceil(mopKg / 50);

    const ureaCost = basalUreaBags * UREA_BAG_PRICE;
    const nanoUreaCost = nanoUreaBottles * NANO_UREA_BOTTLE_PRICE;
    const nanoDapCost = nanoDapBottles * NANO_DAP_BOTTLE_PRICE;
    const mopCost = mopBags * MOP_BAG_PRICE;

    totalEstimatedCost = ureaCost + nanoUreaCost + nanoDapCost + mopCost;

    productsRequired = [
      {
        name: "Conventional Urea (Basal soil start)",
        quantity: basalUreaBags * 45,
        unit: "kg",
        bagsOrBottles: basalUreaBags,
        estimatedCost: ureaCost,
        description: "Applied at sowing to ensure root anchoring"
      },
      {
        name: "IFFCO Nano Urea Liquid (500 ml)",
        quantity: nanoUreaBottles * 500,
        unit: "ml",
        bagsOrBottles: nanoUreaBottles,
        estimatedCost: nanoUreaCost,
        description: "Foliar spray @ 4ml/litre; replaces heavy urea sacks with >80% absorption"
      },
      {
        name: "IFFCO Nano DAP Liquid (500 ml)",
        quantity: nanoDapBottles * 500,
        unit: "ml",
        bagsOrBottles: nanoDapBottles,
        estimatedCost: nanoDapCost,
        description: "Foliar spray at 30-35 DAS for root expansion and flowering"
      },
      {
        name: "Muriate of Potash (MOP 60% K2O)",
        quantity: mopBags * 50,
        unit: "kg",
        bagsOrBottles: mopBags,
        estimatedCost: mopCost,
        description: "Supplies essential potassium for disease resistance and grain weight"
      }
    ];

    splitSchedule = [
      {
        stageName: { en: "Basal Dose (Sowing / Planting)", mr: "बेसल डोस (पेरणी / लागवड वेळी)", hi: "बेसल डोज (बुवाई के समय)" },
        timing: { en: "Day 0 (At sowing)", mr: "दिवस ० (पेरणीच्या वेळी)", hi: "दिन 0 (बुवाई के समय)" },
        products: [
          { name: "Conventional Urea", quantity: basalUreaBags * 45, unit: "kg", cost: ureaCost },
          { name: "MOP (Potash)", quantity: Math.round(mopBags * 50 * 0.5), unit: "kg", cost: Math.round(mopCost * 0.5) }
        ],
        instructions: {
          en: "Mix into seed furrows 5cm below seed level. Do not place in direct seed contact.",
          mr: "बियाण्याखाली ५ सेमी खोल पेरा. बियांच्या थेट संपर्कात खत येऊ देऊ नका.",
          hi: "बीज से 5 सेमी नीचे कतारों में डालें। सीधे बीज के संपर्क से बचाएं।"
        }
      },
      {
        stageName: { en: "1st Foliar Spray (Vegetative / Tillering)", mr: "पहिली फवारणी (शाकीय वाढ / फुटवे फुटताना)", hi: "पहला पर्णीय छिड़काव (वानस्पतिक बढ़वार)" },
        timing: { en: "30 - 35 Days After Sowing", mr: "पेरणीनंतर ३० ते ३५ दिवस", hi: "बुवाई के 30-35 दिन बाद" },
        products: [
          { name: "Nano Urea", quantity: Math.round(nanoUreaBottles * 250), unit: "ml", cost: Math.round(nanoUreaCost * 0.5) },
          { name: "Nano DAP", quantity: nanoDapBottles * 500, unit: "ml", cost: nanoDapCost }
        ],
        instructions: {
          en: "Spray in clear sunny morning or evening hours @ 4ml Nano Urea + 4ml Nano DAP per litre water.",
          mr: "सकाळी किंवा संध्याकाळी ४ मि.ली. नॅनो युरिया + ४ मि.ली. नॅनो डीएपी प्रति लिटर पाण्यात मिसळून फवारा.",
          hi: "सुबह या शाम 4 मिली नैनो यूरिया + 4 मिली नैनो डीएपी प्रति लीटर पानी में स्प्रे करें।"
        }
      },
      {
        stageName: { en: "2nd Foliar Spray (Flowering / Booting)", mr: "दुसरी फवारणी (फुलोरा / ओंबी निघताना)", hi: "दूसरा पर्णीय छिड़काव (फूल एवं बाली अवस्था)" },
        timing: { en: "55 - 65 Days After Sowing", mr: "पेरणीनंतर ५५ ते ६५ दिवस", hi: "बुवाई के 55-65 दिन बाद" },
        products: [
          { name: "Nano Urea", quantity: Math.round(nanoUreaBottles * 250), unit: "ml", cost: Math.round(nanoUreaCost * 0.5) },
          { name: "MOP (Remaining Potash)", quantity: Math.round(mopBags * 50 * 0.5), unit: "kg", cost: Math.round(mopCost * 0.5) }
        ],
        instructions: {
          en: "Final foliar booster to sustain green canopy and accelerate grain filling.",
          mr: "दाण्यांचे वजन व चमक वाढवण्यासाठी आणि पाने हिरवी ठेवण्यासाठी अंतिम फवारणी.",
          hi: "दाना भराव व चमक बढ़ाने के लिए अंतिम छिड़काव।"
        }
      }
    ];
  } else {
    // Conventional DAP + Urea + MOP
    // DAP (18% N, 46% P2O5) supplies all P and some N
    const dapKg = Math.round(totalP / 0.46);
    const dapBags = Math.ceil(dapKg / 50);
    const nFromDap = Math.round(dapKg * 0.18);

    // Remaining N supplied by Urea (46% N)
    const remainingN = Math.max(0, totalN - nFromDap);
    const ureaKg = Math.round(remainingN / 0.46);
    const ureaBags = Math.ceil(ureaKg / 45);

    // MOP (60% K2O)
    const mopKg = Math.round(totalK / 0.6);
    const mopBags = Math.ceil(mopKg / 50);

    const dapCost = dapBags * DAP_BAG_PRICE;
    const ureaCost = ureaBags * UREA_BAG_PRICE;
    const mopCost = mopBags * MOP_BAG_PRICE;

    totalEstimatedCost = dapCost + ureaCost + mopCost;

    productsRequired = [
      {
        name: "DAP (Di-Ammonium Phosphate 18:46:0)",
        quantity: dapBags * 50,
        unit: "kg",
        bagsOrBottles: dapBags,
        estimatedCost: dapCost,
        description: "Primary phosphorus source with initial nitrogen kick"
      },
      {
        name: "Conventional Urea (46% N)",
        quantity: ureaBags * 45,
        unit: "kg",
        bagsOrBottles: ureaBags,
        estimatedCost: ureaCost,
        description: "Applied in 2-3 split top dressings"
      },
      {
        name: "MOP (Muriate of Potash 60% K2O)",
        quantity: mopBags * 50,
        unit: "kg",
        bagsOrBottles: mopBags,
        estimatedCost: mopCost,
        description: "Strengthens stem against lodging and improves yield quality"
      }
    ];

    splitSchedule = [
      {
        stageName: { en: "Basal Dose (At Sowing)", mr: "बेसल डोस (पेरणीच्या वेळी)", hi: "बेसल डोज (बुवाई के समय)" },
        timing: { en: "Day 0", mr: "पेरणीचा दिवस", hi: "बुवाई का दिन" },
        products: [
          { name: "DAP", quantity: dapBags * 50, unit: "kg", cost: dapCost },
          { name: "MOP", quantity: Math.round(mopBags * 50 * 0.5), unit: "kg", cost: Math.round(mopCost * 0.5) },
          { name: "Urea (Initial)", quantity: Math.round(ureaBags * 45 * 0.3), unit: "kg", cost: Math.round(ureaCost * 0.3) }
        ],
        instructions: {
          en: "Apply entire DAP, 50% Potash, and 30% Urea in seed drill at sowing.",
          mr: "पूर्ण डीएपी, ५०% पालाश व ३०% युरिया पेरणीच्या वेळी पाभरीने द्या.",
          hi: "संपूर्ण डीएपी, 50% पोटाश और 30% यूरिया बुवाई समय डालें।"
        }
      },
      {
        stageName: { en: "1st Top Dressing", mr: "पहिला हप्ता (३०-३५ दिवस)", hi: "पहला टॉप ड्रेसिंग" },
        timing: { en: "30 - 35 DAS", mr: "पेरणीनंतर ३०-३५ दिवस", hi: "बुवाई के 30-35 दिन बाद" },
        products: [
          { name: "Urea", quantity: Math.round(ureaBags * 45 * 0.4), unit: "kg", cost: Math.round(ureaCost * 0.4) }
        ],
        instructions: {
          en: "Broadcast urea evenly before irrigation or in moist soil after weeding.",
          mr: "खुरपणीनंतर जमिनीत पुरेसा ओलावा असताना युरिया फेकून द्या व लगेच पाणी द्या.",
          hi: "निराई के बाद पर्याप्त नमी होने पर यूरिया छिड़कें।"
        }
      },
      {
        stageName: { en: "2nd Top Dressing", mr: "दुसरा हप्ता (६० दिवस)", hi: "दूसरा टॉप ड्रेसिंग" },
        timing: { en: "55 - 65 DAS", mr: "पेरणीनंतर ५५-६० दिवस", hi: "बुवाई के 55-60 दिन बाद" },
        products: [
          { name: "Urea", quantity: Math.round(ureaBags * 45 * 0.3), unit: "kg", cost: Math.round(ureaCost * 0.3) },
          { name: "MOP (Remaining)", quantity: Math.round(mopBags * 50 * 0.5), unit: "kg", cost: Math.round(mopCost * 0.5) }
        ],
        instructions: {
          en: "Apply remaining Nitrogen and Potash to sustain seed formation.",
          mr: "उरलेले नत्र व पालाश देऊन हलके पाणी द्या.",
          hi: "बचा हुआ यूरिया व पोटाश देकर पानी लगाएं।"
        }
      }
    ];
  }

  // Calculate potential savings with Nano package vs conventional
  const conventionalApproxCost = Math.round(acres * 3800);
  const nanoSavings = Math.max(0, conventionalApproxCost - totalEstimatedCost);

  return {
    convertedAcres: Number(acres.toFixed(2)),
    baseNPKPerAcre: baseNPK,
    adjustedNPKTotal: { n: totalN, p: totalP, k: totalK },
    nutrientRatings: ratings,
    fymCredit: { n: fymN, p: fymP, k: fymK },
    productsRequired,
    totalEstimatedCost,
    nanoSavingsVsConventional: nanoSavings,
    splitSchedule,
    formulaSteps
  };
}
