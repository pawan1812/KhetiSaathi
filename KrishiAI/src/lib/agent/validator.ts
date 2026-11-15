/**
 * KHETISAATHI — OUTPUT VALIDATOR & SAFETY GUARD
 * 
 * Verifies every message before it reaches a farmer:
 * 1. Urgency is valid ("high" | "medium" | "low")
 * 2. Non-empty message and reason
 * 3. Maximum 3 short sentences
 * 4. Strictly ZERO pesticide/fertilizer doses (e.g. rejects ml/L, g/L, kg/acre, mg)
 * 5. Language validation (Marathi / Hindi)
 * 6. Mentions specific time when rain is relevant
 * 
 * If validation fails, provides a safe verified fallback message.
 */

export interface FarmActionOutput {
  urgency: "high" | "medium" | "low";
  message: string;
  reason: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedOutput: FarmActionOutput;
  fallbackUsed: boolean;
}

// Patterns that indicate pesticide, fungicide, or fertilizer dosages
const DOSAGE_PATTERNS = [
  /\b\d+(\.\d+)?\s*(ml|m\.l\.|मि\.?ली\.?|मिली|लीटर|litre|litres|l)\b/i,
  /\b\d+(\.\d+)?\s*(gm|g|ग्रॅम|ग्राम|किलो|कि\.?ग्रा\.?|kg|किग्र|mg|मिग्र)\b/i,
  /\b\d+(\.\d+)?\s*(प्रति|per|\/)\s*(लिटर|लीटर|litre|एकड़|एकर|acre|हेक्टर|ha|झाड|पौधा)\b/i,
  /\b\d+\s*[-–toते]\s*\d+\s*(ml|g|gm|kg|किलो|ग्रॅम|मिली)\b/i,
  /(@|दर|प्रमाणात)\s*\d+(\.\d+)?/i,
  /(dose|डोस|मात्रा)\s*:\s*\d+/i,
  /\b(19:19:19|12:61:00|00:52:34|00:00:50|13:00:45)\b/
];

/**
 * Split text into sentences using Marathi/Hindi purna viram (।) and western punctuation.
 */
export function splitSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/[।\.!\?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Validates the agent output against all safety rules.
 */
export function validateFarmAction(
  output: any,
  expectedLanguage: "mr" | "hi" | "en" = "mr",
  context?: {
    crop?: string;
    rainProb?: number;
    highRainHours?: string[];
  }
): ValidationResult {
  const errors: string[] = [];

  if (!output || typeof output !== "object") {
    errors.push("Output is not a valid JSON object.");
  }

  const urgencyRaw = String(output?.urgency || "").toLowerCase().trim();
  const validUrgencies: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
  const urgency: "high" | "medium" | "low" = validUrgencies.includes(urgencyRaw as any)
    ? (urgencyRaw as "high" | "medium" | "low")
    : "medium";

  if (!validUrgencies.includes(urgencyRaw as any)) {
    errors.push(`Invalid urgency level '${output?.urgency}'. Must be 'high', 'medium', or 'low'.`);
  }

  const message = typeof output?.message === "string" ? output.message.trim() : "";
  const reason = typeof output?.reason === "string" ? output.reason.trim() : "";

  if (!message) {
    errors.push("Message is empty.");
  }

  if (!reason) {
    errors.push("Reason is empty.");
  }

  // Sentence count check (maximum 3 sentences)
  const sentences = splitSentences(message);
  if (sentences.length > 3) {
    errors.push(`Message exceeds 3 sentences (found ${sentences.length} sentences).`);
  }

  // Dosage check (safety rule: strictly NO doses)
  for (const pattern of DOSAGE_PATTERNS) {
    if (pattern.test(message)) {
      errors.push(`Message contains chemical or fertilizer dosage pattern: ${pattern}`);
      break;
    }
  }

  // Language check
  const hasDevanagari = /[\u0900-\u097F]/.test(message);
  if (expectedLanguage === "mr") {
    if (!hasDevanagari) {
      errors.push("Expected Marathi Devanagari script, but none detected.");
    }
  } else if (expectedLanguage === "hi") {
    if (!hasDevanagari) {
      errors.push("Expected Hindi Devanagari script, but none detected.");
    }
  }

  // Rain timing check: if rain prob >= 60% and high rain hours exist, message should mention time
  if (context?.rainProb && context.rainProb >= 60 && context.highRainHours && context.highRainHours.length > 0) {
    const timeKeywords = [
      "वाजता", "दुपारी", "सकाळी", "संध्याकाळी", "उद्या", "दरम्यान", "वेळेत", "तास",
      "बजे", "दोपहर", "सुबह", "शाम", "कल", "दौरान", "समय", "घंटे", "hours", "pm", "am"
    ];
    const hasTimeMention = timeKeywords.some((w) => message.includes(w)) || /\d{1,2}(:\d{2})?/.test(message);
    if (!hasTimeMention) {
      errors.push("Rain is forecasted >=60% but message does not specify when rain is expected.");
    }
  }

  // If there are errors, build a safe verified fallback message
  if (errors.length > 0) {
    const fallback = getSafeFallback(expectedLanguage, context?.crop);
    return {
      isValid: false,
      errors,
      sanitizedOutput: fallback,
      fallbackUsed: true
    };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedOutput: {
      urgency,
      message,
      reason
    },
    fallbackUsed: false
  };
}

/**
 * Returns an unshakeable, 100% ICAR-safe fallback message in the farmer's language.
 */
export function getSafeFallback(
  language: "mr" | "hi" | "en",
  crop?: string
): FarmActionOutput {
  const cropTextMr = crop ? `${crop} पिकासाठी ` : "";
  const cropTextHi = crop ? `${crop} फसल के लिए ` : "";

  if (language === "mr") {
    return {
      urgency: "medium",
      message: `${cropTextMr}सध्या शेतात सामान्य ओलावा टिकवून ठेवा. खते किंवा फवारणीच्या कोणत्याही प्रमाणासाठी आपल्या स्थानिक कृषी सहाय्यक किंवा केव्हीकेशी संपर्क साधा. पिकांची नियमित पाहणी करत राहा.`,
      reason: "सुरक्षित कृषी मार्गदर्शक तत्त्वांनुसार प्रमाणित सल्ला."
    };
  }

  if (language === "hi") {
    return {
      urgency: "medium",
      message: `${cropTextHi}खेत में सामान्य नमी बनाए रखें और खरपतवार की निगरानी करें। किसी भी दवा या खाद की सही मात्रा के लिए स्थानीय कृषि अधिकारी अथवा केवीके से संपर्क करें। फसल की नियमित देखभाल रखें।`,
      reason: "कृषि विज्ञान केंद्र के सुरक्षा मानकों के अनुसार सुरक्षित परामर्श।"
    };
  }

  return {
    urgency: "medium",
    message: "Maintain balanced soil moisture and inspect crops for weeds. For exact fertilizer or spray dosages, please consult your local Agriculture Officer or KVK. Monitor field conditions regularly.",
    reason: "Standard safe agronomic practice advice."
  };
}
